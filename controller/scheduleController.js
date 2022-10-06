const { Schedule } = require("../models/Schedule");
const { Tags } = require("../models/Tags");

const scheduleController = {
    newSchedule : async (req, res) => {
        const newSchedule = new Schedule({
            title: req.body.title,
            contents : req.body.contents,
            priority : req.body.priority,
            tag : [],
            address : req.body.address,
            writer : req.user._id,
            date : {
                startDate : req.body.startDate,
                endDate : req.body.endDate
            }
        })
        let tagArray = [];

        req.body.tag.map(async (tag) => {
            const tagExists = await Tags.findOne({tagName: tag}).exec();
            if (tagExists) {
                tagArray.push(tagExists._id);
                console.log(tagExists);
            } else {
                const newTag = await Tags.create({
                    tagName: tag,
                    writer: req.user._id
                });
                tagArray.push((newTag._id));
                console.log(tagArray);
            }
        })

        console.log(tagArray);

        await newSchedule.updateOne({$push : {tag : { $each : tagArray }}})
        console.log(newSchedule);
        // newSchedule = await Schedule.create(newSchedule);
        //
        // tagArray.map((t) => {
        //     Tags.updateMany({_id : t}, {$push : {schedule : newSchedule._id}});
        // })

        // await Schedule.create({

        // }, (err, result) => {
        //     if(err){
        //         console.log("new Schedule create Error : " + err);
        //         return res.json({message : err});
        //     }
        //     return res.json({createSuccess : true})
        //         .status(200);
        // })
    }
}

module.exports = scheduleController;