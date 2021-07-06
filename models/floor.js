var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const mongoosastic = require('mongoosastic')

var SpotSchema = new mongoose.Schema({
    isBooked:{type:Boolean,default:false,require:true},
    spotNo:{type:Number,require:true}
})

var FloorSchema = new mongoose.Schema({
    floorNumber:{type: Number, require: true, default: 0, unique: true},
    spots:{type:[SpotSchema],validate: [arrayLimit, '{PATH} exceeds the limit of 25'],default:[{isBooked:false,spotNo:1},{isBooked:false,spotNo:2},{isBooked:false,spotNo:3},{isBooked:false,spotNo:4},{isBooked:false,spotNo:5},{isBooked:false,spotNo:6},{isBooked:false,spotNo:7},{isBooked:false,spotNo:8},{isBooked:false,spotNo:9},{isBooked:false,spotNo:10},{isBooked:false,spotNo:11},{isBooked:false,spotNo:12},{isBooked:false,spotNo:13},{isBooked:false,spotNo:14},{isBooked:false,spotNo:15},{isBooked:false,spotNo:16},{isBooked:false,spotNo:17},{isBooked:false,spotNo:18},{isBooked:false,spotNo:19},{isBooked:false,spotNo:20},{isBooked:false,spotNo:21},{isBooked:false,spotNo:22},{isBooked:false,spotNo:23},{isBooked:false,spotNo:24},{isBooked:false,spotNo:25}]}
})
//{$push: {"spots": {spotNo: req.body.spotNo, isBooked: true}}}
//---------------------------------------------------------------
//{$set: {"spots": {spotNo: req.body.spotNo, isBooked: true}}}
//{arrayFilters: [ {"spots": {isBooked:false}}], new:true}
function arrayLimit(val) {
    return val.length <= 25;
  }
FloorSchema.plugin(uniqueValidator)
FloorSchema.plugin(mongoosastic)

var Floor = mongoose.model('Floor',FloorSchema)
module.exports = Floor