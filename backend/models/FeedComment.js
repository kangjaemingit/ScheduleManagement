const mongoose = require('mongoose');
const { Feed } = require("./Feed");

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

// FeedCommentSchema.pre('deleteOne', {document : false, query : true}, async function(next){
//     const { _id } = this.getFilter();
//
//     await Feed.findOneAndUpdate({comments : _id}, {$pull : {comments : _id}}).exec();
//     next();
// });

const FeedComment = mongoose.model('FeedComment', FeedCommentSchema);

module.exports = { FeedComment };
