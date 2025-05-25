export const errorHandler = (statusCode,message)=> {
    //statusCode is the error code we want to send to the client
    //message is the error message we want to send to the client
    //this function will return an error object with the statusCode and message
    //this error object will be used by the express error handler to send the error response to the client
    //if we want to send a custom error response to the client, we can use this function
    //this function will be used in the controllers to send the error response to the client
    //custom error handler - error created by us : a manual error
    const error = new Error()
    error.statusCode = statusCode;
    error.message = message;
    return error;
};  