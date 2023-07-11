/**
 * Inside the exported function, it calls the fn function passed as an argument. This fn function is expected to return a promise.
 * The code then uses the catch method to handle any errors that may occur during the execution of the promise. 
 * If an error occurs, it passes the error to the next function, which triggers the error-handling middleware in Express.
 * In summary, this code is a wrapper for asynchronous Express middleware functions that automatically handles any errors that occur during their execution.
 * It ensures that errors are properly propagated to the error-handling middleware.
*/
module.exports = fn => {
    return (req , res , next) => {
        fn(req , res , next).catch(next);
    };
};