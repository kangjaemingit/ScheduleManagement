const { Category } = require("../models/Category")
const { User } = require("../models/User")

const categoryController={
    newCategory : async (req,res)=>{
        Category.create({
            categoryName:req.body.categoryName,
            Tags : req.body.Tags,
            sharer:req.body.sharer
        }),(err,result)=>{
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
        Category.findOneAndUpdate({_id:req.body._id},
            {$set:{categoryName:req.body.categoryName,
                    Tags:req.body.Tags,
                    sharer:req.body.sharer}}
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

        Category.findOneAndDelete({_id:req.body._id}),
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
