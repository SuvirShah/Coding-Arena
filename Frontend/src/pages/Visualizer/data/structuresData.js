export const structuresData = {
  "array": {
    title: "Array",
    summary: "A contiguous block of memory storing elements of the same type.",
    badges: ["Linear", "Contiguous Memory", "O(1) Access", "Fixed/Dynamic"],
    history: "Arrays are one of the oldest and most fundamental data structures, tracing their roots back to the very first high-level programming languages like Fortran (1957) and COBOL. They were designed to mirror how physical computer memory works: a continuous sequence of addresses.",
    facts: [
      "In C, an array name is simply a pointer to its first element's memory address.",
      "Most modern scripting languages (like Python and JavaScript) don't actually use true fixed-size arrays by default; their 'arrays' are dynamic objects or lists under the hood.",
      "Matrix operations in machine learning (like those in TensorFlow) rely entirely on highly optimized multi-dimensional arrays to process massive amounts of parallel calculations."
    ],
    definition: "An array is a fixed-size sequential collection of elements of the same type. Because elements are stored side-by-side in memory, the exact physical location of any element can be calculated instantly using a mathematical formula.",
    intuition: "Think of a row of lockers, each with a sequential number. If you know you want locker #5, you don't need to walk past lockers 1 through 4—you can walk directly to locker 5. The physical distance between each locker is exactly the same.",
    why: "Arrays exist to provide instantaneous O(1) random access. They are the most efficient way to store and retrieve sequential data when you already know the index you are looking for.",
    structure: "A single, continuous block of RAM. The computer remembers the 'base address' (the start of the array). To find index 'i', it calculates: Address = Base_Address + (i * Element_Size).",
    engineeringRelevance: "Arrays are the backbone of high-performance computing. Because they are stored contiguously, they leverage 'spatial locality'—meaning when the CPU fetches one array element from RAM, it automatically loads the adjacent elements into its ultra-fast L1/L2 cache. This makes arrays vastly faster to iterate over than linked structures.",
    timeComplexity: [
      { op: "Access (Index)", time: "O(1)", space: "O(1)", notes: "Direct memory calculation using base address + offset." },
      { op: "Search (Value)", time: "O(n)", space: "O(1)", notes: "Requires iterating through elements unless sorted (Binary Search is O(log n))." },
      { op: "Insertion", time: "O(n)", space: "O(1)", notes: "Requires shifting all subsequent elements to the right. O(1) if at the end of dynamic array." },
      { op: "Deletion", time: "O(n)", space: "O(1)", notes: "Requires shifting all subsequent elements to the left. O(1) if at the end." }
    ],
    spaceComplexity: "O(n)",
    pros: [
      "Fast random access (O(1)) given an index.",
      "Exceptional cache locality, making iteration incredibly fast on modern CPUs.",
      "No memory overhead per element (unlike pointers in linked lists).",
      "Native support in virtually all hardware and programming languages."
    ],
    cons: [
      "Fixed size in memory (static arrays). Dynamic arrays have overhead during resizing.",
      "Expensive insertion and deletion in the middle or beginning (O(n)).",
      "Memory can be wasted if the allocated size is much larger than the used size."
    ],
    useCases: [
      "Image processing (pixels are stored as 2D/3D arrays).",
      "Implementing other data structures like Stacks, Queues, Heaps, and Hash Tables.",
      "Lookup tables and caching systems.",
      "Sequential data processing where index access is crucial."
    ],
    whereUsed: "Almost everywhere. Used heavily in system programming, graphics buffers, mathematical simulations, and low-level memory management.",
    whenToUse: "When you know the exact number of elements in advance, require fast read access by index, and need to optimize for CPU cache performance.",
    whenNotToUse: "When you have frequent insertions/deletions in the middle of the collection, or when you have a highly unpredictable and fluctuating number of elements.",
    mistakes: [
      "Off-by-one errors in loops (e.g., looping to n instead of n-1).",
      "Index out of bounds exceptions (trying to access array[10] when size is 10).",
      "Assuming language-level arrays (like JS arrays) guarantee contiguous memory."
    ],
    interview: "Extremely high. You must intimately understand techniques like Sliding Window, Two Pointers, Prefix Sums, and in-place manipulation.",
    implementations: {
      "C++": "int arr[5] = {1, 2, 3, 4, 5}; // Static\nstd::vector<int> v = {1, 2, 3, 4, 5}; // Dynamic",
      "Java": "int[] arr = new int[]{1, 2, 3, 4, 5}; // Static\nArrayList<Integer> list = new ArrayList<>(); // Dynamic",
      "JavaScript": "const arr = [1, 2, 3, 4, 5]; // Dynamic by default\n// JS arrays are actually objects under the hood",
      "Python": "arr = [1, 2, 3, 4, 5] # Dynamic list\n# Python lists are dynamic arrays of pointers"
    },
    related: [
      { name: "Dynamic Array", path: "/learn/ds/array" },
      { name: "Linked List", path: "/learn/ds/linked-list" },
      { name: "Matrix", path: "/learn/ds/array" }
    ]
  },
  "linked-list": {
    title: "Linked List",
    summary: "A linear collection of data elements where each element points to the next.",
    badges: ["Linear", "Non-contiguous", "Dynamic Size", "O(1) Insert/Delete (Known Node)"],
    history: "Linked lists were developed in 1955 by Allen Newell, Cliff Shaw, and Herbert A. Simon at RAND Corporation. They were initially used in the IPL (Information Processing Language) to power early artificial intelligence programs.",
    facts: [
      "The 'Undo' functionality in many desktop applications is built using Doubly Linked Lists.",
      "The FAT (File Allocation Table) file system, historically used by MS-DOS and Windows, utilizes a linked list structure to track file clusters on a hard drive.",
      "Blockchain technology is fundamentally a highly secure, cryptographic linked list."
    ],
    definition: "A linked list is a sequence of data elements, called nodes. Unlike arrays, nodes are not stored in contiguous memory. Instead, each node contains its data and a memory address (pointer) to the next node in the sequence.",
    intuition: "Imagine a treasure hunt where each clue leads you to the location of the next clue. You can't skip straight to the 5th clue; you must start at the first clue and follow the chain until you reach the 5th.",
    why: "Linked lists were created to overcome the fixed-size limitations of arrays. They allow for true dynamic memory allocation, expanding and shrinking precisely as needed without ever needing to copy or shift elements.",
    structure: "A 'Head' pointer keeps track of the first node. Every node contains a `val` (data) and a `next` pointer. The final node points to `null` to signify the end of the list.",
    engineeringRelevance: "Linked lists are crucial when dealing with completely unknown quantities of data where pre-allocating an array is impossible or wasteful. They are heavily used in low-level systems for managing free memory pools (Free Lists) and resolving Hash Table collisions (Chaining).",
    timeComplexity: [
      { op: "Access (Index)", time: "O(n)", space: "O(1)", notes: "Requires traversing step-by-step from the head node to the nth node." },
      { op: "Search (Value)", time: "O(n)", space: "O(1)", notes: "Linear scan through the list." },
      { op: "Insertion", time: "O(1)*", space: "O(1)", notes: "O(1) if you already have a pointer to the insertion point. Otherwise O(n) to find the spot." },
      { op: "Deletion", time: "O(1)*", space: "O(1)", notes: "O(1) if you already have a pointer to the node. Otherwise O(n)." }
    ],
    spaceComplexity: "O(n)",
    pros: [
      "Completely dynamic size (can grow/shrink perfectly to fit data).",
      "Efficient O(1) insertions and deletions without shifting elements.",
      "No memory wasted on pre-allocated unused capacity."
    ],
    cons: [
      "No random access (cannot do list[5] in O(1)).",
      "Extra memory required for storing pointers.",
      "Terrible cache locality (nodes are scattered in RAM, causing frequent cache misses).",
      "Reverse traversal is impossible in a singly linked list."
    ],
    useCases: [
      "Implementing Stacks and Queues without arbitrary size limits.",
      "Adjacency lists for representing Graphs.",
      "Managing tabs in a web browser (Doubly Linked List).",
      "Hash table collision resolution (chaining)."
    ],
    whereUsed: "Operating system memory allocators, browser histories, text editor undo buffers.",
    whenToUse: "When you have frequent insertions/deletions at the ends of a list, don't need random access, and the total number of elements fluctuates wildly.",
    whenNotToUse: "When you need fast random access, or when memory overhead is a severe constraint (pointers take up space).",
    mistakes: [
      "Losing the head pointer by reassigning it carelessly.",
      "Dereferencing null pointers (e.g., current.next.next when current.next is null).",
      "Memory leaks in languages like C/C++ by removing a node but forgetting to `free` it.",
      "Creating infinite loops by accidentally pointing a node back to a previous node."
    ],
    interview: "Very common. Typical questions involve reversing a list, finding the middle (using the slow/fast pointer technique), detecting a cycle (Floyd's algorithm), or merging sorted lists.",
    implementations: {
      "C++": "struct Node {\n  int data;\n  Node* next;\n  Node(int val) : data(val), next(nullptr) {}\n};",
      "Java": "class Node {\n  int data;\n  Node next;\n  Node(int d) { data = d; next = null; }\n}",
      "JavaScript": "class Node {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n  }\n}",
      "Python": "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None"
    },
    related: [
      { name: "Doubly Linked List", path: "/learn/ds/linked-list" },
      { name: "Circular Linked List", path: "/learn/ds/linked-list" },
      { name: "Array", path: "/learn/ds/array" }
    ]
  },
  "stack": {
    title: "Stack",
    summary: "A LIFO (Last-In-First-Out) linear data structure.",
    badges: ["LIFO", "Linear", "O(1) Operations", "Restricted Access"],
    history: "The stack was first proposed in 1946 by Alan Turing for subroutine calling and returning in his design for the ACE computer. It was independently developed later and patented by Bauer and Samelson in 1957.",
    facts: [
      "The 'Stack Overflow' website is named after the fatal error that occurs when a computer's call stack exceeds its memory limit.",
      "Most modern CPUs have dedicated hardware registers specifically designed to maintain a stack (the Stack Pointer).",
      "The popular card game 'Magic: The Gathering' resolves spells using a strict Last-In-First-Out 'Stack' mechanism exactly like the data structure."
    ],
    definition: "A stack is a linear data structure that rigidly enforces the Last-In-First-Out (LIFO) principle. Elements can only be added (pushed) or removed (popped) from the very top.",
    intuition: "Think of a physical stack of heavy plates in a cafeteria. You can only safely take the top plate, and if you return a plate, it must go on top. Trying to pull a plate from the middle will cause a crash.",
    why: "Stacks are perfectly designed to manage execution state, reverse sequences, and process nested structures. They enforce an ordered history where the most recent action is the first one addressed.",
    structure: "Can be implemented using an Array or a Linked List. An internal pointer (or index) constantly keeps track of the 'top' element.",
    engineeringRelevance: "The execution of nearly every program written relies on the 'Call Stack', which tracks active function calls. When function A calls function B, A is pushed to the stack. When B finishes, it is popped, and A resumes.",
    timeComplexity: [
      { op: "Push", time: "O(1)", space: "O(1)", notes: "Add an element to the top." },
      { op: "Pop", time: "O(1)", space: "O(1)", notes: "Remove the element from the top." },
      { op: "Peek / Top", time: "O(1)", space: "O(1)", notes: "View the top element without removing it." },
      { op: "Search", time: "O(n)", space: "O(1)", notes: "Requires repeatedly popping elements off to find a specific value." }
    ],
    spaceComplexity: "O(n)",
    pros: [
      "Guaranteed O(1) operations for push, pop, and peek.",
      "Incredibly simple to implement.",
      "Restricted access protects data integrity (you can't accidentally mess up the middle)."
    ],
    cons: [
      "Extremely limited access (only the top element is accessible).",
      "If array-based, it has a fixed capacity or incurs performance hits during resizing.",
      "Not suitable for searching."
    ],
    useCases: [
      "Function call execution and recursion tracking.",
      "Undo/Redo features in text editors.",
      "Syntax parsing (checking for balanced parentheses, JSON parsing).",
      "Depth-First Search (DFS) graph and tree algorithms."
    ],
    whereUsed: "Language compilers, browser history (back button), expression evaluation (Reverse Polish Notation calculators).",
    whenToUse: "When you need strict LIFO behavior, such as backtracking through a maze, reversing a string, or parsing nested symbols.",
    whenNotToUse: "When you need random access, FIFO behavior (use a queue), or need to search through elements frequently.",
    mistakes: [
      "Stack Overflow (exceeding memory capacity due to infinite recursion).",
      "Stack Underflow (attempting to pop from an empty stack).",
      "Using a stack when a queue is actually needed for fairness."
    ],
    interview: "High. Extremely common in parsing problems (e.g., 'Valid Parentheses') and optimization problems using a 'Monotonic Stack' (e.g., 'Daily Temperatures' or 'Next Greater Element').",
    implementations: {
      "C++": "#include <stack>\nstd::stack<int> s;\ns.push(1);\ns.pop();",
      "Java": "Stack<Integer> s = new Stack<>();\ns.push(1);\ns.pop();",
      "JavaScript": "const stack = [];\nstack.push(1);\nconst top = stack.pop(); // JS arrays act as stacks natively",
      "Python": "stack = []\nstack.append(1)\ntop = stack.pop()"
    },
    related: [
      { name: "Queue", path: "/learn/ds/queue" },
      { name: "Monotonic Stack", path: "/learn/ds/stack" }
    ]
  },
  "queue": {
    title: "Queue",
    summary: "A FIFO (First-In-First-Out) linear data structure.",
    badges: ["FIFO", "Linear", "O(1) Operations", "Restricted Access"],
    history: "Queues were formalized in the early 1900s by Agner Krarup Erlang, a Danish mathematician, when he studied phone calls in a telephone exchange network to determine wait times and queueing theory.",
    facts: [
      "Every time you click a key on your keyboard, the keystroke is placed into a hardware queue to ensure letters appear on screen in the exact order you typed them.",
      "Massive internet architectures rely entirely on 'Message Queues' (like Apache Kafka) to handle millions of asynchronous requests per second.",
      "The concept of 'fairness' in computer networking is literally implemented via queue algorithms."
    ],
    definition: "A queue is a linear data structure that rigidly follows the First-In-First-Out (FIFO) principle. Elements are added at the 'rear' and removed from the 'front'.",
    intuition: "Think of a line of people waiting to buy concert tickets. The first person to join the line is the first one to get a ticket. People cutting in line is not allowed.",
    why: "Queues exist to ensure fairness and ordered processing. They are the buffer between a fast producer and a slow consumer, ensuring no data is lost and everything is handled in the order it was received.",
    structure: "Can be implemented using a Linked List (where you enqueue at the tail and dequeue at the head) or a Circular Array to save memory.",
    engineeringRelevance: "Queues are the fundamental building block of asynchronous architecture. Whether it's a web server handling HTTP requests, a printer managing jobs, or a CPU scheduling threads, queues ensure systems process workloads smoothly without dropping tasks.",
    timeComplexity: [
      { op: "Enqueue", time: "O(1)", space: "O(1)", notes: "Add an element to the rear." },
      { op: "Dequeue", time: "O(1)", space: "O(1)", notes: "Remove an element from the front." },
      { op: "Peek / Front", time: "O(1)", space: "O(1)", notes: "View the front element without removing it." },
      { op: "Search", time: "O(n)", space: "O(1)", notes: "Requires dequeuing elements to find a specific value." }
    ],
    spaceComplexity: "O(n)",
    pros: [
      "Maintains the strict order of arrival (FIFO).",
      "Fast O(1) operations.",
      "Excellent for scheduling, buffering, and throttling systems."
    ],
    cons: [
      "Limited access (only front and rear are accessible).",
      "Basic array-based queues can waste space if not implemented circularly.",
      "Not suitable for searching."
    ],
    useCases: [
      "Task scheduling (CPU scheduling, print queues).",
      "Breadth-First Search (BFS) graph algorithms.",
      "Handling asynchronous requests (Message brokers).",
      "Streaming data buffers (video/audio streaming)."
    ],
    whereUsed: "Operating systems, web servers, router traffic management, asynchronous microservices.",
    whenToUse: "When you need to process items fairly in the exact order they were received, or when you need a buffer between systems operating at different speeds.",
    whenNotToUse: "When you need random access, or when you need to process the most recent items first (use a stack).",
    mistakes: [
      "Using a standard array/list and removing from the front, which causes terrible O(n) shifting in languages like JS/Python.",
      "Queue underflow (attempting to dequeue from an empty queue).",
      "Not handling the wrap-around logic correctly in circular array implementations."
    ],
    interview: "Medium/High. Very frequently used as an auxiliary data structure for BFS or level-order tree traversal.",
    implementations: {
      "C++": "#include <queue>\nstd::queue<int> q;\nq.push(1);\nq.pop();",
      "Java": "Queue<Integer> q = new LinkedList<>();\nq.offer(1);\nq.poll();",
      "JavaScript": "// WARNING: shift() is O(n).\n// Better to use a custom linked-list class or two stacks.\nconst queue = [];\nqueue.push(1);\nqueue.shift();",
      "Python": "from collections import deque\nq = deque()\nq.append(1)\nq.popleft()"
    },
    related: [
      { name: "Priority Queue", path: "/learn/ds/heap" },
      { name: "Deque", path: "/learn/ds/queue" },
      { name: "Stack", path: "/learn/ds/stack" }
    ]
  },
  "binary-tree": {
    title: "Binary Tree",
    summary: "A hierarchical data structure where each node has at most two children.",
    badges: ["Hierarchical", "Non-linear", "Max 2 Children", "Recursive"],
    history: "Trees in graph theory date back to the mid-19th century. Binary Search Trees (BSTs) were independently discovered in 1960 by P.F. Windley, A.D. Booth, A.J.T. Colin, and T.N. Hibbard as a method to vastly speed up computer searches.",
    facts: [
      "The entire HTML Document Object Model (DOM) of the webpage you are looking at right now is represented as a tree structure.",
      "In 3D video games, 'BSP Trees' (Binary Space Partitioning) are used to quickly calculate which polygons are visible to the camera, enabling fast rendering.",
      "Chess engines use massive game trees to evaluate future moves, pruning branches that lead to losing scenarios."
    ],
    definition: "A binary tree is a tree data structure in which each node has at most two children, distinctly referred to as the left child and the right child.",
    intuition: "Think of an organization chart or a family tree, but with a strict biological limit: every parent can have a maximum of exactly two descendants.",
    why: "Linear structures (arrays, lists) force a trade-off: fast searching requires slow insertion (sorted array), and fast insertion requires slow searching (linked list). Binary Search Trees solve this, offering fast O(log n) performance for both search AND insertion.",
    structure: "Consists of nodes. A node contains data, a pointer to the left child, and a pointer to the right child. The topmost node is called the 'root'. Nodes with no children are called 'leaves'.",
    engineeringRelevance: "Trees are the foundational architecture of databases. Specialized variants like B-Trees allow relational databases (like MySQL and PostgreSQL) to index billions of rows and return search results in milliseconds.",
    timeComplexity: [
      { op: "Search (BST)", time: "O(log n)", space: "O(log n)", notes: "Average case. Worst case is O(n) if the tree is completely unbalanced (skewed)." },
      { op: "Insertion (BST)", time: "O(log n)", space: "O(log n)", notes: "Average case. Worst case is O(n)." },
      { op: "Deletion (BST)", time: "O(log n)", space: "O(log n)", notes: "Average case. Worst case is O(n)." },
      { op: "Traversal", time: "O(n)", space: "O(h)", notes: "Visiting all nodes. Space is proportional to tree height (h) due to the call stack." }
    ],
    spaceComplexity: "O(n)",
    pros: [
      "Natural representation of hierarchical relationships.",
      "Provides extremely fast O(log n) operations for Search, Insert, and Delete (if balanced).",
      "Dynamic size, growing organically without memory reallocation overhead."
    ],
    cons: [
      "Standard BSTs can degrade to O(n) operations if data is inserted in sorted order (it literally becomes a linked list).",
      "Requires extra memory overhead for child pointers.",
      "Traversing and balancing logic is significantly more complex than linear arrays."
    ],
    useCases: [
      "Representing hierarchical data (file systems, folders, HTML DOM).",
      "Implementing Sets and Maps (via balanced variants like Red-Black Trees).",
      "Expression parsing (Expression Trees) in compilers.",
      "Decision trees in machine learning algorithms."
    ],
    whereUsed: "Databases (B-Trees), 3D graphics engines (BSP trees), routing algorithms, JSON/XML parsers.",
    whenToUse: "When your data naturally forms a hierarchy, or when you need sorted data that also supports extremely fast insertions and deletions.",
    whenNotToUse: "When you just need a simple unordered list, when memory is extremely limited, or if you only append to the end of a dataset.",
    mistakes: [
      "Forgetting base cases in recursive tree functions, leading to null reference errors.",
      "Not updating parent pointers properly during node deletion.",
      "Assuming a standard BST is always balanced in the real world."
    ],
    interview: "Extremely high. Trees are highly recursive by nature. You must master recursive/iterative traversals (In-order, Pre-order, Post-order), level-order (BFS) traversal, and structural manipulations (like inverting a tree).",
    implementations: {
      "C++": "struct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int x) : val(x), left(NULL), right(NULL) {}\n};",
      "Java": "class TreeNode {\n  int val;\n  TreeNode left, right;\n  TreeNode(int x) { val = x; }\n}",
      "JavaScript": "class TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = this.right = null;\n  }\n}",
      "Python": "class TreeNode:\n    def __init__(self, val=0):\n        self.val = val\n        self.left = None\n        self.right = None"
    },
    related: [
      { name: "Binary Search Tree", path: "/learn/ds/binary-tree" },
      { name: "AVL / Red-Black Tree", path: "/learn/ds/binary-tree" },
      { name: "Heap", path: "/learn/ds/heap" }
    ]
  },
  "graph": {
    title: "Graph",
    summary: "A non-linear structure consisting of nodes (vertices) connected by edges.",
    badges: ["Non-linear", "Network", "Nodes & Edges", "Directed/Undirected"],
    history: "The study of graphs began in 1736 when Leonhard Euler solved the famous 'Seven Bridges of Königsberg' problem. Euler proved it was impossible to walk through the city crossing each bridge exactly once, inventing Graph Theory in the process.",
    facts: [
      "The entire internet is essentially one gigantic, directed graph where webpages are nodes and hyperlinks are edges.",
      "Google's original PageRank algorithm determined search results by modeling the web as a graph and analyzing the density of edges (links) pointing to a node.",
      "GPS navigation apps use graph shortest-path algorithms to find the fastest route to your destination in milliseconds."
    ],
    definition: "A graph is a data structure consisting of a finite set of vertices (or nodes) and a set of edges that connect these vertices. It can be directed (one-way streets) or undirected (two-way streets), weighted (distance matters) or unweighted.",
    intuition: "Think of a map of airline flights. The cities are vertices, and the flight routes are the edges. Some flights go both ways (undirected), some are one-way (directed), and each has a flight time (weight).",
    why: "While trees represent strict hierarchies, graphs represent arbitrary, interconnected networks. They are the ultimate tool for modeling real-world relationships.",
    structure: "Typically represented in code using an Adjacency Matrix (a 2D array, great for dense graphs) or an Adjacency List (an array of lists/sets, great for sparse graphs).",
    engineeringRelevance: "Graphs power social networks (finding 'people you may know'), logistics and supply chain optimization, network packet routing protocols, and package dependency resolution (like npm or pip determining which libraries to install).",
    timeComplexity: [
      { op: "Add Vertex", time: "O(1)", space: "O(1)", notes: "Using an adjacency list." },
      { op: "Add Edge", time: "O(1)", space: "O(1)", notes: "Using an adjacency list or matrix." },
      { op: "Remove Edge", time: "O(E)", space: "O(1)", notes: "O(1) in matrix, O(E) in list to find the edge." },
      { op: "Traversal (BFS/DFS)", time: "O(V + E)", space: "O(V)", notes: "V = vertices, E = edges." }
    ],
    spaceComplexity: "O(V + E) for Adjacency List, O(V^2) for Adjacency Matrix.",
    pros: [
      "Incredibly versatile; can model almost any complex real-world network.",
      "Forms the basis of highly advanced optimization algorithms (shortest path, network flow).",
      "Can represent both hierarchical and cyclical relationships."
    ],
    cons: [
      "Can be highly memory intensive, especially if using a matrix for a sparse graph.",
      "Algorithms are often complex to implement, prone to off-by-one errors and infinite loops.",
      "Cycle detection and traversal require careful visited-state management."
    ],
    useCases: [
      "Social networks (friends, followers, connections).",
      "Routing and navigation systems (Google Maps, Waze).",
      "Recommendation engines (Netflix, Amazon).",
      "Dependency resolution (Package managers, build tools like Make)."
    ],
    whereUsed: "Network topologies, internet routing protocols (BGP, OSPF), compilers (dependency graphs, control flow graphs).",
    whenToUse: "When modeling any interconnected data, networks, state machines, or arbitrary pairwise relationships.",
    whenNotToUse: "When the relationships are strictly hierarchical (use a tree) or purely sequential (use an array/list).",
    mistakes: [
      "Infinite loops during traversal because you forgot to mark nodes as 'visited'.",
      "Choosing the wrong representation (e.g., using an O(V^2) space Matrix for a sparse graph).",
      "Not handling disconnected graph components properly during traversal."
    ],
    interview: "Very high. Must intimately know Breadth-First Search (BFS), Depth-First Search (DFS), cycle detection, Topological Sort, and Dijkstra's shortest path algorithm.",
    implementations: {
      "C++": "vector<vector<int>> adj(n); // Adjacency List\nadj[u].push_back(v);",
      "Java": "List<List<Integer>> adj = new ArrayList<>();\nfor(int i=0; i<n; i++) adj.add(new ArrayList<>());",
      "JavaScript": "const adj = new Map(); // Map vertices to arrays of neighbors\nadj.set(u, [v, w]);",
      "Python": "from collections import defaultdict\nadj = defaultdict(list)\nadj[u].append(v)"
    },
    related: [
      { name: "Directed Acyclic Graph", path: "/learn/ds/graph" },
      { name: "Tree", path: "/learn/ds/binary-tree" },
      { name: "Disjoint Set (Union-Find)", path: "/learn/ds/graph" }
    ]
  },
  "heap": {
    title: "Heap (Priority Queue)",
    summary: "A specialized tree-based structure that satisfies the heap property.",
    badges: ["Complete Binary Tree", "Min/Max Priority", "O(log n) Insert", "Array-backed"],
    history: "The heap data structure was invented in 1964 by J.W.J. Williams, specifically to implement the Heapsort sorting algorithm. It was quickly realized that it was also the perfect structure for priority queues.",
    facts: [
      "Despite being conceptualized as a tree, a heap is almost always implemented as a flat array in memory to maximize cache efficiency.",
      "The heap data structure has absolutely nothing to do with the 'Heap Memory' used for dynamic memory allocation in programming languages—it's just an unfortunate name collision.",
      "Dijkstra's shortest path algorithm is drastically sped up by using a Min-Heap to select the next closest node."
    ],
    definition: "A heap is a complete binary tree where the parent node is either always greater than or equal to (Max Heap) or less than or equal to (Min Heap) its children.",
    intuition: "Imagine a corporate ladder. In a Max Heap, the CEO (root) has the most power. Every manager has less power than their boss, but more power than their subordinates. If a new powerful executive joins, they 'bubble up' the ladder until they find their proper rank.",
    why: "Finding the maximum or minimum element in a standard array takes O(n) time. A heap keeps the min/max element at the very top, providing instant O(1) access, while keeping insertions and deletions blazing fast at O(log n).",
    structure: "A conceptual complete binary tree implemented as a flat Array. For any node at index `i`, its left child is at `2i + 1`, right child is at `2i + 2`, and its parent is at `floor((i - 1) / 2)`.",
    engineeringRelevance: "Heaps are the core mechanism behind Priority Queues. Operating systems use them heavily to schedule processes—ensuring high-priority system tasks get CPU time before low-priority background tasks.",
    timeComplexity: [
      { op: "Find Min/Max", time: "O(1)", space: "O(1)", notes: "The root of the tree is always at index 0." },
      { op: "Insert", time: "O(log n)", space: "O(1)", notes: "Add to end of array, then 'heapify up'." },
      { op: "Extract Min/Max", time: "O(log n)", space: "O(1)", notes: "Swap root with last element, remove last, then 'heapify down'." },
      { op: "Heapify (Build Heap)", time: "O(n)", space: "O(1)", notes: "Building a heap from an unsorted array takes exactly O(n) time, not O(n log n)." }
    ],
    spaceComplexity: "O(n)",
    pros: [
      "Instantaneous O(1) access to the highest or lowest priority element.",
      "Can be built from scratch in strictly O(n) time.",
      "Extremely memory efficient because it uses a plain array without any pointer overhead."
    ],
    cons: [
      "Searching for an arbitrary, non-root element is slow O(n).",
      "Not a fully sorted structure (only the root is guaranteed, the rest is just partially ordered).",
      "Deleting an arbitrary element is complex and slow."
    ],
    useCases: [
      "Implementing Priority Queues.",
      "CPU process scheduling in operating systems.",
      "Finding the K-th largest or K-th smallest element in a massive dataset.",
      "Optimizing Dijkstra's Shortest Path and Prim's Minimum Spanning Tree algorithms."
    ],
    whereUsed: "OS task schedulers, network bandwidth management, real-time event simulations.",
    whenToUse: "When you repeatedly need to fetch or process elements based on a priority (highest or lowest first) in a constantly changing dataset.",
    whenNotToUse: "When you need to search for specific elements frequently, or when you need data completely sorted at all times.",
    mistakes: [
      "Confusing 0-based indexing vs 1-based indexing when calculating child positions.",
      "Thinking a heap is a completely sorted array (it is not).",
      "Re-sorting the entire array upon insertion instead of using proper `heapify up` logic."
    ],
    interview: "High. Heaps are the absolute standard optimization for any problem asking for the 'Top K' elements, 'K-th largest', or merging multiple sorted lists.",
    implementations: {
      "C++": "#include <queue>\n// Max Heap by default\nstd::priority_queue<int> maxHeap;\n// Min Heap\nstd::priority_queue<int, vector<int>, greater<int>> minHeap;",
      "Java": "PriorityQueue<Integer> minHeap = new PriorityQueue<>();\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());",
      "JavaScript": "// JS lacks a built-in heap.\n// Usually requires writing a custom class or using a library.",
      "Python": "import heapq\nmin_heap = []\nheapq.heappush(min_heap, 5)\nmin_val = heapq.heappop(min_heap)\n# Python only has min-heap natively"
    },
    related: [
      { name: "Binary Tree", path: "/learn/ds/binary-tree" },
      { name: "Queue", path: "/learn/ds/queue" }
    ]
  },
  "hash-map": {
    title: "Hash Map",
    summary: "A data structure that maps keys to values for highly efficient lookups.",
    badges: ["Key-Value", "O(1) Average Lookup", "Hashing", "Unordered"],
    history: "The concept of hashing was first described by Hans Peter Luhn in 1953 in an internal IBM memorandum. Hash tables became widespread in the 1970s and 80s as memory capacities grew, revolutionizing database architectures.",
    facts: [
      "Under the hood, almost every object or dictionary in modern dynamic languages (like Python, JavaScript, and Ruby) is actually implemented as a Hash Map.",
      "Cryptographic hash functions (like SHA-256 used in Bitcoin) share the same mathematical roots as Hash Map functions, just optimized for security rather than speed.",
      "A Hash Map sacrifices memory efficiency to gain raw speed. It typically keeps a large percentage of its buckets completely empty to minimize collisions."
    ],
    definition: "A Hash Map (or Hash Table) implements an associative array abstract data type. It maps unique keys to specific values by using a mathematical 'Hash Function' to compute an index into an array of buckets.",
    intuition: "Think of an encyclopedia index. Instead of reading the entire book page-by-page to find 'Zebras', you look up 'Z' in the index and jump straight to page 402. The Hash Function acts as the index, telling you exactly where the data lives in memory.",
    why: "Linear searching takes O(n) time, which is disastrous for massive datasets. Hash Maps provide near-instantaneous O(1) data retrieval, insertion, and deletion on average, making them the ultimate tool for fast lookups.",
    structure: "An underlying array of 'buckets'. A hash function converts the string/object key into an integer index. When two keys hash to the same index (a 'collision'), they are stored together using a Linked List (Chaining) or by finding the next empty slot (Open Addressing).",
    engineeringRelevance: "Hash Maps are arguably the most used data structure in modern software engineering. They power in-memory caches (Redis, Memcached), database indexing, and JSON object representation. Almost all performance optimization eventually involves caching results in a Hash Map.",
    timeComplexity: [
      { op: "Search", time: "O(1)", space: "O(1)", notes: "Average case. Worst case is O(n) if the hash function is terrible and everything collides." },
      { op: "Insertion", time: "O(1)", space: "O(1)", notes: "Average case. Worst case is O(n) when the internal array needs to be resized (re-hashing)." },
      { op: "Deletion", time: "O(1)", space: "O(1)", notes: "Average case." }
    ],
    spaceComplexity: "O(n)",
    pros: [
      "Lightning-fast O(1) lookups, insertions, and deletions.",
      "Extremely flexible keys (can use strings, numbers, or complex objects depending on language support).",
      "Simplifies and drastically speeds up many complex algorithms (like turning an O(n^2) nested loop into an O(n) single loop)."
    ],
    cons: [
      "Fundamentally unordered data (unless using a specific variant like LinkedHashMap).",
      "Worst-case O(n) operations if the hash function is poor or the 'load factor' becomes too high.",
      "High memory footprint. Requires pre-allocating more memory than strictly necessary to prevent collisions."
    ],
    useCases: [
      "Caching layer architectures (Memcached, Redis).",
      "Counting frequencies of elements in an array.",
      "Removing duplicates from a massive dataset (Hash Set).",
      "Representing structured data objects (JSON)."
    ],
    whereUsed: "Under the hood of language primitives, database engines, and networking routing tables.",
    whenToUse: "Whenever you need extremely fast lookups by a specific identifier/key, or need to map relationships between distinct items.",
    whenNotToUse: "When you need to iterate over data in a sorted/alphabetical order, or when running on deeply embedded systems with extreme memory constraints.",
    mistakes: [
      "Using a mutable object as a key (if the object changes, its hash changes, and it is lost in the map forever).",
      "Writing a poor custom hash function that maps everything to the same bucket.",
      "Ignoring the load factor and causing massive execution delays during table re-sizing."
    ],
    interview: "Extremely high. 'Use a Hash Map' is the most common and powerful optimization technique in coding interviews to reduce time complexity from O(n²) down to O(n).",
    implementations: {
      "C++": "#include <unordered_map>\nstd::unordered_map<string, int> map;\nmap[\"key\"] = 1;",
      "Java": "HashMap<String, Integer> map = new HashMap<>();\nmap.put(\"key\", 1);",
      "JavaScript": "const map = new Map();\nmap.set('key', 1);\n// OR standard object:\nconst obj = { key: 1 };",
      "Python": "hash_map = {}\nhash_map['key'] = 1"
    },
    related: [
      { name: "Hash Set", path: "/learn/ds/hash-map" },
      { name: "Trie", path: "/learn/ds/trie" }
    ]
  },
  "trie": {
    title: "Trie (Prefix Tree)",
    summary: "A tree-like data structure specialized for storing and retrieving strings efficiently.",
    badges: ["Tree", "Strings", "Prefixes", "O(L) Search"],
    history: "The Trie was first conceptualized by René de la Briandais in 1959. The term 'Trie' was coined later by Edward Fredkin in 1960, derived from the middle syllable of the word 're-trie-val' (originally pronounced 'tree', though many pronounce it 'try' today).",
    facts: [
      "The predictive text on your smartphone keyboard is powered by a massive Trie mapping prefixes to common words.",
      "Unlike a Hash Map which takes O(1) to find a word but cannot easily find prefixes, a Trie naturally clusters words with identical prefixes together.",
      "IP routing tables on internet backbone routers use a specialized version of Tries to perform 'Longest Prefix Match' lookups at hardware speeds."
    ],
    definition: "A Trie is a specialized search tree used to store a dynamic set of strings. Unlike a standard search tree, nodes in a Trie do not store the key itself; instead, the path taken to reach the node physically defines the key/string.",
    intuition: "Think of flipping through a physical dictionary. If you are looking for 'CAT', you go to the 'C' section, then flip to the 'A' subsection, then find the 'T' words. A Trie structure exactly mirrors this progressive prefix filtering.",
    why: "While Hash Maps are great for exact-match string lookups, they are completely useless for finding all strings that *start with* a specific prefix. Tries solve prefix-matching natively and extremely efficiently.",
    structure: "A root node represents an empty string. Each outgoing edge represents a character. Each node can have multiple children (e.g., up to 26 for the English alphabet). A boolean flag at a node indicates if the path to that node forms a complete, valid word.",
    engineeringRelevance: "Tries are the absolute gold standard for building fast, scalable autocomplete search boxes and spell checkers. They trade heavy memory usage for incredibly fast string resolution that scales beautifully regardless of how many millions of words are stored.",
    timeComplexity: [
      { op: "Insertion", time: "O(L)", space: "O(L)", notes: "L is the length of the string." },
      { op: "Search (Exact Word)", time: "O(L)", space: "O(1)", notes: "L is the length of the string." },
      { op: "Search (Prefix)", time: "O(L)", space: "O(1)", notes: "Very fast prefix matching, independent of dictionary size." }
    ],
    spaceComplexity: "O(N * L * Alphabet_Size) where N is number of words, L is average length.",
    pros: [
      "Highly predictable O(L) lookup time, completely independent of how many millions of words are stored in the structure.",
      "The undisputed champion of prefix-matching operations.",
      "Can automatically sort strings alphabetically simply by traversing the tree in pre-order."
    ],
    cons: [
      "Extremely high memory footprint (every single node potentially contains an array or map of 26+ child pointers).",
      "Overkill and slower than a Hash Map if you absolutely never need to do prefix searches."
    ],
    useCases: [
      "Autocomplete and typeahead search suggestions.",
      "Spell checkers and autocorrect systems.",
      "IP routing tables (Longest prefix match).",
      "Solving complex word games (like Boggle or Scrabble solvers)."
    ],
    whereUsed: "Search engine input boxes, IDE code completion (IntelliSense), network routers.",
    whenToUse: "When dealing with massive dictionaries of words and you need to perform frequent prefix searches or autocomplete suggestions.",
    whenNotToUse: "When you only need exact string matching (use a Hash Map), or when running in memory-constrained environments where the massive pointer overhead is unacceptable.",
    mistakes: [
      "Allocating a massive fixed array of 256 characters per node when only 26 lowercase letters are needed, wasting enormous amounts of memory.",
      "Forgetting to properly set or check the `isEndOfWord` boolean flag.",
      "Using a Trie when a Hash Map would suffice for exact matches."
    ],
    interview: "Medium/High. Most commonly requested in System Design interviews (e.g., 'Design an autocomplete system') or in advanced string/matrix algorithm problems (like Word Search II).",
    implementations: {
      "C++": "struct TrieNode {\n  TrieNode* children[26] = {nullptr};\n  bool isWord = false;\n};",
      "Java": "class TrieNode {\n  TrieNode[] children = new TrieNode[26];\n  boolean isWord;\n}",
      "JavaScript": "class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isWord = false;\n  }\n}",
      "Python": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.isWord = False"
    },
    related: [
      { name: "Hash Map", path: "/learn/ds/hash-map" },
      { name: "Suffix Tree", path: "/learn/ds/trie" }
    ]
  }
};
