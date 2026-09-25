import { env } from "../../../config/env";
import type { VerificationProvider, VerificationOutcome, VerificationSubmission } from "./VerificationProvider";

/**
 * Scaffold for a real ID.me integration (identity + business/organization
 * verification via ID.me's "Groups" verified-attributes flow).
 *
 * What's missing to go live, and how to add it back:
 *   1. Register an ID.me OAuth application at https://developers.id.me and
 *      request the identity ("self") and, for business legitimacy checks,
 *      an appropriate group scope (e.g. an ID.me Groups verification for
 *      business/professional affiliation).
 *   2. Set IDME_CLIENT_ID, IDME_CLIENT_SECRET, IDME_REDIRECT_URI in the
 *      backend environment, and VERIFICATION_PROVIDER=IDME.
 *   3. Implement the OAuth authorization-code exchange below: redirect the
 *      user to ID.me's /oauth/authorize endpoint, receive the callback code,
 *      exchange it at /oauth/token, then call /api/public/v3/attributes with
 *      the access token to confirm verified identity/business attributes.
 *   4. Map the returned attributes to VERIFIED or REJECTED and store the
 *      raw ID.me response in VerificationRequest.notes for audit purposes.
 *
 * Until those credentials exist, this provider fails closed: it throws so
 * that the request falls back to ManualReviewProvider rather than silently
 * approving anyone.
 */
export class IdMeProvider implements VerificationProvider {
  readonly type = "IDME" as const;

  async submit(_input: VerificationSubmission): Promise<VerificationOutcome> {
    if (!env.idmeClientId || !env.idmeClientSecret || !env.idmeRedirectUri) {
      throw new Error(
        "ID.me is not configured. Set IDME_CLIENT_ID, IDME_CLIENT_SECRET and IDME_REDIRECT_URI, " +
          "or leave VERIFICATION_PROVIDER=MANUAL to use the admin review queue."
      );
    }

    // TODO(phase 1.5): implement the OAuth authorization-code exchange and
    // attribute lookup described above once production credentials exist.
    throw new Error("ID.me integration is scaffolded but not yet implemented.");
  }
}
