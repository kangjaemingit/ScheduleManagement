const { Schedule } = require("../models/Schedule");
const { Tags } = require("../models/Tags");

const scheduleController = {
    newSchedule : async (req, res) => {
        try{
            // 새로운 일정 객체 생성
            const newSchedule = new Schedule({
                title: req.body.title,
                contents : req.body.contents,
                priority : req.body.priority,
                tag : [],
                address : req.body.address,
                scheduleWriter : req.user._id,
                date : {
                    startDate : req.body.startDate,
                    endDate : req.body.endDate
                }
            })


            req.body.tag.map(async (tag) => {
                // 태그 존재 유무 확인
                const tagExists = await Tags.findOne({tagName: tag}).exec();

                if (tagExists) { // 태그가 존재한다면
                    await Tags.updateOne({_id : tagExists._id}, {$push : {schedule : newSchedule._id}}).exec() // 태그에 일정 ID UPDATE
                    await newSchedule.updateOne({$push : {tag : tagExists._id}}).exec(); // 일정에 태그 ID UPDATE
                } else { // 태그가 존재하지 않는다면
                    // 새로운 태그 생성
                    const newTag = await Tags.create({
                        tagName: tag,
                        tagWriter: req.user._id,
                        schedule : [newSchedule._id]
                    });
                    // 일정에 태그 ID UPDATE
                    await newSchedule.updateOne({$push : {tag : newTag._id}}).exec();
                }
            });

            // 일정 DB에 저장
            await Schedule.create(newSchedule)

            // 성공값 반환
            return res.json({newScheduleSuccess : true}).status(200);

        } catch (e){
            console.log(e);
            return res.json({newScheduleSuccess : false, message : e})
        }
    },
    autoComplete : (req, res) => {
        Tags.find({tagName : { $regex : req.params.keyword}})
            .exec((err, autoComplete) => {
                if(err){
                    console.log(err);
                    return res.json({autoComplete : false, message : err});
                }
                return res.json({ autoComplete }).status(200)
            })
    }
}

module.exports = scheduleController;