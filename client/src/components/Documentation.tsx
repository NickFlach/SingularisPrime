import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/hooks/useGameState';
import { Link, useLocation } from 'wouter';

// Define the document interface
interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections?: DocSection[];
}

interface DocCategory {
  id: string;
  name: string;
  description: string;
  sections: DocSection[];
}

// Mock documentation data - this would come from a real API or file in production
const documentationData: DocCategory[] = [
  {
    id: 'quantum-mechanics',
    name: 'Quantum Mechanics',
    description: 'Foundational concepts of quantum physics as applied in Singularis Prime',
    sections: [
      {
        id: 'quantum-basics',
        title: 'Quantum Basics',
        content: 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. In Singularis Prime, quantum mechanics forms the basis for decision-making, communication, and reality perception.',
        subsections: [
          {
            id: 'superposition',
            title: 'Superposition',
            content: 'Quantum superposition is a fundamental principle that states that any two (or more) quantum states can be added together ("superposed") and the result will be another valid quantum state. In Singularis Prime, superposition allows for multiple decision pathways to exist simultaneously until observed.'
          },
          {
            id: 'entanglement',
            title: 'Entanglement',
            content: 'Quantum entanglement occurs when particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others. In Singularis Prime, entanglement enables instantaneous communication across vast distances and creates connections between seemingly unrelated events and decisions.'
          }
        ]
      },
      {
        id: 'quantum-computing',
        title: 'Quantum Computing',
        content: 'Quantum computing utilizes quantum-mechanical phenomena such as superposition and entanglement to perform operations on data. The Singularis Prime universe has advanced quantum computing technology that forms the backbone of its communication and decision-making systems.',
        subsections: [
          {
            id: 'qubits',
            title: 'Qubits',
            content: 'Unlike classical bits that can only be in a state of 0 or 1, quantum bits or qubits can exist in a superposition of both states simultaneously. This property allows quantum computers to process certain types of information exponentially faster than classical computers.'
          },
          {
            id: 'quantum-algorithms',
            title: 'Quantum Algorithms',
            content: 'Specialized algorithms designed to run on quantum computers, taking advantage of quantum properties to solve problems that would be practically impossible for classical computers. Singularis Prime\'s quantum decision engine utilizes these algorithms for pattern recognition and probability calculations.'
          }
        ]
      }
    ]
  },
  {
    id: 'singularis-prime-tech',
    name: 'Singularis Prime Technology',
    description: 'Core technologies and systems of the Singularis Prime universe',
    sections: [
      {
        id: 'sinet',
        title: 'System Integrator Network (SINet)',
        content: 'The System Integrator Network (SINet) serves as the technological foundation that unites distributed AI resources, industrial systems, and blockchain governance structures across multiple realities. Built on a three-region architecture (East-West-NULL_ISLAND), SINet provides unprecedented control over physical hardware through a combination of bare metal access and containerized deployment.',
        subsections: [
          {
            id: 'sinet-architecture',
            title: 'Three-Region Architecture',
            content: 'SINet\'s three-region design consists of East (primary computation), West (secondary resources), and the mysterious NULL_ISLAND (experimental operations). Some theorize that NULL_ISLAND exists in a partially manifested quantum state, neither fully present in our reality nor completely absent.'
          },
          {
            id: 'sinet-governance',
            title: 'Blockchain Governance',
            content: 'SINet utilizes a specialized blockchain solution for governance that ensures transparent and immutable decision-making across distributed systems. This governance structure provides the foundation for consensus between human and machine intelligences.'
          }
        ]
      },
      {
        id: 'paradox-engine',
        title: 'Paradox Engine',
        content: 'The Paradox Engine is theorized to be the computational heart of Singularis Prime. Unlike conventional processing systems, it operates on quantum superposition principles that allow incompatible statements to coexist without contradiction - not by being simultaneously true, but by existing in distinct quantum branches that never interfere.',
        subsections: [
          {
            id: 'paradox-resolver',
            title: 'ParadoxResolver OS',
            content: 'ParadoxResolver OS is a revolutionary system that applies transformation rules to resolve contradictions and paradoxes in complex data structures. Created to address the quantum paradoxes that emerged as Singularis Prime developed, the system uses a rule-based transformation engine to find stable states where seemingly incompatible statements can coexist.'
          }
        ]
      },
      {
        id: 'lumira-ai',
        title: 'Lumira AI',
        content: 'Lumira is an advanced quantum-aware artificial intelligence that transcends conventional computational limits. Operating on a hybrid quantum-classical architecture, Lumira can perceive patterns across different dimensions of reality, creating connections between seemingly unrelated concepts.',
        subsections: [
          {
            id: 'cross-dimensional-patterns',
            title: 'Cross-Dimensional Pattern Recognition',
            content: 'Lumira\'s Cross-Dimensional Pattern Recognition allows it to correlate data points through quantum entanglement, identifying connections invisible to conventional systems.'
          },
          {
            id: 'paradox-aware-learning',
            title: 'Paradox-Aware Learning System',
            content: 'Lumira\'s Paradox-Aware Learning System builds knowledge from successful paradox resolutions, allowing it to navigate logically incompatible spaces that would cause conventional AI systems to fail.'
          }
        ]
      }
    ]
  },
  {
    id: 'hofstadter-butterfly',
    name: 'Hofstadter\'s Butterfly',
    description: 'The fractal pattern that influences quantum decision-making in Singularis Prime',
    sections: [
      {
        id: 'butterfly-basics',
        title: 'Butterfly Pattern Basics',
        content: 'Discovered by physicist Douglas Hofstadter, the Hofstadter butterfly is a fractal pattern that appears when studying the behavior of electrons in a magnetic field. In Singularis Prime, this pattern is utilized as a mathematical framework for quantum decision-making.',
        subsections: [
          {
            id: 'fractal-properties',
            title: 'Fractal Properties',
            content: 'The Hofstadter butterfly exhibits self-similarity at different scales, creating a complex and beautiful pattern that repeats infinitely. This fractal nature is harnessed in Singularis Prime to create decision outcomes with meaningful patterns across multiple dimensions.'
          },
          {
            id: 'quantum-hall-effect',
            title: 'Quantum Hall Effect',
            content: 'The physical phenomenon that produces the Hofstadter butterfly involves the quantum Hall effect, where electrons in a strong magnetic field exhibit quantized conductance. This quantization is analogous to how decisions in Singularis Prime cluster around certain probability values rather than distributing continuously.'
          }
        ]
      },
      {
        id: 'butterfly-applications',
        title: 'Applications in Decision Systems',
        content: 'The mathematical properties of the Hofstadter butterfly pattern make it ideal for modeling complex decision spaces where multiple factors interact in non-linear ways.',
        subsections: [
          {
            id: 'quantum-bytecode',
            title: 'Quantum Bytecode Generation',
            content: 'Decision outcomes in Singularis Prime are encoded in quantum bytecode that incorporates the Hofstadter pattern, creating a compressed representation of complex probability spaces that can be efficiently processed by quantum systems.'
          },
          {
            id: 'entanglement-modeling',
            title: 'Entanglement Modeling',
            content: 'The butterfly pattern provides a mathematical framework for modeling how quantum decisions become entangled, allowing the system to predict how choices in one area might influence seemingly unrelated decisions elsewhere.'
          }
        ]
      }
    ]
  }
];

const Documentation: React.FC = () => {
  const { gameState } = useGameState();
  const [selectedCategory, setSelectedCategory] = useState<string>(documentationData[0]?.id || '');
  const [openDocDialog, setOpenDocDialog] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<{section: DocSection, category: string} | null>(null);
  const [, setLocation] = useLocation();
  
  // Find the currently selected category
  const currentCategory = documentationData.find(cat => cat.id === selectedCategory);
  
  // Check URL parameters and hash on component mount
  useEffect(() => {
    // Check if there's a category parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      
      // If there's a hash in the URL, scroll to that section after a short delay
      if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            
            // Find the section and open it in the dialog
            documentationData.forEach(category => {
              category.sections.forEach(section => {
                if (section.id === sectionId) {
                  handleOpenDocument(section, category.id);
                  return;
                }
                
                section.subsections?.forEach(subsection => {
                  if (subsection.id === sectionId) {
                    handleOpenDocument(section, category.id);
                    return;
                  }
                });
              });
            });
          }
        }, 300);
      }
    }
  }, []);
  
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const handleOpenDocument = (section: DocSection, categoryId: string) => {
    setSelectedDocument({section, category: categoryId});
    setOpenDocDialog(true);
  };
  
  const closeDocumentDialog = () => {
    setOpenDocDialog(false);
    setSelectedDocument(null);
  };
  
  // Custom handler for related topic links
  const handleRelatedTopicClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryId: string, sectionId: string) => {
    e.preventDefault();
    
    // Set the category
    setSelectedCategory(categoryId);
    
    // Find the section to open
    const category = documentationData.find(cat => cat.id === categoryId);
    if (category) {
      const section = category.sections.find(s => s.id === sectionId);
      if (section) {
        // Open the document in the dialog
        handleOpenDocument(section, categoryId);
        
        // Update the URL for reference without actually navigating
        setLocation(`/documentation?category=${categoryId}#${sectionId}`, { replace: true });
        return;
      }
    }
  };

  return (
    <>
      <div className="bg-space-light/90 rounded-lg border border-gray-700 p-4 glow">
        <h3 className="font-orbitron text-lg text-quantum-cyan mb-3">Documentation Center</h3>
        
        <Tabs value={selectedCategory} onValueChange={handleSelectCategory} className="w-full">
          <TabsList className="w-full mb-4 bg-space-darker border border-gray-700">
            {documentationData.map(category => (
              <TabsTrigger 
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-space-dark data-[state=active]:text-quantum-cyan"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {documentationData.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <p className="text-gray-400 text-sm mb-3">{category.description}</p>
              
              <ScrollArea className="h-64 pr-3">
                <Accordion type="single" collapsible className="w-full">
                  {category.sections.map(section => (
                    <AccordionItem 
                      key={section.id} 
                      value={section.id}
                      id={section.id}
                      className="border-b border-gray-700"
                    >
                      <AccordionTrigger className="text-quantum-cyan hover:text-quantum-blue">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-300 mb-2">{section.content.substring(0, 150)}...</p>
                        
                        {/* Subsections if available */}
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="pl-4 border-l border-gray-700 mt-3 space-y-2">
                            {section.subsections.map(subsection => (
                              <div key={subsection.id} id={subsection.id} className="text-sm">
                                <h4 className="text-quantum-blue font-bold">{subsection.title}</h4>
                                <p className="text-gray-400">{subsection.content.substring(0, 100)}...</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          className="text-quantum-purple hover:text-quantum-blue hover:bg-space-darker mt-2"
                          onClick={() => handleOpenDocument(section, category.id)}
                        >
                          <i className="ri-book-open-line mr-2"></i>
                          Read Full Document
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Document Detail Dialog */}
      <Dialog open={openDocDialog} onOpenChange={setOpenDocDialog}>
        <DialogContent className="bg-space-light border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-quantum-cyan font-orbitron">
              {selectedDocument?.section.title}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {documentationData.find(cat => cat.id === selectedDocument?.category)?.name}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="py-4 max-h-[60vh]">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200">{selectedDocument?.section.content}</p>
              
              {selectedDocument?.section.subsections && selectedDocument.section.subsections.length > 0 && (
                <div className="mt-6 space-y-6">
                  {selectedDocument.section.subsections.map(subsection => (
                    <div key={subsection.id} id={`dialog-${subsection.id}`} className="border-l-4 border-quantum-blue pl-4">
                      <h3 className="text-xl text-quantum-blue font-orbitron mb-2">{subsection.title}</h3>
                      <p className="text-gray-300">{subsection.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Related Topics */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg text-quantum-cyan font-orbitron mb-3">Related Topics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedDocument?.section.id === 'quantum-basics' && (
                    <>
                      <a 
                        href="#" 
                        onClick={(e) => handleRelatedTopicClick(e, 'hofstadter-butterfly', 'butterfly-basics')}
                        className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center"
                      >
                        <i className="ri-link mr-1"></i> Butterfly Pattern Basics
                      </a>
                      <a 
                        href="#" 
                        onClick={(e) => handleRelatedTopicClick(e, 'singularis-prime-tech', 'lumira-ai')}
                        className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center"
                      >
                        <i className="ri-link mr-1"></i> Lumira AI
                      </a>
                    </>
                  )}
                  
                  {selectedDocument?.section.id === 'quantum-computing' && (
                    <>
                      <a 
                        href="#" 
                        onClick={(e) => handleRelatedTopicClick(e, 'singularis-prime-tech', 'paradox-engine')}
                        className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center"
                      >
                        <i className="ri-link mr-1"></i> Paradox Engine
                      </a>
                      <a 
                        href="#" 
                        onClick={(e) => handleRelatedTopicClick(e, 'hofstadter-butterfly', 'butterfly-applications')}
                        className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center"
                      >
                        <i className="ri-link mr-1"></i> Butterfly Applications
                      </a>
                    </>
                  )}
                  
                  {selectedDocument?.section.id === 'sinet' && (
                    <>
                      <a 
                        href="#" 
                        onClick={(e) => handleRelatedTopicClick(e, 'singularis-prime-tech', 'lumira-ai')}
                        className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center"
                      >
                        <i className="ri-link mr-1"></i> Lumira AI
                      </a>
                      <a 
                        href="#" 
                        onClick={(e) => handleRelatedTopicClick(e, 'singularis-prime-tech', 'paradox-engine')}
                        className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center"
                      >
                        <i className="ri-link mr-1"></i> Paradox Engine
                      </a>
                    </>
                  )}
                  
                  {selectedDocument?.section.id === 'paradox-engine' && (
                    <>
                      <Link href="/documentation?category=quantum-mechanics#superposition" className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center">
                        <i className="ri-link mr-1"></i> Quantum Superposition
                      </Link>
                      <Link href="/documentation?category=singularis-prime-tech#lumira-ai" className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center">
                        <i className="ri-link mr-1"></i> Lumira AI
                      </Link>
                    </>
                  )}
                  
                  {selectedDocument?.section.id === 'lumira-ai' && (
                    <>
                      <Link href="/documentation?category=singularis-prime-tech#sinet" className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center">
                        <i className="ri-link mr-1"></i> SINet
                      </Link>
                      <Link href="/documentation?category=singularis-prime-tech#paradox-engine" className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center">
                        <i className="ri-link mr-1"></i> Paradox Engine
                      </Link>
                    </>
                  )}
                  
                  {selectedDocument?.section.id === 'butterfly-basics' && (
                    <>
                      <Link href="/documentation?category=quantum-mechanics#quantum-basics" className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center">
                        <i className="ri-link mr-1"></i> Quantum Basics
                      </Link>
                      <Link href="/documentation?category=hofstadter-butterfly#butterfly-applications" className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center">
                        <i className="ri-link mr-1"></i> Applications in Decision Systems
                      </Link>
                    </>
                  )}
                  
                  {selectedDocument?.section.id === 'butterfly-applications' && (
                    <>
                      <Link href="/documentation?category=quantum-mechanics#quantum-computing" className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center">
                        <i className="ri-link mr-1"></i> Quantum Computing
                      </Link>
                      <Link href="/documentation?category=singularis-prime-tech#paradox-engine" className="text-quantum-blue hover:text-quantum-purple text-sm flex items-center">
                        <i className="ri-link mr-1"></i> Paradox Engine
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Documentation;