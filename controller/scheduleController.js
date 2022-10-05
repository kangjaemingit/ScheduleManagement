const { Schedule } = require("../models/Schedule");

const scheduleController = {
    newSchedule : async (req, res) => {
        await Schedule.create({
            title: req.body.title,
            contents : req.body.contents,
            priority : req.body.priority,
            tag : req.body.tag,
            address : req.body.address,
            writer : req.session.passport.user.userId,
            date : {
                startDate : req.body.startDate,
                endDate : req.body.endDate
            }
        }, (err, result) => {
            if(err){
                console.log("new Schedule create Error : " + err);
                return res.json({message : err});
            }
            return res.json({createSuccess : true})
                .status(200);
        })
    }
}

module.exports = scheduleController;