const express = require('express');
var router = express.Router();
var passport = require('passport');
const localStrategy = require('../../config/passport');
const User = require('../../models/User');
const auth = require('../../middlewares/auth');
const app = express();

passport.use(localStrategy);
router.use(passport.initialize());

router.post('/login', passport.authenticate('local', {session:false}), (req, res) => {
    req.user.generateToken()
    res.status(200).send({status:200, token: req.user.token, data: req.user, message: 'Welcome, You have logged in successfully'})
})

router.get('/',auth.isToken,auth.isUser,(req,res)=>{
    res.status(200).send({status: 200, token:req.token, data: req.user});
})

router.delete('/delete/:email',auth.isToken,auth.isUser,auth.isAdmin,(req,res)=>{
    User.findOneAndDelete({email:req.params.email},function(err,data){
        if(err || data === null){
            res.status(203).send({message:'User does not exist'});
        }else{
            res.status(200).send({message:'User deleted from the system'});
        }
    })
})
router.put('/update',auth.isToken,auth.isUser,(req,res)=>{
    User.findOne({email: req.email}, (err, user) => {
        if(!err && user !== null){
            if(!user.comparePassword(req.body.oldPassword)){
                res.status(203).send({message:'Old Password is Incorrect'})
            }
            else{
                user.name = req.body.newName
                user.setPassword(req.body.newPassword)
                user.save()
                res.status(203).send({message:'User updated successfully'})
            }
        }
    })
})

router.post('/signup', (req, res) => {
    let user = User()
    user.name = req.body.name
    user.email = req.body.email
    user.setPassword(req.body.password)
    user.role=1
    user.save((err, result) => {
        if(!err){
            user.generateToken()
            res.status(200).send({status: 200, token: user.token, data: user, message: 'New Customer has been added'})
        }
        else{
            console.log(err)
            res.status(203).send({message: 'Email exists, try another one'})
        }
    })
})

router.post('/addAdmin', auth.isToken, auth.isUser, auth.isAdmin, (req, res) => {
    let user = User()
    user.name = req.body.name
    user.email = req.body.email
    user.setPassword(req.body.password)
    user.role=0
    user.save((err, result) => {
        if(!err){
            user.generateToken()
            res.status(200).send({status: 200, token: user.token, data: user, message: 'New Admin has been added'})
        }
        else{
            console.log(err)
            res.status(203).send({message: 'Email exists, try another one'})
        }
    })
})

router.get('/showAll',  auth.isToken, auth.isUser, auth.isAdmin, (req, res) => {
    User.find((err, result) => {
        if(!err){
            res.status(200).send({totalDocs: result.length, data: result});
        }
        else
            res.send(203).send({message: 'Sorry! There was a problem'})
    })
})


module.exports = router;