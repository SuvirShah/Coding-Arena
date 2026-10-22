const validator=require("validator");


const validate=(data)=>{

    const mandatoryField=['firstName','emailId','password'];
    const isAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed){
        
        throw new Error ("Required Fields Missing");
        
    }

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");
    if(!validator.isStrongPassword(data.password,{
        minLength:8,
        minLowercase:1,
        minUppercase:0,
        minNumbers:1,
        minSymbols:0
    }))
        throw new Error("Password must be at least 8 characters with at least one number");
    

}


module.exports=validate;