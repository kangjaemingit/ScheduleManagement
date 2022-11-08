const { Category } = require('../models/Category');

/**
 * 담당자 : 강재민
 * 함수 설명 : 캘린더 페이지를 렌더링 해주는 함수입니다.
 * 주요 기능 : - 유저정보와 내가 생성한 카테고리 정보를 함께 렌더링 합니다.
 * */
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
