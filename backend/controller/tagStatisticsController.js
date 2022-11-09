const {Schedule} = require("../models/Schedule");
const {Tags} = require("../models/Tags");

const tagStatisticsController={
    /**
     * 담당자 : 강재민
     * 함수 설명 : 태그 통계 페이지를 렌더링 해주는 함수 입니다.
     * 주요 기능 : - 나의 전체 일정 데이터와 함께 태그 통계 페이지를 render 합니다.
     * */
    index : async (req, res) => {
        try{
            const mySchedule = await Schedule.find({scheduleWriter : req.user._id})
                .sort({"date.startDate" : -1})
                .populate("tag")
                .exec();
            res.render('tagStatistics/tagStatistics', {user : req.user, mySchedule});
        } catch (e){
            console.log(e);
        }

    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 태그통계 기본값을 불러오는 함수입니다.
     * 주요 기능 : - 일정 전체 갯수, 사용한 태그 종류의 갯수, 전체 사용한 태그의 갯수, 사용한 태그 각각의 수를 찾아 return 합니다
     * */
    tagStatisticsData : async (req, res) => {
        try{
            // 나의 일정
            const mySchedule = await Schedule.find({scheduleWriter : req.user._id})
                .populate("tag")
                .exec();


            const scheduleAllCount = mySchedule.length; // 일정 전체 갯수
            let usedTagKindCount = 0; // 태그 종류 갯수
            let usedTagAllCount = 0; // 전체 사용 태그 수
            let usedTags = []; // 사용한 태그 배열 -> {태그id, 태그명, 사용한 태그 수} 객체 배열

            // 일정 1개씩 반복
            mySchedule.map((s) => {
                usedTagAllCount += s.tag.length; // 전체 태그 사용 수 += 해당 일정의 태그 수

                // 태그 1개씩 반복
                s.tag.map((tag) => {
                    // 사용한 태그 임시변수 생성
                    let tempUsedTags = new Object();

                    // 사용한 태그 배열에서 태그가 존재하는지 탐색
                    let tagExist = usedTags.find(t => t.tagName === tag.tagName);

                    // 존재하지 않는다면 usedTag에 객체 생성하고 count = 1
                    if(tagExist === undefined){
                        tempUsedTags._id = tag._id
                        tempUsedTags.tagName = tag.tagName;
                        tempUsedTags.count = 1;

                        // 임시객체에 먼저 담고
                        tempUsedTags = JSON.stringify(tempUsedTags);
                        // 태그 배열에 push
                        usedTags.push(JSON.parse(tempUsedTags));
                    } else{ // 존재한다면 usedTag의 객체 count에 +1
                        tagExist.count += 1;
                    }
                })
            });
            // count를 기준으로 내림차순 정렬
            usedTags.sort((a, b) => b.count - a.count);

            usedTagKindCount = usedTags.length; // 태그 종류별 갯수 = 사용한 태그 배열의 길이

            // 반환
            return res.json({
                statisticsDataSuccess : true,
                scheduleAllCount,
                usedTagAllCount,
                usedTagKindCount,
                usedTags,
                mySchedule
            }).status(200);
        } catch (e){
            console.log(e);
            return res.json({statisticsDataSuccess : false, message : e})
        }

    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 태그이름을 통해서 태그 정보와 일정리스트를 받아오는 함수입니다.
     * 주요 기능 : - 태그통계에서 태그 이름을 클릭했을 때 일정리스트를 반환합니다.
     *          - 태그 이름이 일치하고, 일정에서 일정 작성자가 '나'에 해당하는 값들만 찾아 return 합니다.
     * */
    findMyTagByTagName : (req, res) => {
        Tags.findOne({tagName : req.params.tagName})
            .populate({
                path : 'schedule',
                match : {scheduleWriter : req.user._id}
            })
            .exec((err, result) => {
                if(err){
                    console.log(err);
                    return res.json({getTagSuccess : false, message : err})
                }
                return res.json({tagInfo : result}).status(200);
            })
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 태그 통계페이지에서 왼쪽 원형차트 범례의 '기타' 항목에 해당하는 일정을 불러오기 위한 함수입니다.
     * 주요 기능 : - 일정목록에서 일정 작성자가 '나'이고, 태그 배열중 하나라도 포함하는 일정을 모두 불러와 return 합니다.
     * */
    findMyTagByNotTagName : (req, res) => {
        Schedule.find({$and : [{scheduleWriter : req.user._id}, {tag : {$in : req.body.tags}}]})
            .exec((err, result) => {
            if(err){
                console.log(err);
                return res.json({getScheduleSuccess : false, message : err})
            }
            return res.json({schedule : result}).status(200);
        })

        // Tags.find( {tagName : {$nin : req.body.tags}})
        //     .populate({
        //         path : 'schedule',
        //         match : {scheduleWriter : req.user._id}
        //     })
        //     .exec((err, result) => {
        //         if(err){
        //             console.log(err);
        //             return res.json({getTagSuccess : false, message : err})
        //         }
        //         return res.json({tagInfo : result}).status(200);
        //     })
    }

}
module.exports=tagStatisticsController;