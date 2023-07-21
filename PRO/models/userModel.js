const mongoose = require('mongoose');
const validator = require('validator');
const {Schema} = mongoose;

/**
    * @author Alexandru Ivanescu <ivanescu.alexandru01@gmail.com>.
    * Create schema for User using mongoose and mongodb.
    * Type: Schema.Types.Mixed - it's to used in schema number or string in the same place.
*/

const userSchema = new mongoose.Schema({

    name: {
        type: String ,
        required: [true , 'Please tell us your name!'],
        unique: true
    },

    email: {
        type: String ,
        required: [true , 'Filed email is require'],
        unique: true,
        lowercare: true,
        validate: [validator.isEmail , 'Please provide a valid email']
    },

    photo: String ,

    password: {
        type: Schema.Types.Mixed ,
        required: [true , 'Filed Password is required'],
        minlength: 8
    },

    passwordConfirm: {
        type: Schema.Types.Mixed ,
        required: [true , 'Field password confirmation is required']

    },
});
const User = mongoose.model('User' , userSchema);

module.exports = User;