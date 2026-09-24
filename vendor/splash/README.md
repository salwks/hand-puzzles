# Splash — water tank build

`splash-tank.js` is a build of [matsuoka-601/Splash](https://github.com/matsuoka-601/Splash) (MIT, see
`LICENSE`) at commit `3df5d62`: its MLS-MPM simulation and screen-space fluid renderer (narrow-range
filter), wrapped by `splash_tank.ts` as a still tank with a fixed low camera and a programmatic hand
that stirs the water like Splash's mouse. The environment is drawn in code (white bathroom tiles) instead
of Splash's photo cubemap, and `patches/bathroom-tiles.diff` turns its floor grid into the same tiles.

To rebuild: clone Splash at that commit, apply `patches/bathroom-tiles.diff`, copy `splash_tank.ts` to `embed/` and `vite.embed.config.ts`
to the repo root, then `npm install && npx vite build -c vite.embed.config.ts` → `dist-embed/splash-tank.js`.
