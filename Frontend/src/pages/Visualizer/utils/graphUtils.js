// ─────────────────────────────────────────────────────────
// Graph Pathfinding Algorithms
// Generates step-by-step frames for grid pathfinding
// ─────────────────────────────────────────────────────────

/**
 * Breadth-First Search (BFS)
 * Guarantees the shortest path on an unweighted grid.
 */
export function generateBFSFrames(grid, startNode, endNode) {
  const frames = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = {};

  const queue = [{ r: startNode.r, c: startNode.c }];
  visited[startNode.r][startNode.c] = true;

  // Directions: Up, Right, Down, Left
  const dr = [-1, 0, 1, 0];
  const dc = [0, 1, 0, -1];

  frames.push({
    type: "init",
    description: `Starting Breadth-First Search (BFS) from [${startNode.r}, ${startNode.c}] to [${endNode.r}, ${endNode.c}].`,
  });

  while (queue.length > 0) {
    const { r, c } = queue.shift();

    frames.push({
      type: "visit",
      row: r,
      col: c,
      description: `Visiting node [${r}, ${c}].`,
    });

    if (r === endNode.r && c === endNode.c) {
      const path = [];
      let curr = `${r},${c}`;
      while (curr) {
        const [cr, cc] = curr.split(",").map(Number);
        path.unshift({ r: cr, c: cc });
        curr = parent[curr];
      }
      frames.push({
        type: "path",
        path,
        description: `🎉 Target reached! Shortest path found with length ${path.length - 1}.`,
      });
      return frames;
    }

    for (let i = 0; i < 4; i++) {
      const nr = r + dr[i];
      const nc = c + dc[i];

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (!visited[nr][nc] && !grid[nr][nc].isWall) {
          visited[nr][nc] = true;
          parent[`${nr},${nc}`] = `${r},${c}`;
          queue.push({ r: nr, c: nc });
        }
      }
    }
  }

  frames.push({
    type: "not_found",
    description: "Target is unreachable. All accessible nodes visited.",
  });

  return frames;
}

/**
 * Depth-First Search (DFS)
 * Does NOT guarantee the shortest path. Explores as deeply as possible.
 */
export function generateDFSFrames(grid, startNode, endNode) {
  const frames = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = {};

  const stack = [{ r: startNode.r, c: startNode.c }];
  // DFS uses a stack, but we only mark visited when we process the node, 
  // or we can mark it on push to prevent massive duplicates.
  // Standard DFS for visualizations marks on visit (pop).

  // Directions: Up, Right, Down, Left
  const dr = [-1, 0, 1, 0];
  const dc = [0, 1, 0, -1];

  frames.push({
    type: "init",
    description: `Starting Depth-First Search (DFS) from [${startNode.r}, ${startNode.c}] to [${endNode.r}, ${endNode.c}].`,
  });

  while (stack.length > 0) {
    const { r, c } = stack.pop();

    if (visited[r][c]) continue;
    visited[r][c] = true;

    frames.push({
      type: "visit",
      row: r,
      col: c,
      description: `Visiting node [${r}, ${c}].`,
    });

    if (r === endNode.r && c === endNode.c) {
      const path = [];
      let curr = `${r},${c}`;
      while (curr) {
        const [cr, cc] = curr.split(",").map(Number);
        path.unshift({ r: cr, c: cc });
        curr = parent[curr];
      }
      frames.push({
        type: "path",
        path,
        description: `🎉 Target reached! Path found with length ${path.length - 1}. (DFS does not guarantee shortest path)`,
      });
      return frames;
    }

    // Push neighbors in reverse order so that they are popped in the correct order (Up, Right, Down, Left)
    for (let i = 3; i >= 0; i--) {
      const nr = r + dr[i];
      const nc = c + dc[i];

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (!visited[nr][nc] && !grid[nr][nc].isWall) {
          parent[`${nr},${nc}`] = `${r},${c}`;
          stack.push({ r: nr, c: nc });
        }
      }
    }
  }

  frames.push({
    type: "not_found",
    description: "Target is unreachable. All accessible nodes visited.",
  });

  return frames;
}
