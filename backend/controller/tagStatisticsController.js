const {Schedule} = require("../models/Schedule");

const tagStatisticsController={
    index : async (req, res) => {
        const mySchedule = await Schedule.find({scheduleWriter : req.user._id})
            .populate("tag")
            .exec();

        const scheduleAllCount = mySchedule.length;
        let usedTagKindCount = 0;
        let usedTagAllCount = 0;
        let usedTags = [];

        mySchedule.map((s) => {
            usedTagAllCount += s.tag.length;

            s.tag.map((tag) => {
                // 임시변수 생성
                let tempUsedTags = new Object();

                // 태그가 존재하는지 탐색
                let tagExist = usedTags.find(t => t.tagName === tag.tagName);

                // 존재하지 않는다면 usedTag에 객체 생성하고 count = 1
                if(tagExist === undefined){
                    tempUsedTags._id = tag._id
                    tempUsedTags.tagName = tag.tagName;
                    tempUsedTags.count = 1;

                    tempUsedTags = JSON.stringify(tempUsedTags);
                    usedTags.push(JSON.parse(tempUsedTags));
                } else{ // 존재한다면 usedTag의 객체 count에 +1
                    tagExist.count += 1;
                }
            })
        })

        usedTagKindCount = usedTags.length;

        console.log("총 일정 수 : " + scheduleAllCount + " / 사용된 태그 종류 수 : " + usedTagKindCount + " / 사용된 태그 수 : " + usedTagAllCount);
        console.log(usedTags);


        res.render('tagStatistics/tagStatistics', {
            user : req.user,
            scheduleAllCount,
            usedTagKindCount,
            usedTagAllCount,
            usedTags
        });
    }

}
module.exports=tagStatisticsController;