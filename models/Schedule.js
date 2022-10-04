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
        type : [String]
    },
    address : {
        type : String
    },
    writer : {
        type : String
    },
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