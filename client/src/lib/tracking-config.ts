/**
 * Tracking configuration — paste your IDs here.
 *
 * After you finish the GTM + GA4 + Google Ads dashboard setup, edit the three
 * values below with the real IDs and redeploy. No other files need to change.
 *
 * Until real IDs are pasted in, tracking is silently disabled (no errors, no
 * accidental loads of an unconfigured GTM container).
 */

export const TRACKING = {
  /**
   * GTM container ID — looks like "GTM-XXXXXXX".
   * Where to find: tagmanager.google.com → your container → top-right of the
   * workspace shows the ID.
   */
  GTM_CONTAINER_ID: "GTM-T39JPZVF" as string,

  /**
   * GA4 measurement ID — looks like "G-XXXXXXXXXX".
   * Where to find: analytics.google.com → Admin → Data Streams → click your
   * Cicero Grand web stream → Measurement ID is in the top-right.
   */
  GA4_MEASUREMENT_ID: "G-GC9V8V3440" as string,

  /**
   * Google Ads conversion ID — looks like "AW-XXXXXXXXX".
   * Where to find: ads.google.com → Tools → Conversions → click any
   * conversion action → "Tag setup" → "Use Google Tag Manager" → the
   * Conversion ID is shown there.
   */
  GADS_CONVERSION_ID: "AW-16665941603" as string,

  /**
   * Optional: pass through to GA4 / GAds as conversion labels for events
   * fired from the site. Get these from Google Ads when you create each
   * conversion action.
   */
  GADS_LABELS: {
    BEGIN_CHECKOUT: "" as string,
    PHONE_CLICK: "zI1UCLj8rascEOOs-Io-" as string,
  },
};

/**
 * Helper — returns true only when GTM is configured. Used to short-circuit
 * tracking calls before any IDs are pasted in, so we never load a malformed
 * GTM container on production.
 */
export function isTrackingEnabled(): boolean {
  return /^GTM-[A-Z0-9]+$/i.test(TRACKING.GTM_CONTAINER_ID);
}
