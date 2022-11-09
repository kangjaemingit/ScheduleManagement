const mongoose = require('mongoose');
const {FeedComment} = require("./FeedComment");
/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 항목의 스키마입니다.
 * 주요 기능 : - 피드 내용, 작성자, 일정, 작성일자, 댓글로 구성되어있습니다.
 *              - 피드 작성자, 일정, 댓글은 각각 유저, 일정, 피드댓글 모델과 단방향 매핑되어있습니다.
 * */
const FeedSchema = mongoose.Schema({
    feedContents : { // 피드 내용
        type : String
    },
    feedWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"}, // 피드 작성자
    schedule : {type : mongoose.Schema.Types.ObjectId, ref:"Schedule"}, // 일정
    createDate : { // 작성일자
        type : Date,
    },
    comments : { // 댓글
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"FeedComment"}]
    }
})

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드가 삭제 될 때 그에 작성된 댓글도 함꼐 삭제해주기 위한 미들웨어 입니다.
 * 주요 기능 : - 피드가 삭제 됐을 때 매핑되어있던 댓글을 모두 삭제해주도록 합니다.
 * */
FeedSchema.pre('deleteOne', {document : false, query : true}, async function(next){
    const { comments } = this.getFilter();

    await FeedComment.deleteMany({_id : comments}).exec();
    next();
});

const Feed = mongoose.model('Feed', FeedSchema);

module.exports = { Feed };
