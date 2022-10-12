const { Category } = require("../models/Category")
const { User } = require("../models/User")
const { Tags } = require("../models/Tags")

const categoryController = {
    newCategory : async (req,res)=>{
        await Category.create({
            categoryName: req.body.categoryName,
            tags : req.body.tags,
            sharer: req.body.sharer,
            categoryWriter: req.user._id
        }, (err, result) => {
            if(err){
                console.log("new Category create Error:"+err);
                return res.json({newCategorySuccess : false, message:err});
            }
            else{
                return res.json({newCategorySuccess:true})
                    .status(200);
            }
        });
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
        Category.deleteOne({$and : [{_id : req.params.id}, {categoryWriter : req.user._id}]}, (err) => {
            if(err){
                console.log("deleteCategory Err : " + err);
                return res.json({deleteCategorySuccess : false, message : err})
            }
            return res.json({deleteCategorySuccess : true}).status(200);
        })
    },
    getMyCategory : (req, res) => {
      Category.find({categoryWriter : req.user._id},
          (err, result) =>{
          if(err){
              console.log(err);
              return res.json({ getMyCategorySuccess : false, message : err });
          }
          return res.json({ categories : result }).status(200);
      })
    },
    getTagList : (req, res) => {
        Tags.find({}, (err, result) => {
            if(err){
                console.log(err);
                return res.json({getTagSuccess : false, message : err});
            }
            return res.json({getTagSuccess : true, tags : result});
        })
    },
    getUserList : (req, res) => {
        User.find({}, (err, result) => {
            if(err){
                console.log(err);
                return res.json({getUserSuccess : false, message : err});
            }
            return res.json({getUserSuccess : true, users : result});
        })
    },
    searchUser : (req, res) => {
        User.find({$or : [{name : {$regex : req.body.keyword}}, {email : {$regex : req.body.keyword}}]}
        , (err, result) => {
            if(err){
                console.log(err);
                return res.json({searchUserSuccess : false, message : err});
            }
            return res.json({searchUserSuccess : true, users : result});
            });

    }

}
module.exports=categoryController;
