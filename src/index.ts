import { isEmojiSupported } from "is-emoji-supported";

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
  fontUrl = "https://cdn.jsdelivr.net/npm/country-flag-emoji-polyfill@0.1/TwemojiCountryFlags.woff2"
) {
  if (isEmojiSupported("😊") && !isEmojiSupported("🇨🇭")) {
    const style = document.createElement("style");

    // I generated the `unicode-range` below using https://wakamaifondue.com/beta/, which is awesome
    // and it helps make sure this font is never tried for any character that it does not support.
    //
    // See build/make-font.sh for more background why these are the relevant unicode ranges.
    style.textContent = `@font-face {
      font-family: "${fontName}";
      unicode-range: U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067,
        U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F;
      src: url('${fontUrl}') format('woff2');
    }`;
    document.head.appendChild(style);
    debugger;
    return true;
  }
  return false;
}
