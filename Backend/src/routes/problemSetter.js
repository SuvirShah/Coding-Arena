const express=require("express");
const adminMiddleware=require("../middleware/adminMiddleware");
const userMiddleware=require("../middleware/userMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser, submittedProblem}=require("../controllers/userProblems")
const ProblemRouter=express.Router();


ProblemRouter.post('/create',adminMiddleware,createProblem);
ProblemRouter.put('/update/:id',adminMiddleware,updateProblem);
ProblemRouter.delete('/delete/:id',adminMiddleware,deleteProblem);



ProblemRouter.get('/ProblemById/:id',userMiddleware,getProblemById);
ProblemRouter.get('/getAllProblem',userMiddleware,getAllProblem);
ProblemRouter.get('/ProblemSolvedByUser',userMiddleware,solvedAllProblembyUser);
ProblemRouter.get('/submittedProblem/:pid',userMiddleware,submittedProblem);


module.exports=ProblemRouter;