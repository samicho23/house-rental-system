/**
 * Express application factory: middleware stack + module routes.
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import apiRouter from "./routes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

export function createApp() {
  const app = express();

  // --- global middleware -----------------------------------------------------
  app.disable("x-powered-by");
  app.use(
    cors({
      origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(",").map((o) => o.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  if (env.isDev) app.use(requestLogger);

  app.get("/api-docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });
  app.get("/swagger-check.json", (_req, res) => {
    res.json(swaggerSpec);
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "FaydaRent API Documentation",
  }));

  // --- API routes ------------------------------------------------------------
  app.use("/api", apiRouter);

  // --- errors ----------------------------------------------------------------
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
