require("../config/register-alias");
const { prisma } = require("@/lib/prisma-client");

function mapUser(entity) {
  if (!entity) {
    return null;
  }

  return {
    id: entity.id,
    username: entity.username,
    role: entity.role,
    passwordHash: entity.passwordHash,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

async function findByUsername(username) {
  const entity = await prisma.user.findUnique({ where: { username } });
  return mapUser(entity);
}

async function findById(id) {
  const entity = await prisma.user.findUnique({ where: { id } });
  return mapUser(entity);
}

async function upsertUser({ username, passwordHash, role }) {
  const entity = await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      role,
    },
    create: {
      username,
      passwordHash,
      role,
    },
  });

  return mapUser(entity);
}

module.exports = {
  findByUsername,
  findById,
  upsertUser,
};
