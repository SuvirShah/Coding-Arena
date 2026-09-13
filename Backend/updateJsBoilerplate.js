const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');

async function updateBoilerplates() {
    try {
        const mongoUri = process.env.DB_CONNECT_STRING || process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('No mongo URI found in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        const problemsCollection = mongoose.connection.db.collection('problems');
        const jsBoilerplate = "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    // Write your code here\n}\n\nsolve();";

        const problems = await problemsCollection.find({}).toArray();
        console.log(`Found ${problems.length} problems.`);

        for (const p of problems) {
            let updatedStartCode = (p.startCode || []).map(sc => {
                if (sc.language?.toLowerCase() === 'javascript' || sc.language?.toLowerCase() === 'js') {
                    return { ...sc, boilerplate: jsBoilerplate };
                }
                return sc;
            });

            if (!updatedStartCode.some(sc => sc.language?.toLowerCase() === 'javascript' || sc.language?.toLowerCase() === 'js')) {
                updatedStartCode.push({ language: 'javascript', boilerplate: jsBoilerplate });
            }

            await problemsCollection.updateOne({ _id: p._id }, { $set: { startCode: updatedStartCode } });
            console.log(`Updated problem: ${p.title || p._id}`);
        }

        console.log('Database update completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateBoilerplates();
