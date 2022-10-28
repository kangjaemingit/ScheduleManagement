const {Schedule} = require("../models/Schedule");
const {Category} = require("../models/Category");

const dashboardController={
    index : async (req, res) => {
        const today = new Date();
        const compareStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0)
        const compareEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
        try{
            const completeSchedule = await Schedule.find({
                $and : [
                    {scheduleWriter : req.user._id},
                    {complete : true},
                    {"date.startDate" : {$lt : compareStartDate}},
                    {"date.endDate" : {$gte : compareEndDate}}
                ]})
                .populate('tag')
                .exec();

            const readySchedule = await Schedule.find({
                $and : [
                    {scheduleWriter : req.user._id},
                    {complete : false},
                    {"date.startDate" : {$lt : compareStartDate}},
                    {"date.endDate" : {$gte : compareEndDate}}
                ]})
                .populate('tag')
                .exec();

            const sharedCategory = await Category.find({sharer : req.user._id}).exec()

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

            sharedSchedule = sharedSchedule.reduce(function (acc, cur){
                return acc.concat(cur);
            })

            sharedSchedule = [...new Set(sharedSchedule.map(JSON.stringify))].map(JSON.parse);

            res.render('dashboard/dashboard', { title: 'Express', user : req.user, completeSchedule, readySchedule, sharedSchedule });
        } catch (e) {
            console.log(e);
        }
    },
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
    }
}
module.exports = dashboardController;