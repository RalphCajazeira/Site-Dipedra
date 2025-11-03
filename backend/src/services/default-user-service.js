require("../config/register-alias");
const bcrypt = require("@/lib/bcrypt");
const userRepository = require("@/repositories/user-repository");
const { defaultUsers: defaultUserSeeds } = require("@/config/default-users");

async function syncDefaultUsers(users = defaultUserSeeds) {
  for (const user of users) {
    const existing = await userRepository.findByUsername(user.username);

    if (!existing) {
      const passwordHash = await bcrypt.hash(user.password);
      await userRepository.upsertUser({
        username: user.username,
        passwordHash,
        role: user.role,
      });
      continue;
    }

    const roleChanged = existing.role !== user.role;
    const passwordChanged = !(await bcrypt.compare(
      user.password,
      existing.passwordHash
    ));

    if (!roleChanged && !passwordChanged) {
      continue;
    }

    const passwordHash = passwordChanged
      ? await bcrypt.hash(user.password)
      : existing.passwordHash;

    await userRepository.upsertUser({
      username: user.username,
      passwordHash,
      role: user.role,
    });
  }
}

module.exports = { syncDefaultUsers };
