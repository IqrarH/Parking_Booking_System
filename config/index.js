const dataDev = require('./development')
// TODO add the production env check here
if (process.env.NODE_ENV === "production") {
    module.exports = {
        secret: 'shhhhh',
        dbUrl: '', 
        port: process.env.PORT
    }
}
module.exports = dataDev