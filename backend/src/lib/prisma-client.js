require("../config/register-alias");
const { PrismaClient } = require("@prisma/client");
require("@/config/env");

const prisma = new PrismaClient();

module.exports = { prisma };
