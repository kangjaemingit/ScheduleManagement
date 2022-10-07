const { User } = require("../models/User")

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