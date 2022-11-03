const { Feed } = require("../models/Feed")
const { FeedComment } = require("../models/FeedComment");

const feedController = {
    index : async (req, res) => {
        const feed = await Feed.find({})
            .populate('feedWriter')
            .populate('schedule')
            .populate({
                path : 'comments',
                populate : 'commentWriter'
            })
            .sort({'createDate' : -1})
            .exec();

        res.render('feed/feedPage', {user : req.user, feed});
    },
    createFeed : async (req, res) => {
        await Feed.create({
            feedContents : req.body.contents,
            feedWriter : req.user._id,
            schedule : req.body.scheduleId,
            createDate : new Date()
        }, (err, result) => {
            if(err){
                console.log(err);
                return res.json({createFeedSuccess : false, message : err})
            }
            return res.json({createFeedSuccess : true, feed : result, user : req.user}).status(200);
        })
    },
    updateFeed : (req, res) => {
        Feed.updateOne({_id : req.body.feedId},
            {$set : {feedContents : req.body.feedContents, schedule : req.body.scheduleId}},
            (err) => {
                if(err){
                    console.log(err);
                    return res.json({updateFeedSuccess : false, message : err})
                }

                return res.json({updateFeedSuccess : true}).status(200);
            });
    },
    deleteFeed : (req, res) => {
        Feed.deleteOne({_id : req.body.id}, (err) => {
            if(err){
                console.log(err);
                return res.json({deleteFeedSuccess : false, message : err})
            }

            return res.json({deleteFeedSuccess : true}).status(200);
        })
    },
    createFeedComment : async (req, res) => {
        try{
            const comment = await FeedComment.create({
                comment : req.body.comment,
                commentWriter : req.user._id
            });

            await Feed.updateOne({_id : req.body.feedId}, {$push : {comments : comment._id}}).exec();

            return res.json({createCommentSuccess : true, comment, user : req.user});
        } catch (e) {
            console.log(e);
            return res.json({createCommentSuccess : false, message : e});
        }
    },
    deleteFeedComment : async (req, res) => {
        try{
            await FeedComment.deleteOne({_id : req.body.id}).exec();
            await Feed.updateOne({comments : req.body.id}, {$pull : {comments : req.body.id}}).exec()

            return res.json({deleteCommentSuccess : true}).status(200);
        } catch (e) {
            console.log(e);
            return res.json({deleteCommentSuccess : false, message : e})
        }

    }
}

module.exports = feedController;