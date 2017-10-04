import path from "path";

import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import { pascalCase } from "change-case";

const pkg = require(path.join(process.cwd(), "package.json")); // eslint-disable-line

const moduleName = pkg.moduleName || pascalCase(pkg.name);

const env = process.env.NODE_ENV;

const filename = {
  development: `${pkg.name}.js`,
  production: `${pkg.name}.min.js`
}[env || "development"];

const uglifyConfig = {
  compress: {
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    dead_code: true,
    unused: true,
    drop_debugger: true,
    booleans: true,
    warnings: false
  }
};

const plugins = [
  babel({
    exclude: "node_modules/**"
  }),
  commonjs({
    include: "node_modules/**"
  }),
  replace({
    "process.env.NODE_ENV": JSON.stringify(env),
    global: "window"
  }),
  resolve({
    jsnext: true,
    main: true,
    browser: true
  })
];

if (env === "production") {
  plugins.push(uglify(uglifyConfig));
}

// Filesize plugin needs to be last to report correct filesizes when minified
plugins.push(filesize());

const moduleContext = {
  // override module contexts here
};

const config = {
  entry: "src/index.js",
  dest: `dist/${filename}`,
  format: "umd",
  moduleContext,
  moduleName,
  plugins
};

export default config;
