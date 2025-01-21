import { Request, Response } from "express";
import express from "express";
import pool from "../db";
import { authenticateToken } from "../middleware/auth";
import fetch from "node-fetch";

const router = express.Router();

// Get all stored recipes for a user
router.get(
  "/stored",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const [recipes]: any = await pool.query(
        "SELECT * FROM recipes WHERE user_id = ?",
        [userId]
      );
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create new recipe
router.post(
  "/stored",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, image, ingredients, instructions } = req.body;
      const userId = req.user.id;

      const [result]: any = await pool.query(
        "INSERT INTO recipes (user_id, title, description, image, ingredients, instructions) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, title, description, image, ingredients, instructions]
      );

      const [newRecipe]: any = await pool.query(
        "SELECT * FROM recipes WHERE id = ?",
        [result.insertId]
      );

      res.json(newRecipe[0]);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update stored recipe
router.put(
  "/stored/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, image, ingredients, instructions } = req.body;
      const userId = req.user.id;

      const [result]: any = await pool.query(
        "UPDATE recipes SET title = ?, description = ?, image = ?,  ingredients = ?, instructions = ? WHERE id = ? AND user_id = ?",
        [title, description, image, ingredients, instructions, id, userId]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Recipe not found" });
        return;
      }

      const [updatedRecipe]: any = await pool.query(
        "SELECT * FROM recipes WHERE id = ?",
        [id]
      );

      res.json(updatedRecipe[0]);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete stored recipe
router.delete(
  "/stored/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const [result]: any = await pool.query(
        "DELETE FROM recipes WHERE id = ? AND user_id = ?",
        [id, userId]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Recipe not found" });
        return;
      }

      res.json({ message: "Recipe deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get public recipes from API
router.get("/public", async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/micahcochran/json-cookbook/refs/heads/main/cookbook-100.json"
    );
    const recipes = await response.json();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching public recipes" });
  }
});

// Store public recipe to user's stored recipes
router.post(
  "/public/store",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, image, ingredients, instructions } = req.body;
      const userId = req.user.id;

      const [result]: any = await pool.query(
        "INSERT INTO recipes (user_id, title, description, image, ingredients, instructions) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, title, description, image, ingredients, instructions]
      );

      const [savedRecipe]: any = await pool.query(
        "SELECT * FROM recipes WHERE id = ?",
        [result.insertId]
      );

      res.json(savedRecipe[0]);
    } catch (err) {
      res.status(500).json({ message: "Error saving public recipe" });
    }
  }
);

export default router;
