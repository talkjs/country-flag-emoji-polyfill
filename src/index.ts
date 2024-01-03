import { supportsEmoji } from "./emoji";

/**
 * Injects a style element into the HEAD with a web font with country flags,
 * iff the browser does support emojis but not country flags.
 *
 * @param fontName - Override the default font name ("Twemoji Country Flags")
 * @param fontUrl - Override the font URL (defaults to a jsdeliver-hosted)
 *
 * @returns true if the web font was loaded (ie the browser does not support country flags)
 */
export function polyfillCountryFlagEmojis(
  fontName = "Twemoji Country Flags",
  fontUrl = "https://cdn.jsdelivr.net/npm/country-flag-emoji-polyfill@0.1/dist/TwemojiCountryFlags.woff2"
) {
  if (
    typeof window !== "undefined" &&
    supportsEmoji("😊") &&
    !supportsEmoji("🇨🇭")
  ) {
    const style = document.createElement("style");

    // I generated the `unicode-range` below using
    // https://wakamaifondue.com/beta/, which is awesome and it helps make sure
    // this font is never tried for any character that it does not support.
    //
    // See build/make-font.sh for more background why these are the relevant
    // unicode ranges.
    //
    // Also, we're setting `font-display` to "swap" because without it, all text
    // will be invisible during the time between this style tag being injected
    // and the font having been loaded. This happens because developers will
    // typically set `Twemoji Country Flags` as the first font in their
    // `font-family` lists, and the browser tries to prevent a "flash of
    // unstyled text" and therefore hide all text instead of rendering it with
    // potentially the wrong font. This matters when you're waiting for Open
    // Sans to load and you dont want your blog to briefly render in Times New
    // Roman first, but it's actively harmful for apps, where text might briefly
    // disappear just to load some country flag fallbacks that might not even be
    // on the page.
    //
    // Apparently (when I tested this) browsers aren't smart enough to only do
    // hide characters that match the not-yet-loaded font's unicode-range.
    // Setting it to "swap" unfortunately makes the browser render eg `□` or
    // `ɴʟ` for country flags until the font is in. But this is way better than
    // hiding all UI text everywhere :D
    style.textContent = `@font-face {
      font-family: "${fontName}";
      unicode-range: U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067,
        U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F;
      src: url('${fontUrl}') format('woff2');
      font-display: swap;
    }`;
    document.head.appendChild(style);

    return true;
  }
  return false;
}
