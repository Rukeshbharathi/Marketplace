// Error Handler Middleware
const errorMiddleware = (err, req, res, next) => {
    // Default status code
    let statusCode = res.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Custom Error Handling
    if (err.name === "ValidationError") {
        // Handle Mongoose Validation Errors (e.g., missing required fields)
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        // Handle JWT Token Errors
        statusCode = 401;
        message = "Invalid or expired token";
    } else if (err.name === "CastError") {
        // Handle Cast Errors (invalid MongoDB ObjectID format)
        statusCode = 400;
        message = `Invalid ID format: ${err.value}`;
    } else if (err.name === "MongoError" && err.code === 11000) {
        // Handle MongoDB duplicate key errors
        statusCode = 400;
        message = "Duplicate key error: Value already exists";
    }

    // Log error to the console (for debugging purposes)
    console.error(err.stack);

    // Send error response
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
    });
};

export default errorMiddleware;
