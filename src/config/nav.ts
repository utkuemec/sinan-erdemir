import { candidate } from "./candidate";
import { getStrings } from "./strings";

const t = getStrings(candidate.locale);

/**
 * Primary navigation, shared by the header and footer. Labels come from the
 * config/string layers; route paths are file-based and stay literal — to
 * rename a path, rename the route file and update it here and in the
 * vite.config.ts prerender pages list.
 */
export interface NavLink {
  label: string;
  to: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: candidate.bio.navLabel, to: "/meet-the-candidate" },
  { label: candidate.priorities.navLabel, to: "/priorities" },
  { label: candidate.ward.navLabel, to: "/ward" },
  { label: t.nav.community, to: "/community" },
  ...(candidate.features.votingInfo ? [{ label: t.nav.vote, to: "/vote" }] : []),
  { label: t.nav.getInvolved, to: "/get-involved" },
];

export const FOOTER_LINKS: readonly NavLink[] = [
  ...NAV_LINKS,
  { label: t.nav.contact, to: "/contact" },
  { label: t.nav.privacy, to: "/privacy" },
];
