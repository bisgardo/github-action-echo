const { compute } = require("./lib");

const BASH = "/bin/bash";

test("entry of fixed value", async () => {
  const res = await compute({ prefix_key: "value" }, "prefix_", BASH);
  expect(res).toEqual({ key: "value" });
});

test("entries of fixed and computed values", async () => {
  const res = await compute(
    { prefix_key1: "value", prefix_key2: "key1=${key1}" },
    "prefix_",
    BASH
  );
  expect(res).toEqual({ key1: "value", key2: "key1=value" });
});

test("entries of fixed and computed values in reverse lexicographic order", async () => {
  const res = await compute(
    { prefix_key2: "value", prefix_key1: "key2=${key2}" },
    "prefix_",
    BASH
  );
  expect(res).toEqual({ key2: "value", key1: "key2=value" });
});

test("entries of fixed and computed values, referencing before defining", async () => {
  const res = await compute(
    { prefix_key2: "key1=${key1}", prefix_key1: "value" },
    "prefix_",
    BASH
  );
  expect(res).toEqual({ key1: "value", key2: "key1=" });
});

test("key is lower-cased", async () => {
  const res = await compute({ PREFIX_KEY: "value" }, "PREFIX_", BASH);
  expect(res).toEqual({ key: "value" });
});

test("substitutions are not HTML escaped", async () => {
  const res = await compute(
    { prefix_key1: "val=ue", prefix_key2: "key1=${key1}" },
    "prefix_",
    BASH
  );
  expect(res).toEqual({ key1: "val=ue", key2: "key1=val=ue" });
});

// TODO Add test that expression outputting expression isn't re-evaluated in assignments.
// TODO Test use of subshells.
// TODO Test use of quotes.
