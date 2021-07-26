import express = require('express');

export const auth = (req: any, res: express.Response, next: any) => {
    if (req.session.status === true) {
        return next();
    }
    else {
        res.redirect('/registration');
    }
}