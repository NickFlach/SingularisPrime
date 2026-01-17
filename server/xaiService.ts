import OpenAI from "openai";
import { Request, Response } from "express";
import { GameState } from "@shared/schema";
import type { QuantumDecision } from "../client/src/types/game";

// Initialize xAI client with API key
const xai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY 
});

/**
 * Handle request for xAI text generation
 * This endpoint allows for generating content using Grok models
 */
export async function handleXAICompletion(req: Request, res: Response) {
  try {
    const { prompt, type = "narrative", model = "grok-2-1212" } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    let systemPrompt = "You are an AI assistant in the Singularis Prime universe.";
    
    // Adjust system prompt based on content type
    switch (type) {
      case "scientific":
        systemPrompt = "You are a scientific expert in the Singularis Prime universe, specializing in advanced physics and quantum theory. Provide accurate but accessible scientific explanations.";
        break;
      case "quantum":
        systemPrompt = "You are a quantum physics theorist in the Singularis Prime universe. Explain quantum concepts with mathematical precision while relating them to the game's quantum decision mechanics.";
        break;
      case "paradox":
        systemPrompt = "You are a paradox analyst in the Singularis Prime universe. Discuss temporal and logical paradoxes, their implications, and how they relate to quantum decision theory.";
        break;
      case "codex":
        systemPrompt = "You are the Singularis Prime Codex system. Create an encyclopedia-style entry with accurate technical details and lore connections.";
        break;
      default:
        systemPrompt = "You are the narrative AI for Singularis Prime. Create compelling, immersive narrative content that blends scientific concepts with engaging storytelling.";
    }
    
    // Generate content using xAI's Grok model
    const response = await xai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
    
    return res.json({ 
      content: response.choices[0].message.content,
      model: response.model
    });
    
  } catch (error) {
    console.error("Error in xAI completion:", error);
    return res.status(500).json({ error: "Error processing xAI completion" });
  }
}

/**
 * Handle request for xAI quantum decision analysis
 * This endpoint analyzes and potentially adjusts quantum decisions
 */
export async function handleXAIQuantumDecisionAdjustment(req: Request, res: Response) {
  try {
    const { decision, gameState } = req.body;
    
    if (!decision || !gameState) {
      return res.status(400).json({ 
        error: "Decision and game state are required" 
      });
    }
    
    // Get player quantum level for context
    const playerQuantum = gameState.player?.attributes?.quantum || 0;
    
    // Request quantum decision adjustment from Grok
    const response = await xai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: 
            "You are a quantum decision analyst for the Singularis Prime game. " +
            "Analyze and adjust quantum decisions based on player attributes and game state. " +
            "Respond with JSON in this format: { probability: number, entanglementFactor: number, superpositionStates?: string[], suggestedOutcome?: string }"
        },
        {
          role: "user",
          content: 
            `Analyze and adjust this quantum decision:\n` +
            `Decision: ${JSON.stringify(decision)}\n` +
            `Player Quantum Level: ${playerQuantum}\n` +
            `Current Scene: ${gameState.narrative?.currentScene?.title || "Unknown"}\n` +
            `Player Origin: ${gameState.player?.origin || "Unknown"}\n` +
            `Energy Level: ${gameState.player?.energy || 0}\n` +
            `Knowledge Level: ${gameState.player?.knowledge || 0}\n` +
            `Paradox Level: ${gameState.player?.paradox || 0}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const adjustedDecision = JSON.parse(response.choices[0].message.content || "{}");
    
    // Return the adjusted decision
    return res.json({
      originalDecision: decision,
      adjustedDecision: {
        ...decision,
        probability: adjustedDecision.probability ?? decision.probability,
        entanglementFactor: adjustedDecision.entanglementFactor ?? decision.entanglementFactor,
        superpositionStates: adjustedDecision.superpositionStates ?? decision.superpositionStates,
      },
      model: response.model
    });
    
  } catch (error) {
    console.error("Error in xAI quantum decision adjustment:", error);
    return res.status(500).json({ error: "Error processing quantum decision adjustment" });
  }
}

/**
 * Handle request for xAI game state analysis
 * This endpoint analyzes game state and provides suggestions for adjustment
 */
export async function handleXAIGameStateAdjustment(req: Request, res: Response) {
  try {
    const { gameState } = req.body;
    
    if (!gameState) {
      return res.status(400).json({ error: "Game state is required" });
    }
    
    // Provide a complex analysis of the game state
    const response = await xai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: 
            "You are the AI Director for Singularis Prime, a quantum narrative game. " +
            "Analyze the game state and suggest adjustments to create an optimal player experience. " +
            "Respond with JSON in this format: { " +
            "quantumComplexity: number, " +  // 0-1 factor to adjust complexity of quantum decisions
            "narrativeDirection: string, " + // Suggested narrative emphasis
            "processorImprovements?: object, " + // Suggested processor improvements
            "nextChoiceEmphasis?: string, " + // What type of choices to emphasize
            "playerAttributeSuggestions?: object " + // Attribute adjustment suggestions
            "}"
        },
        {
          role: "user",
          content: `Analyze this game state and provide AI Director recommendations:\n${JSON.stringify(gameState, null, 2)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });
    
    // Parse the response
    const adjustments = JSON.parse(response.choices[0].message.content || "{}");
    
    // Return the game state adjustments
    return res.json({
      adjustments,
      model: response.model
    });
    
  } catch (error) {
    console.error("Error in xAI game state adjustment:", error);
    return res.status(500).json({ error: "Error processing game adjustments" });
  }
}

/**
 * Handle request for xAI image analysis
 * This endpoint analyzes images using xAI's vision capabilities
 */
export async function handleXAIImageAnalysis(req: Request, res: Response) {
  try {
    const { base64Image, prompt } = req.body;
    
    if (!base64Image) {
      return res.status(400).json({ error: "Image data is required" });
    }
    
    // Default prompt if none provided
    const imagePrompt = prompt || "Analyze this image in detail and describe its key elements, context, and any notable aspects.";
    
    // Analyze image using Grok vision
    const response = await xai.chat.completions.create({
      model: "grok-2-vision-1212",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: imagePrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 800,
    });
    
    return res.json({ 
      analysis: response.choices[0].message.content,
      model: response.model
    });
    
  } catch (error) {
    console.error("Error in xAI image analysis:", error);
    return res.status(500).json({ error: "Error processing image analysis" });
  }
}