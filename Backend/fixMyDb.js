const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const mongoose = require('mongoose');

async function cleanDB() {
    try {
        const mongoUri = process.env.DB_CONNECT_STRING || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("Missing MongoDB connection string in environment variables (DB_CONNECT_STRING or MONGO_URI).");
        }
        await mongoose.connect(mongoUri);
        const db = mongoose.connection.db;
        const problemsCollection = db.collection('problems');

        // Overwrite startCode and referenceSolution to strictly match the schema
        await problemsCollection.updateMany({}, {
            $set: {
                startCode: [
                    { language: "c++", boilerplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}" },
                    { language: "java", boilerplate: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}" },
                    { language: "javascript", boilerplate: "function solve() {\n    // Write your code here\n}\n\nsolve();" }
                ],
                referenceSolution: [
                    { language: "c++", completeCode: "// solution" },
                    { language: "java", completeCode: "// solution" },
                    { language: "javascript", completeCode: "// solution" }
                ]
            }
        });

        console.log("SUCCESS: Database cleaned to 3 items using 'boilerplate'!");
        process.exit(0);
    } catch (err) {
        console.error("Error cleaning database:", err);
        process.exit(1);
    }
}

cleanDB();
