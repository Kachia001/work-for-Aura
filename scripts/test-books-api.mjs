import assert from "node:assert/strict";
import { test } from "node:test";

const base = process.env.TEST_BASE_URL ?? "http://localhost:3000";
async function get(query = "") {
  const response = await fetch(`${base}/api/books${query}`);
  return { status: response.status, body: await response.json() };
}

test("seeded catalog paginates without duplicates and calculates discounts", async () => {
  const first = await get();
  const second = await get("?page=2");
  const third = await get("?page=3");
  assert.equal(first.status, 200);
  assert.equal(first.body.total, 28);
  assert.equal(first.body.items.length, 12);
  assert.equal(first.body.totalPages, 3);
  assert.equal(second.body.items.length, 12);
  assert.equal(third.body.items.length, 4);
  assert.equal(
    new Set(
      [...first.body.items, ...second.body.items, ...third.body.items].map(
        (b) => b.id,
      ),
    ).size,
    28,
  );
  assert.equal(first.body.items[0].discountRate, 5);
  assert.equal(
    first.body.items.find((b) => b.type === "single").discountRate,
    0,
  );
});

test("custom page size controls pagination", async () => {
  const first = await get("?pageSize=5");
  const second = await get("?pageSize=5&page=2");
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(first.body.pageSize, 5);
  assert.equal(first.body.items.length, 5);
  assert.equal(first.body.totalPages, 6);
  assert.equal(second.body.items.length, 5);
  assert.equal(
    new Set([...first.body.items, ...second.body.items].map((b) => b.id)).size,
    10,
  );
});

test("search and type filter compose on the server", async () => {
  const { body } = await get(`?type=pass&q=${encodeURIComponent("시즌4")}`);
  assert.equal(body.total, 4);
  assert.ok(
    body.items.every((b) => b.type === "pass" && b.name.includes("시즌4")),
  );
  assert.equal((await get("?type=single")).body.total, 18);
});

test("empty, out-of-range and SQL wildcard input return no unintended matches", async () => {
  for (const query of [
    "?q=no-such-book",
    "?page=999",
    "?q=%25",
    "?q=_",
    "?q=%27%20OR%201%3D1--",
  ]) {
    const { status, body } = await get(query);
    assert.equal(status, 200);
    assert.deepEqual(body.items, []);
  }
});

test("invalid request values return safe 400 errors", async () => {
  for (const query of [
    "?page=0",
    "?page=-1",
    "?page=1.5",
    "?page=abc",
    "?pageSize=0",
    "?pageSize=-1",
    "?pageSize=1.5",
    "?pageSize=abc",
    "?pageSize=",
    "?pageSize=101",
    "?type=other",
    `?q=${"x".repeat(101)}`,
  ]) {
    const { status, body } = await get(query);
    assert.equal(status, 400);
    assert.equal(typeof body.error.message, "string");
    assert.doesNotMatch(
      JSON.stringify(body),
      /postgres|DATABASE_URL|password|stack/i,
    );
  }
});
