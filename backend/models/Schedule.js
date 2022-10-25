const mongoose = require('mongoose');
const { Tags } = require('./Tags');

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
    },
    complete : {
        type : Boolean,
        default : false
    }
});

ScheduleSchema.pre('deleteOne', {document : false, query : true}, async function(next){
    const { _id } = this.getFilter();

    await Tags.updateMany({$in : {schedule : _id}}, {$pull : {schedule : _id}})
    next();

});


const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = {Schedule};