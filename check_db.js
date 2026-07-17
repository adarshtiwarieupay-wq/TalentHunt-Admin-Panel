const mongoose = require('mongoose');

const MONGODB_URI="mongodb+srv://adarshtiwarieupay_db_user:sLx31zWqLgxtgIb5@cluster0.zaozicx.mongodb.net/quiz?retryWrites=true&w=majority";

async function main() {
  await mongoose.connect(MONGODB_URI);
  
  const db = mongoose.connection.db;
  const questions = await db.collection('questions').find().limit(2).toArray();
  console.log(JSON.stringify(questions, null, 2));
  
  process.exit(0);
}

main().catch(console.error);
