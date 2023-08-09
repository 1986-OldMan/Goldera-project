const crypto = require('crypto');
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

    role: {
        type: String ,
        enum: ['user' , 'seller' , 'supervisor' , 'admin'],
        default: 'user',
      },

    password: {
        type: Schema.Types.Mixed ,
        required: [true , 'Filed Password is required'],
        minlength: 8,
        select: false
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

    passwordChangedAt: {
        type: Date 
    },

    passwordResetToken: String ,
    passwordResetExpires: Date
    
});

/**
    * This is mongoose middleware with pre save middleware , basically document middleware 
    * Only run this function if password was actually modified!
    * Hash the password with cost of 13
    * The number "13" represents the cost factor used by the bcrypt hashing algorithm.
    * It specifies the number of rounds the algorithm will perform during the password hashing process.
    * Delete passwordConfirm field after hash the password
    * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password , 13);

    this.passwordConfirm = undefined;
});

/**
    * Define a method called 'correctPassword' on the userSchema to securely compare passwords.
    * This method is used to check if a given 'candidatePassword' matches the hashed 'userPassword'
    * Use bcrypt.compare to securely compare the provided candidatePassword.
    *  with the hashed userPassword stored in the database.
    *  bcrypt.compare returns a Promise, so we use 'await' to wait for the result.
    * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/

userSchema.methods.correctPassword = async function(candidatePassword , userPassword) {
    return await bcrypt.compare(candidatePassword , userPassword);
};

/**
    * In summary, this method is used to check if a given JWT timestamp is earlier than the timestamp when the user last changed their password.
    * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

  /**
    * crypto.randomBytes(32).toString('hex'): This line generates 32 random bytes and converts them to a hexadecimal string.
    * crypto.createHash('sha256').update(resetToken).digest('hex'): This line takes the random token generated in the previous step and computes its SHA-256 hash. 
    * The hashed token is then stored in the passwordResetToken field of the document.
    * his.passwordResetExpires = Date.now() + 10 * 60 * 1000;: This line sets the passwordResetExpires field to the current time (in milliseconds) plus 10 minutes. This means the token will expire after 10 minutes from the time it was generated.
    * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
 */
  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({resetToken} , this.passwordResetToken);
    return resetToken;
};

  /**
    * this section is a middleware to see if password is not changed or is create a new user.
    * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
 */
userSchema.pre('save' , function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

const User = mongoose.model('User' , userSchema);

module.exports = User;