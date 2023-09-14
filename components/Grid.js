// src/components/Grid.js
import React, { useState } from 'react';
import { dijkstra } from '../algorithms/Dijkstra';  
import '../styles/Grid.css';

const Grid = () => {
    // Define grid dimensions
    const rows = 10;
    const cols = 10;

    // State to manage mouse drag events
    const [isMouseDown, setIsMouseDown] = useState(false);

    // State to manage whether we are currently dragging the start or end cell
    const [draggingStart, setDraggingStart] = useState(false);
    const [draggingEnd, setDraggingEnd] = useState(false);
    
    // State to manage whether a path is currently displayed or not
    const [isPathFound, setIsPathFound] = useState(false);

    // Initialize grid with start and end cells
    const initializeGrid = () => {
        const grid = Array.from({ length: rows }, (_, rowIndex) =>
            Array.from({ length: cols }, (_, colIndex) => ({
                row: rowIndex,
                col: colIndex,
                type: 'empty', // by default all cells are empty
            }))
        );
        
        // Initialize the start and end cells
        grid[0][0].type = 'start';
        grid[rows - 1][cols - 1].type = 'end';
        return grid;
    };

    // Initialize grid state
    const [grid, setGrid] = useState(initializeGrid());

    // Find and display path using Dijkstra's Algorithm
    const findPath = () => {
        // (new code)
        let start, end;
        for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col].type === 'start') {
                start = grid[row][col];
            }
            if (grid[row][col].type === 'end') {
                end = grid[row][col];
            }
        }
        }
        const path = dijkstra(grid, start, end);
        if (path !== null) {
            const newGrid = [...grid];
            for (const cell of path) {
                if (newGrid[cell.row][cell.col].type !== 'start' && newGrid[cell.row][cell.col].type !== 'end') {
                    newGrid[cell.row][cell.col].type = 'path';
                }
            }
            setGrid(newGrid);
            setIsPathFound(true);
        } else {
            alert("No path exists!");
        }
    };

    // Function to clear the path
    const clearPath = () => {
        const newGrid = [...grid];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (newGrid[row][col].type === 'path') {
                    newGrid[row][col].type = 'empty';
                }
            }
        }
        setGrid(newGrid);
        setIsPathFound(false); // Reset the isPathFound state to false
    };

    // Function to handle button click
    const handleButtonClick = () => {
        if (isPathFound) {
            clearPath();
        } else {
            findPath();
        }
    };

    // Handle mouse events
    const handleMouseDown = (rowIndex, colIndex) => {
        setIsMouseDown(true);

        // Check if we are clicking on the start or end cell
        if (grid[rowIndex][colIndex].type === 'start') {
            setDraggingStart(true);
        } else if (grid[rowIndex][colIndex].type === 'end') {
            setDraggingEnd(true);
        } 
        else {
            updateCell(rowIndex, colIndex);
        }
    };

    // Handle mouse enter event for drag functionality
    const handleMouseEnter = (rowIndex, colIndex) => {
        if (isMouseDown) {
            if (draggingStart) {
                moveCell('start', rowIndex, colIndex);
            } else if (draggingEnd) {
                moveCell('end', rowIndex, colIndex);
            } 
            else {
                updateCell(rowIndex, colIndex);
            }
        }
    };

    // Handle mouse up event to stop dragging
    const handleMouseUp = () => {
        setIsMouseDown(false);
        setDraggingStart(false);
        setDraggingEnd(false);
    };

    // Move the start or end cell to a new location
    const moveCell = (type, rowIndex, colIndex) => {
        const newGrid = [...grid];
        let prevRow, prevCol;

        // Find the previous location of the start or end cell
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (newGrid[row][col].type === type) {
                    prevRow = row;
                    prevCol = col;
                }
            }
        }

        // Reset the previous location of the start or end cell
        if (prevCol !== undefined && prevRow !== undefined) {
            newGrid[prevRow][prevCol].type = newGrid[prevRow][prevCol].prevType || 'empty';
        }

        // Update the new cell type
        newGrid[rowIndex][colIndex].prevType = newGrid[rowIndex][colIndex].type;
        newGrid[rowIndex][colIndex].type = type;

        setGrid(newGrid);
    };

    // Update a celly type when wall or dragged over
    const updateCell = (rowIndex, colIndex) => {
        const newGrid = [...grid];

        // Toggle the cell type between empty and wall
        if (newGrid[rowIndex][colIndex].type === 'empty') {
            newGrid[rowIndex][colIndex].type = 'wall';
        } else if (newGrid[rowIndex][colIndex].type === 'wall') {
            newGrid[rowIndex][colIndex].type = 'empty';
        }
        setGrid(newGrid);
    }

    // Render the grid
    return (
        <div className="grid-container">
        {/* (Button to find ir clear the path) */}
        <button onClick={handleButtonClick}>{isPathFound ? 'Clear Path' : 'Find Path'}</button>

        {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
                <div
                key={colIndex}
                className={`grid-cell grid-cell--${cell.type}`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
                ></div>
            ))}
            </div>
        ))}
        </div>
    );
};

export default Grid;

