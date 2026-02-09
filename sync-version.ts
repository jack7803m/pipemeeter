// This script syncs the version in package.json, src-tauri/Cargo.toml, and
// src-tauri/tauri.conf.json with the git tag (from GITHUB_REF_NAME).
// This should only be run in a GitHub Actions environment.

const version = process.env.GITHUB_REF_NAME?.replace(/^v/, "");

if (!version) {
  console.error("GITHUB_REF_NAME is not set or has no version. Are you running in GitHub Actions on a v* tag?");
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+/.test(version)) {
  console.error(`Invalid semver version: "${version}"`);
  process.exit(1);
}

console.log(`Syncing version to ${version}`);

// package.json
const pkgPath = "package.json";
const pkg = await Bun.file(pkgPath).json();
pkg.version = version;
await Bun.write(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`  Updated ${pkgPath}`);

// src-tauri/tauri.conf.json
const tauriConfPath = "src-tauri/tauri.conf.json";
const tauriConf = await Bun.file(tauriConfPath).json();
tauriConf.version = version;
await Bun.write(tauriConfPath, JSON.stringify(tauriConf, null, 2) + "\n");
console.log(`  Updated ${tauriConfPath}`);

// src-tauri/Cargo.toml
const cargoPath = "src-tauri/Cargo.toml";
const cargo = await Bun.file(cargoPath).text();
const updatedCargo = cargo.replace(/^version = ".*"/m, `version = "${version}"`);
await Bun.write(cargoPath, updatedCargo);
console.log(`  Updated ${cargoPath}`);

export {}