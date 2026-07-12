import { $getSelection, $isRangeSelection } from "lexical";

/** Clears inline format flags (bold, italic, …) on the current selection. */
export function $clearStickyTextFormats(): void {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    selection.setFormat(0);
  }
}
