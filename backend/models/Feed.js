const mongoose = require('mongoose');

const FeedSchema = mongoose.Schema({
    feedContents : {
        type : String
    },
    feedWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    schedule : {type : mongoose.Schema.Types.ObjectId, ref:"Schedule"},
    createDate : {
        type : Date,
        default : new Date()
    },
    comments : {
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"FeedComment"}]
    }
})

const Feed = mongoose.model('Feed', FeedSchema);

module.exports = { Feed };
