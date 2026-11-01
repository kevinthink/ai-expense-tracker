/**
 * Moves across a login/logout boundary with a full page load rather than a
 * client-side navigation, so nothing rendered or cached for the previous
 * session can be shown to the next one.
 */
export function fullPageRedirect(path: "/" | "/login") {
  window.location.assign(path);
}
