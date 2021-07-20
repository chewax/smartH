(function(){
    
    const {join} = require ('path');
    const low = require('lowdb');
    const fileAsync = require('lowdb/lib/adapters/JSONFileSync');

    import { Low, JSONFile } from 'lowdb'

    // Use JSON file for storage
    const file = join(__dirname, 'db.json')
    const adapter = new JSONFile(file)
    const db = new Low(adapter)

    module.exports.connect = async () => {
    // Read data from JSON file, this will set db.data content
        await db.read();
        if (!db.data) {
            db.data = { posts: [] };
            // Write db.data content to db.json
            await db.write();
        }
}


}).call(this);
