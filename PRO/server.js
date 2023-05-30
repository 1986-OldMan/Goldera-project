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
        required: [true , 'A product must have a name']
    },

    id: {
        type: Number ,
        required: [true , 'A product must have an id']
    }
});

//Creating documents and testing the model(Schema)
const Product = mongoose.model('Product' , productSchema);

const testProduct = new Product({
    name: 'King Charles III Britannia One Ounce Silver Coin 2023' ,
    price: 40 ,
    id: 1
});

//Testing the model

testProduct.save().then(doc => {console.log(doc)}).catch(err => {console.log('ERROR ---> :' , err)});

const port = process.env.PORT || 8000;
app.listen(port , () => {
    console.log(`App running on port ${port}....`);
});