const mongoose = require('mongoose');
const { Tags } = require('./Tags');

/**
 * 담당자 : 강재민, 김건희
 * 함수 설명 : 일정 항목의 스키마입니다.
 * 주요 기능 : - 제목, 내용, 우선순위, 태그, 주소, 작성자, 날짜(시작일, 마감일), 완료여부 로 구성되어있습니다.
 *              - 태그와 양방향으로 매핑되어있습니다.
 *              - 일정 작성자와 단방향으로 매핑되어 있습니다.
 * */
const ScheduleSchema = mongoose.Schema({
    title : { // 일정 제목
        type : String
    },
    contents : { // 일정 내용
        type : String
    },
    priority : { // 우선순위
        type : Number
    },
    tag : { // 태그
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"Tags"}]
    },
    address : { // 주소
        type : String
    },
    scheduleWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"}, // 일정 작성자
    date : { // 날짜 객체
        startDate : { // 시작일
            type : Date
        },
        endDate : { // 마감일
            type : Date
        }
    },
    complete : { // 완료 여부
        type : Boolean,
        default : false
    }
});
/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 삭제 시에 태그에서의 일정 매핑관계를 끊어주기 위한 미들웨어입니다.
 * 주요 기능 : - 일정이 삭제 될 때 태그에 매핑되어있던 일정을 모두 삭제 해줍니다.
 * */
ScheduleSchema.pre('deleteOne', {document : false, query : true}, async function(next){
    // 일정 id
    const { _id } = this.getFilter();

    // 태그에서 일정 id 삭제
    await Tags.updateMany({$in : {schedule : _id}}, {$pull : {schedule : _id}})
    next();

});


const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = {Schedule};