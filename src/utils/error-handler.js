const { createLogger, transports, format } = require("winston");
const { AppError } = require("./app-errors");

const LogErrors = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "app_error.log" }),
    ],
});

class ErrorLogger {
    async logError(err) {
        console.log(
            "======================== Start Error Logger ========================"
        );
        LogErrors.log({
            private: true,
            level: "error",
            message: `${new Date()} - ${JSON.stringify(err)}`,
        });
        console.log(
            "======================== End Error Logger ========================"
        );

        return false;
    }

    isTrustError(error) {
        if (error instanceof AppError) {
            return error.isOperational;
        } else {
            return false;
        }
    }
}

// Event handlers for unhandled exceptions and rejections
const errorLogger = new ErrorLogger();

process.on("unhandledRejection", (reason, promise) => {
    console.log(reason, "UNHANDLED REJECTION");
    errorLogger.logError(reason);
});

process.on("uncaughtException", (error) => {
    console.log(error, "UNCAUGHT EXCEPTION");
    errorLogger.logError(error);
    if (errorLogger.isTrustError(err)) {
        // process exist // need restart
    }
});

const ErrorHandler = async (err, req, res, next) => {
    if (err) {
        await errorLogger.logError(err);
        if (errorLogger.isTrustError(err)) {
            if (err.errorStack) {
                const errorDescription = err.errorStack;
                return res
                    .status(err.statusCode)
                    .json({ message: errorDescription });
            }
            return res.status(err.statusCode).json({ message: err.message });
        } else {
            // process exit // terriablly wrong with flow need restart
        }
        return res.status(err.statusCode).json({ message: err.message });
    }
    next();
};

module.exports = ErrorHandler;
