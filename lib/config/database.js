
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import { Low, JSONFile } from 'lowdb';


// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);


const connect = async () => {
    // Read data from JSON file, this will set db.data content
    await db.read();
    if (!db.data) {
        db.data = { posts: [] };
        // Write db.data content to db.json
        await db.write();
    }
};

export default {
    connect,
    db
};
