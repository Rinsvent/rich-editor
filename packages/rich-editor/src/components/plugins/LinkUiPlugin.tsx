"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode } from "@lexical/link";
import { $findMatchingParent } from "@lexical/utils";
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { LinkUiProvider } from "../../context/LinkUiContext";
import { $applyLinkForm, $removeLinkByKey } from "../../core/links";
import type { EditorLabels } from "../../core/features";
import { IconEdit, IconTrash } from "../toolbar/ToolbarIcons";

type LinkModalState = {
  mode: "create" | "edit";
  text: string;
  url: string;
  linkKey?: string;
};

type FloatingToolbarState = {
  linkKey: string;
  top: number;
  left: number;
};

function LinkModal({
  state,
  labels,
  onClose,
  onSave,
}: {
  state: LinkModalState;
  labels: EditorLabels;
  onClose: () => void;
  onSave: (text: string, url: string, linkKey?: string) => void;
}) {
  const titleId = useId();
  const textId = useId();
  const urlId = useId();
  const [text, setText] = useState(state.text);
  const [url, setUrl] = useState(state.url);
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(state.text);
    setUrl(state.url || "https://");
    const timer = window.setTimeout(() => textRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const title = state.mode === "edit" ? labels.linkEdit : labels.linkAdd;

  return createPortal(
    <div className="re-link-modal-backdrop" onMouseDown={onClose}>
      <div
        className="re-link-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3 id={titleId} className="re-link-modal-title">
          {title}
        </h3>
        <label className="re-link-field" htmlFor={textId}>
          <span className="re-link-field-label">{labels.linkText}</span>
          <input
            ref={textRef}
            id={textId}
            type="text"
            className="re-link-field-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={labels.linkText}
          />
        </label>
        <label className="re-link-field" htmlFor={urlId}>
          <span className="re-link-field-label">{labels.linkUrl}</span>
          <input
            id={urlId}
            type="url"
            className="re-link-field-input"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://"
          />
        </label>
        <div className="re-link-modal-actions">
          <button
            type="button"
            className="re-link-modal-btn re-link-modal-btn-secondary"
            onClick={onClose}
          >
            {labels.linkCancel}
          </button>
          <button
            type="button"
            className="re-link-modal-btn re-link-modal-btn-primary"
            onClick={() => onSave(text, url, state.linkKey)}
            disabled={!text.trim() || !url.trim()}
          >
            {labels.linkSave}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function LinkFloatingToolbar({
  position,
  labels,
  onEdit,
  onRemove,
}: {
  position: FloatingToolbarState;
  labels: EditorLabels;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="re-link-floating-toolbar"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="toolbar"
      aria-label={labels.linkToolbar}
    >
      <button
        type="button"
        className="re-link-floating-btn"
        aria-label={labels.linkEdit}
        title={labels.linkEdit}
        onMouseDown={(event) => {
          event.preventDefault();
          onEdit();
        }}
      >
        <IconEdit />
      </button>
      <button
        type="button"
        className="re-link-floating-btn re-link-floating-btn-danger"
        aria-label={labels.linkRemove}
        title={labels.linkRemove}
        onMouseDown={(event) => {
          event.preventDefault();
          onRemove();
        }}
      >
        <IconTrash />
      </button>
    </div>
  );
}

export function LinkUiPlugin({
  labels,
  containerRef,
  enabled = true,
  children,
}: {
  labels: EditorLabels;
  containerRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  children: React.ReactNode;
}) {
  if (!enabled) {
    return <>{children}</>;
  }
  const [editor] = useLexicalComposerContext();
  const [modal, setModal] = useState<LinkModalState | null>(null);
  const [toolbar, setToolbar] = useState<FloatingToolbarState | null>(null);

  const closeModal = useCallback(() => setModal(null), []);
  const hideToolbar = useCallback(() => setToolbar(null), []);

  const openLinkDialog = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const existing = $findMatchingParent(selection.anchor.getNode(), $isLinkNode);
      if (existing) {
        setModal({
          mode: "edit",
          text: existing.getTextContent(),
          url: existing.getURL(),
          linkKey: existing.getKey(),
        });
        hideToolbar();
        return;
      }

      setModal({
        mode: "create",
        text: selection.getTextContent(),
        url: "https://",
      });
      hideToolbar();
    });
  }, [editor, hideToolbar]);

  const openEditForLinkKey = useCallback(
    (linkKey: string) => {
      editor.getEditorState().read(() => {
        const link = $getNodeByKey(linkKey);
        if (!$isLinkNode(link)) return;
        setModal({
          mode: "edit",
          text: link.getTextContent(),
          url: link.getURL(),
          linkKey: link.getKey(),
        });
        hideToolbar();
      });
    },
    [editor, hideToolbar],
  );

  const handleSaveModal = useCallback(
    (text: string, url: string, linkKey?: string) => {
      editor.update(() => {
        $applyLinkForm({ text, url }, linkKey);
      });
      closeModal();
      editor.focus();
    },
    [closeModal, editor],
  );

  const removeLink = useCallback(
    (linkKey: string) => {
      editor.update(() => {
        $removeLinkByKey(linkKey);
      });
      hideToolbar();
    },
    [editor, hideToolbar],
  );

  useEffect(() => {
    const removeClick = editor.registerCommand(
      CLICK_COMMAND,
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return false;

        const anchor = target.closest("a.re-link");
        if (!anchor || !containerRef.current?.contains(anchor)) return false;

        event.preventDefault();

        const node = $getNearestNodeFromDOMNode(anchor);
        const link = node ? $findMatchingParent(node, $isLinkNode) : null;
        if (!link) return true;

        const rect = anchor.getBoundingClientRect();
        const host = containerRef.current.getBoundingClientRect();
        const toolbarHeight = 36;
        const gap = 6;
        const spaceAbove = rect.top - host.top;
        const showBelow = spaceAbove < toolbarHeight + gap;

        setToolbar({
          linkKey: link.getKey(),
          top: showBelow
            ? rect.bottom - host.top + gap
            : rect.top - host.top - toolbarHeight - gap,
          left: rect.left - host.left + rect.width / 2,
        });
        setModal(null);
        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );

    const onDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest(".re-link-floating-toolbar")) return;
      if (target.closest(".re-link-modal")) return;
      if (target.closest("a.re-link")) return;
      hideToolbar();
    };

    document.addEventListener("mousedown", onDocumentMouseDown);
    return () => {
      removeClick();
      document.removeEventListener("mousedown", onDocumentMouseDown);
    };
  }, [containerRef, editor, hideToolbar]);

  useEffect(() => {
    if (!toolbar) return;

    const update = () => {
      editor.getEditorState().read(() => {
        const link = $getNodeByKey(toolbar.linkKey);
        if (!$isLinkNode(link)) {
          hideToolbar();
          return;
        }

        const element = editor.getElementByKey(link.getKey());
        const container = containerRef.current;
        if (!element || !container) {
          hideToolbar();
          return;
        }

        const rect = element.getBoundingClientRect();
        const host = container.getBoundingClientRect();
        const toolbarHeight = 36;
        const gap = 6;

        setToolbar((current) =>
          current
            ? {
                ...current,
                top: rect.top - host.top - toolbarHeight - gap,
                left: rect.left - host.left + rect.width / 2,
              }
            : null,
        );
      });
    };

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, editor, hideToolbar, toolbar]);

  return (
    <LinkUiProvider openLinkDialog={openLinkDialog}>
      {children}
      {toolbar && containerRef.current &&
        createPortal(
          <LinkFloatingToolbar
            position={toolbar}
            labels={labels}
            onEdit={() => openEditForLinkKey(toolbar.linkKey)}
            onRemove={() => removeLink(toolbar.linkKey)}
          />,
          containerRef.current,
        )}
      {modal && (
        <LinkModal
          state={modal}
          labels={labels}
          onClose={closeModal}
          onSave={handleSaveModal}
        />
      )}
    </LinkUiProvider>
  );
}
