const mongoose=require("mongoose");

const {Schema}=mongoose;

const ProblemSchema=new Schema({
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard']
    },
    tags:{
        type:[String],
        required:true,
        enum:['array','linkedlist','dp','graph']
    },
    visibleTestCases:[{
        input:{
        type:String,
        required:true,
        },
        output:{
            type:String,
            required:true,

        },
        explanation:{
            type:String,
            required:true,
        }

    }
    ],
    hiddenTestCases:[{
        input:{
        type:String,
        required:true,
        },
        output:{
            type:String,
            required:true,

        }
    }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true,
            },
            boilerplate:{
                type:String,
                required:true,
            }
        }
    ] ,
    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true,
            }
        }
    ] ,
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }    
})

const Problem=mongoose.model('problem',ProblemSchema);

module.exports=Problem;