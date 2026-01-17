import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuantumVisualizerDashboard } from '@/components/QuantumVisualizerDashboard';
import { GameState } from '@/types/game';

// Mock the useGameState hook
jest.mock('@/hooks/useGameState', () => ({
  useGameState: () => ({
    gameState: mockGameState,
    updateGameState: jest.fn(),
    saveGame: jest.fn(),
    loadGame: jest.fn(),
    resetGame: jest.fn(),
    isLoading: false
  })
}));

// Mock the components used within QuantumVisualizerDashboard
jest.mock('@/components/HofstadterButterflyVisualizer', () => ({
  HofstadterButterflyVisualizer: jest.fn(() => (
    <div data-testid="hofstadter-butterfly">Hofstadter Butterfly Mock</div>
  ))
}));

jest.mock('@/components/QuantumVisualizer', () => ({
  QuantumVisualizer: jest.fn(() => (
    <div data-testid="quantum-visualizer">Quantum Visualizer Mock</div>
  ))
}));

// Sample game state
const mockGameState: GameState = {
  currentScreen: 'narrative',
  player: {
    name: 'Test Player',
    origin: 'quantum_researcher',
    attributes: {
      quantum: 65,
      temporal: 40,
      pattern: 55
    },
    energy: 100,
    knowledge: 50,
    paradox: 15
  },
  inventory: [],
  codexEntries: [],
  narrative: {
    currentScene: {
      id: 'test-scene',
      title: 'Test Scene',
      description: 'A test narrative scene',
      prompt: 'What will you do?'
    },
    visitedScenes: [],
    unlockedChoices: []
  },
  location: {
    name: 'Test Location'
  },
  game: {
    cycle: 'alpha',
    audioEnabled: true,
    quantumProcessor: {
      qubits: 12,
      entanglementCapacity: 75,
      coherenceTime: 6000,
      errorCorrectionLevel: 4,
      activeAlgorithms: ['shor', 'grover']
    }
  }
};

describe('QuantumVisualizerDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock interval and timers
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders with default collapsed state', () => {
    render(<QuantumVisualizerDashboard />);
    
    // Check for the title
    expect(screen.getByText('Quantum Visualization System')).toBeInTheDocument();
    
    // Should have both tabs in collapsed state
    expect(screen.getByRole('tab', { name: /Hofstadter's Butterfly/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Quantum Decision Space/i })).toBeInTheDocument();
    
    // Should NOT have the combined tab when collapsed
    expect(screen.queryByRole('tab', { name: /Combined View/i })).not.toBeInTheDocument();
    
    // Should have expand button
    expect(screen.getByText('Expand Dashboard')).toBeInTheDocument();
    
    // Should render both visualizers (one visible based on selected tab)
    expect(screen.getByTestId('hofstadter-butterfly')).toBeInTheDocument();
    
    // The description text should be present
    expect(screen.getByText(/Hofstadter's Butterfly visualizes the fractal structure/i)).toBeInTheDocument();
  });
  
  test('toggles between expanded and collapsed states', () => {
    render(<QuantumVisualizerDashboard />);
    
    // Initially collapsed
    expect(screen.getByText('Expand Dashboard')).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /Combined View/i })).not.toBeInTheDocument();
    
    // Click expand button
    fireEvent.click(screen.getByText('Expand Dashboard'));
    
    // Now should be expanded
    expect(screen.queryByText('Expand Dashboard')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Combined View/i })).toBeInTheDocument();
    
    // The controls for magnetic field and energy should appear
    expect(screen.getByText('Magnetic Field (Φ/Φ₀)')).toBeInTheDocument();
    expect(screen.getByText('Energy Level (E)')).toBeInTheDocument();
  });
  
  test('switches between tabs', () => {
    render(<QuantumVisualizerDashboard />);
    
    // Default tab should be 'fractal' showing Hofstadter's Butterfly
    expect(screen.getByTestId('hofstadter-butterfly')).toBeVisible();
    
    // Click on Quantum Decision Space tab
    fireEvent.click(screen.getByRole('tab', { name: /Quantum Decision Space/i }));
    
    // Should now show quantum visualizer
    expect(screen.getByTestId('quantum-visualizer')).toBeVisible();
    expect(screen.getByText(/This visualization shows the current quantum decision space/i)).toBeInTheDocument();
  });
  
  test('refreshes decision ID', () => {
    render(<QuantumVisualizerDashboard />);
    
    // Find the refresh button (it has a RefreshCw icon)
    const refreshButton = screen.getByTitle('Generate new quantum state');
    expect(refreshButton).toBeInTheDocument();
    
    // Click the refresh button
    fireEvent.click(refreshButton);
    
    // The main test here is that it doesn't crash
    // The actual decision ID is generated dynamically
    expect(refreshButton).toBeInTheDocument();
  });
  
  test('changes color scheme', () => {
    render(<QuantumVisualizerDashboard />);
    
    // Expand the dashboard to see color scheme options
    fireEvent.click(screen.getByText('Expand Dashboard'));
    
    // Initially 'quantum' should be selected
    const quantumButton = screen.getByRole('button', { name: /Quantum/i });
    const spectrumButton = screen.getByRole('button', { name: /Spectrum/i });
    const monochromeButton = screen.getByRole('button', { name: /Monochrome/i });
    
    // Default scheme is 'quantum'
    expect(quantumButton).toHaveClass('text-primary-foreground');
    
    // Click on spectrum
    fireEvent.click(spectrumButton);
    
    // Now 'spectrum' should be selected
    expect(spectrumButton).toHaveClass('text-primary-foreground');
    
    // Click on monochrome
    fireEvent.click(monochromeButton);
    
    // Now 'monochrome' should be selected
    expect(monochromeButton).toHaveClass('text-primary-foreground');
  });
  
  test('renders combined view when expanded', () => {
    render(<QuantumVisualizerDashboard />);
    
    // Expand the dashboard
    fireEvent.click(screen.getByText('Expand Dashboard'));
    
    // Click on Combined View tab
    fireEvent.click(screen.getByRole('tab', { name: /Combined View/i }));
    
    // Should show both visualizers and additional explanatory text
    expect(screen.getAllByTestId('hofstadter-butterfly').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('quantum-visualizer').length).toBeGreaterThan(0);
    
    // Check for descriptive text in the combined view
    expect(screen.getByText(/The quantum decision system in SINGULARIS PRIME uses fractal mathematics/i)).toBeInTheDocument();
    
    // Should show player quantum attribute
    expect(screen.getByText(new RegExp(`With a Quantum attribute of ${mockGameState.player.attributes.quantum}`))).toBeInTheDocument();
    
    // Should show processor info
    expect(screen.getByText(new RegExp(`Your quantum processor has ${mockGameState.game.quantumProcessor?.qubits} qubits`))).toBeInTheDocument();
  });
});