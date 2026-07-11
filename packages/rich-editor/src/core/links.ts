import { $createLinkNode, $isLinkNode } from "@lexical/link";
import {
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
} from "lexical";

export type LinkFormValues = {
  text: string;
  url: string;
};

export function $applyLinkForm(
  values: LinkFormValues,
  linkKey?: string,
): void {
  const text = values.text.trim();
  const url = values.url.trim();
  if (!text || !url) return;

  if (linkKey) {
    const link = $getNodeByKey(linkKey);
    if (!$isLinkNode(link)) return;

    const nextLink = $createLinkNode(url, {
      rel: link.getRel(),
      target: link.getTarget(),
      title: link.getTitle(),
    });
    nextLink.append($createTextNode(text));
    link.replace(nextLink);
    nextLink.selectEnd();
    return;
  }

  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;

  if (!selection.isCollapsed()) {
    selection.removeText();
  }

  const link = $createLinkNode(url);
  link.append($createTextNode(text));
  selection.insertNodes([link]);
}

export function $removeLinkByKey(linkKey: string): void {
  const link = $getNodeByKey(linkKey);
  if (!$isLinkNode(link)) return;
  const textNode = $createTextNode(link.getTextContent());
  link.replace(textNode);
  textNode.select();
}
