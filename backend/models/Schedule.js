const mongoose = require('mongoose');

const ScheduleSchema = mongoose.Schema({
    title : {
        type : String
    },
    contents : {
        type : String
    },
    priority : {
        type : Number
    },
    tag : {
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"Tags"}]
    },
    address : {
        type : String
    },
    scheduleWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    date : {
        startDate : {
            type : Date
        },
        endDate : {
            type : Date
        }
    }
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = {Schedule};