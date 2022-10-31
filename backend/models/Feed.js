const mongoose = require('mongoose');

const FeedSchema = mongoose.Schema({
    feedContents : {
        type : String
    },
    feedWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"},
})

const Feed = mongoose.model('Feed', FeedSchema);

module.exports = { Feed };
