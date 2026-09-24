# Splash — water tank build

`splash-tank.js` is a build of [matsuoka-601/Splash](https://github.com/matsuoka-601/Splash) (MIT, see
`LICENSE`) at commit `3df5d62`: its MLS-MPM simulation and screen-space fluid renderer (narrow-range
filter), wrapped by `splash_tank.ts` as a still tank with a fixed low camera and a programmatic hand
that stirs the water like Splash's mouse. `cubemap/` is Splash's environment map.

To rebuild: clone Splash at that commit, copy `splash_tank.ts` to `embed/` and `vite.embed.config.ts`
to the repo root, then `npm install && npx vite build -c vite.embed.config.ts` → `dist-embed/splash-tank.js`.
