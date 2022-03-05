import express from "express";
import { usersRoutes } from "./routes/users.routes";
import swaggerUi from 'swagger-ui-express';

const app = express();
import swaggerFile from "../swagger.json";

app.use(express.json());
app.use("/users", usersRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export { app };
