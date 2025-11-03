require("./config/register-alias");
const { createApp } = require("@/app");
const { env } = require("@/config/env");
const { prisma } = require("@/lib/prisma-client");

async function bootstrap() {
  await prisma.$connect();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`🚀 API rodando na porta ${env.port}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return server;
}

if (require.main === module) {
  bootstrap().catch((error) => {
    console.error("❌ Falha ao iniciar a API:", error);
    process.exit(1);
  });
}

module.exports = { bootstrap };
