import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

const Inventory: React.FC = () => {
  const { gameState } = useGameState();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Find the selected item data
  const itemData = selectedItem 
    ? gameState.inventory.find(item => item.id === selectedItem) 
    : null;
  
  const handleUseItem = (itemId: string) => {
    setSelectedItem(itemId);
  };
  
  const closeItemDialog = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <div className="bg-space-light/90 rounded-lg border border-gray-700 p-4 glow-green">
        <h3 className="font-orbitron text-lg text-quantum-green mb-3">Quantum Cache</h3>
        
        <div className="grid grid-cols-2 gap-2">
          {gameState.inventory.map(item => (
            <div 
              key={item.id}
              className="border border-gray-700 rounded p-2 text-center hover:border-quantum-green transition cursor-pointer bg-space-dark/60"
              onClick={() => handleUseItem(item.id)}
            >
              <div className="w-10 h-10 mx-auto mb-1 rounded-md flex items-center justify-center bg-gradient-to-br from-space-dark to-space-light">
                <i className={`ri-${item.icon} text-quantum-green`}></i>
              </div>
              <p 
                className="text-xs font-medium text-white truncate" 
                title={item.name}
              >
                {item.name}
              </p>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 4 - gameState.inventory.length) }).map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="border border-gray-700 rounded p-2 text-center bg-space-dark/60 opacity-40"
            >
              <div className="w-10 h-10 mx-auto mb-1 rounded-md flex items-center justify-center bg-gradient-to-br from-space-dark to-space-light">
                <i className="ri-add-line text-gray-500"></i>
              </div>
              <p className="text-xs font-medium text-gray-500 truncate">Empty Slot</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={closeItemDialog}>
        <DialogContent className="bg-space-light border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-quantum-green font-orbitron">
              {itemData?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-md flex items-center justify-center bg-gradient-to-br from-space-dark to-space-light">
              <i className={`ri-${itemData?.icon} text-3xl text-quantum-green`}></i>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300">
                {itemData?.description || "A mysterious quantum artifact with unknown properties."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Inventory;
