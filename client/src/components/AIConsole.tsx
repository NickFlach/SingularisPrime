import React, { useState } from 'react';
import { useAIDirector } from './AIDirector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameState } from '@/hooks/useGameState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIConsoleProps {
  minimized?: boolean;
}

export const AIConsole: React.FC<AIConsoleProps> = ({ minimized = false }) => {
  const { isEnabled, toggleAI, lastAnalysis, processingAdjustment, latestRecommendation, generateContent } = useAIDirector();
  const { gameState } = useGameState();
  const [isMinimized, setIsMinimized] = useState<boolean>(minimized);
  const [activeTab, setActiveTab] = useState<string>('status');
  const [contentPrompt, setContentPrompt] = useState<string>('');
  const [contentType, setContentType] = useState<string>('narrative');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Handle content generation
  const handleGenerateContent = async () => {
    if (contentPrompt.trim() === '') return;
    
    setIsGenerating(true);
    try {
      const content = await generateContent(contentPrompt, contentType);
      setGeneratedContent(content);
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent("Error generating content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle minimized state
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={toggleMinimized} 
          className="bg-quantum-purple hover:bg-quantum-blue text-white rounded-full h-12 w-12 flex items-center justify-center"
        >
          AI
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-space-dark text-white border border-quantum-blue z-50 shadow-glow">
      <CardHeader className="bg-space-darker pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-quantum-cyan font-orbitron text-sm">Lumira AI Console</CardTitle>
          <CardDescription className="text-xs text-quantum-purple">Quantum-Aware Intelligence</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            className="h-6 w-6 p-0 text-quantum-cyan hover:text-quantum-purple" 
            onClick={toggleMinimized}
          >
            -
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-2 bg-space-darker">
            <TabsTrigger value="status" className="text-xs">Status</TabsTrigger>
            <TabsTrigger value="generate" className="text-xs">Generate</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="mt-0">
            <div className="space-y-2">
              <div className="text-xs flex justify-between">
                <span>AI Director:</span>
                <span className={isEnabled ? "text-green-500" : "text-red-500"}>
                  {isEnabled ? "Active" : "Disabled"}
                </span>
              </div>
              
              <div className="text-xs flex justify-between">
                <span>Last Analysis:</span>
                <span className="text-quantum-cyan">
                  {lastAnalysis ? new Date(lastAnalysis).toLocaleTimeString() : "Never"}
                </span>
              </div>
              
              <div className="text-xs flex justify-between">
                <span>Processing:</span>
                <span className={processingAdjustment ? "text-yellow-500" : "text-green-500"}>
                  {processingAdjustment ? "Working..." : "Idle"}
                </span>
              </div>
              
              <Separator className="my-2 bg-gray-700" />
              
              <div className="text-xs">
                <div className="mb-1 text-quantum-cyan">Latest Recommendation:</div>
                <div className="italic text-gray-300">
                  {latestRecommendation || "No recommendations yet."}
                </div>
              </div>
              
              <Separator className="my-2 bg-gray-700" />
              
              <div className="text-xs">
                <div className="mb-1 text-quantum-cyan">Player Metrics:</div>
                <div className="grid grid-cols-2 gap-1">
                  <div>Quantum Level:</div>
                  <div className="text-right">{gameState.player.attributes.quantum.toFixed(1)}</div>
                  
                  <div>Energy:</div>
                  <div className="text-right">{gameState.player.energy}</div>
                  
                  <div>Knowledge:</div>
                  <div className="text-right">{gameState.player.knowledge}</div>
                  
                  <div>Paradox:</div>
                  <div className="text-right">{gameState.player.paradox}</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="mt-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="contentType" className="text-xs w-20">Type:</Label>
                <select 
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="flex-1 bg-space-darker border border-gray-700 rounded px-2 py-1 text-xs"
                >
                  <option value="narrative">Narrative</option>
                  <option value="scientific">Scientific</option>
                  <option value="quantum">Quantum Theory</option>
                  <option value="paradox">Paradox Concept</option>
                  <option value="codex">Codex Entry</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="prompt" className="text-xs">Prompt:</Label>
                <Textarea 
                  id="prompt"
                  value={contentPrompt}
                  onChange={(e) => setContentPrompt(e.target.value)}
                  className="w-full mt-1 bg-space-darker border border-gray-700 text-xs"
                  placeholder="Enter a prompt for content generation..."
                  rows={3}
                />
              </div>
              
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating || contentPrompt.trim() === ''}
                className="w-full bg-quantum-purple hover:bg-quantum-blue text-white text-xs"
              >
                {isGenerating ? "Generating..." : "Generate Content"}
              </Button>
              
              <div>
                <Label className="text-xs text-quantum-cyan">Generated Content:</Label>
                <ScrollArea className="h-24 mt-1 p-2 bg-space-darker border border-gray-700 rounded text-xs">
                  {generatedContent || "Generated content will appear here."}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="aiToggle" className="text-xs">AI Director:</Label>
                <Switch
                  id="aiToggle"
                  checked={isEnabled}
                  onCheckedChange={toggleAI}
                />
              </div>
              
              <Separator className="my-2 bg-gray-700" />
              
              <div className="text-xs space-y-2">
                <div className="text-quantum-cyan mb-1">Processor Status:</div>
                <div className="grid grid-cols-2 gap-1">
                  <div>Qubits:</div>
                  <div className="text-right">{gameState.game.quantumProcessor?.qubits || 'N/A'}</div>
                  
                  <div>Entanglement:</div>
                  <div className="text-right">{gameState.game.quantumProcessor?.entanglementCapacity || 'N/A'}</div>
                  
                  <div>Coherence Time:</div>
                  <div className="text-right">{gameState.game.quantumProcessor?.coherenceTime || 'N/A'}</div>
                  
                  <div>Error Correction:</div>
                  <div className="text-right">{gameState.game.quantumProcessor?.errorCorrectionLevel || 'N/A'}</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mt-2">
                <p>The AI Director uses quantum principles to subtly adjust game parameters based on your play style and preferences.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-space-darker px-3 py-1 text-xs text-gray-500">
        <div className="w-full flex justify-between items-center">
          <span>Singularis Prime v2.5</span>
          <span className="text-quantum-purple">{isEnabled ? "AI Active" : "AI Standby"}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIConsole;