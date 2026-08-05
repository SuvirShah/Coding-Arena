const express=require("express");
const adminMiddleware=require("../middleware/adminMiddleware");
const userMiddleware=require("../middleware/userMiddleware");
const rateLimiter=require("../middleware/rateLimiter");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser, submittedProblem}=require("../controllers/userProblems")
const ProblemRouter=express.Router();


ProblemRouter.post('/create',adminMiddleware,rateLimiter,createProblem);
ProblemRouter.put('/update/:id',adminMiddleware,rateLimiter,updateProblem);
ProblemRouter.delete('/delete/:id',adminMiddleware,rateLimiter,deleteProblem);



ProblemRouter.get('/ProblemById/:id',userMiddleware,rateLimiter,getProblemById);
ProblemRouter.get('/getAllProblem',userMiddleware,rateLimiter,getAllProblem);
ProblemRouter.get('/ProblemSolvedByUser',userMiddleware,rateLimiter,solvedAllProblembyUser);
ProblemRouter.get('/submittedProblem/:pid',userMiddleware,rateLimiter,submittedProblem);


module.exports=ProblemRouter;