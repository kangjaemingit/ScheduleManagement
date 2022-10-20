const { Category } = require('../models/Category');


const calendarController={
    index : async (req, res) => {
        try{
            const myCategories =
                await Category.find({categoryWriter : req.user._id})
                    .populate("tags")
                    .populate("sharer")
                    .exec();
            res.render('calendarPage/calendarPage', { title: 'Express',user : req.user, myCategories});
        } catch (e){
            console.log(e);
        }

    }

}
module.exports=calendarController;
