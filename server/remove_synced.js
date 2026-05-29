require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(async () => {
  const db = mongoose.connection.db;
  
  // Since we don't have isSynced in the schema anymore, we can delete documents 
  // that have a githubLink starting with github.com or isSynced equal to true, 
  // or we can just fetch and print them to be safe before we delete.
  
  const res = await db.collection('projects').deleteMany({
    $or: [
      { isSynced: true },
      { githubLink: { $exists: true, $ne: "" } }
    ]
  });
  console.log('Deleted synced projects:', res.deletedCount);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
