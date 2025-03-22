import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handler for general AI completion requests
export async function handleAICompletion(req: Request, res: Response) {
  try {
    const { prompt, systemPrompt, model = "gpt-3.5-turbo-0125", maxTokens = 500, temperature = 0.7 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are an AI assistant for a quantum-themed narrative game called Singularis Prime."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature,
    });
    
    return res.json({ 
      content: response.choices[0].message.content,
      usage: response.usage
    });
  } catch (error: any) {
    console.error("Error in AI completion:", error);
    return res.status(500).json({ 
      error: "Error processing AI request",
      message: error.message
    });
  }
}

// Handler for quantum decision adjustments
export async function handleQuantumDecisionAdjustment(req: Request, res: Response) {
  try {
    const { decision, playerMetrics, gameState } = req.body;
    
    if (!decision || !playerMetrics || !gameState) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    // Create prompt for decision adjustment
    const prompt = `
      Please analyze this quantum decision and suggest subtle adjustments to enhance player experience:
      
      Current Decision:
      - ID: ${decision.id}
      - Probability: ${decision.probability}
      - Entanglement Factor: ${decision.entanglementFactor || 0}
      - Outcome: ${decision.outcome}
      - Superposition States: ${decision.superpositionStates?.join(', ') || 'None'}
      
      Player Profile:
      - Preferred choices: ${JSON.stringify(playerMetrics.preferredChoiceTypes)}
      - Answer accuracy: ${playerMetrics.answerAccuracy}
      - Recent interests: ${playerMetrics.recentTopics.join(', ')}
      - Player quantum attribute: ${gameState.player.attributes.quantum}
      
      Based on this data, suggest subtle adjustments to:
      1. Probability (0-1 scale)
      2. Entanglement Factor (0-1 scale)
      3. Superposition States (list of possible states)
      
      Format your response exactly as:
      Probability: [value between 0-1]
      EntanglementFactor: [value between 0-1]
      SuperpositionStates: [comma-separated list]
    `;
    
    // Using gpt-3.5-turbo-0125 model which should be accessible
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: "You are an AI quantum decision adjustor. Your job is to subtly modify quantum decisions to create more engaging and personalized game experiences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.5,
    });
    
    const content = response.choices[0].message.content || "";
    
    // Parse the structured response
    const lines = content.split('\n').filter(line => line.trim() !== '');
    let result = {
      probability: decision.probability,
      entanglementFactor: decision.entanglementFactor || 0.3,
      superpositionStates: decision.superpositionStates || []
    };
    
    for (const line of lines) {
      if (line.includes('Probability:')) {
        const value = parseFloat(line.split(':')[1].trim());
        if (!isNaN(value) && value >= 0 && value <= 1) {
          result.probability = value;
        }
      } else if (line.includes('EntanglementFactor:')) {
        const value = parseFloat(line.split(':')[1].trim());
        if (!isNaN(value) && value >= 0 && value <= 1) {
          result.entanglementFactor = value;
        }
      } else if (line.includes('SuperpositionStates:')) {
        const states = line.split(':')[1].trim();
        if (states) {
          result.superpositionStates = states.split(',').map(s => s.trim());
        }
      }
    }
    
    return res.json(result);
  } catch (error: any) {
    console.error("Error in quantum decision adjustment:", error);
    return res.status(500).json({ 
      error: "Error processing adjustment request",
      message: error.message
    });
  }
}

// Handler for game state adjustments
export async function handleGameStateAdjustment(req: Request, res: Response) {
  try {
    const { playerMetrics, gameState } = req.body;
    
    if (!playerMetrics || !gameState) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    // Create prompt for the AI
    const prompt = `
      Please analyze this player data and provide subtle game adjustments:
      
      Player Metrics:
      - Preferred choices: ${JSON.stringify(playerMetrics.preferredChoiceTypes)}
      - Answer accuracy: ${playerMetrics.answerAccuracy}
      - Exploration index: ${playerMetrics.explorationIndex}
      - Recent topics of interest: ${playerMetrics.recentTopics.join(', ')}
      - Session duration: ${playerMetrics.sessionDuration} seconds
      
      Current Game State:
      - Current scene: ${gameState.narrative.currentScene.title}
      - Player quantum attribute: ${gameState.player.attributes.quantum}
      - Player energy: ${gameState.player.energy}
      - Player knowledge: ${gameState.player.knowledge}
      - Player paradox level: ${gameState.player.paradox}
      
      Based on this data, suggest subtle adjustments to:
      1. Quantum complexity (0-1 scale)
      2. Narrative direction (what themes or content to emphasize)
      3. Next choice emphasis (what kind of choices to present)
      4. Any processor improvements that might engage this player
      
      Format your response as: 
      Quantum Complexity: [value between 0-1]
      Narrative Direction: [brief description]
      Next Choice Emphasis: [type of choices to emphasize]
      Processor Improvements: [any suggested improvements]
      Attribute Suggestions: [any attribute adjustments]
    `;
    
    // Using gpt-3.5-turbo-0125 model which should be accessible
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: "You are an AI game director for a quantum-themed narrative game. Your job is to analyze player behavior and make subtle adjustments to maintain engagement and provide a personalized experience."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const content = response.choices[0].message.content || "";
    
    // Default values
    const defaultAdjustment: {
      quantumComplexity: number;
      narrativeDirection: string;
      nextChoiceEmphasis: string;
      processorImprovements?: any;
      playerAttributeSuggestions?: Record<string, number>;
    } = {
      quantumComplexity: 0.5,
      narrativeDirection: "continue current path",
      nextChoiceEmphasis: "balance"
    };
    
    // Parse the structured response
    const lines = content.split('\n').filter(line => line.trim() !== '');
    let result = { ...defaultAdjustment };
    
    for (const line of lines) {
      if (line.includes('Quantum Complexity:')) {
        const value = parseFloat(line.split(':')[1].trim());
        if (!isNaN(value) && value >= 0 && value <= 1) {
          result.quantumComplexity = value;
        }
      } else if (line.includes('Narrative Direction:')) {
        result.narrativeDirection = line.split(':')[1].trim();
      } else if (line.includes('Next Choice Emphasis:')) {
        result.nextChoiceEmphasis = line.split(':')[1].trim();
      } else if (line.includes('Processor Improvements:')) {
        const improvements = line.split(':')[1].trim();
        const processorImprovements: any = {};
        
        if (improvements.includes('qubits')) {
          processorImprovements.qubits = Math.min(64, 12); // Default improvement
        }
        if (improvements.includes('coherence')) {
          processorImprovements.coherenceTime = Math.min(10, 2); // Default improvement
        }
        
        if (Object.keys(processorImprovements).length > 0) {
          result.processorImprovements = processorImprovements;
        }
      } else if (line.includes('Attribute Suggestions:')) {
        const suggestions = line.split(':')[1].trim();
        const attributeMap: Record<string, number> = {};
        
        if (suggestions.includes('quantum')) attributeMap.quantum = 1;
        if (suggestions.includes('temporal')) attributeMap.temporal = 1;
        if (suggestions.includes('pattern')) attributeMap.pattern = 1;
        
        if (Object.keys(attributeMap).length > 0) {
          result.playerAttributeSuggestions = attributeMap;
        }
      }
    }
    
    return res.json(result);
  } catch (error: any) {
    console.error("Error in game state adjustment:", error);
    return res.status(500).json({ 
      error: "Error processing game adjustment request",
      message: error.message
    });
  }
}