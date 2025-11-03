require("../src/config/register-alias");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const assert = require("node:assert/strict");
const { describe, before, after, afterEach, test } = require("node:test");

const databaseFile = path.join(os.tmpdir(), "default-user-service-test.sqlite");
process.env.DATABASE_URL = `file:${databaseFile.replace(/\\/g, "/")}`;

const { syncDefaultUsers } = require("@/services/default-user-service");
const { defaultUsers } = require("@/config/default-users");
const userRepository = require("@/repositories/user-repository");
const bcrypt = require("@/lib/bcrypt");
const { prisma } = require("@/lib/prisma-client");

describe("default-user-service", () => {
  before(async () => {
    if (fs.existsSync(databaseFile)) {
      fs.unlinkSync(databaseFile);
    }

    execSync("npx prisma migrate deploy", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  after(async () => {
    await prisma.$disconnect();

    if (fs.existsSync(databaseFile)) {
      fs.unlinkSync(databaseFile);
    }
  });

  test("creates default users when they do not exist", async () => {
    await syncDefaultUsers(defaultUsers);

    for (const seed of defaultUsers) {
      const user = await userRepository.findByUsername(seed.username);
      assert.ok(user, `User ${seed.username} should exist`);
      assert.equal(user.role, seed.role);
      assert.equal(
        await bcrypt.compare(seed.password, user.passwordHash),
        true
      );
    }
  });

  test("does not rehash passwords when no changes are needed", async () => {
    await syncDefaultUsers(defaultUsers);
    const before = await userRepository.findByUsername(defaultUsers[0].username);

    await syncDefaultUsers(defaultUsers);
    const after = await userRepository.findByUsername(defaultUsers[0].username);

    assert.equal(before.passwordHash, after.passwordHash);
  });
});
