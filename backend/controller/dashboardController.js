const {Schedule} = require("../models/Schedule");

const dashboardController={
    index : async (req, res) => {
        const today = new Date();
        const compareStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0)
        const compareEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)

        const schedule = await Schedule.find({
            $and : [
                {scheduleWriter : req.user._id},
                {"date.startDate" : {$lt : compareStartDate}},
                {"date.endDate" : {$gte : compareEndDate}}
            ]})
            .populate('tag')
            .exec();


        res.render('dashboard/dashboard', { title: 'Express', user : req.user, schedule });
    }
}
module.exports = dashboardController;