const mongoose = require('mongoose');

const FeedCommentSchema = mongoose.Schema({
    comment : {
        type : String
    },
    commentWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    createDate : {
        type : Date,
        default : new Date()
    }
})

const FeedComment = mongoose.model('FeedComment', FeedCommentSchema);

module.exports = { FeedComment };
