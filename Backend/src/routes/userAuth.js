const express=require("express");
const {register , login, logout,adminRegister, deleteProfile,checkUser }=require("../controllers/userAuthen");
const authRouter=express.Router();
const userMiddleware=require("../middleware/userMiddleware")
const adminMiddleware=require("../middleware/adminMiddleware");

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
// authRouter.post('/getProfile',getProfile);
authRouter.post('/deleteProfile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,checkUser);


module.exports=authRouter;