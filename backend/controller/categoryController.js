const { Category } = require("../models/Category")
const { User } = require("../models/User")
const { Tags } = require("../models/Tags")

const categoryController={
    newCategory : async (req,res)=>{
        await Category.create({
            categoryName:req.body.categoryName,
            Tags : [req.body.Tags._id],
            sharer: [req.body.sharer._id],
            // categoryWriter:req.user._id
        }),(err,result)=>{
            console.log("result1",res)
            if(err){
                console.log("new Category create Error:"+err);
                return res.json({message:err});
            }
            else{
                return res.status(200).json({createSuccess:true});
            }
        }
    },
    editCategory : async (req,res)=>{
        await Category.findOneAndUpdate({_id:req.body._id},
            {$set:{categoryName:req.body.categoryName,
                    Tags:req.body.Tags._id,
                    sharer:req.body.sharer._id}}
        ),(err,result)=>{
            if(err){
                console.log("Category update err:"+err)
                return res.json({message:err});
            }
            else{
                return res.status(200).json({updateSuccess:true});
            }
        }
    },
    deleteCategory : async (req,res) =>{
        await Category.findOneAndDelete({_id:req.body._id}),
            (err,result)=>{
            if(err){
                console.log("Category delete Error:"+err)
                return res.json({messge:err});
            }
            else
            {
                return res.status(200).json({DeleteSuccess:true})
            }
        }
    }

}
module.exports=categoryController;
