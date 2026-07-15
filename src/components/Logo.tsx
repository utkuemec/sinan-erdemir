import { Link } from "@tanstack/react-router";
import { candidate } from "@/config/candidate";

export function Logo() {
  const { firstName, lastName, logoTagline, campaignName } = candidate.identity;
  return (
    <Link to="/" className="logo" aria-label={`${campaignName}, home`}>
      <span className="logo__name">
        {firstName}
        <br />
        {lastName}
      </span>
      <span className="logo__tag">{logoTagline}</span>
    </Link>
  );
}
