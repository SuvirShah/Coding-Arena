import { Route,Routes,Navigate } from "react-router"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import {checkAuth} from "./pages/authSlice";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import AdminHome from "./pages/AdminHome";
import AdminDeleteProblem from "./pages/AdminDeleteProblem";
import AdminUpdateProblem from "./pages/AdminUpdateProbelm";
import ProblemPage from "./pages/ProblemPage";
import AdminUpload from "./components/AdminUpload";
import AdminVideo from "./components/AdminVideo";

function App(){

  const dispatch=useDispatch();
  const {isAuthenticated,user,loading}=useSelector((state)=>state.auth);

  console.log(user?.role);
  console.log(isAuthenticated);
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch])

  if(loading){
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  }
  const isAdmin = isAuthenticated && user?.role?.toLowerCase() === "admin";
  return(
    <Routes>
      <Route path="/" element={isAuthenticated?<HomePage></HomePage>:<Navigate to='/signup'/>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to='/'/>:<Login/>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to='/'/>:<Signup/>}></Route>
      <Route path="/problem/:problemId" element={<ProblemPage />}/>
      <Route path="/admin" element={isAuthenticated&&isAdmin?<AdminHome/>:<Navigate to='/'/>}></Route>
      <Route path="/admin/create" element={isAuthenticated&&isAdmin?<AdminPanel/>:<Navigate to='/'></Navigate>}/>
      <Route path="/admin/update" element={isAuthenticated&&isAdmin?<AdminUpdateProblem/>:<Navigate to='/'/>}/>
      <Route path="/admin/delete" element={isAuthenticated&&isAdmin?<AdminDeleteProblem/>:<Navigate to='/'/>}/>
     <Route path="/admin/video" element={isAuthenticated && user?.role === "admin" ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === "admin" ? <AdminUpload /> : <Navigate to="/" />} />
    </Routes>
  )
  console.log({isAuthenticated,loading});
}

export default App
