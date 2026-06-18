const { GoogleGenAI } =require("@google/genai");

const solveDoubt=async(req,res)=>{

    try{
        const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
        console.log("AI client created");
        async function main() {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hello there",
            config: {
            systemInstruction: "You are a coding assistant strictly answer based on the given problems. if user asks anything unreleated answer hi as rudely as you can",
            },
        });
        console.log("Got AI response");
        return res.status(200).json({
                message: response.text,
                });
        }

        await main();
    }
    catch(err){
        res.status(500).send("Ai not available at this momnent"+err);
    }


}
module.exports=solveDoubt;