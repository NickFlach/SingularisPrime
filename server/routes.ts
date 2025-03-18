import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { gameStateSchema, insertGameSaveSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game save endpoints
  app.get("/api/game-saves", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      const saves = await storage.getGameSavesByUserId(userId);
      res.json(saves);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game saves" });
    }
  });

  app.get("/api/game-saves/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid save ID" });
      }
      
      const save = await storage.getGameSave(id);
      
      if (!save) {
        return res.status(404).json({ message: "Game save not found" });
      }
      
      res.json(save);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game save" });
    }
  });

  app.post("/api/game-saves", async (req, res) => {
    try {
      const saveData = req.body;
      
      // Validate game state
      try {
        gameStateSchema.parse(saveData.saveData);
      } catch (error) {
        return res.status(400).json({ message: "Invalid game state data", error });
      }
      
      // Validate save data
      try {
        insertGameSaveSchema.parse(saveData);
      } catch (error) {
        return res.status(400).json({ message: "Invalid save data", error });
      }
      
      const newSave = await storage.createGameSave(saveData);
      res.status(201).json(newSave);
    } catch (error) {
      res.status(500).json({ message: "Failed to save game" });
    }
  });

  app.delete("/api/game-saves/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid save ID" });
      }
      
      await storage.deleteGameSave(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete game save" });
    }
  });

  // User authentication endpoints (for saving and loading games)
  app.post("/api/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser({ username, password });
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
