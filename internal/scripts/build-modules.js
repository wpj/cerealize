/* eslint-disable import/no-extraneous-dependencies */
const { omit } = require("lodash/fp");
const readPkg = require("read-pkg-up");
const writePkg = require("write-pkg");
const { exec } = require("shelljs");

const { BABEL_ENV } = process.env;

const outDir = {
  cjs: "lib",
  es: "es"
}[BABEL_ENV];

readPkg().then(({ pkg }) => {
  const pkgName = {
    cjs: name => name,
    es: name => `${name}-es`
  }[BABEL_ENV](pkg.name);

  const publicPkg = {
    ...omit(["scripts", "ava", "devDependencies", "_id", "readme"], pkg),
    name: pkgName,
    private: false
  };

  exec(`babel src --out-dir ${outDir} --ignore test.js`);
  writePkg.sync(outDir, publicPkg);
});
