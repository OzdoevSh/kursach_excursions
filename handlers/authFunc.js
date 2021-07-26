"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = function (req, res, next) {
    if (req.session.status === true) {
        return next();
    }
    else {
        res.redirect('/registration');
    }
};
