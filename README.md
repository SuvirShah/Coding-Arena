# Technical Architecture & Project Documentation: CodeArena

## 1. Project Overview

CodeArena is a full-stack competitive programming platform and Data Structures & Algorithms (DSA) visualizer. Designed to simulate the core functionality of enterprise platforms like LeetCode, it allows users to write, execute, and evaluate code against hidden test cases in a secure environment. The platform includes advanced features such as an interactive DSA workspace, AI-assisted coding hints, and video solutions.

## 2. Technology Stack Selection

### Frontend Architecture

* **Framework:** React.js paired with React Router for Single Page Application (SPA) navigation.
* **State Management:** Redux Toolkit (RTK) and RTK Query. RTK Query was chosen over standard `fetch` or `axios` because it provides built-in request deduplication, automated cache invalidation, and seamless loading/error state management out of the box.
* **Styling:** Tailwind CSS. The platform utilizes a custom global theme (Deep Charcoal `#0f0d0a` and Vibrant Gold `#ffd700`) applied via Tailwind utility classes to ensure a consistent, premium dark-mode aesthetic without heavy CSS file overhead.

### Backend Architecture

* **Runtime & Framework:** Node.js with Express.js. Express was selected for its minimal overhead, massive middleware ecosystem, and non-blocking I/O, which is crucial for handling thousands of asynchronous code execution requests.
* **Database:** MongoDB (Mongoose Object Data Modeling).
* **In-Memory Store:** Redis.
* **Third-Party APIs:** Judge0 (Code Execution Sandbox).

## 3. Database Strategy: Why MongoDB?

MongoDB was selected as the primary database over a traditional SQL relational database for several critical architectural reasons:

1. **Schema Flexibility:** A coding problem inherently contains highly nested and variable data structures. A single problem might have varying constraints, multiple language stubs, and complex array-based test cases (inputs, expected outputs, hidden flags).
2. **JSON Native:** MongoDB stores data in BSON (Binary JSON), which maps perfectly to the JavaScript objects used in Node.js and React. This eliminates the need for complex ORM mapping or heavy SQL `JOIN` operations when fetching a problem and its associated test cases.
3. **Horizontal Scalability:** As the platform scales to handle thousands of user submissions and problem sets, MongoDB's native sharding capabilities provide a straightforward path to scaling out database reads and writes.

## 4. Authentication & Authorization Lifecycle

Security and access control are handled entirely within the backend to prevent client-side manipulation.

### Authentication (Proving Identity)

Authentication is implemented using **JSON Web Tokens (JWT)**.

* Upon successful login, the server generates a signed JWT containing the user's basic identifying payload.
* This token is passed back to the client and stored in an **HTTP-only, secure cookie** via the `cookie-parser` middleware.
* **Why HTTP-only?** Storing tokens in `localStorage` makes them highly vulnerable to Cross-Site Scripting (XSS) attacks. An HTTP-only cookie cannot be accessed by client-side JavaScript, effectively neutralizing XSS token theft.

### Authorization (Granting Access)

Authorization is enforced using Role-Based Access Control (RBAC) via custom Express middleware (`userMiddleware` and `adminMiddleware`).

* When a request hits a protected route (e.g., submitting code or creating a new problem), the middleware intercepts the request.
* It extracts the JWT from the cookie, verifies the cryptographic signature, and checks the user's role.
* If a standard user attempts to access the `/problem` setter routes (which require Admin privileges), the middleware rejects the request with a `403 Forbidden` status before the controller logic ever executes.

## 5. Integrations & Micro-Services

### Code Execution Engine (Judge0)

Running untrusted, user-submitted code directly on the host server is a massive security risk. To solve this, the application delegates code execution to the **Judge0 API**, an open-source, heavily sandboxed execution environment.

* **Integration Flow:** The frontend sends the source code, language ID, and test cases to the Express backend (`/submission` route). The backend proxies this request to Judge0.
* **Polling & Safety Limits:** Code compilation and execution are asynchronous and take time. The backend polls the Judge0 API for the result. To prevent the Node.js event loop from hanging infinitely if the Judge0 server fails, the while-loop implements a strict maximum attempt counter (e.g., 15 attempts with a 1-second delay). If unresolved, it gracefully returns a "Time Limit Exceeded" or server error to the frontend.

### Additional Integrations

* **AI Chatbot (`/ai`):** An integrated AI route designed to act as a coding tutor. It analyzes the user's current code state and provides hints or syntax corrections without directly revealing the solution.
* **Video Solutions (`/video`):** A dedicated route for serving and managing metadata for video walkthroughs of complex algorithms.

## 6. Performance Optimization: Redis Caching

To optimize performance and reduce database load, **Redis** is implemented as an in-memory caching layer.

* **Implementation:** When a user requests the global problem list or a static problem description, the backend first checks the Redis cache. If a cache miss occurs, it queries MongoDB, returns the data, and stores the result in Redis with a Time-To-Live (TTL) expiration.
* **Benefits:** Database queries that normally take 100-200ms are reduced to sub-millisecond retrieval times. This drastically lowers the Time to First Byte (TTFB) on the frontend and protects the MongoDB cluster from unnecessary read-heavy loads during traffic spikes.

## 7. Security: Redis Rate Limiting

Public APIs are highly vulnerable to Denial of Service (DoS) attacks, brute-force logins, and API abuse (especially expensive routes like Judge0 executions and AI completions).

* **Implementation:** The backend utilizes Redis to implement rate limiting, typically using a Token Bucket or Sliding Window algorithm. Redis tracks the IP address or User ID and atomically increments a request counter (`INCR`) with an expiration timer (`EXPIRE`).
* **Benefits:** If a user exceeds the allowed threshold (e.g., more than 5 code submissions per minute), Redis blocks the request instantly, and Express returns a `429 Too Many Requests` status. Because Redis operates in-memory, this check happens with near-zero latency penalty to legitimate users.

## 8. General Backend Security Measures

Beyond authentication and rate limiting, the Express application implements several industry-standard security layers:

* **Helmet.js:** Automatically sets secure HTTP headers (e.g., Strict-Transport-Security, X-Frame-Options) to protect against clickjacking and cross-site scripting.
* **Strict CORS Configuration:** Cross-Origin Resource Sharing is locked down to explicitly allow requests only from trusted domains (e.g., `localhost:5173` and the production Vercel `.app` domain).
* **Payload Limitations:** `express.json({limit: '50kb'})` ensures that malicious actors cannot send massive JSON payloads designed to crash the Node.js process by consuming all available memory.
* **Mass Assignment Protection:** When creating or updating database records, controllers strictly destructure `req.body` to only extract expected fields (title, description, testCases). This prevents attackers from injecting unauthorized database fields (like `role: "admin"`).

## 9. Infrastructure & Deployment Architecture

The platform is deployed using a decoupled, highly available architecture:

* **Frontend Distribution:** Hosted on Vercel. This provides a global CDN, edge-caching, automated CI/CD directly from GitHub, and zero cold-start latency.
* **Backend Hosting (Dual Strategy):**
* **Development / Free Tier:** Hosted on Render for daily development. An external UptimeRobot monitor pings a dedicated `/health` route every 5 minutes to bypass Render's 15-minute inactivity sleep cycle.
* **Production / High Performance:** Deployed on an AWS EC2 instance. The Node.js application is reverse-proxied behind Nginx and secured with HTTPS via Let's Encrypt (Certbot). This ensures a high-performance environment with zero cold starts during critical usage periods (such as interviews or presentations).
