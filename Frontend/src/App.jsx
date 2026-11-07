import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, Navigate, useLocation, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./pages/authSlice";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Everything except the two entry screens is loaded on demand, so a visitor on the login page
// doesn't download the code editor, the visualizers and the admin tools.
const HomePage = lazy(() => import("./pages/HomePage"));
const ProblemPage = lazy(() => import("./pages/ProblemPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminHome = lazy(() => import("./pages/AdminHome"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminUpdateProblem = lazy(() => import("./pages/AdminUpdateProbelm"));
const AdminDeleteProblem = lazy(() => import("./pages/AdminDeleteProblem"));
const AdminVideo = lazy(() => import("./components/AdminVideo"));
const AdminUpload = lazy(() => import("./components/AdminUpload"));
const VisualizerApp = lazy(() => import("./pages/Visualizer/VisualizerApp"));
const NotFound = lazy(() => import("./pages/NotFound"));

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200" role="status" aria-label="Loading">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
}

// Logged-out visitors are sent to `redirectTo`, remembering where they were headed
function RequireAuth({ children, redirectTo = "/login" }) {
  const { isAuthenticated, wasAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    // Someone who was logged in a moment ago (logout, expired session) already has an account:
    // send them to login (where any explanation is shown), not to sign up.
    return <Navigate to={wasAuthenticated ? "/login" : redirectTo} replace state={{ from: location }} />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (user?.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Login/Signup: once logged in, continue to the page the user originally wanted
function PublicOnly({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }
  return children;
}

// key={problemId}: going from one problem to another starts the page fresh
function ProblemRoute() {
  const { problemId } = useParams();
  return <ProblemPage key={problemId} />;
}

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { initializing } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Only the very first "am I logged in?" check blocks the screen. Login/signup/logout
  // requests no longer unmount the page (that used to wipe the form and its error message).
  if (initializing) {
    return <FullPageSpinner />;
  }

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<FullPageSpinner />}>
        <Routes>
          <Route path="/" element={<RequireAuth redirectTo="/signup"><HomePage /></RequireAuth>} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/problem/:problemId" element={<RequireAuth><ProblemRoute /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><AdminHome /></RequireAdmin>} />
          <Route path="/admin/create" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
          <Route path="/admin/update" element={<RequireAdmin><AdminUpdateProblem /></RequireAdmin>} />
          <Route path="/admin/delete" element={<RequireAdmin><AdminDeleteProblem /></RequireAdmin>} />
          <Route path="/admin/video" element={<RequireAdmin><AdminVideo /></RequireAdmin>} />
          <Route path="/admin/upload/:problemId" element={<RequireAdmin><AdminUpload /></RequireAdmin>} />
          <Route path="/visualizer/*" element={<VisualizerApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;