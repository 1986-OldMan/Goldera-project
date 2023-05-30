const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
})
const app = require('./app');

//Connect the project to online database.
const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);

mongoose.connect(DB , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {console.log('DB connection successful!')});

//Create a schema for products
const productSchema = new mongoose.Schema({
    name: {
        type: String ,
        required: [true , 'A product must have a name'] ,
        unique: true
    },

    price: {
        type: Number ,
        require: [true , 'A product must have a name']
    },

    id: {
        type: Number ,
        require: [true , 'A product must have an id']
    }
});

const Product = mongoose.model('Product' , productSchema);

const port = process.env.PORT || 8000;
app.listen(port , () => {
    console.log(`App running on port ${port}....`);
});