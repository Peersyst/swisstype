/* eslint-disable no-console */
const path = require("path");
const fse = require("fs-extra");

const packagePath = process.cwd();
const buildPackagePath = (file) => path.join(packagePath, file);
const distPath = path.join(packagePath, "./dist");
const buildDistPath = (file) => path.join(distPath, file);

function main() {
    try {
        if (fse.existsSync(distPath)) fse.removeSync(distPath);
        fse.mkdirSync(distPath);

        const packageDataString = fse.readFileSync(path.resolve(packagePath, "./package.json"), "utf8");
        const packageData = JSON.parse(packageDataString);
        delete packageData.devDependencies;
        delete packageData.scripts;
        const newPackageData = {
            ...packageData,
            main: "lib/index.js",
            types: "lib/index.d.ts",
        };
        fse.writeFileSync(buildDistPath("./package.json"), JSON.stringify(newPackageData, null, 2), "utf8");

        fse.copySync(buildPackagePath("./README.md"), buildDistPath("./README.md"));

        fse.copySync(buildPackagePath("./LICENSE"), buildDistPath("./LICENSE"));

        fse.copySync(buildPackagePath("./index.d.ts"), buildDistPath("./index.d.ts"));
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
