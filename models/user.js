var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const mongoosastic = require('mongoosastic')
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, require: true, unique: true, index: true},
    password: {type: String, required: true},
    role: {type: Number, require: true, default: 1}, // TODO add enum here
});

UserSchema.plugin(uniqueValidator)
UserSchema.plugin(mongoosastic)

UserSchema.methods.setPassword = function(pass){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    this.password = hash
}

UserSchema.methods.comparePassword = function(pass){
    return bcrypt.compareSync(pass, this.password)
}

UserSchema.methods.generateToken = function(){
    this.token = jsonwebtoken.sign({user: this.email}, 'shhhhh') // TODO Config secret
}


const User = mongoose.model('User', UserSchema);
module.exports = User