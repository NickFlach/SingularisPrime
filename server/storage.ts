import { users, type User, type InsertUser, gameSaves, type GameSave, type InsertGameSave } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getGameSave(id: number): Promise<GameSave | undefined>;
  getGameSavesByUserId(userId: number): Promise<GameSave[]>;
  createGameSave(gameSave: InsertGameSave): Promise<GameSave>;
  deleteGameSave(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameSaves: Map<number, GameSave>;
  userCurrentId: number;
  saveCurrentId: number;

  constructor() {
    this.users = new Map();
    this.gameSaves = new Map();
    this.userCurrentId = 1;
    this.saveCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameSave(id: number): Promise<GameSave | undefined> {
    return this.gameSaves.get(id);
  }

  async getGameSavesByUserId(userId: number): Promise<GameSave[]> {
    return Array.from(this.gameSaves.values()).filter(
      (save) => save.userId === userId,
    );
  }

  async createGameSave(insertGameSave: InsertGameSave): Promise<GameSave> {
    const id = this.saveCurrentId++;
    const gameSave: GameSave = { ...insertGameSave, id };
    this.gameSaves.set(id, gameSave);
    return gameSave;
  }

  async deleteGameSave(id: number): Promise<void> {
    this.gameSaves.delete(id);
  }
}

export const storage = new MemStorage();
