import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

const isProduction = process.env.ENV === "production";
const isEsm = process.env.METHOD === "esm";

let suffix = isProduction ? ".min" : "";
suffix = isEsm ? ".esm" + suffix : suffix;

const config = {
  input: "src/index.js",
  output: {
    file: `dist/zutils${suffix}.js`,
    format: isEsm ? "es" : "umd",
    name: "zutils",
    globals: {
      zutils: "zutils"
    }
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**" // 只编译我们的源代码
    })
  ]
};

if (isProduction) {
  config.plugins.push(
    uglify({
      warnings: false,
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true
      }
    })
  );
}

export default config;
