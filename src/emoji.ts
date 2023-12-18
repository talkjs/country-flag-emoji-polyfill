// emoji detection code inspired by if-emoji and emoji-picker-element, with modifications.
const FONT_FAMILY =
  '"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol",' +
  '"Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif';

function makeCtx() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.textBaseline = "top";
  ctx.font = `100px ${FONT_FAMILY}`;
  ctx.scale(0.01, 0.01);
  return ctx;
}

function getColor(ctx: CanvasRenderingContext2D, text: string, color: string) {
  // we're rendering to a 1px canvas so it'll be a character (or, hopefully, a
  // color emoji) scaled down to a single vague brownish pixel
  ctx.clearRect(0, 0, 100, 100);
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);

  const bytes = ctx.getImageData(0, 0, 1, 1).data;
  return bytes.join(",");
}

/**
 * Detects whether the emoji in `text` is rendered as a color emoji by this
 * browser.
 *
 * Note: this is not complete for detecting support for any emoji. Notably, it
 * does not detect whether emojis that consist of two glyphs with a
 * zero-width-joiner are rendered as a single emoji or as two, because this is
 * not needed to detect country flag support.
 */
export function supportsEmoji(text: string) {
  // Render `text` to a single pixel in white and in black, and then compare
  // them to each other and ensure they're the same color, and neither one is
  // black. This shows that the emoji was rendered in color, and the font color
  // was disregarded.
  const ctx = makeCtx();
  const white = getColor(ctx, text, "#fff");
  const black = getColor(ctx, text, "#000");

  // This is RGBA, so for 0,0,0, we are checking that the first RGB is not all zeroes.
  // Most of the time when unsupported this is 0,0,0,0, but on Chrome on Mac it is
  // 0,0,0,61 - there is a transparency here.
  return black === white && !black.startsWith("0,0,0,");
}
