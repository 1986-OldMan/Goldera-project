const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
        required: [true , 'Field password confirmation is required'],
        validate: {
            //This only work on CREATE and SAVE!
            validator: function(el) {
                return el === this.password ;
            },
            message: 'Field password and password confirmation are not the same!'
        }
    },
});

/**
    * This is mongoose middleware with pre save middleware , basically document middleware 
    * Only run this function if password was actually modified!
    * Hash the password with cost of 13
    * The number "13" represents the cost factor used by the bcrypt hashing algorithm.
    * It specifies the number of rounds the algorithm will perform during the password hashing process.
    * Delete passwordConfirm field after hash the password
*/
userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password , 13);

    this.passwordConfirm = undefined;
});

const User = mongoose.model('User' , userSchema);

module.exports = User;