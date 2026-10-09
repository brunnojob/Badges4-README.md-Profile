import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const colors = {
  green: "22c55e",
  blue: "2563eb",
  red: "dc2626",
  orange: "ea580c",
  gray: "475569",
  purple: "7c3aed",
};
export function escape(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );
}
export function render(label, message, color = "blue") {
  if (
    typeof label !== "string" ||
    typeof message !== "string" ||
    !label.trim() ||
    !message.trim() ||
    label.length > 80 ||
    message.length > 80 ||
    /[\x00-\x1f]/.test(label + message)
  )
    throw new Error("invalid_badge_text");
  if (typeof color !== "string") throw new Error("invalid_color");
  color = colors[color] ?? color.replace(/^#/, "");
  if (!/^[a-f0-9]{6}$/i.test(color)) throw new Error("invalid_color");
  const width = (text) =>
    Math.max(
      30,
      [...text].reduce(
        (sum, character) =>
          sum +
          (/[^\x00-\x7f]/.test(character)
            ? 13
            : /[ilI., ]/.test(character)
              ? 4
              : /[MW@]/.test(character)
                ? 10
                : 7),
        0,
      ) + 18,
    );
  const left = width(label),
    right = width(message),
    total = left + right;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="24" role="img" aria-label="${escape(label + ": " + message)}"><title>${escape(label + ": " + message)}</title><rect width="${total}" height="24" rx="4" fill="#${color}"/><path d="M4 0h${left - 4}v24H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#1e293b"/><g fill="#fff" font-family="DejaVu Sans,Verdana,sans-serif" font-size="11" text-anchor="middle"><text x="${left / 2}" y="16">${escape(label)}</text><text x="${left + right / 2}" y="16">${escape(message)}</text></g></svg>\n`;
}
export function audit(markdown) {
  const results = [];
  for (const match of markdown.matchAll(
    /!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g,
  )) {
    const address = match[1];
    let url;
    try { url = new URL(address); }
    catch {
      results.push({ url: address, line: markdown.slice(0, match.index).split("\n").length,
        problems: ["malformed_url"] });
      continue;
    }
    const problems = [];
    if (url.protocol !== "https:") problems.push("insecure_transport");
    if (url.username || url.password) problems.push("embedded_credentials");
    for (const field of ["label", "message"])
      if ((url.searchParams.get(field) ?? "").length > 80)
        problems.push("oversized_" + field);
    if (
      ![
        "flat",
        "flat-square",
        "plastic",
        "for-the-badge",
        "social",
        null,
      ].includes(url.searchParams.get("style"))
    )
      problems.push("unknown_style");
    results.push({
      url: address,
      line: markdown.slice(0, match.index).split("\n").length,
      problems,
    });
  }
  return {
    total: results.length,
    issues: results.filter((row) => row.problems.length),
    valid: results.every((row) => !row.problems.length),
  };
}
async function main(args) {
  if (args[0] === "render" && args.length >= 4 && args.length <= 5)
    await writeFile(args[3], render(args[1], args[2], args[4]));
  else if (args[0] === "audit" && args.length === 2) {
    const result = audit(await readFile(args[1], "utf8"));
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.valid ? 0 : 1;
  } else
    throw new Error(
      "badge.mjs render label message output.svg [color] | audit README.md",
    );
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 2;
  });
