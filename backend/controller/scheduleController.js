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

            let tagArray = await Promise.all(req.body.tag.map(async (tag) => {
                // 태그 존재 유무 확인
                const tagExists = await Tags.findOne({tagName: tag}).exec();

                if (tagExists) { // 태그가 존재한다면
                    await Tags.updateOne({_id : tagExists._id}, {$push : {schedule : newSchedule._id}}).exec() // 태그에 일정 ID UPDATE
                    return tagExists._id
                    // await newSchedule.updateOne({$push : {tag : tagExists._id}}).exec(); // 일정에 태그 ID UPDATE
                } else { // 태그가 존재하지 않는다면
                    // 새로운 태그 생성
                    const newTag = await Tags.create({
                        tagName: tag,
                        tagWriter: req.user._id,
                        schedule : [newSchedule._id]
                    });
                    // 일정에 태그 ID UPDATE
                    return newTag._id;
                    // await newSchedule.updateOne({$push : {tag : newTag._id}}).exec();
                }
            }));

            // 일정 DB에 저장
            await Schedule.create(newSchedule)

            await Schedule.updateOne({_id: newSchedule._id}, {$set : {tag : tagArray}}).exec();

            // 성공값 반환
            return res.json({newScheduleSuccess : true}).status(200);

        } catch (e){
            console.log(e);
            return res.json({newScheduleSuccess : false, message : e})
        }
    },
    editSchedule : (req, res) => {

    },
    deleteSchedule : (req, res) => {

    },
    autoComplete : (req, res) => {
        Tags.find({tagName : { $regex : req.body.keyword}})
            .exec((err, autoComplete) => {
                if(err){
                    console.log(err);
                    return res.json({autoComplete : false, message : err});
                }
                return res.json({ autoComplete }).status(200)
            })
    },
    getScheduleByWriter: (req,res)=>{
        Schedule.find({scheduleWriter:req.user._id})
            .populate("tag")
            .populate("scheduleWriter")
            .exec((err,result)=>{
                if(err){
                    console.log(err)
                    return res.json({scheduleRenderSuccess:false, message:err});
                }
                return res.json({scheduleRenderSuccess:true, scheduleData:result});
            });
    },
    getScheduleById : (req, res) => {
      Schedule.findOne({_id : req.params.id})
          .populate("tag")
          .exec((err, result) => {
              if(err){
                  console.log(err);
                  return res.json({getScheduleSuccess : false, message : err})
              }
              return res.json({schedule : result}).status(200);
          })
    },
    getScheduleByCategory:(req, res) => {
        // Tags.find({_id : req.body.tags})
        //     .populate({
        //         path : 'schedule',
        //         match : {scheduleWriter : req.body.categoryWriter}
        //     })
        //     .exec((err, result) => {
        //         if(err){
        //             console.log(err);
        //             return res.json({getScheduleSuccess : false, message : err})
        //         }
        //         console.log(result);
        //         return res.json({schedule : result}).status(200);
        //     })

        Schedule.find({$and : [{tag : {$in : req.body.tags}}, {scheduleWriter: req.body.categoryWriter}]})
            .populate('scheduleWriter')
            .exec((err, result) => {
                if(err){
                    console.log(err);
                    return res.json({getScheduleSuccess : false, message : err})
                }
                console.log(result);
                return res.json({schedule : result}).status(200);
            })
    }
}

module.exports = scheduleController;