const {getLanguageById,submitBatch,submitToken}=require("../utils/ProblemUtility");
const Problem=require("../models/problems");
const User=require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");

const createProblem=async(req,res)=>{
    const {title,description,difficulty,tags,visibleTestCases,
        hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;


    try{
        for(const {language,completeCode} of referenceSolution){
            const languageId=getLanguageById(language);



            const submissions = visibleTestCases.map((testcases)=>({
                source_code : completeCode,
                language_id : languageId,
                stdin: testcases.input,
                expected_output: testcases.output
            }));

            const submitResult=await submitBatch(submissions);


            const resultToken=submitResult.map((value)=>value.token);

            const testResult=await submitToken(resultToken);

            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error Occured");
                }
            }
        }
        const UserProblem=await Problem.create({
            ...req.body,
            problemCreator:req.result._id
        });
        res.status(201).send("Problem Saved Sucessfully");
    }
    catch(err){
        res.status(400).send(err);
    }

}
const updateProblem=async(req,res)=>{
    const {id}=req.params;
    const {title,description,difficulty,tags,visibleTestCases,
            hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;
    try{
        if(!id){
            return res.status(400).send("Missing ID Field");
        }
        const ProblemToUpdate=await Problem.findById(id);
        if(!ProblemToUpdate){
            return res.status(400).send("Problem Id not found"); 
        }
        for(const {language,completeCode} of referenceSolution){
            const languageId=getLanguageById(language);



            const submissions = visibleTestCases.map((testcases)=>({
                source_code : completeCode,
                language_id : languageId,
                stdin: testcases.input,
                expected_output: testcases.output
            }));

            const submitResult=await submitBatch(submissions);


            const resultToken=submitResult.map((value)=>value.token);

            const testResult=await submitToken(resultToken);

            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error Occured");
                }
            }
        }
        const UpdatedProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});

        res.status(200).send(UpdatedProblem);
    }
    catch(err){
        res.status(404).send("Error"+err);
    }
}
const deleteProblem=async(req,res)=>{
    const {id}=req.params;
    try{
        if(!id){
            return res.status(400).send("No Problem Id send");
        }
        const ProblemToBeDeleted=await Problem.findByIdAndDelete(id);
        if(!ProblemToBeDeleted){
            return res.status(404).send("No Such Problem Exsists");
        }
        res.status(200).send("Problem Sucessfully Deleted");
    }
    catch(err){
        res.status(500).send("ERROR:"+err.message);
    }
}
const getProblemById = async(req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("No Problem Id send");
        }
        
        // Determine if user has solved the problem or is admin
        let isSolvedOrAdmin = false;
        if (req.result && req.result._id) {
            const userId = req.result._id;
            const user = await User.findById(userId);
            if (user && (user.problemSolved.includes(id) || user.role === 'admin')) {
                isSolvedOrAdmin = true;
            }
        }

        let selectFields = '_id title description difficulty tags visibleTestCases startCode';
        if (isSolvedOrAdmin) {
            selectFields += ' referenceSolution';
        }

        const getRequestedProblem = await Problem.findById(id).select(selectFields).lean();
        
        if (!getRequestedProblem) {
            return res.status(404).send("No Such Problem Exsists");
        }

        // If solved/admin, also fetch video details if they exist
        if (isSolvedOrAdmin) {
            const video = await SolutionVideo.findOne({ problemId: id });
            if (video) {
                getRequestedProblem.secureUrl = video.secureUrl;
                getRequestedProblem.thumbnailUrl = video.thumbnailUrl;
                getRequestedProblem.duration = video.duration;
            }
        }

        res.status(200).send(getRequestedProblem);
    } catch(err) {
        res.status(500).send("Error: " + err);
    }
}
const getAllProblem=async(req,res)=>{
    try{
        const getProblems=await Problem.find({}).select('_id title description difficulty');
        if(getProblems.length==0){
            return res.status(404).send("No Such Problem Exsists");
        }
        res.status(200).json(getProblems);
    }
    catch(err){
        res.status(404).send("Error:"+err);
    }
}
const solvedAllProblembyUser=async(req,res)=>{
    try{
        const userId=(req.result._id);

        const user=await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"
        })
        res.status(200).send(user.problemSolved);
    }
    catch(err){
        res.status(500).send("Server Error:"+err);
    }
}
const submittedProblem=async(req,res)=>{
    try{
        const userId=req.result._id;
        const problemId=req.params.pid;
        const ans=await Submission.find({userId,problemId});

        if(ans.length==0){
            return res.status(200).send("No Submission made");
        }
        res.status(200).send(ans);

    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}
module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};