import { candidate } from "./candidate";
import { getStrings } from "./strings";

const t = getStrings(candidate.locale);

/**
 * Primary navigation, shared by the header and footer. Labels come from the
 * config/string layers; route paths are file-based and stay literal — to
 * rename a path, rename the route file and update it here and in the
 * vite.config.ts prerender pages list.
 */
export const NAV_LINKS = [
  { label: candidate.bio.navLabel, to: "/meet-the-candidate" },
  { label: candidate.priorities.navLabel, to: "/priorities" },
  { label: candidate.ward.navLabel, to: "/ward" },
  { label: t.nav.community, to: "/community" },
  { label: t.nav.getInvolved, to: "/get-involved" },
] as const;

export const FOOTER_LINKS = [
  ...NAV_LINKS,
  { label: t.nav.vote, to: "/vote" },
  { label: t.nav.contact, to: "/contact" },
] as const;
