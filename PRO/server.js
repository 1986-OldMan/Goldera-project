const mongoose = require('mongoose');
const dotenv = require('dotenv');

/**
  * Error Handling: Uncaught Exception
  * This event listener captures uncaught exceptions that occur during the execution of the Node.js application.
  * When an uncaught exception is encountered, the event listener logs a message indicating the occurrence of an uncaught exception
    * and outputs the error details (name and message) to the console for diagnostic purposes.
  * The Node.js process is then exited with an exit code of 1, indicating an abnormal termination due to the uncaught exception.
  *Additionally, consider using a crash reporting service to collect and analyze uncaught exceptions in production environments.
*/

process.on('uncaughtException' , err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name , err.message);
  process.exit(1)
});

dotenv.config({
    path: './config.env'
});
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
    
}).then(() => {console.log('DB connection successful! 🧮');
  if(process.env.NODE_ENV === 'development') {
    const endTime = new Date(); // Record the end time
    const connectionTime = endTime - startTime; // Calculate the time difference
    console.log(`Time taken to connect DB: ${connectionTime} ms`)};
});

const port = process.env.PORT || 8000;
const server = app.listen(port , () => {
    console.log(`App running on port ${port} 🗄️....`);
});

/**
  * Error Handling: Unhandled Rejection
  * This event listener captures unhandled promise rejections that may occur during database operations.
  * When an unhandled rejection happens, the event listener logs the error details (name and message) to the console,
    * outputs a message indicating the occurrence of an unhandled rejection, and gracefully shuts down the server (if running).
  * The Node.js process is then exited with an exit code of 1, indicating an abnormal termination due to the unhandled rejection.
  * Properly handling promise rejections at the source of the issue is recommended to prevent unhandled rejections.
*/

process.on('unhandledRejection' , err => {
  console.log(err.name , err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
      process.exit(1)
  });
});