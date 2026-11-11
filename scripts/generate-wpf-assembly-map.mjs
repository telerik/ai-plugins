/**
 * generate-wpf-assembly-map.mjs
 *
 * Regenerates the Telerik UI for WPF assembly -> NuGet package reference tables
 * used by plugins/telerik-wpf-upgrade-plugin (lazy skill telerik-wpf-assembly-mapping).
 *
 * Usage:
 *   node ./scripts/generate-wpf-assembly-map.mjs --dlls <dir> --nuget <dir> [--report <file>]
 *
 *   --dlls    Extracted "Telerik_UI_for_WPF_<version>_Dlls" folder
 *             (contains Binaries/ and Binaries.NoXaml/ with WPF<tfm> subfolders).
 *   --nuget   Folder that contains the extracted
 *             "..._NuGet_Separate_Packages_Xaml" and "..._NuGet_Separate_Packages_NoXaml"
 *             folders of .nupkg files.
 *   --report  Optional path for the coverage report (Markdown). Printed to stdout otherwise.
 *
 * Facts come only from the artifacts: package ids, versions, dependency groups and
 * lib/<tfm> payloads are read from each .nupkg; assembly presence from the DLL folders.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import zlib from 'node:zlib';

const REPO_ROOT = process.cwd();
const OUT_DIR = path.join(
  REPO_ROOT,
  'plugins', 'telerik-wpf-upgrade-plugin', 'upgrade', 'skills', 'lazy',
  'telerik-wpf-assembly-mapping', 'ref',
);

const FLAVORS = ['Xaml', 'NoXaml'];
const DLL_FLAVOR_DIRS = { Xaml: 'Binaries', NoXaml: 'Binaries.NoXaml' };

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    args[key.slice(2)] = argv[i + 1];
    i++;
  }
  if (!args.dlls || !args.nuget) {
    console.error('Usage: node ./scripts/generate-wpf-assembly-map.mjs --dlls <dir> --nuget <dir> [--report <file>]');
    process.exit(1);
  }
  return args;
}

// ---------------------------------------------------------------------------
// Minimal ZIP reader (central directory + stored/deflated entries)
// ---------------------------------------------------------------------------

function readZipEntries(buf) {
  const EOCD_SIG = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a zip file (EOCD not found)');

  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('Bad central directory entry');
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    entries.push({ name: decodeURIComponent(name), method, compSize, localOffset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function readZipEntry(buf, entry) {
  const p = entry.localOffset;
  const nameLen = buf.readUInt16LE(p + 26);
  const extraLen = buf.readUInt16LE(p + 28);
  const start = p + 30 + nameLen + extraLen;
  const data = buf.subarray(start, start + entry.compSize);
  if (entry.method === 0) return data;
  if (entry.method === 8) return zlib.inflateRawSync(data);
  throw new Error(`Unsupported zip compression method ${entry.method} for ${entry.name}`);
}

// ---------------------------------------------------------------------------
// Nuspec parsing
// ---------------------------------------------------------------------------

function normalizeTfm(tfm) {
  if (!tfm) return 'any';
  const m = /^\.NETFramework(\d)\.?(\d)\.?(\d)?$/i.exec(tfm);
  if (m) return `net${m[1]}${m[2]}${m[3] ?? ''}`;
  const s = /^\.NETStandard(\d+\.\d+)$/i.exec(tfm);
  if (s) return `netstandard${s[1]}`;
  return tfm.toLowerCase();
}

function attr(tag, name) {
  const m = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i').exec(tag);
  return m ? m[1] : undefined;
}

function parseNuspec(xml) {
  const id = /<id>([^<]+)<\/id>/i.exec(xml)?.[1].trim();
  const version = /<version>([^<]+)<\/version>/i.exec(xml)?.[1].trim();
  const groups = {};
  const depsBlock = /<dependencies>([\s\S]*?)<\/dependencies>/i.exec(xml)?.[1] ?? '';
  const groupRe = /<group\b([^>]*?)(?:\/>|>([\s\S]*?)<\/group>)/gi;
  let g;
  let sawGroup = false;
  while ((g = groupRe.exec(depsBlock))) {
    sawGroup = true;
    const tfm = normalizeTfm(attr(g[1], 'targetFramework'));
    groups[tfm] = parseDependencies(g[2] ?? '');
  }
  if (!sawGroup && depsBlock) groups.any = parseDependencies(depsBlock);
  return { id, version, groups };
}

function parseDependencies(block) {
  const deps = [];
  const depRe = /<dependency\b([^>]*?)\/?>/gi;
  let d;
  while ((d = depRe.exec(block))) {
    deps.push({ id: attr(d[1], 'id'), range: attr(d[1], 'version') });
  }
  return deps;
}

async function readPackage(file) {
  const buf = await fs.readFile(file);
  const entries = readZipEntries(buf);
  const nuspecEntry = entries.find((e) => !e.name.includes('/') && e.name.toLowerCase().endsWith('.nuspec'));
  if (!nuspecEntry) throw new Error(`No nuspec in ${file}`);
  const nuspec = parseNuspec(readZipEntry(buf, nuspecEntry).toString('utf8'));
  const lib = {};
  for (const e of entries) {
    // Only top-level lib/<tfm>/*.dll: skips Design/ and satellite-language subfolders.
    const m = /^lib\/([^/]+)\/([^/]+\.dll)$/i.exec(e.name);
    if (!m) continue;
    const tfm = normalizeTfm(m[1]);
    (lib[tfm] ??= []).push(m[2]);
  }
  for (const tfm of Object.keys(lib)) lib[tfm].sort();
  return { ...nuspec, lib, file: path.basename(file) };
}

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

async function listDirs(dir) {
  return (await fs.readdir(dir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
}

async function loadPackages(nugetRoot) {
  const byFlavor = { Xaml: [], NoXaml: [] };
  for (const name of await listDirs(nugetRoot)) {
    const flavor = /_NoXaml$/i.test(name) ? 'NoXaml' : /_Xaml$/i.test(name) ? 'Xaml' : null;
    if (!flavor) continue;
    const dir = path.join(nugetRoot, name);
    for (const f of (await fs.readdir(dir)).filter((x) => x.toLowerCase().endsWith('.nupkg')).sort()) {
      byFlavor[flavor].push(await readPackage(path.join(dir, f)));
    }
  }
  for (const flavor of FLAVORS) {
    if (byFlavor[flavor].length === 0) throw new Error(`No ${flavor} packages found under ${nugetRoot}`);
  }
  return byFlavor;
}

function tfmFromDllFolder(name) {
  const m = /^WPF(\d)(\d)(\d)?$/i.exec(name);
  if (!m) return null;
  // WPF462 -> net462 (.NET Framework); WPF80 -> net8.0-windows7.0 (matches the package lib folder).
  return m[3] !== undefined ? `net${m[1]}${m[2]}${m[3]}` : `net${m[1]}.${m[2]}-windows7.0`;
}

async function loadDlls(dllRoot) {
  const result = {};
  for (const flavor of FLAVORS) {
    const flavorDir = path.join(dllRoot, DLL_FLAVOR_DIRS[flavor]);
    result[flavor] = {};
    for (const sub of await listDirs(flavorDir)) {
      const tfm = tfmFromDllFolder(sub);
      if (!tfm) continue;
      const files = await fs.readdir(path.join(flavorDir, sub), { withFileTypes: true });
      result[flavor][tfm] = files.filter((f) => f.isFile() && f.name.toLowerCase().endsWith('.dll')).map((f) => f.name).sort();
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

const isFlavorPackage = (id) => /\.for\.Wpf(\.Xaml)?$/i.test(id) || /^Telerik\.UI\.for\.Wpf\.AllControls\./i.test(id);
const isAllControls = (id) => /^Telerik\.UI\.for\.Wpf\.AllControls\./i.test(id);
const isTelerik = (id) => /^Telerik\./i.test(id);

function buildModel(packagesByFlavor) {
  const flavored = { Xaml: [], NoXaml: [] };
  const shared = new Map();
  const sharedConflicts = [];
  for (const flavor of FLAVORS) {
    for (const pkg of packagesByFlavor[flavor]) {
      if (isFlavorPackage(pkg.id)) {
        flavored[flavor].push(pkg);
        continue;
      }
      const key = pkg.id.toLowerCase();
      const existing = shared.get(key);
      if (!existing) shared.set(key, pkg);
      else if (existing.version !== pkg.version || JSON.stringify(existing.lib) !== JSON.stringify(pkg.lib)) {
        sharedConflicts.push(`${pkg.id}: Xaml and NoXaml folders contain different payloads/versions`);
      }
    }
  }
  return { flavored, shared: [...shared.values()].sort((a, b) => a.id.localeCompare(b.id)), sharedConflicts };
}

function tfmsOf(packages) {
  const set = new Set();
  for (const p of packages) {
    Object.keys(p.lib).forEach((t) => set.add(t));
    Object.keys(p.groups).filter((t) => t !== 'any').forEach((t) => set.add(t));
  }
  return [...set].sort(compareTfm);
}

function compareTfm(a, b) {
  const rank = (t) => (/^net4/.test(t) ? 0 : 1);
  return rank(a) - rank(b) || a.localeCompare(b, undefined, { numeric: true });
}

function assemblyIndex(packages) {
  const index = new Map();
  for (const pkg of packages) {
    for (const [tfm, dlls] of Object.entries(pkg.lib)) {
      for (const dll of dlls) {
        const key = dll.toLowerCase();
        const row = index.get(key) ?? { dll, owners: new Map() };
        const tfms = row.owners.get(pkg.id) ?? new Set();
        tfms.add(tfm);
        row.owners.set(pkg.id, tfms);
        index.set(key, row);
      }
    }
  }
  return [...index.values()].sort((a, b) => a.dll.localeCompare(b.dll));
}

function telerikDeps(pkg, tfm) {
  return (pkg.groups[tfm] ?? pkg.groups.any ?? [])
    .filter((d) => isTelerik(d.id) && d.id.toLowerCase() !== 'telerik.licensing')
    .map((d) => d.id)
    .sort();
}

// ---------------------------------------------------------------------------
// Markdown
// ---------------------------------------------------------------------------

const code = (s) => `\`${s}\``;
const list = (items) => (items.length ? items.map(code).join(', ') : 'None');

function header(title, versions, intro) {
  return [
    `# ${title}`,
    '',
    '<!-- GENERATED by scripts/generate-wpf-assembly-map.mjs — do not edit by hand. Regenerate for each release. -->',
    '',
    `Source package versions (provenance only, not installation targets): ${versions.map(code).join(', ')}. Generated from the release \`.nupkg\` files (nuspec dependency groups and top-level \`lib/<tfm>/*.dll\` payloads). Designer-only DLLs under \`lib/<tfm>/Design\` and localization satellite folders are excluded.`,
    '',
    "These tables describe assembly ownership and dependency relationships, not package-version requirements. Resolve versions and verify framework support using the requested release's nuspecs.",
    '',
    intro,
    '',
  ];
}

function renderFlavor(flavor, packages, versions) {
  const tfms = tfmsOf(packages);
  const lines = header(
    `Telerik UI for WPF ${flavor} Assembly Reference Map`,
    versions,
    `Reference tables for \`telerik-wpf-assembly-mapping\` when the project uses the **${flavor}** assemblies. Flavor-neutral packages (Document Processing, Zip, AI, \`Telerik.Licensing\`) are in [assembly-map-shared.md](assembly-map-shared.md).`,
  );

  lines.push('## Assembly Reference → NuGet Package', '');
  lines.push(`| Assembly | NuGet package | ${tfms.map(code).join(' | ')} |`);
  lines.push(`| --- | --- | ${tfms.map(() => '---').join(' | ')} |`);
  for (const row of assemblyIndex(packages)) {
    for (const [id, owned] of row.owners) {
      lines.push(`| ${code(row.dll)} | ${code(id)} | ${tfms.map((t) => (owned.has(t) ? 'yes' : '—')).join(' | ')} |`);
    }
  }
  lines.push('', 'Any Telerik assembly not listed above has **no known mapping** for this flavor — report it, do not guess.', '');

  lines.push('## Nuspec Package Dependencies (Telerik → Telerik)', '');
  const suffix = flavor === 'Xaml' ? '.for.Wpf.Xaml' : '.for.Wpf';
  const short = (id) => (id.endsWith(suffix) ? id.slice(0, -suffix.length) : `${id} (shared)`);
  lines.push(
    `Dependency names omit the \`${suffix}\` suffix (e.g. \`Telerik.Windows.Controls\` means \`Telerik.Windows.Controls${suffix}\`); \`(shared)\` marks a flavor-neutral package from [assembly-map-shared.md](assembly-map-shared.md). TFMs with an identical dependency set are grouped. Licensing dependencies are omitted here; NuGet resolves them transitively when declared by the selected packages. Non-Telerik dependencies resolve through NuGet and do not affect package selection.`,
    '',
  );
  lines.push('| NuGet package | Depends on (by TFM) |');
  lines.push('| --- | --- |');
  for (const pkg of packages.filter((p) => !isAllControls(p.id)).sort((a, b) => a.id.localeCompare(b.id))) {
    const shipped = tfms.filter((t) => pkg.lib[t] || pkg.groups[t]);
    const bySet = new Map();
    for (const t of shipped) {
      const key = list(telerikDeps(pkg, t).map(short));
      bySet.set(key, [...(bySet.get(key) ?? []), t]);
    }
    const cell = [...bySet].map(([deps, ts]) => `${ts.join(', ')}: ${deps}`).join('<br>');
    lines.push(`| ${code(pkg.id)} | ${cell} |`);
  }
  lines.push('');

  const all = packages.find((p) => isAllControls(p.id));
  if (all) {
    lines.push(`## ${code(all.id)} Membership`, '');
    lines.push(`Meta-package with no DLL payload. NuGet resolves its dependencies using the selected release's nuspec. Names omit the \`${suffix}\` suffix.`, '');
    for (const t of tfms) {
      lines.push(`- **${t}**: ${list(telerikDeps(all, t).map(short))}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function renderShared(shared, versions, tfmOnly) {
  const lines = header(
    'Telerik UI for WPF Shared (Flavor-Neutral) Assembly Reference Map',
    versions,
    "Packages that are identical for the Xaml and NoXaml distributions. Their versions are independent of the UI package version; resolve compatible versions from the requested release's nuspecs. NuGet picks the closest `lib` folder for the project TFM (for example a `net9.0-windows` project uses `net8.0-windows7.0` when no closer folder exists).",
  );

  lines.push('## Assembly Reference → NuGet Package', '');
  lines.push('| Assembly | NuGet package | `lib` TFMs |');
  lines.push('| --- | --- | --- |');
  for (const row of assemblyIndex(shared)) {
    for (const [id, owned] of row.owners) {
      lines.push(`| ${code(row.dll)} | ${code(id)} | ${list([...owned].sort(compareTfm))} |`);
    }
  }
  const noLib = shared.filter((p) => Object.keys(p.lib).length === 0);
  if (noLib.length) {
    lines.push('', `Packages with no top-level \`lib\` DLL payload: ${list(noLib.map((p) => p.id))}.`);
  }
  lines.push('');

  lines.push('## Nuspec Package Dependencies (Telerik → Telerik)', '');
  lines.push('TFMs with an identical dependency set are grouped. `Telerik.Licensing` is omitted.', '');
  lines.push('| NuGet package | Depends on (by TFM) |');
  lines.push('| --- | --- |');
  for (const pkg of shared) {
    const bySet = new Map();
    for (const t of tfmsOf([pkg])) {
      const key = list(telerikDeps(pkg, t));
      bySet.set(key, [...(bySet.get(key) ?? []), t]);
    }
    const cell = [...bySet].map(([deps, ts]) => `${ts.join(', ')}: ${deps}`).join('<br>');
    lines.push(`| ${code(pkg.id)} | ${cell} |`);
  }
  lines.push('');

  lines.push('## Assemblies Shipped for Only One Target Framework', '');
  lines.push('Derived from the DLL distribution folders. On a .NET Framework → .NET move these need the replacements described in `telerik-wpf-assembly-mapping`.', '');
  for (const flavor of FLAVORS) {
    for (const [tfm, dlls] of Object.entries(tfmOnly[flavor])) {
      lines.push(`- **${flavor}, ${tfm} only**: ${list(dlls)}`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Coverage
// ---------------------------------------------------------------------------

function coverage(model, dlls) {
  const out = ['# WPF assembly map coverage report', ''];
  const tfmOnly = { Xaml: {}, NoXaml: {} };
  for (const flavor of FLAVORS) {
    const pkgs = [...model.flavored[flavor], ...model.shared];
    const owners = new Map(assemblyIndex(pkgs).map((r) => [r.dll.toLowerCase(), r]));
    out.push(`## ${flavor}`, '');
    out.push(`Packages: ${model.flavored[flavor].length} flavor-specific + ${model.shared.length} shared.`, '');

    const folderTfms = Object.keys(dlls[flavor]).sort(compareTfm);
    for (const tfm of folderTfms) {
      const present = dlls[flavor][tfm];
      const noPkg = present.filter((d) => {
        const r = owners.get(d.toLowerCase());
        return !r || ![...r.owners.values()].some((t) => t.has(tfm));
      });
      out.push(`- ${tfm}: ${present.length} assemblies in the DLL folder; without a package for this TFM: ${list(noPkg)}`);
    }

    const allFolder = new Set(folderTfms.flatMap((t) => dlls[flavor][t].map((d) => d.toLowerCase())));
    const pkgOnly = [...owners.values()].filter((r) => !allFolder.has(r.dll.toLowerCase())).map((r) => r.dll);
    out.push(`- Package DLLs not present in the DLL folder: ${list(pkgOnly)}`);

    const multi = [...owners.values()].filter((r) => r.owners.size > 1).map((r) => `${r.dll} (${[...r.owners.keys()].join(', ')})`);
    out.push(`- Assemblies shipped in more than one package: ${list(multi)}`);

    for (const tfm of folderTfms) {
      const others = folderTfms.filter((t) => t !== tfm).flatMap((t) => dlls[flavor][t].map((d) => d.toLowerCase()));
      const only = dlls[flavor][tfm].filter((d) => !others.includes(d.toLowerCase()));
      if (only.length) tfmOnly[flavor][tfm] = only;
    }
    for (const [tfm, only] of Object.entries(tfmOnly[flavor])) out.push(`- Only in ${tfm}: ${list(only)}`);

    const pkgTfms = tfmsOf(pkgs).filter((t) => !folderTfms.includes(t));
    out.push(`- Package TFMs with no DLL folder: ${list(pkgTfms)}`, '');

    const all = model.flavored[flavor].find((p) => isAllControls(p.id));
    if (all) {
      for (const tfm of tfmsOf([all])) {
        const members = new Set(telerikDeps(all, tfm).map((x) => x.toLowerCase()));
        const missing = model.flavored[flavor]
          .filter((p) => !isAllControls(p.id) && p.lib[tfm] && !members.has(p.id.toLowerCase()))
          .map((p) => p.id);
        out.push(`- ${all.id} (${tfm}) does not reference: ${list(missing)}`);
      }
      out.push('');
    }
  }
  if (model.sharedConflicts.length) out.push('## Shared package conflicts', '', ...model.sharedConflicts.map((c) => `- ${c}`), '');
  return { text: out.join('\n'), tfmOnly };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const packagesByFlavor = await loadPackages(args.nuget);
  const dlls = await loadDlls(args.dlls);
  const model = buildModel(packagesByFlavor);

  const uiVersions = [...new Set(FLAVORS.flatMap((f) => model.flavored[f].map((p) => p.version)))].sort();
  const sharedVersions = [...new Set(model.shared.map((p) => p.version))].sort();
  const { text: report, tfmOnly } = coverage(model, dlls);

  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const flavor of FLAVORS) {
    await fs.writeFile(path.join(OUT_DIR, `assembly-map-${flavor.toLowerCase()}.md`), renderFlavor(flavor, model.flavored[flavor], uiVersions));
  }
  await fs.writeFile(path.join(OUT_DIR, 'assembly-map-shared.md'), renderShared(model.shared, sharedVersions, tfmOnly));

  if (args.report) await fs.writeFile(args.report, report);
  else console.log(report);
  console.log(`Wrote reference maps to ${path.relative(REPO_ROOT, OUT_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
