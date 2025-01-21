import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import recipeRoutes from "./routes/recipes";
import pool from "./db";

const app = express();
const port = 3000;

// Test database connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
