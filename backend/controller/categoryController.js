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
    updateCategory : async (req,res)=>{
        await Category.findOneAndUpdate({_id:req.body.categoryId},
            {$set:{categoryName : req.body.categoryName, tags : req.body.tags, sharer : req.body.sharer}})
            .exec((err,result) => {
            if(err){
                console.log("Category update err:" + err)
                return res.json({updateCategorySuccess:false, message:err});
            }
            else{
                return res.json({updateCategorySuccess:true}).status(200);
            }
        });

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
        User.find({_id : {$ne : req.user._id}}, (err, result) => {
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

    },
    sharedCategory : (req, res) => {
        Category.find({$and : [{sharer: {$in: req.user._id}}, {$ne : {categoryWriter : req.user._id}}]})
            .populate("categoryWriter")
            .populate("sharer")
            .populate("tags")
            .exec((err, result) => {
                if (err) {
                    console.log(err);
                    return res.json({sharedCategorySuccess: false, message: err});
                }
                return res.json({sharedCategories: result}).status(200);
            })

    }
}
module.exports=categoryController;
