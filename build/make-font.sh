#!/bin/bash

# build dependencies: fonttools and curl. in my WSL, fonttools was a single `apt
# install fonttools` away.

# download latest Twemoji font
TTF=$(mktemp -t XXXXXXXXXX.ttf)
curl --location https://github.com/mozilla/twemoji-colr/releases/latest/download/TwemojiMozilla.ttf --output $TTF

# strip all characters except country flags, and save to woff2.
#
# "FFTM" is a metadata table in created by FontForge which TwemojiMozilla
# somehow includes. pyftsubset can't subset it and warns, so we explicitly drop
# it to suppress the warning. we don't need it.
#
# `unicodes` is used to only select glyphs that can be built with the selected
# unicode ranges. we need these ranges:
#   - U+1F1E6-1F1FF the range of regional indicator symbols, combinations of
#     which make regular flag emojis
#   - Ingredients for England, Scotland and Wales flags:
#     - U+1F3F4 is "Waving black flag"
#     - U+E0061-E007A are Latin Small Letter "Tags"
#     - U+E007F the "Cancel tag"
pyftsubset $TTF \
  --no-subset-tables+=FFTM \
  --unicodes=U+1F1E6-1F1FF,U+1F3F4,U+E0061-E007A,U+E007F \
  --output-file=../dist/TwemojiCountryFlags.woff2 \
  --flavor=woff2

rm $TTF