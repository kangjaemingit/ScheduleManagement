const { Feed } = require("../models/Feed")

const feedController = {
    index : async (req, res) => {
        const feed = await Feed.find({})
            .populate('feedWriter')
            .populate('schedule')
            .sort({'createDate' : -1})
            .exec();

        res.render('feed/feedPage', {user : req.user, feed});
    },
    createFeed : async (req, res) => {
        await Feed.create({
            feedContents : req.body.contents,
            feedWriter : req.user._id,
            schedule : req.body.scheduleId
        }, (err, result) => {
            if(err){
                console.log(err);
                return res.json({createFeedSuccess : false, message : err})
            }
            return res.json({createFeedSuccess : true, feed : result, user : req.user}).status(200);
        })
    },
    updateFeed : (req, res) => {
        Feed.updateOne({_id : req.body.id},
            {$set : {feedContents : req.body.feedContents}},
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
    }
}

module.exports = feedController;