const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const moment = require('moment');
const Booking = require('../../models/Booking');
const Floor = require('../../models/Floor');
const Vehicle = require('../../models/Vehicle');
const User = require('../../models/User');
const auth = require('../../middlewares/auth');
const utility = require('../../middlewares/checkSpotAvailability')
const app = express();

router.post('/addBooking',utility.checkSpotAvailability,auth.isToken,auth.isUser,async(req,res)=>{
    
    const floor = await Floor.findOne({floorNumber:req.body.floor}).exec();
    const customer = await User.findOne({email:req.body.customer}).exec()
    const vehicle = await Vehicle.findOne({vehicleNumber:req.body.vehicle}).exec()
    const oldBooking = await Booking.findOne({vehicle: vehicle._id, isActive: true}).exec();
    if(vehicle===null){
        res.status(203).send({message:'Unable to add booking, Vehicle is not registered. Please add vehicle first to add booking'})
    }else if(floor === null){
        res.status(203).send({message:'Unable to add booking, Selected Floor does not exist'})
    }else if(customer === null){
        res.status(203).send({message:'Unable to add booking, Owner does not exist, Kindly sign up first to add booking'})
    }else if(oldBooking){
        res.status(203).send({status: 203, message:'Unable to add booking, The Vehicle already has an active booking'})
    }else{
        let booking = Booking();
        booking.user = mongoose.Types.ObjectId(customer._id);
        booking.vehicle = mongoose.Types.ObjectId(vehicle._id);
        booking.startingTime = req.body.bookingTime;
        booking.bookingDuration = req.body.bookingDuration;     //booking duration in hours
        booking.floor = mongoose.Types.ObjectId(floor._id);
        booking.bookedSpot = req.body.spotNo;
        booking.isActive = true;
        booking.save(async(err,result)=>{
            if(err){
                console.log(err);
                res.status(203).send({status: 203, message:'Unable to add booking...'})
            }else{
                await Floor.findOneAndUpdate({floorNumber:req.body.floor},
                    {$set: {"spots.$[el]": {spotNo: req.body.spotNo, isBooked: true}}},
                    {arrayFilters: [ {"el.spotNo":req.body.spotNo}], new:true}
                )
                res.status(200).send({status: 200, message:'Booking added successfully'})
            }
        })
    }
})

router.get('/viewBooking/:vehicleNumber',auth.isToken,auth.isUser,auth.isAdmin,async(req,res)=>{
    const vehicle = await Vehicle.findOne({vehicleNumber:req.params.vehicleNumber}).exec()
    if(vehicle===null){
        res.status(203).send({message:'No Booking found for the given number'})
    }
    Booking.findOne({vehicle:mongoose.Types.ObjectId(vehicle._id), isActive: true}).populate('user','name -_id').populate('vehicle','vehicleNumber -_id').populate('floor','floorNumber -_id').exec((err,booking)=>{
        if(!err&&booking!==null){
            res.status(200).send({status: 200, data: booking});
        }else{
            res.status(203).send({status: 203, message:'No Active Booking found for the given number'});
        }
    })
})

router.get('/showAll',auth.isToken,auth.isUser,auth.isAdmin,async(req,res)=>{
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    let count = 0;

    await Booking.find().exec((err,bookings) => {
        count = bookings.length;
    })

    await Booking.find().select('-_id')
    .skip((page-1) * limit)
    .limit(limit)
    .populate('user','name -_id')
    .populate('vehicle','vehicleNumber -_id')
    .populate('floor','floorNumber -_id')
    .exec((err,bookings)=>{
        if(!err&&bookings!==null){
            res.status(200).send({totalDocs: count, status: 200, data: bookings});
        }else{
            res.status(203).send({status: 203, message:'Unable to show bookings'});
        }
    })
})

router.put('/updateBooking/:vehicleNumber',auth.isToken,auth.isUser,auth.isAdmin,async(req,res)=>{
    console.log('API HIT');
    console.log(req.body);
    const vehicle = await Vehicle.findOne({vehicleNumber:req.params.vehicleNumber}).exec()
    if(vehicle===null){
        res.status(203).send({status:203, message:'No Booking found for the given number'})
    }
    Booking.findOneAndUpdate({vehicle:mongoose.Types.ObjectId(vehicle._id), isActive: true},
    {bookingDuration:req.body.newBookingDuration},function(err,data){
        if(err || data === null){
            res.status(203).send({status:203, message:'No Booking found for the given number'});
        }else{
            res.status(200).send({status:200, message:'Booking updated successfully'});
        }
    
    })
})
router.get('/calculateReceipt/:vehicleNumber',auth.isToken,auth.isUser,async(req,res)=>{
    console.log(req.url);
    const vehicle = await Vehicle.findOne({vehicleNumber:req.params.vehicleNumber}).exec()
    if(vehicle===null){
        res.status(203).send({status: 203, message:'No Booking found for the given number'})
    }
    var flag=0;
    Booking.findOne({vehicle:mongoose.Types.ObjectId(vehicle._id), isActive: true},
    async function(err,data){
        if(err || data === null){
            res.status(203).send({status: 203, message:'No Booking found for the given number'});
        }else{
            flag=1;
            const floor = await Floor.findOne({_id:data.floor}).exec()
            await Floor.findOneAndUpdate({floorNumber:floor.floorNumber},
                {$set: {"spots.$[el]": {spotNo: data.bookedSpot, isBooked: false}}},
                {arrayFilters: [ {"el.spotNo":data.bookedSpot}], new:true}
            )
            await Booking.findOneAndUpdate({vehicle:mongoose.Types.ObjectId(vehicle._id), isActive: true},
            {isActive:false},{new:true})
            var charges = data.bookingDuration * 5;
            res.status(200).send({bill: charges, message:'Your bill is '+charges+'$'});
        }
    })
})

router.get('/calculateFine/:vehicleNumber',auth.isToken,auth.isUser,async(req,res)=>{
    const vehicle = await Vehicle.findOne({vehicleNumber:req.params.vehicleNumber}).exec()
    if(vehicle===null){
        res.status(203).send({status: 203, message:'No Booking found for the given number'})
    }
    Booking.findOne({vehicle:mongoose.Types.ObjectId(vehicle._id), isActive: true}).exec((err,data)=>{
        if(err || data === null){
            res.status(203).send({status: 203, message:'No Booking found for the given number'})
        }else{
            var bookingTime = moment(data.startingTime).local().format('YYYY-MM-DDTHH:mm:ss').toString();
            var endingTime = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss').toString();
            var ms = moment(endingTime,"YYYY-MM-DDTHH:mm:ss").diff(moment(bookingTime,"YYYY-MM-DDTHH:mm:ss"),'hours');
            var totalFine = (parseInt(ms.toString()) - parseInt(data.bookingDuration)) * 10;
            if(totalFine>0){
                res.status(200).send({fine: totalFine, message:'Your fine is '+totalFine+'$'});
            }else{
                res.status(200).send({fine: 0, message:'Your fine is 0$'});
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