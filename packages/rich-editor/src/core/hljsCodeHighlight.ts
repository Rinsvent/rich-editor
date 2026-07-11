import {
  $isCodeHighlightNode,
  $isCodeNode,
  CodeHighlightNode,
  CodeNode,
  type CodeNode as CodeNodeType,
} from "@lexical/code";
import {
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  $isTabNode,
  $isTextNode,
  $onUpdate,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  TextNode,
} from "lexical";
import { getHljsHighlightNodes, preloadHljsLanguage } from "./hljsHighlight";
import { isHljsLanguageLoaded } from "./hljsRuntime";

type TransformState = {
  didTransform: boolean;
  nodesCurrentlyHighlighting: Set<NodeKey>;
};

function isEqual(nodeA: LexicalNode, nodeB: LexicalNode): boolean {
  return (
    ($isCodeHighlightNode(nodeA) &&
      $isCodeHighlightNode(nodeB) &&
      nodeA.getTextContent() === nodeB.getTextContent() &&
      nodeA.getHighlightType() === nodeB.getHighlightType()) ||
    ($isTabNode(nodeA) && $isTabNode(nodeB)) ||
    ($isLineBreakNode(nodeA) && $isLineBreakNode(nodeB))
  );
}

function getDiffRange(prevNodes: LexicalNode[], nextNodes: LexicalNode[]) {
  let leadingMatch = 0;
  while (leadingMatch < prevNodes.length) {
    if (!isEqual(prevNodes[leadingMatch], nextNodes[leadingMatch])) break;
    leadingMatch++;
  }

  const prevNodesLength = prevNodes.length;
  const nextNodesLength = nextNodes.length;
  const maxTrailingMatch =
    Math.min(prevNodesLength, nextNodesLength) - leadingMatch;
  let trailingMatch = 0;

  while (trailingMatch < maxTrailingMatch) {
    trailingMatch++;
    if (
      !isEqual(
        prevNodes[prevNodesLength - trailingMatch],
        nextNodes[nextNodesLength - trailingMatch],
      )
    ) {
      trailingMatch--;
      break;
    }
  }

  const from = leadingMatch;
  const to = prevNodesLength - trailingMatch;
  const nodesForReplacement = nextNodes.slice(
    leadingMatch,
    nextNodesLength - trailingMatch,
  );

  return { from, to, nodesForReplacement };
}

function $updateAndRetainSelection(
  nodeKey: NodeKey,
  updateFn: () => boolean,
): void {
  const node = $getNodeByKey(nodeKey);
  if (!$isCodeNode(node) || !node.isAttached()) return;

  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    updateFn();
    return;
  }

  const anchor = selection.anchor;
  const anchorOffset = anchor.offset;
  const isNewLineAnchor =
    anchor.type === "element" &&
    $isLineBreakNode(node.getChildAtIndex(anchor.offset - 1));
  let textOffset = 0;

  if (!isNewLineAnchor) {
    const anchorNode = anchor.getNode();
    textOffset =
      anchorOffset +
      anchorNode.getPreviousSiblings().reduce(
        (offset, sibling) => offset + sibling.getTextContentSize(),
        0,
      );
  }

  const hasChanges = updateFn();
  if (!hasChanges) return;

  if (isNewLineAnchor) {
    anchor.getNode().select(anchorOffset, anchorOffset);
    return;
  }

  node.getChildren().some((child) => {
    const isText = $isTextNode(child);
    if (isText || $isLineBreakNode(child)) {
      const textContentSize = child.getTextContentSize();
      if (isText && textContentSize >= textOffset) {
        child.select(textOffset, textOffset);
        return true;
      }
      textOffset -= textContentSize;
    }
    return false;
  });
}

const loadingCodeNodes = new Set<NodeKey>();

function requestLanguageLoad(
  editor: LexicalEditor,
  language: string,
  nodeKey: NodeKey,
): void {
  if (loadingCodeNodes.has(nodeKey)) return;
  loadingCodeNodes.add(nodeKey);

  void preloadHljsLanguage(language).finally(() => {
    loadingCodeNodes.delete(nodeKey);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!$isCodeNode(node) || !node.isAttached()) return;
      node.getWritable();
    });
  });
}

function $codeNodeTransform(
  editor: LexicalEditor,
  transformState: TransformState,
  node: CodeNodeType,
): void {
  const nodeKey = node.getKey();
  const language = node.getLanguage() || "plaintext";

  if (!isHljsLanguageLoaded(language)) {
    requestLanguageLoad(editor, language, nodeKey);
    return;
  }

  if (transformState.nodesCurrentlyHighlighting.has(nodeKey)) return;

  transformState.nodesCurrentlyHighlighting.add(nodeKey);
  if (!transformState.didTransform) {
    transformState.didTransform = true;
    $onUpdate(() => {
      transformState.didTransform = false;
      transformState.nodesCurrentlyHighlighting.clear();
    });
  }

  $updateAndRetainSelection(nodeKey, () => {
    const currentNode = $getNodeByKey(nodeKey);
    if (!$isCodeNode(currentNode) || !currentNode.isAttached()) return false;

    const highlightNodes = getHljsHighlightNodes(
      currentNode,
      currentNode.getLanguage() || "plaintext",
    );
    const diffRange = getDiffRange(currentNode.getChildren(), highlightNodes);
    const { from, to, nodesForReplacement } = diffRange;

    if (from !== to || nodesForReplacement.length > 0) {
      currentNode.splice(from, to - from, nodesForReplacement);
      return true;
    }
    return false;
  });
}

function $textNodeTransform(
  editor: LexicalEditor,
  transformState: TransformState,
  node: TextNode,
): void {
  if ($isCodeHighlightNode(node)) return;

  const parentNode = node.getParent();
  if ($isCodeNode(parentNode)) {
    $codeNodeTransform(editor, transformState, parentNode);
    return;
  }
}

export function registerHljsCodeHighlighting(
  editor: LexicalEditor,
): () => void {
  if (!editor.hasNodes([CodeNode, CodeHighlightNode])) {
    throw new Error(
      "HljsCodeHighlightPlugin: CodeNode or CodeHighlightNode not registered on editor",
    );
  }

  const transformState: TransformState = {
    didTransform: false,
    nodesCurrentlyHighlighting: new Set(),
  };

  const removeCode = editor.registerNodeTransform(CodeNode, (node) => {
    $codeNodeTransform(editor, transformState, node);
  });
  const removeText = editor.registerNodeTransform(TextNode, (node) => {
    $textNodeTransform(editor, transformState, node);
  });
  const removeHighlight = editor.registerNodeTransform(
    CodeHighlightNode,
    (node) => {
      const parent = node.getParent();
      if ($isCodeNode(parent)) return;
      node.replace($createTextNode(node.getTextContent()));
    },
  );

  return () => {
    removeCode();
    removeText();
    removeHighlight();
  };
}
