const {Schedule} = require("../models/Schedule");

const tagStatisticsController={
    index : async (req, res) => {
        const scheduleAllCount = await Schedule.count({scheduleWriter : req.user._id}).exec();
        const usedTagKindCount = 0;
        const usedTagCount = 0;

        res.render('tagStatistics/tagStatistics', {user : req.user});
    }

}
module.exports=tagStatisticsController;