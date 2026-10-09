import { test } from "node:test";
import assert from "node:assert/strict";
import { render, audit } from "../tools/badge.mjs";

test("malformed addresses are collected and invalid color types are rejected", () => {
  assert.throws(() => render("label", "message", {}), /invalid_color/);
  const result = audit("![bad](https://[invalid)\n![good](https://example.com/badge)");
  assert.equal(result.total, 2);
  assert.deepEqual(result.issues[0].problems, ["malformed_url"]);
});

test("SVG text and accessible labels escape markup", () => {
  const svg = render("<script>", "A&B", "blue");
  assert.ok(svg.includes("&lt;script&gt;"));
  assert.ok(!svg.includes("<script>"));
  assert.throws(() => render("label", "message", 'red"/>'));
});
test("Markdown audit reports insecure badge URLs and styles", () => {
  const result = audit(
    "![test](http://example.com/badge?style=unknown)\n![good](https://img.shields.io/badge/pass-yes-green)",
  );
  assert.equal(result.total, 2);
  assert.deepEqual(result.issues[0].problems, [
    "insecure_transport",
    "unknown_style",
  ]);
});
