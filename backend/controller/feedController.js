const { Feed } = require("../models/Feed")
const { FeedComment } = require("../models/FeedComment");

const feedController = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 피드 페이지를 렌더링 해주는 함수입니다.
     * 주요 기능 : - 모든 피드의 데이터를 찾아 데이터와 함께 피드 페이지를 render 해줍니다.
     * */
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
    /**
     * 담당자 : 강재민
     * 함수 설명 : 피드를 생성해주는 함수입니다.
     * 주요 기능 : - 사용자로부터 피드 데이터를 입력받아 새로운 피드를 생성합니다.
     * */
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
    /**
     * 담당자 : 강재민
     * 함수 설명 : 피드를 수정하는 함수입니다.
     * 주요 기능 : - 피드의 내용과 매핑한 일정정보를 입력받아 업데이트 하도록 합니다.
     * */
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
    /**
     * 담당자 : 강재민
     * 함수 설명 : 피드를 삭제하는 함수입니다.
     * 주요 기능 : - 피드 id를 입력받아 피드를 삭제하는 역할을 합니다.
     * */
    deleteFeed : (req, res) => {
        Feed.deleteOne({_id : req.body.id}, (err) => {
            if(err){
                console.log(err);
                return res.json({deleteFeedSuccess : false, message : err})
            }

            return res.json({deleteFeedSuccess : true}).status(200);
        })
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 피드 댓글을 생성해주는 함수입니다.
     * 주요 기능 : - 피드댓글의 데이터를 사용자로부터 받아 새로운 댓글을 생성해줍니다.
     * */
    createFeedComment : async (req, res) => {
        try{
            const comment = await FeedComment.create({
                comment : req.body.comment,
                commentWriter : req.user._id,
                createDate : new Date()
            });

            await Feed.updateOne({_id : req.body.feedId}, {$push : {comments : comment._id}}).exec();

            return res.json({createCommentSuccess : true, comment, user : req.user});
        } catch (e) {
            console.log(e);
            return res.json({createCommentSuccess : false, message : e});
        }
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 피드 댓글을 삭제하는 함수입니다.
     * 주요 기능 : - 피드댓글 id를 입력받아 댓글을 삭제해줍니다.
     *          - 피드에서 연결된 피드 댓글 id를 삭제해줍니다.
     * */
    deleteFeedComment : async (req, res) => {
        try{
            // 피드 댓글 삭제
            await FeedComment.deleteOne({_id : req.body.id}).exec();
            // 피드에서 매핑된 피드 댓글 id 삭제
            await Feed.updateOne({comments : req.body.id}, {$pull : {comments : req.body.id}}).exec()

            return res.json({deleteCommentSuccess : true}).status(200);
        } catch (e) {
            console.log(e);
            return res.json({deleteCommentSuccess : false, message : e})
        }

    }
}

module.exports = feedController;