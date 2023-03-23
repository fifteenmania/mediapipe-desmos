import topLevelAwait from "vite-plugin-top-level-await";

/** @type {import('vite').UserConfig} */
export default {
  base: '',
  assetsInclude: ["**/*.task"],
  plugins: [
    topLevelAwait()
  ]
}
