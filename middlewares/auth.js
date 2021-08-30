const jsonwebtoken = require('jsonwebtoken');
const userType = require('../constants/userType');
const User = require('../models/User');

const isToken = function (req, res, next){
    var token = req.headers.authorization.split(' ')
    if(typeof token[1] === 'undefined' || typeof token[1] === null){
        res.status(401).send({message: 'You are not logged in'})
    }
    else{
        jsonwebtoken.verify(token[1], 'shhhhh', (err, data) => {
            if(err){
                res.status(401).send({message: 'You are not logged in'})
            }
            else{
                req.token = token[1];
                req.email = data.user
                next()
            }
        })
    }
}

const isUser = function(req, res, next){
    User.findOne({email: req.email}, (err, user) => {
        if(err){
            res.status(401).send({message: 'You are not logged in'})
        }
        else{
            req.user = user;
            next()
        }
    })   
}

const isAdmin = function(req, res, next){
    // TODO add contants folder and add an enum or const file for user types and get the user type from there
    // if(req.user.role === userType.Admin)
    if(req.user.role === userType.Admin){
        next()
    }
    else
        res.status(401).send({message: 'You are not admin'})
}

module.exports = {isToken, isUser, isAdmin}