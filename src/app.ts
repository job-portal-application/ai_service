// @ts-ignore: Could not find declaration file for module 'express'.
import express from "express";
import dotenv from "dotenv";
import { connectKafka } from "./utils/producer.js";
import aiRoutes from "./routes/routes.js";

dotenv.config();

const app = express();
app.use(express.json({
    limit: "100mb"}));
app.use(express.urlencoded({ extended: true }));

connectKafka();

app.use("/api/v1/ai", aiRoutes);


export default app;