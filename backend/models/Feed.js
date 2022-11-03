const mongoose = require('mongoose');
const {FeedComment} = require("./FeedComment");

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

FeedSchema.pre('deleteOne', {document : false, query : true}, async function(next){
    const { comments } = this.getFilter();

    await FeedComment.deleteMany({$in : {_id : comments}}).exec();
    next();
});

const Feed = mongoose.model('Feed', FeedSchema);

module.exports = { Feed };
