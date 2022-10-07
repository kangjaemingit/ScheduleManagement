const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env['MONGO_URI'], {
        dbName : 'ScheduleManagement',
        authMechanism: 'DEFAULT',
    })
        .then(() => console.log("MongoDB connected"))
        .catch((err) => {
            console.log("mongoDB connection ERROR : " + err);
        })
}