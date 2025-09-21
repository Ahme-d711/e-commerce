export default class AppError extends Error {
    status: number;
    isOperational: boolean;

    constructor(message: string, status: number){
        super(message);

        this.status = status,
        this.isOperational = true,

        Object.setPrototypeOf(this, new.target.prototype);

        Error.captureStackTrace(this)
    }
}