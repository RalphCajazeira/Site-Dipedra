require("./config/register-alias");
const express = require("express");
const cors = require("cors");
const { routes } = require("@/routes");
const { notFoundHandler } = require("@/errors/not-found-handler");
const { errorHandler } = require("@/errors/error-handler");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - startedAt;
      console.log(
        `${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`
      );
    });
    next();
  });

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
