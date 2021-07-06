const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const moment = require('moment')
const Booking = require('../../models/Booking');
const Floor = require('../../models/Floor');
const Vehicle = require('../../models/Vehicle');
const User = require('../../models/User');
const auth = require('../../middlewares/auth');
const utility = require('../../middlewares/utility')
const app = express();

router.post('/addBooking',utility.checkSpotAvailability,auth.isToken,auth.isUser,async(req,res)=>{
    
    const floor = await Floor.findOne({floorNumber:req.body.floor}).exec();
    const customer = await User.findOne({email:req.body.customer}).exec()
    const vehicle = await Vehicle.findOne({vehicleNumber:req.body.vehicle}).exec()
    if(vehicle===null || floor === null || customer === null){
        res.status(203).send({message:'Unable to add booking, Invalid Floor, Vehicle OR Username'})
    }
    let booking = Booking();
    booking.bookedFor = mongoose.Types.ObjectId(customer._id);
    booking.bookedForVehicle = mongoose.Types.ObjectId(vehicle._id);
    booking.bookingTime = req.body.bookingTime;
    booking.bookingDuration = req.body.bookingDuration;     //booking duration in hours
    booking.bookedFloor = mongoose.Types.ObjectId(floor._id);
    booking.bookedSpot = req.body.spotNo;
    booking.isActive = true;
    booking.save(async(err,result)=>{
        if(err){
            res.status(203).send({message:'Unable to add booking, The Vehicle already has a booking'})
        }else{
            await Floor.findOneAndUpdate({floorNumber:req.body.floor},
                {$set: {"spots.$[el]": {spotNo: req.body.spotNo, isBooked: true}}},
                {arrayFilters: [ {"el.spotNo":req.body.spotNo}], new:true}
            )
            res.status(200).send({message:'Booking added successfully'})
        }
    })
})

router.get('/viewBooking/:vehicleNumber',auth.isToken,auth.isUser,auth.isAdmin,async(req,res)=>{
    const vehicle = await Vehicle.findOne({vehicleNumber:req.params.vehicleNumber}).exec()
    if(vehicle===null){
        res.status(203).send({message:'No Booking found for the given number'})
    }
    Booking.findOne({bookedForVehicle:mongoose.Types.ObjectId(vehicle._id)},{_id:false}).populate('bookedFor','name -_id').populate('bookedForVehicle','vehicleNumber -_id').populate('bookedFloor','floorNumber -_id').exec((err,booking)=>{
        if(!err&&booking!==null){
            res.status(200).send(booking);
        }else{
            res.status(203).send({message:'No Booking found for the given number'});
        }
    })
})

router.get('/showAllBookings/:pageNumber/:limit',auth.isToken,auth.isUser,auth.isAdmin,async(req,res)=>{
    await Booking.find().select('-_id')
    .skip((+req.params.pageNumber-1) *  +req.params.limit)
    .limit(+req.params.limit)
    .populate('bookedFor','name -_id').populate('bookedForVehicle','vehicleNumber -_id').populate('bookedFloor','floorNumber -_id').exec((err,bookings)=>{
        if(!err&&bookings!==null){
            res.status(200).send(bookings);
        }else{
            res.status(203).send({message:'Unable to show bookings'});
        }
    })
})

router.put('/updateBooking',auth.isToken,auth.isUser,auth.isAdmin,async(req,res)=>{
    const vehicle = await Vehicle.findOne({vehicleNumber:req.body.vehicleNumber}).exec()
    if(vehicle===null){
        res.status(203).send({message:'No Booking found for the given number'})
    }
    Booking.findOneAndUpdate({bookedForVehicle:mongoose.Types.ObjectId(vehicle._id)},
    {bookingDuration:req.body.newBookingDuration},function(err,data){
        if(err || data === null){
            res.status(203).send({message:'No Booking found for the given number'});
        }else{
            res.status(200).send({message:'Booking updated successfully'});
        }
    
    })
})
router.get('/calculateReceipt/:vehicleNumber',auth.isToken,auth.isUser,async(req,res)=>{
    const vehicle = await Vehicle.findOne({vehicleNumber:req.params.vehicleNumber}).exec()
    if(vehicle===null){
        res.status(203).send({message:'No Booking found for the given number'})
    }
    var flag=0;
    Booking.findOne({bookedForVehicle:mongoose.Types.ObjectId(vehicle._id)},
    async function(err,data){
        if(err || data === null){
            res.status(203).send({message:'No Booking found for the given number'});
        }else{
            flag=1;
            const floor = await Floor.findOne({_id:data.bookedFloor}).exec()
            await Floor.findOneAndUpdate({floorNumber:floor.floorNumber},
                {$set: {"spots.$[el]": {spotNo: data.bookedSpot, isBooked: false}}},
                {arrayFilters: [ {"el.spotNo":data.bookedSpot}], new:true}
            )
            await Booking.findOneAndUpdate({bookedForVehicle:mongoose.Types.ObjectId(vehicle._id)},
            {isActive:false},{new:true})
            var charges = data.bookingDuration * 5;
            res.status(200).send({message:'Your bill is '+charges+'$'});
        }
    })
})

router.get('/calculateFine/:vehicleNumber',auth.isToken,auth.isUser,async(req,res)=>{
    const vehicle = await Vehicle.findOne({vehicleNumber:req.params.vehicleNumber}).exec()
    if(vehicle===null){
        res.status(203).send({message:'No Booking found for the given number'})
    }
    Booking.findOne({bookedForVehicle:mongoose.Types.ObjectId(vehicle._id)}).exec((err,data)=>{
        if(err){
            res.status(203).send({message:'No Booking found for the given number'})
        }else{
            var bookingTime = moment(data.bookingTime).local().format('YYYY-MM-DDTHH:mm:ss').toString();
            var endingTime = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss').toString();
            var ms = moment(endingTime,"YYYY-MM-DDTHH:mm:ss").diff(moment(bookingTime,"YYYY-MM-DDTHH:mm:ss"),'hours');
            var totalFine = (parseInt(ms.toString()) - parseInt(data.bookingDuration)) * 10;
            if(totalFine>0){
                res.status(200).send({message:'Your fine is '+totalFine+'$'});
            }else{
                res.status(200).send({message:'Your fine is 0$'});
            }
            console.log(parseInt(ms.toString()))
            console.log(data.bookingDuration)
        }
    })
})



router.get('/',(req,res)=>{
    res.send('PMS is ON!!!')
})

module.exports = router;