// TODO rename this file and update to checkspotavailabilty 
const Floor = require('../models/Floor')

const checkSpotAvailability =  function(req,res, next) {
        // TODO remove the async await
    Floor.findOne({floorNumber:req.body.floor}).exec().then(data => {
        if(data === null){
            res.status(203).send({message:'Unable to add booking, Invalid Floor'})
        }
        const temp = data.spots
        // TODO camparison
        if(req.body.spotNo<25 && req.body.spotNo>0 && temp[req.body.spotNo-1].spotNo===req.body.spotNo && temp[req.body.spotNo-1].isBooked===false){
            next()
        }
        else{
            res.status(200).send({message:'Spot not available'})
        }
    })
    
}

module.exports = {checkSpotAvailability}