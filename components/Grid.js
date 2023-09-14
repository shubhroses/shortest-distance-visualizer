import React, { useEffect, useState } from 'react';
import { dijkstra } from '../algorithms/Dijkstra';
import '../styles/Grid.css';

const Grid = () => {
    const rows = 10;
    const cols = 10;

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [draggingStart, setDraggingStart] = useState(false);
    const [draggingEnd, setDraggingEnd] = useState(false);
    const [isPathFound, setIsPathFound] = useState(false);

    // Initialize grid
    const initializeGrid = () => {
        const grid = Array.from({ length: rows }, (_, rowIndex) =>
            Array.from({ length: cols }, (_, colIndex) => ({
                row: rowIndex,
                col: colIndex,
                type: 'empty',
            }))
        );
        grid[0][0].type = 'start';
        grid[rows - 1][cols - 1].type = 'end';
        return grid;
    };

    const [grid, setGrid] = useState(initializeGrid());

    // Find and display path using Dijkstra's Algorithm
    const findPath = () => {
        // Step 1: Clear the existing path on the grid
        const clearedGrid = grid.map(row =>
          row.map(cell => {
            if (cell.type === 'path') {
                return { ...cell, type: 'empty' };
            }
            return cell;
          })
        );
      
        // Step 2: Identify the start and end cells
        let start = null;
        let end = null;
        for (const row of clearedGrid) {
            for (const cell of row) {
                if (cell.type === 'start') {
                    start = cell;
                }
                if (cell.type === 'end') {
                    end = cell;
                }
            }
        }
      
        if (!start || !end) {
            console.error("Start or end cell not found");
            return;
        }
      
        // Step 3: Run Dijkstra's Algorithm to find the shortest path
        const { path } = dijkstra(clearedGrid, start, end);
      
        // Step 4: Update the grid to show the path
        if (path) {
            const newGrid = clearedGrid.map(row =>
                row.map(cell => {
                    const isPathCell = path.some(p => p.row === cell.row && p.col === cell.col);
                    if (isPathCell && cell.type !== 'start' && cell.type !== 'end') {
                        return { ...cell, type: 'path' };
                    }
                    return cell;
                })
            );
            setGrid(newGrid);
            setIsPathFound(true);
        }
    };      
    

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
        setIsPathFound(false);
    };
    

    const handleButtonClick = () => {
        if (isPathFound) {
            clearPath();
        } else {
            findPath();
        }
    };
    const [shouldUpdatePath, setShouldUpdatePath] = useState(false);

    useEffect(() => {
        if (isPathFound && shouldUpdatePath) {
            findPath();
            setShouldUpdatePath(false);
        }
    }, [grid, isPathFound, shouldUpdatePath]);

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

        if (isPathFound) {
            findPath();
        }
        setShouldUpdatePath(true);
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
            <button onClick={handleButtonClick}>{isPathFound ? "Clear Path" : "Animate"}</button>
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

