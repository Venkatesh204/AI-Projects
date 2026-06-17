import React from 'react';
import { ModuleContent, GridCrafterScenario } from '../types';

export const modules: ModuleContent[] = [
  {
    id: 'addition',
    name: 'Matrix Addition',
    emoji: '➕',
    tagline: 'Combining forces, element by element.',
    icon: 'ListPlus',
    conceptHTML: `<h4>Matrix Addition ➕</h4><p>Dive into the world of combining matrices! This section will teach you the fundamentals of matrix addition. Think of it like merging two identical spreadsheets—you just add the values in the matching cells!</p>`,
    objectiveHTML: `<ul><li>✅ <strong>The Golden Rule:</strong> Understand the core requirement that matrices must have the same dimensions to be added.</li><li>➕ <strong>Step-by-Step Addition:</strong> Learn how to add matrices by adding their corresponding elements (C = A + B).</li><li>✍️ <strong>Practice Problems:</strong> Confidently solve addition problems for any two compatible matrices.</li><li>➡️ <strong>Real-World Connection:</strong> See how matrix addition is used in practical scenarios.</li></ul>`,
    simulationGames: [
      { gameType: 'gridCrafter', title: 'GridCrafter Simulation', description: 'Apply matrix addition in a 2D world.', icon: 'LayoutGrid' },
      { gameType: 'flashcards', title: 'Flashcards', description: 'Test your memory on key concepts.', icon: 'Layers' },
    ],
    gridCrafterScenario: {
      title: "Resource Overlay",
      description: "You have a map of base resources (World). A new survey has found additional resources (Operator). Add the two maps to find the new total for each sector.",
      worldMatrix: [[1, 3], [4, 2]],
      operatorMatrix: [[2, 1], [0, 2]],
      targetMatrix: [[3, 4], [4, 4]],
      visualMap: (val) => {
        const colors = ['bg-yellow-900/50', 'bg-yellow-800/60', 'bg-yellow-700/70', 'bg-yellow-600/80', 'bg-yellow-500'];
        return { className: colors[Math.min(val, 4)] || colors[4] };
      }
    },
  },
  {
    id: 'subtraction',
    name: 'Matrix Subtraction',
    emoji: '➖',
    tagline: 'Finding the difference, one spot at a time.',
    icon: 'ListMinus',
    conceptHTML: `<h4>Matrix Subtraction ➖</h4><p>Matrix subtraction is all about finding the difference! 📊 Imagine comparing a "before" and "after" photo. By subtracting, we can see exactly what changed. Just like addition, the matrices must be the same size, but here, order is key!</p>`,
    objectiveHTML: `<ul><li>✅ <strong>Same Size Rule:</strong> Know that matrices must have identical dimensions to be subtracted.</li><li>➖ <strong>Element-by-Element Subtraction:</strong> Master the process of finding the difference by subtracting corresponding elements (C = A - B).</li><li>📉 <strong>Find the Change:</strong> Use subtraction to calculate the net change or variance between two data sets, like inventory levels or budget plans.</li><li>➡️ <strong>Order is Key:</strong> Understand why A - B is different from B - A (it's not commutative!).</li></ul>`,
    simulationGames: [
      { gameType: 'gridCrafter', title: 'GridCrafter Simulation', description: 'Apply matrix subtraction in a 2D world.', icon: 'LayoutGrid' },
      { gameType: 'flashcards', title: 'Flashcards', description: 'Test your memory on key concepts.', icon: 'Layers' },
    ],
    gridCrafterScenario: {
      title: "Pollution Cleanup",
      description: "A plot of land (World) has varying pollution levels. A cleanup process (Operator) removes a specific amount of pollution from each sector. Calculate the remaining pollution levels.",
      worldMatrix: [[8, 7], [9, 8]],
      operatorMatrix: [[4, 2], [3, 5]],
      targetMatrix: [[4, 5], [6, 3]],
      visualMap: (val) => {
        if (val >= 8) return { className: 'bg-green-900/80' };
        if (val >= 6) return { className: 'bg-green-800/70' };
        if (val >= 4) return { className: 'bg-green-600/80' };
        return { className: 'bg-green-500' };
      }
    },
  },
  {
    id: 'scalarMultiplication',
    name: 'Scalar Multiplication',
    emoji: '✖️',
    tagline: 'Scaling up or down, uniformly.',
    icon: 'DivideSquare',
    conceptHTML: `<h4>Scalar Multiplication ✖️</h4><p>Scalar multiplication is like using a magnifying glass 🔍 or a shrink ray on your matrix! A 'scalar' is just a single number that scales the entire matrix up or down, affecting every single element inside.</p>`,
    objectiveHTML: `<ul><li>🔢 <strong>What's a Scalar?:</strong> Define a scalar as a single number that scales every element in a matrix.</li><li>✖️ <strong>The Core Operation:</strong> Learn how to multiply every element of a matrix by a scalar value <i>k</i> (B = <i>k</i>A).</li><li>⚖️ <strong>Scaling Data:</strong> Apply scalar multiplication to real-world tasks like converting units or uniformly resizing a graphic.</li><li>➡️ <strong>Visualize the Effect:</strong> See how a scalar uniformly stretches or shrinks the data represented by the matrix.</li></ul>`,
    simulationGames: [
      { gameType: 'gridCrafter', title: 'GridCrafter Simulation', description: 'Apply scalar multiplication in a 2D world.', icon: 'LayoutGrid' },
      { gameType: 'flashcards', title: 'Flashcards', description: 'Test your memory on key concepts.', icon: 'Layers' },
    ],
    gridCrafterScenario: {
      title: "Crop Yield Boost",
      description: "You are a farmer managing crop yields (World). A new fertilizer (Scalar) has been developed that triples the yield of every plot. Calculate the new yields.",
      worldMatrix: [[2, 5], [4, 3]],
      operatorScalar: 3,
      targetMatrix: [[6, 15], [12, 9]],
      visualMap: (val) => {
        const shade = Math.min(200 + val * 25, 900);
        return { className: `bg-teal-${shade}/80` };
      }
    },
  },
  {
    id: 'matrixMultiplication',
    name: 'Matrix Multiplication',
    emoji: '⚙️',
    tagline: 'Combining matrices in a more complex dance.',
    icon: 'Sigma',
    conceptHTML: `<h4>Matrix Multiplication ⚙️</h4><p>Get ready for a more advanced move! Matrix multiplication isn't just element-by-element. It's a powerful 'row-times-column' dance 💃 that combines two matrices to model complex systems and transformations.</p>`,
    objectiveHTML: `<ul><li>⛓️ <strong>The Chain Rule:</strong> Master the crucial condition for multiplication: the number of columns in the first matrix must equal the number of rows in the second (A<sub>m×<strong>n</strong></sub> × B<sub><strong>n</strong>×p</sub>).</li><li>⚙️ <strong>Row-by-Column Method:</strong> Learn the dot product process to calculate each element of the resulting matrix.</li><li>📐 <strong>Predict the Result:</strong> Determine the dimensions of the final matrix by looking at the outer dimensions (m × p).</li><li>➡️ <strong>Real-World Power:</strong> Discover how matrix multiplication is fundamental in computer graphics, network routing, and scientific simulations.</li></ul>`,
    simulationGames: [
        { gameType: 'gridCrafter', title: 'GridCrafter Simulation', description: 'Apply matrix multiplication in a factory simulation.', icon: 'LayoutGrid' },
        { gameType: 'flashcards', title: 'Flashcards', description: 'Test your memory on key concepts.', icon: 'Layers' },
    ],
    gridCrafterScenario: {
      title: "Factory Resource Calculation",
      description: "You are the factory manager. You have an order list for 'Bots' and 'Drones' (Orders). You also know the resources required for each (Resource Costs). Multiply the matrices to find the total 'Steel' and 'CPUs' needed to fulfill the orders.",
      worldMatrix: [[10, 20]], // Orders: 10 Bots, 20 Drones
      operatorMatrix: [[5, 2], [3, 4]], // Costs: Bot=[5 steel, 2 cpus], Drone=[3 steel, 4 cpus]
      targetMatrix: [[110, 100]], // Total Resources: [110 steel, 100 cpus]
      visualMap: (val) => ({ className: '' }) // Not used for this non-grid scenario
    },
  },
];