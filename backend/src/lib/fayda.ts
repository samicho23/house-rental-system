/**
 * Fayda (VeriFayda / eSignet) simulation.
 *
 * In production this module performs the OpenID Connect authorization code
 * flow with PKCE against Fayda: the user is redirected to the Fayda sign-in
 * page, the backend exchanges the returned code for tokens using a signed
 * client key, verifies signatures and reads the verified claims.
 *
 * Until the national ID programme approves the platform as a partner
 * (see proposal §9 risk table), a test identity provider stands in behind
 * the same interface: a national ID number (FIN) plus the holder's
 * consent returns verified claims, which pre-fill the registration form.
 */

export { mockFaydaAuthenticate as faydaAuthenticate } from "../modules/fayda/fayda.mock";
export type { FaydaClaims } from "../modules/fayda/fayda.types";
