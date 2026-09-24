# jeantimex/fluid — water tank build

`water-tank.js` is a build of [jeantimex/fluid](https://github.com/jeantimex/fluid) (MIT, see
`LICENSE.txt`) at commit `9daf3ae`: its 3D SPH simulation and screen-space renderer (refraction,
absorption, foam, spray, bubbles, shadows), wrapped by `water_tank.ts` as a still tank with a
programmatic hand instead of the demo's mouse controls.

To rebuild: clone jeantimex/fluid at that commit, copy `water_tank.ts` to `src/embed/` and
`vite.embed.config.ts` to the repo root, then `npm install && npx vite build -c vite.embed.config.ts`.
The output is `dist-embed/water-tank.js`.
