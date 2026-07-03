import React from "react";
import { useParams, Link } from "react-router";

const visualizerRoutes = {
  "bubble-sort": "/visualizer/bubble-sort",
  "quick-sort": "/visualizer/quick-sort",
  "binary-search": "/visualizer/binary-search",
  "bfs": "/visualizer/bfs",
  "dfs": "/visualizer/dfs",
  "kadanes-algorithm": "/visualizer/kadanes-algorithm",
  "two-sum": "/visualizer/two-sum",
  "sliding-window": "/visualizer/sliding-window",
};

export default function AlgorithmDetail() {
  const { id } = useParams();

  const contentMap = {
    "bubble-sort": {
      title: "Bubble Sort",
      category: "Sorting",
      summary: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
      intuition: "Like bubbles rising to the surface of water, the largest elements 'bubble up' to the end of the array in each iteration.",
      approach: [
        "Start at the beginning of the array.",
        "Compare the first two elements. If the first is greater than the second, swap them.",
        "Move to the next pair of elements and repeat step 2 until the end of the array.",
        "This completes one 'pass'. The largest element is now at the very end.",
        "Repeat the process for the remaining elements (excluding the sorted ones at the end) until no more swaps are needed.",
        "Optimization: If a pass completes without any swaps, the array is already sorted, and we can stop early."
      ],
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      bestCase: "O(n) when the array is already sorted (if implemented with a 'swapped' flag).",
      useCases: ["Educational purposes (easy to understand)", "When the array is almost sorted (with optimization)", "When memory space is severely limited"],
      pros: ["Very simple to understand and implement", "In-place sorting (O(1) space)", "Stable sort (doesn't change relative order of equal elements)"],
      cons: ["Extremely slow for large datasets O(n²)", "Rarely used in practice for performance-critical applications"],
      edgeCases: ["Already sorted array", "Reverse sorted array (worst case)", "Array with all identical elements"],
      relatedProblems: ["Sort Colors", "Insertion Sort"],
      mistakes: ["Forgetting to optimize with a boolean flag to break early if no swaps occurred", "Iterating all the way to the end on every pass (instead of n-i-1)"],
      pseudocode: `function bubbleSort(arr):
    n = length(arr)
    for i from 0 to n-1:
        swapped = false
        // Last i elements are already in place
        for j from 0 to n-i-1:
            if arr[j] > arr[j+1]:
                swap arr[j] and arr[j+1]
                swapped = true
        // If no two elements were swapped by inner loop, then break
        if not swapped:
            break
    return arr`,
      interview: "Low priority for implementation, but often used as a baseline to explain why O(n log n) sorts are better. You may be asked to optimize it using the 'swapped' flag."
    },
    "quick-sort": {
      title: "Quick Sort",
      category: "Sorting",
      summary: "A highly efficient divide-and-conquer sorting algorithm that partitions arrays around a pivot element.",
      intuition: "Pick an element as a referee (pivot). Everyone smaller goes to the left group, everyone bigger goes to the right group. Recursively sort each group.",
      approach: [
        "Choose a pivot element from the array (commonly the last element).",
        "Partition the array: rearrange so all elements less than the pivot come before it, and all elements greater come after.",
        "The pivot is now in its final sorted position.",
        "Recursively apply steps 1–3 to the left subarray and the right subarray.",
        "Base case: subarrays of size 0 or 1 are already sorted."
      ],
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(log n)",
      bestCase: "O(n log n) when the pivot divides the array into roughly equal halves.",
      useCases: ["General-purpose sorting", "When average-case performance matters more than worst-case", "In-place sorting with good cache performance"],
      pros: ["Very fast in practice (often faster than Merge Sort)", "In-place sorting (O(log n) stack space)", "Good cache locality"],
      cons: ["Worst case O(n²) with bad pivot choices", "Not a stable sort", "Recursive — risk of stack overflow on very large inputs"],
      edgeCases: ["Already sorted array (worst case with last-element pivot)", "All identical elements", "Array of size 1 or 0"],
      relatedProblems: ["Kth Largest Element", "Sort Colors", "Quickselect"],
      mistakes: ["Not handling the base case properly", "Poor pivot selection leading to O(n²)", "Off-by-one errors in the partition logic"],
      pseudocode: `function quickSort(arr, low, high):
    if low < high:
        pivotIndex = partition(arr, low, high)
        quickSort(arr, low, pivotIndex - 1)
        quickSort(arr, pivotIndex + 1, high)

function partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j from low to high - 1:
        if arr[j] <= pivot:
            i++
            swap arr[i] and arr[j]
    swap arr[i+1] and arr[high]
    return i + 1`,
      interview: "High priority. Understanding partitioning is essential. QuickSelect (a variant) is frequently asked for finding the Kth largest/smallest element."
    },
    "binary-search": {
      title: "Binary Search",
      category: "Searching",
      summary: "An efficient algorithm for finding an item from a sorted list of items.",
      intuition: "Like searching for a word in a dictionary: you open the book in the middle. If the word you're looking for comes alphabetically before the page you're on, you search the first half. Otherwise, you search the second half.",
      approach: [
        "Ensure the array is sorted.",
        "Set two pointers: 'low' at the start and 'high' at the end of the array.",
        "Calculate the middle index: mid = low + (high - low) / 2.",
        "If the target equals the middle element, return its index.",
        "If the target is less than the middle element, it must be in the left half. Update high = mid - 1.",
        "If the target is greater than the middle element, it must be in the right half. Update low = mid + 1.",
        "Repeat steps 3-6 until low > high. If so, the target is not in the array."
      ],
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1) (iterative), O(log n) (recursive)",
      bestCase: "O(1) when the target is the middle element on the first try.",
      useCases: ["Searching in a sorted array", "Finding boundaries (first/last occurrence)", "Searching in rotated sorted arrays", "Finding a peak element"],
      pros: ["Extremely fast for large, sorted datasets", "Minimal space required"],
      cons: ["Requires the array to be sorted first (which takes O(n log n))", "Requires random access (doesn't work well on linked lists)"],
      edgeCases: ["Empty array", "Target is smaller than the first element", "Target is larger than the last element", "Duplicates exist in the array"],
      relatedProblems: ["Find First and Last Position of Element in Sorted Array", "Search in Rotated Sorted Array", "Find Peak Element", "Koko Eating Bananas"],
      mistakes: ["Integer overflow when calculating mid: use 'low + (high - low) / 2' instead of '(low + high) / 2'", "Off-by-one errors with while loop condition ('<=' vs '<') and updating pointers ('mid - 1' vs 'mid')"],
      pseudocode: `function binarySearch(arr, target):
    low = 0
    high = length(arr) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if arr[mid] == target:
            return mid
        else if arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1 // not found`,
      interview: "Extremely high priority. You must be able to write a bug-free binary search and its variants (finding bounds) instinctively."
    },
    "dfs": {
      title: "Depth First Search (DFS)",
      category: "Graph",
      summary: "An algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking.",
      intuition: "Imagine exploring a maze. You keep walking down a path until you hit a dead end, then you walk back to the last intersection and try a different path.",
      approach: [
        "Start at the chosen node (or root).",
        "Mark the current node as visited.",
        "Explore an unvisited adjacent node.",
        "Recursively apply steps 1-3 to the adjacent node.",
        "If you hit a node with no unvisited adjacent nodes, backtrack to the previous node.",
        "Continue until all reachable nodes are visited."
      ],
      timeComplexity: "O(V + E) where V is vertices, E is edges",
      spaceComplexity: "O(V) for the recursion stack (or explicit stack) and visited set",
      bestCase: "O(1) if target is the start node.",
      useCases: ["Topological Sorting", "Finding connected components", "Solving mazes/puzzles with only one solution", "Detecting cycles in a graph"],
      pros: ["Requires less memory than BFS for wide trees/graphs", "Can easily be implemented with recursion"],
      cons: ["Can get stuck in infinite loops in graphs with cycles if 'visited' isn't tracked", "Doesn't necessarily find the shortest path"],
      edgeCases: ["Disconnected graphs", "Graph with cycles", "Empty graph"],
      relatedProblems: ["Number of Islands", "Clone Graph", "Course Schedule (Topological Sort)"],
      mistakes: ["Forgetting to mark nodes as visited, leading to infinite loops", "Not handling disconnected components (needing an outer loop over all vertices)"],
      pseudocode: `function dfs(graph, start, visited=set()):
    if start not in visited:
        visited.add(start)
        print(start)
        for neighbor in graph[start]:
            dfs(graph, neighbor, visited)
    return visited`,
      interview: "Very high priority. Often the go-to algorithm for matrix/grid problems and tree traversals."
    },
    "bfs": {
      title: "Breadth First Search (BFS)",
      category: "Graph",
      summary: "An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.",
      intuition: "Imagine a drop of water hitting a pond. The ripples spread outwards in concentric circles. BFS explores nodes level by level.",
      approach: [
        "Initialize a Queue and a Visited set.",
        "Enqueue the starting node and add it to Visited.",
        "While the queue is not empty, dequeue a node.",
        "Process the dequeued node.",
        "For each unvisited neighbor of this node, enqueue it and mark it as visited."
      ],
      timeComplexity: "O(V + E) where V is vertices, E is edges",
      spaceComplexity: "O(V) for the queue and visited set",
      bestCase: "O(1) if target is start node.",
      useCases: ["Finding the shortest path in unweighted graphs", "Peer to peer networks", "Crawlers in search engines", "Social networking features (people 1 degree away)"],
      pros: ["Guarantees finding the shortest path in unweighted graphs"],
      cons: ["Requires more memory than DFS (needs to store all nodes at current level in queue)"],
      edgeCases: ["Disconnected graphs", "Graph with cycles", "Empty graph"],
      relatedProblems: ["Rotting Oranges", "Word Ladder", "Shortest Path in Binary Matrix"],
      mistakes: ["Marking nodes as visited when Popping from queue instead of Pushing (can lead to adding same node multiple times)", "Using an array shift() operation in JavaScript which is O(N) instead of a proper Queue data structure"],
      pseudocode: `function bfs(graph, start):
    visited = set()
    queue = Queue()
    
    queue.enqueue(start)
    visited.add(start)
    
    while not queue.isEmpty():
        vertex = queue.dequeue()
        print(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)`,
      interview: "Very high priority. Essential for shortest-path problems on unweighted graphs and level-order tree traversals."
    },
    "kadanes-algorithm": {
      title: "Kadane's Algorithm",
      category: "Dynamic Programming",
      summary: "An efficient algorithm to find the maximum sum contiguous subarray within a one-dimensional array of numbers.",
      intuition: "At each position, you have a choice: either extend the current subarray or start a new one from here. If the running sum becomes negative, it's better to start fresh.",
      approach: [
        "Initialize maxSoFar and maxEndingHere to the first element.",
        "Iterate through the array starting from the second element.",
        "At each element, maxEndingHere = max(element, maxEndingHere + element).",
        "Update maxSoFar = max(maxSoFar, maxEndingHere).",
        "After iterating, maxSoFar holds the maximum subarray sum."
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      bestCase: "O(n) — always scans the full array.",
      useCases: ["Stock trading (max profit from buy/sell)", "Image processing (maximum sum rectangle)", "Signal processing"],
      pros: ["Optimal O(n) time", "O(1) space", "Elegant and simple"],
      cons: ["Only finds the sum, not the subarray itself (requires extra tracking)", "Doesn't handle the empty subarray case naturally"],
      edgeCases: ["All negative numbers", "All positive numbers", "Single element array", "Array with zeros"],
      relatedProblems: ["Maximum Subarray", "Maximum Sum Circular Subarray", "Best Time to Buy and Sell Stock"],
      mistakes: ["Initializing maxSoFar to 0 instead of the first element (fails for all-negative arrays)", "Not tracking the actual subarray indices when needed"],
      pseudocode: `function kadane(arr):
    maxSoFar = arr[0]
    maxEndingHere = arr[0]
    
    for i from 1 to length(arr) - 1:
        maxEndingHere = max(arr[i], maxEndingHere + arr[i])
        maxSoFar = max(maxSoFar, maxEndingHere)
    
    return maxSoFar`,
      interview: "Very high priority. The classic dynamic programming problem. You must know this instinctively."
    },
    "two-sum": {
      title: "Two Sum / Two Pointers",
      category: "Patterns",
      summary: "A fundamental algorithmic pattern that uses two pointers to efficiently search pairs or subsets in sorted or structured data.",
      intuition: "Place one finger at the start and one at the end of a sorted array. If the sum is too small, move the left finger right. If too large, move the right finger left.",
      approach: [
        "Sort the array (if using two pointers; for hash map approach, skip this).",
        "Initialize two pointers: left = 0, right = length - 1.",
        "Calculate the sum of elements at both pointers.",
        "If sum equals target, return the pair.",
        "If sum < target, move left pointer right (increase sum).",
        "If sum > target, move right pointer left (decrease sum).",
        "Repeat until pointers cross."
      ],
      timeComplexity: "O(n) with hash map, O(n log n) with two pointers (due to sorting)",
      spaceComplexity: "O(n) with hash map, O(1) with two pointers",
      bestCase: "O(1) if the answer is at the boundaries.",
      useCases: ["Finding pairs that sum to a target", "Removing duplicates", "Container with most water", "Palindrome checking"],
      pros: ["Very efficient for sorted data", "Can avoid extra space with two pointers", "Versatile pattern applicable to many problems"],
      cons: ["Two pointers requires sorted data", "Hash map uses extra space"],
      edgeCases: ["No valid pair exists", "Multiple valid pairs", "Duplicate elements", "Negative numbers"],
      relatedProblems: ["Two Sum", "Three Sum", "Container With Most Water", "Valid Palindrome"],
      mistakes: ["Forgetting to sort the array before using two pointers", "Using the same element twice", "Not handling duplicates properly in 3Sum"],
      pseudocode: `// Hash Map approach (unsorted)
function twoSum(arr, target):
    map = {}
    for i, num in enumerate(arr):
        complement = target - num
        if complement in map:
            return [map[complement], i]
        map[num] = i

// Two Pointers approach (sorted)
function twoSumSorted(arr, target):
    left = 0, right = length(arr) - 1
    while left < right:
        sum = arr[left] + arr[right]
        if sum == target: return [left, right]
        else if sum < target: left++
        else: right--`,
      interview: "Extremely high priority. Two Sum is the #1 most asked interview question. The two-pointer pattern extends to many harder problems."
    },
    "sliding-window": {
      title: "Sliding Window",
      category: "Patterns",
      summary: "A technique for solving problems involving contiguous subarrays or substrings by maintaining a 'window' that slides across the data.",
      intuition: "Imagine looking through a window on a moving train. The scenery (data) changes, but you only process what's currently visible through your window frame.",
      approach: [
        "Define two pointers (left and right) that form the window boundaries.",
        "Expand the window by moving the right pointer.",
        "When a condition is violated, shrink the window by moving the left pointer.",
        "At each step, update the answer (max/min length, sum, etc.).",
        "Continue until the right pointer reaches the end."
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) to O(k) depending on the problem",
      bestCase: "O(n) — always processes each element at most twice.",
      useCases: ["Maximum sum subarray of size K", "Longest substring without repeating characters", "Minimum window substring", "Anagram detection"],
      pros: ["Converts O(n²) brute force to O(n)", "Intuitive once understood", "Applicable to a wide class of problems"],
      cons: ["Only works on contiguous sequences", "Tricky to identify when to shrink vs expand", "Requires careful boundary handling"],
      edgeCases: ["Window larger than array", "All identical elements", "Empty input", "Single element"],
      relatedProblems: ["Longest Substring Without Repeating Characters", "Minimum Window Substring", "Maximum Sum Subarray of Size K", "Fruit Into Baskets"],
      mistakes: ["Not shrinking the window when the constraint is violated", "Off-by-one errors when calculating window size", "Forgetting to update the answer at each valid window"],
      pseudocode: `// Variable-size sliding window
function slidingWindow(arr, condition):
    left = 0
    answer = initial_value
    window_state = {}
    
    for right from 0 to length(arr) - 1:
        // Expand: add arr[right] to window
        update window_state with arr[right]
        
        // Shrink: while window is invalid
        while window violates condition:
            remove arr[left] from window_state
            left++
        
        // Update answer
        answer = best(answer, right - left + 1)
    
    return answer`,
      interview: "Very high priority. A must-know pattern. Tested frequently in FAANG interviews for string and array problems."
    }
  };

  const defaultContent = {
    title: id ? id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Algorithm Not Found",
    category: "Algorithm",
    summary: "Detailed content is under construction.",
    intuition: "Coming soon.",
    approach: ["Coming soon."],
    timeComplexity: "N/A",
    spaceComplexity: "N/A",
    bestCase: "N/A",
    useCases: [],
    pros: [],
    cons: [],
    edgeCases: [],
    mistakes: [],
    interview: "Coming soon.",
    relatedProblems: [],
    pseudocode: "// Code coming soon"
  };

  const data = contentMap[id] || defaultContent;
  const visualizerPath = visualizerRoutes[id];

  return (
    <article className="text-slate-300 font-sans pb-24 antialiased">
      
      {/* 1. HERO HEADER AREA */}
      <header className="mb-14">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
            {data.category}
          </span>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
            ▶ Interactive Visualizer Available
          </span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
          {data.title}
        </h1>
        <p className="text-xl lg:text-2xl text-slate-400 font-light leading-relaxed max-w-4xl border-l-4 border-purple-500 pl-6 py-2">
          {data.summary}
        </p>
      </header>

      {/* 🚀 LAUNCH VISUALIZER CTA — PRIMARY ACTION */}
      {visualizerPath && (
        <section className="mb-14">
          <Link
            to={visualizerPath}
            className="group relative flex items-center justify-between w-full p-8 rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent hover:border-emerald-400/60 hover:from-emerald-500/20 hover:via-emerald-500/10 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300 shadow-lg">
                ▶
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-200 transition-colors">
                  Open Interactive Visualizer
                </h2>
                <p className="text-slate-400 text-base group-hover:text-slate-300 transition-colors">
                  Step through the algorithm with animated bars, controls, and real-time status updates
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-emerald-400 group-hover:text-emerald-300 transition-colors">
              <span className="text-sm font-bold uppercase tracking-wider hidden sm:block">Launch</span>
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </section>
      )}

      <div className="space-y-16">
        
        {/* 2. INTUITION */}
        <section className="bg-[#111827] rounded-3xl p-8 shadow-xl border border-slate-800/60 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <h2 className="text-xl font-bold text-white mb-5 flex items-center relative z-10">
            <span className="text-purple-500 mr-3 text-2xl">💡</span> Core Intuition
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg relative z-10">{data.intuition}</p>
        </section>

        {/* 3. APPROACH */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            Step-by-Step Approach
          </h2>
          <ol className="space-y-4">
            {data.approach.map((step, index) => (
              <li key={index} className="flex bg-[#111827] p-6 rounded-2xl border border-slate-800/60 shadow-lg">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg mr-5 shadow-sm">
                  {index + 1}
                </span>
                <p className="text-slate-300 text-lg pt-1.5 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. COMPLEXITIES */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111827] rounded-3xl p-8 border border-slate-800/60 text-center shadow-xl">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4">Time Complexity</h3>
              <p className="text-4xl font-mono text-blue-400 font-bold">{data.timeComplexity}</p>
            </div>
            <div className="bg-[#111827] rounded-3xl p-8 border border-slate-800/60 text-center shadow-xl">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4">Space Complexity</h3>
              <p className="text-4xl font-mono text-purple-400 font-bold">{data.spaceComplexity}</p>
            </div>
            <div className="bg-[#111827] rounded-3xl p-8 border border-slate-800/60 text-center shadow-xl">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4">Best Case Time</h3>
              <p className="text-2xl font-mono text-emerald-400 font-bold mt-2">{data.bestCase}</p>
            </div>
          </div>
        </section>

        {/* 5. PROS & CONS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-3xl p-10 shadow-lg">
            <h3 className="text-2xl font-bold text-emerald-400 mb-8 flex items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                <span className="text-emerald-500 text-lg">✓</span>
              </div>
              Advantages
            </h3>
            <ul className="space-y-5">
              {data.pros.length > 0 ? data.pros.map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 mr-4 flex-shrink-0"></div>
                  <span className="text-slate-300 text-lg leading-relaxed">{item}</span>
                </li>
              )) : <li className="text-slate-500">No data available</li>}
            </ul>
          </div>
          <div className="bg-rose-950/20 border border-rose-900/30 rounded-3xl p-10 shadow-lg">
            <h3 className="text-2xl font-bold text-rose-400 mb-8 flex items-center">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center mr-4">
                <span className="text-rose-500 text-lg">✕</span>
              </div>
              Disadvantages
            </h3>
            <ul className="space-y-5">
              {data.cons.length > 0 ? data.cons.map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 mr-4 flex-shrink-0"></div>
                  <span className="text-slate-300 text-lg leading-relaxed">{item}</span>
                </li>
              )) : <li className="text-slate-500">No data available</li>}
            </ul>
          </div>
        </section>

        {/* 6. USAGE & INTERVIEW */}
        <section className="bg-[#111827] rounded-3xl p-10 border border-slate-800/60 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-emerald-400 uppercase mb-4">Best Use Cases</h3>
              <ul className="space-y-3 mb-8">
                {data.useCases.length > 0 ? data.useCases.map((item, i) => (
                  <li key={i} className="text-slate-300 text-lg flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-emerald-500 before:rounded-full before:mr-3">
                    {item}
                  </li>
                )) : <li className="text-slate-500">No data available</li>}
              </ul>
              
              <h3 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-4">Edge Cases to Consider</h3>
              <ul className="space-y-3">
                {data.edgeCases.length > 0 ? data.edgeCases.map((item, i) => (
                  <li key={i} className="text-slate-300 text-lg flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-blue-500 before:rounded-full before:mr-3">
                    {item}
                  </li>
                )) : <li className="text-slate-500">No data available</li>}
              </ul>
            </div>
            
            <div className="border-l border-slate-800/80 pl-0 md:pl-12">
              <h3 className="text-sm font-bold tracking-widest text-amber-400 uppercase mb-4">Interview Relevance</h3>
              <p className="text-slate-300 text-lg leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 mb-8">
                {data.interview}
              </p>

              <h3 className="text-sm font-bold tracking-widest text-purple-400 uppercase mb-4">Related Problems</h3>
              <div className="flex flex-wrap gap-3 mt-4">
                {data.relatedProblems.length > 0 ? data.relatedProblems.map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-800/50 text-slate-300 text-sm font-semibold rounded-lg border border-slate-700">
                    {item}
                  </span>
                )) : <span className="text-slate-500">No data available</span>}
              </div>
            </div>
          </div>
        </section>

        {/* 7. COMMON MISTAKES */}
        {data.mistakes && data.mistakes.length > 0 && (
          <section className="bg-amber-950/20 border-l-4 border-amber-500 rounded-r-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-amber-400 mb-5 flex items-center">
              <span className="text-2xl mr-3">⚠️</span> Common Pitfalls & Mistakes
            </h3>
            <ul className="space-y-3 ml-2">
              {data.mistakes.map((m, i) => (
                <li key={i} className="text-slate-300 text-lg flex items-start">
                  <span className="text-amber-500 mr-3 mt-0.5">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 8. PSEUDOCODE */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Pseudocode</h2>
          <div className="bg-[#0d1321] rounded-2xl border border-slate-700/60 overflow-hidden shadow-lg">
            <div className="bg-[#111827] px-6 py-4 border-b border-slate-800/80 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="ml-4 text-xs font-extrabold font-mono text-slate-500 tracking-widest">algorithm.pseudo</span>
            </div>
            <pre className="p-8 text-sm md:text-base font-mono text-blue-300 overflow-x-auto m-0 leading-relaxed">
              <code>{data.pseudocode}</code>
            </pre>
          </div>
        </section>

        {/* 9. BOTTOM CTA — LAUNCH VISUALIZER AGAIN */}
        {visualizerPath && (
          <section className="pt-4">
            <Link
              to={visualizerPath}
              className="group flex items-center justify-center gap-4 w-full p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300"
            >
              <span className="text-2xl">▶</span>
              <span className="text-lg font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Ready to see it in action? Launch the Interactive Visualizer →
              </span>
            </Link>
          </section>
        )}
      </div>
    </article>
  );
}
