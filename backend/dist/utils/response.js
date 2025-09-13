"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendValidationError = exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message, statusCode = 200) => {
    const response = {
        success: true,
        message,
        data
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, error, statusCode = 400, errors) => {
    const response = {
        success: false,
        error,
        errors
    };
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
const sendValidationError = (res, errors, message = 'Validation failed') => {
    return (0, exports.sendError)(res, message, 422, errors);
};
exports.sendValidationError = sendValidationError;
//# sourceMappingURL=response.js.map