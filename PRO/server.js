const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
})
const app = require('./app');

//Connect the project to online database.
const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);

const startTime = new Date(); // Record the start time
mongoose.connect(DB , {
 //This option is used to enable the new MongoDB connection string parser. The MongoDB Node.js driver has a new parser that helps to parse MongoDB connection strings in a more robust way. Setting this option to true ensures that Mongoose uses the new parser.
    useNewUrlParser: true,
 //This option tells Mongoose to use the createIndex() method instead of the deprecated ensureIndex() method for creating indexes. The createIndex() method is the recommended approach for index creation in MongoDB.
   //  useCreateIndex: true,
 // By default, Mongoose uses the findOneAndUpdate() method when performing document updates. However, this method is deprecated in MongoDB. Setting useFindAndModify to false tells Mongoose to use the MongoDB driver's findOneAndUpdate() function directly instead, which avoids the deprecation warning.
   //  useFindAndModify: false,
 //This option enables the new MongoDB Server Discovery and Monitoring engine, which is used to monitor the MongoDB server and maintain a connection.
    useUnifiedTopology: true
    
}).then(() => {console.log('DB connection successful!')
 const endTime = new Date(); // Record the end time
 const connectionTime = endTime - startTime; // Calculate the time difference
 console.log(`Time taken to connect DB: ${connectionTime} ms`)});

const port = process.env.PORT || 8000;
app.listen(port , () => {
    console.log(`App running on port ${port}....`);
});