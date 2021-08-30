const faker = require('faker')
const mongoose = require('mongoose')
const Floor = require('../models/Floor')
let spotsArray=[]
const dbLink = 'mongodb://localhost/PMS'
mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
})
.then((result) => {
    for(var i=0; i<=20; i++){
        let floor = Floor();
        floor.floorNumber = i;
        for(var j=1;j<=25;j++){
            const isBooked = false;
            const spotNo = j;
            let newSpot = {isBooked,spotNo};
            spotsArray.push(newSpot);
        }
        floor.spots = spotsArray;
        spotsArray = [];
        floor.save().then((result)=>console.log('Floor Added')).catch((err)=>console.log(err));
    }
})
.catch((err) => console.log(err))