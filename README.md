## Country Flag Emoji Polyfill

![screenshot of broken emojis](https://user-images.githubusercontent.com/703546/159265695-1ed79f91-2398-4e02-a38d-7aa67426d945.png)

Recent Windows versions (finally) support emojis natively, but they still do not support pretty country flags. By extension, all Chromium-based browsers can't display country flag emojis natively.

In short, if "🇨🇭" looks like "ᴄʜ" and not like a flag, then this polyfill is for you. 

It's 0.7kB gzipped, with zero dependencies. The font with country flags is 77kB and only downloaded when needed.

---

This module is sponsored by [TalkJS](https://talkjs.com), a Chat API with pre-built UI for web & mobile apps.

[![talkjs logo](https://user-images.githubusercontent.com/703546/159268048-19871f36-90f2-409f-ad9f-af711abc8302.png)](https://talkjs.com)

## Usage

### 1. With NPM:

```sh
npm install country-flag-emoji-polyfill
```

```js
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

// ...

polyfillCountryFlagEmojis();
```

#### Or, just with a script tag:

Thanks to the excellent [Skypack CDN](https://www.skypack.dev), you can also use this polyfill without NPM:

```html
<script type="module" defer>
  import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
  polyfillCountryFlagEmojis();
</script>
```

This code only works on browsers that support ES Modules, but Chromium has done so for quite a while so it should work appropriately.

[See here for a full working example](https://talkjs.github.io/country-flag-emoji-polyfill/examples/no-npm/index.html) ([source](./examples/no-npm/index.html))

### 2. Update your CSS

This will load a webfont called `"Twemoji Country Flags"` on relevant browsers. Next, prefix your `font-family` CSS with this font **everywhere where you want country flags to work**. Eg if your CSS currently has this:

```
body {
  font-family: "Helvetica", "Comic Sans", serif;
}
```

then you want to change it to

```
body {
  font-family: "Twemoji Country Flags", "Helvetica", "Comic Sans", serif;
}
```

This is safe because the font is loaded such that the browser will only use it for country flag emojis and not for any other characters (using [`unicode-range`](https://github.com/talkjs/country-flag-emoji-polyfill/blob/master/src/index.ts#L45)). Therefore, the browser will simply use the next font in the list for every character except country flags.

Browsers that have native support for country flags will not load the font at all, and therefore will simply ignore it in the `font-family` list.

## API

```ts
function polyfillCountryFlags(fontName?: string, fontUrl?: string): boolean;
```

Injects a web font with country flags if deemed necessary.

Parameters:

- `fontName` - (optional) Override the default font name ("Twemoji Country Flags")
- `fontUrl` - (optional) Override the font URL (defaults to a jsdeliver-hosted)

If the browser supports color emojis but not country flags, this function injects a `style` element into the HEAD with a web font with country flags, and returns `true`. Otherwise, it does nothing and returns `false`.

## Background

Firefox on Windows adds country flag emoji support falling back on their [Twemoji Mozilla](https://github.com/mozilla/twemoji-colr) font, which itself is simply all [Twemoji](https://twemoji.twitter.com/) emojis concatenated into a single huge color font.

Chromium, however, apparently [does not plan to support country flags on Windows](https://bugs.chromium.org/p/chromium/issues/detail?id=1209677#c5), except if Windows itself adds it. This means that Chromium-based browsers such as Chrome, Edge and Brave won't likely support it soon either. That's a huge chunk of browser users, who will complain that other people's nice flag emojis look to them like "ᴄʜ" and not like a picture.

Until either Microsoft or Google recognize how ridiculous this is, you're stuck with this polyfill.

### How it works

This polyfill merely combines other people's hard work.

The key building block of this polyfill is a font, "Twemoji Country Flags", a subset of "Twemoji Mozilla" made using the excellent [`pyftsubset`](https://fonttools.readthedocs.io/en/latest/subset/index.html) tool from [fonttools](https://github.com/fonttools/fonttools).

This is important, because Twemoji Mozilla is 1.5MB, which is a pretty huge hit on your app perfomance. The subset is only 78kb, which is much better.

It then injects some CSS to load this font as a webfont, but only if the browser supports regular emojis and not country flags. 

As far as I can tell, all browsers that have this problem support WOFF2 fonts, so I made no effort to do the usual multi-font-format `@font-face` syntax (with eg ttf and woff fonts also).

### How to build

This might need updates if [Twemoji Mozilla](https://github.com/mozilla/twemoji-colr) gets a new version - especially if new country flags are added.

- clone the repo
- make sure you're on a system with bash, fonttools and curl (On my WSL/Ubuntu, a single `apt install fonttools` was enough)
- run `npm run make-font`
- find the new font in `dist/TwemojiCountryFlags.woff2`
