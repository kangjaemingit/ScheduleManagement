const { Schedule } = require("../models/Schedule");
const { Tags } = require("../models/Tags");

const scheduleController = {
    newSchedule : async (req, res) => {
        try{
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
                const tagExists = await Tags.findOne({tagName: tag}).exec();
                if (tagExists) {
                    await Tags.updateOne({_id : tagExists._id}, {$push : {schedule : newSchedule._id}}).exec()
                    await newSchedule.updateOne({$push : {tag : tagExists._id}}).exec();
                    return tagExists._id;
                } else {
                    const newTag = await Tags.create({
                        tagName: tag,
                        tagWriter: req.user._id,
                        schedule : [newSchedule._id]
                    });
                    await newSchedule.updateOne({$push : {tag : newTag._id}}).exec();
                    return newTag._id;
                }
            });

            await Schedule.create(newSchedule)
            return res.json({newScheduleSuccess : true}).status(200);

        } catch (e){
            console.log(e);
            return res.json({newScheduleSuccess : false, message : e})
        }
    }
}

module.exports = scheduleController;