const {Schedule} = require("../models/Schedule");
const {Category} = require("../models/Category");
const { Feed } = require("../models/Feed");
const { TodoList }= require("../models/TodoList")

const dashboardController={
    /**
     * 담당자 : 강재민
     * 함수 설명 : 대시보드 페이지를 렌더링 하는 함수입니다.
     * 주요 기능 : - 오늘 일정 중 완료된 '나'의 일정과 미완료 상태인 '나'의 일정을 불러옵니다.
     *           - 공유받은 일정중 오늘에 해당하는 일정을 불러옵니다.
     *           - 최근에 업로드된 피드 5개를 불러옵니다.
     *           - 데이터들과 함께 대시보드 페이지를 render 합니다.
     *           - 오늘 일정은 오늘 날짜 기준 시작일이 익일 자정보다 작고 마감일이 금일 자정보다 클때 즉, 금일 자정과 익일 자정 사이의 교집함에 해당하는 일정을 불러왔습니다.
     * */
    index : async (req, res) => {
        // 오늘 날짜
        const today = new Date();
        // 시작일과 비교할 익일 자정 날짜
        const compareStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0)
        // 마감일과 비교할 금일 자정 날짜
        const compareEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
        try{
            // 완료된 오늘 나의 일정 불러오기
            const completeSchedule = await Schedule.find({
                $and : [
                    {scheduleWriter : req.user._id},
                    {complete : true},
                    {"date.startDate" : {$lt : compareStartDate}},
                    {"date.endDate" : {$gte : compareEndDate}}
                ]})
                .populate('tag')
                .exec();

            // 미완료된 오늘 나의 일정 불러오기
            const readySchedule = await Schedule.find({
                $and : [
                    {scheduleWriter : req.user._id},
                    {complete : false},
                    {"date.startDate" : {$lt : compareStartDate}},
                    {"date.endDate" : {$gte : compareEndDate}}
                ]})
                .populate('tag')
                .exec();

            // 공유받은 카테고리 불러오기
            const sharedCategory = await Category.find({sharer : req.user._id}).exec()

            // 공유받은 카테고리로 해당 일정 불러오기
            let sharedSchedule = await Promise.all(sharedCategory.map(async (sc) => {
                const schedule = await Schedule.find({$and : [
                        {scheduleWriter : sc.categoryWriter},
                        {tag : { $in : sc.tags}},
                        {"date.startDate" : {$lt : compareStartDate}},
                        {"date.endDate" : {$gte : compareEndDate}} ]})
                    .populate("tag")
                    .populate("scheduleWriter")
                    .exec();
                return schedule
            }));


            // 다차원 배열로 이루어진 공유일정을 하나의 배열로 합치기
            if(sharedSchedule.length > 0){
                sharedSchedule = sharedSchedule.reduce(function (acc, cur){
                    return acc.concat(cur);
                })
            }

            // 중복된 일정 제거
            sharedSchedule = [...new Set(sharedSchedule.map(JSON.stringify))].map(JSON.parse);

            // 최근 피드 내용 5개 불러오기
            const feed = await Feed.find({})
                .populate('feedWriter')
                .populate('schedule')
                .sort({'createDate' : -1})
                .limit(5)
                .exec();

            // 투두리스트 불러오기(김건희)
            const todoLists = await TodoList.find({todoListWriter:req.user._id})
                .exec();

            res.render('dashboard/dashboard', { title: 'Express', user : req.user, completeSchedule, readySchedule, sharedSchedule, feed, todoLists });
        } catch (e) {
            console.log(e);
        }
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 일정 완료와 미완료를 변경해주는 함수입니다.
     * 주요 기능 : - 일정의 id와 완료, 미완료 값을 boolean으로 받아와 변경해주었습니다.
     * */
    updateScheduleComplete : (req, res) => {
        Schedule.updateOne({_id : req.body.id},
            {$set : {complete : req.body.bool}})
            .exec((err) => {
                if(err){
                    console.log(err);
                    return res.json({updateCompleteSuccess : false, message : err})
                }
                return res.json({updateCompleteSuccess : true}).status(200);

            })
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 완료율을 불러오기 위해 완료된 일정의 갯수와 미완료된 일정의 갯수를 불러오는 함수입니다.
     * 주요 기능 : - 오늘 날짜에 해당하는 일정 중 완료일정의 갯수와 미완료일정의 갯수를 return합니다.
     * */
    completeRate : async (req, res) => {
        const today = new Date();
        const compareStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0)
        const compareEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
        try {
            // 완료 갯수
            const completeCount = await Schedule.count({
                $and: [
                    {scheduleWriter: req.user._id},
                    {complete: true},
                    {"date.startDate": {$lt: compareStartDate}},
                    {"date.endDate": {$gte: compareEndDate}}
                ]
            })
                .exec();

            // 미완료 갯수
            const readyCount = await Schedule.count({
                $and: [
                    {scheduleWriter: req.user._id},
                    {complete: false},
                    {"date.startDate": {$lt: compareStartDate}},
                    {"date.endDate": {$gte: compareEndDate}}
                ]
            }).exec();

            return res.json({completeRateSuccess : true, completeCount, readyCount}).status(200);
        } catch (e) {
            console.log(e);
            return res.json({completeRateSuccess : false, message : e});
        }
    }
}
module.exports = dashboardController;