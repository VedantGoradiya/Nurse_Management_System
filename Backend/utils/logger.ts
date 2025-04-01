// This file contains the logger for the application

import winston from "winston";

// Defining the logger instance
const logger: winston.Logger = winston.createLogger({
    //Setting the level of the logger
    level: "debug",
    //Setting the format of the logger in specific format
    format: winston.format.combine(
        winston.format.timestamp({  
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [
        //Setting the format of the console logger
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        //Creating a file logger for the error logs
        new winston.transports.File({ filename: "error.log", level: "error" }),
        //Creating a file logger for the combined logs
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

export default logger;
