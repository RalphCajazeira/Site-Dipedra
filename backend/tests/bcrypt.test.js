require("../src/config/register-alias");
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");
const bcrypt = require("@/lib/bcrypt");

describe("bcrypt shim", () => {
  test("hash and compare succeed for valid credentials", async () => {
    const hash = await bcrypt.hash("secret");
    assert.equal(await bcrypt.compare("secret", hash), true);
    assert.equal(await bcrypt.compare("invalid", hash), false);
  });

  test("compare rejects hashes in an unexpected format", async () => {
    assert.equal(await bcrypt.compare("secret", "invalid"), false);
  });
});
