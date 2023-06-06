//------>IMPORTANT, THIS JS FILE IS ONLY FOR IMPORT/DELETE DATA FROM DB(DATABASE), FROM YOUR JSON FILE WITHIN THE PROJECT!<------
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Require the model of your DB and location to be specified
const Product = require('./../../models/productModel');

dotenv.config({
    path: './config.env'
})

//Connect the project to online database.
const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);

mongoose.connect(DB , {
 //This option is used to enable the new MongoDB connection string parser. The MongoDB Node.js driver has a new parser that helps to parse MongoDB connection strings in a more robust way. Setting this option to true ensures that Mongoose uses the new parser.
    useNewUrlParser: true,
 //This option tells Mongoose to use the createIndex() method instead of the deprecated ensureIndex() method for creating indexes. The createIndex() method is the recommended approach for index creation in MongoDB.
    useCreateIndex: true,
 // By default, Mongoose uses the findOneAndUpdate() method when performing document updates. However, this method is deprecated in MongoDB. Setting useFindAndModify to false tells Mongoose to use the MongoDB driver's findOneAndUpdate() function directly instead, which avoids the deprecation warning.
    useFindAndModify: false,
 //This option enables the new MongoDB Server Discovery and Monitoring engine, which is used to monitor the MongoDB server and maintain a connection.
    useUnifiedTopology: true
    
}).then(() => {console.log('DB connection successful!')});

//<------Start to implement how to import/delete your data from DB(DATABASE)------>
// Read json file with fs
const products = JSON.parse(fs.readFileSync(`${__dirname}/products-simple.json` , 'utf-8'));

// Import Data into DB
const importData = async() => {
    try {
        await Product.create(products)
        console.log('Data successfully loaded in DB!');
    } catch (err) {
        console.log(err);
    }
    // The process.exit() function is a method in Node.js that terminates the current process and exits the program. 
    //When called, it immediately stops the execution of the program and returns the control back to the operating system.
    process.exit();
};

//Delete all data from DB
const deleteData = async () => {
    try {
        await Product.deleteMany();
        console.log('Data successfully deleted from DB!');
    }catch (err) {
        console.log(err);
    }
    process.exit();
};

// First write this in code console.log(process.argv);
   console.log(process.argv);

// process. argv is a property that holds an array of command-line values provided when the current process was initiated.
// The first element in the array is the absolute path to the Node, 
// followed by the path to the file that's running and finally any command-line arguments provided when the process was initiated.

// After to see in terminal the proccess of argv in array, write node dev-data/data/import-dev-data.js,
// after in terminal will see this : 
// [
    'C:\\PROGRAM_FILES\\nodejs\\node.exe' , [0]
    'C:\\USERS\\USER_NAME_PC\\FOLDER_NAME\\LOCATION_PROJECT\\PROJECT_NAME\\pro\\dev-data\\data\\import-dev-data.js' , [1]
// ]

// and after added a new position in array with write this in terminal dev-data/data/import-dev-data.js --import and in terminal will se this

//[
    'C:\\PROGRAM_FILES\\nodejs\\node.exe', [0]
    'C:\\USERS\\USER_NAME_PC\\FOLDER_NAME\\LOCATION_PROJECT\\PROJECT_NAME\\pro\\dev-data\\data\\import-dev-data.js' , [1]
    '--import' , [2]
// ]

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

// after that two types of commands will be used in the terminal :
// node dev-data/data/import-dev-data.js --delete = to delete data from DB
// node dev-data/data/import-dev-data.js --import = to import data into DB