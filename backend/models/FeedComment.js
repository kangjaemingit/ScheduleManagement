const mongoose = require('mongoose');

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 댓글 항목의 스키마입니다.
 * 주요 기능 : - 댓글 내용, 댓글 작성자, 작성 일자로 구성되어있습니다.
 *              - 댓글 작성자는 유저 모델과 단방향으로 매핑되어있습니다.
 * */
const FeedCommentSchema = mongoose.Schema({
    comment : { // 댓글 내용
        type : String
    },
    commentWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"}, // 댓글 작성자
    createDate : { // 작성 일자
        type : Date,
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
