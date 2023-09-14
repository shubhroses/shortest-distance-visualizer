// Given a 2D array (grid), source, and target, 
// this function returns the shortest path from source to target.
export const dijkstra = (grid, source, target) => {
    const rows = grid.length;
    const cols = grid[0].length;
  
    // Initialize distance array with Infinity and set distance for source to 0.
    const distance = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    distance[source.row][source.col] = 0;
  
    // Store visited cells
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  
    // Store previous cell for each cell (for path reconstruction)
    const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
  
    // Possible movements from a cell: up, down, left, right
    const dx = [-1, 1, 0, 0];
    const dy = [0, 0, -1, 1];
  
    // Compare function for priority queue
    const compare = (a, b) => distance[a.row][a.col] - distance[b.row][b.col];
  
    // Priority queue to store [row, col] and distance
    const pq = [source];
    pq.compare = compare;
  
    while (pq.length > 0) {
      pq.sort(compare);
      const current = pq.shift();
  
      if (visited[current.row][current.col]) continue;
      visited[current.row][current.col] = true;
  
      if (current.row === target.row && current.col === target.col) {
        return reconstructPath(prev, source, target);
      }
  
      for (let i = 0; i < 4; i++) {
        const newRow = current.row + dx[i];
        const newCol = current.col + dy[i];
  
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
        if (visited[newRow][newCol] || grid[newRow][newCol].type === 'wall') continue;
  
        const alt = distance[current.row][current.col] + 1; // distance to neighbor
  
        if (alt < distance[newRow][newCol]) {
          distance[newRow][newCol] = alt;
          pq.push({ row: newRow, col: newCol });
          prev[newRow][newCol] = current;
        }
      }
    }
  
    return null;
  };
  
  // Reconstructs the shortest path from source to target.
  const reconstructPath = (prev, source, target) => {
    const path = [];
    let current = target;
    while (current !== null) {
      path.push(current);
      current = prev[current.row][current.col];
    }
    return path.reverse();
  };
  