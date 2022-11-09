const { User } = require("../models/User")
/*************************************************************************
 * 담당자 : 김건희
 * 함수 설명 : Navbar에 이용자 이름 및 지정 색상 변경
 * 주요 기능 : Navbar에 이용자 이름 및 지정 색상 변경
 * ***********************************************************************/
const layoutController = {
    updatePaint : async (req,res)=>{
        User.updateOne({_id:req.user._id},
            {$set:{navBgColor:req.body.navBgColor}},
            (err)=>{
            if(err){
                console.log(err)
                return res.json({updateSuccess:false, message:err})
            }
                return res.json({updateSuccess:true, navBgColor: req.body.navBgColor})
            })
    }
}
module.exports = layoutController;