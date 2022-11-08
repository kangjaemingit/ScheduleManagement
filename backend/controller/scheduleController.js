const { Schedule } = require("../models/Schedule");
const { Tags } = require("../models/Tags");
const {Category} = require("../models/Category");

const scheduleController = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 새로운 일정을 생성해주는 함수
     * 주요 기능 : - 새로운 일정 정보를 입력받아 생성해주는 함수입니다.
     *          - 새로운 태그를 입력받으면 태그를 생성해주었습니다
     *          - 태그에는 일정 정보를 매핑, 일정에는 태그정보를 매핑하여 양방향 매핑을 하였습니다.
     * */
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

            // 태그 배열을 반복문을 통해 존재유무 및 일정 매핑, 태그 아이디를 tagArray에 담아줌
            let tagArray = await Promise.all(req.body.tag.map(async (tag) => {
                // 태그 존재 유무 확인
                const tagExists = await Tags.findOne({tagName: tag}).exec();

                if (tagExists) { // 태그가 존재한다면
                    await Tags.updateOne({_id : tagExists._id}, {$push : {schedule : newSchedule._id}}).exec() // 태그에 일정 ID UPDATE
                    return tagExists._id
                } else { // 태그가 존재하지 않는다면
                    // 새로운 태그 생성
                    const newTag = await Tags.create({
                        tagName: tag,
                        tagWriter: req.user._id,
                        schedule : [newSchedule._id]
                    });
                    // 일정에 태그 ID UPDATE
                    return newTag._id;
                }
            }));

            // 일정 DB에 저장
            await Schedule.create(newSchedule)

            // 일정에 태그 정보 update
            await Schedule.updateOne({_id: newSchedule._id}, {$set : {tag : tagArray}}).exec();

            // 성공값 반환
            return res.json({newScheduleSuccess : true}).status(200);

        } catch (e){
            console.log(e);
            return res.json({newScheduleSuccess : false, message : e})
        }
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 일정을 수정하는 함수 입니다.
     * 주요 기능 : - 수정할 일정 데이터를 입력받아 일정을 수정해주는 함수입니다.
     *          - 태그 다큐먼트에 매핑되어있는 수정할 일정 id를 모두 삭제하고 재매핑하였습니다.
     *          - 일정성생과 같은 방법으로 태그의 유무를 판단, 매핑하였습니다.
     *          - 일정내용을 업데이트 하였습니다
     * */
    updateSchedule : async (req, res) => {
        try{
            const oldTag = await Schedule.findOne({_id : req.body.scheduleId}).select('tag').exec();
            await Tags.updateMany({_id: oldTag.tag}, {$pull: {schedule: req.body.scheduleId}}).exec();

            let tagArray = await Promise.all(req.body.tag.map(async (tag) => {
                // 태그 존재 유무 확인
                const tagExists = await Tags.findOne({tagName: tag}).exec();

                if (tagExists) { // 태그가 존재한다면
                    await Tags.updateOne({_id : tagExists._id}, {$push : {schedule : req.body.scheduleId}}).exec() // 태그에 일정 ID UPDATE
                    return tagExists._id
                } else { // 태그가 존재하지 않는다면
                    // 새로운 태그 생성
                    const newTag = await Tags.create({
                        tagName: tag,
                        tagWriter: req.user._id,
                        schedule : [req.body.scheduleId]
                    });
                    // 일정에 태그 ID UPDATE
                    return newTag._id;
                }
            }));

            await Schedule.updateOne({_id: req.body.scheduleId},
                {$set : {
                        title : req.body.title,
                        contents : req.body.contents,
                        "date.startDate" : req.body.startDate,
                        "date.endDate" : req.body.endDate,
                        priority : req.body.priority,
                        tag : tagArray,
                        address : req.body.address
                }})
                .exec();

            // 성공값 반환
            return res.json({updateScheduleSuccess : true}).status(200);

        } catch (e){
            console.log(e);
            return res.json({updateScheduleSuccess : false, message : e})
        }
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 일정을 삭제하는 함수입니다.
     * 주요 기능 : - 삭제할 일정 id를 입력받아 일정을 삭제해주었습니다.
     * */
    deleteSchedule : (req, res) => {
        Schedule.deleteOne({_id : req.body.scheduleId})
            .exec((err) => {
                if(err){
                    console.log(err);
                    return res.json({deleteScheduleSuccess : false, message : err})
                }
                return res.json({deleteScheduleSuccess : true}).status(200)
            });
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
    getScheduleByUser: async (req,res)=>{
        try{
            const sharedCategory = await Category.find({sharer : req.user._id}).exec()

            let sharedSchedule = await Promise.all(sharedCategory.map(async (sc) => {
                const schedule = await Schedule.find({$and : [{scheduleWriter : sc.categoryWriter}, {tag : { $in : sc.tags}}]})
                    .populate("tag")
                    .populate("scheduleWriter")
                    .exec();
                return schedule
            }));

            if(sharedSchedule.length > 0){
                sharedSchedule = sharedSchedule.reduce(function (acc, cur){
                    return acc.concat(cur);
                })
            }

            sharedSchedule = [...new Set(sharedSchedule.map(JSON.stringify))].map(JSON.parse);

            const mySchedule = await Schedule.find({scheduleWriter:req.user._id})
                .populate("tag")
                .populate("scheduleWriter")
                .exec();

            return res.json({scheduleRenderSuccess:true, mySchedule, sharedSchedule});
        } catch (e) {
            if(e){
                console.log(e)
                return res.json({scheduleRenderSuccess:false, message:e});
            }
        }

    },
    getMySchedule : (req, res) => {
        Schedule.find({scheduleWriter:req.user._id})
            .populate("tag")
            .populate("scheduleWriter")
            .exec((err, result) => {
                if(err){
                    console.log(err);
                    return res.json({getMyScheduleSuccess : false, message : err})
                }
                return res.json({getMyScheduleSuccess : true, schedule : result});
            });
    },
    getMyScheduleByKeyword : (req, res) => {
        Schedule.find({ $and : [{scheduleWriter:req.user._id},{title : {$regex : req.body.keyword}}]})
            .populate("tag")
            .populate("scheduleWriter")
            .exec((err, result) => {
                if(err){
                    console.log(err);
                    return res.json({getMyScheduleSuccess : false, message : err})
                }
                return res.json({getMyScheduleSuccess : true, schedule : result});
            });
    },
    getMyScheduleByTag : (req, res) => {
        Schedule.find({$and : [{scheduleWriter:req.user._id}, {tag : {$in : req.body.tag}}]})
            .populate("tag")
            .populate("scheduleWriter")
            .exec((err, result) => {
                if(err){
                    console.log(err);
                    return res.json({getMyScheduleSuccess : false, message : err})
                }
                return res.json({getMyScheduleSuccess : true, schedule : result});
            });
    },
    getScheduleById : (req, res) => {
      Schedule.findOne({_id : req.params.id})
          .populate("tag")
          .populate("scheduleWriter")
          .exec((err, result) => {
              if(err){
                  console.log(err);
                  return res.json({getScheduleSuccess : false, message : err})
              }

              if(result.scheduleWriter._id.toString() === req.user._id.toString()){
                  return res.json({schedule : result, scheduleOwner : true}).status(200);
              } else {
                  return res.json({schedule : result, scheduleOwner : false}).status(200);
              }
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
                return res.json({schedule : result}).status(200);
            })
    }
}

module.exports = scheduleController;