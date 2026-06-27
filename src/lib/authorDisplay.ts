import { getDisplayName } from "./auth";
import { isSameUser } from "./uuidBytes";
import { shortId } from "./utils";

/** Human-readable label and seed for avatar initials/colors. */
export function resolveAuthorDisplay(
  authorId: string,
  currentUserId: string,
  selfDisplayName?: string | null,
): { label: string; avatarName: string } {
  if (isSameUser(authorId, currentUserId)) {
    const name =
      selfDisplayName?.trim() || getDisplayName()?.trim() || "Вы";
    return { label: name, avatarName: name };
  }

  const short = shortId(authorId);
  return { label: short, avatarName: short };
}
