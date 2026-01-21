exports.triggerError = (req, res, next) => {
    const error = new Error("This is a 500 intentional test error!");
    error.status = 500;
    next(error);
};
