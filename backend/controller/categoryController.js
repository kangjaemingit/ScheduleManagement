const { Category } = require("../models/Category")
const { User } = require("../models/User")
const { Tags } = require("../models/Tags")

const categoryController = {
    /**
     * 담당자 : 강재민
     * 함수 설명 : 새로운 카테고리를 생성하는 함수입니다.
     * 주요 기능 : 사용자로부터 카테고리 생성과 관련한 데이터를 입력받아 새로운 카테고리를 생성합니다.
     * */
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
    /**
     * 담당자 : 강재민
     * 함수 설명 : 카테고리를 수정하는 함수입니다.
     * 주요 기능 : - 카테고리명과 태그, 공유자 정보를 입력받아 기존에 있던 카테고리를 수정합니다.
     * */
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
    /**
     * 담당자 : 강재민
     * 함수 설명 : 카테고리를 삭제하는 함수입니다.
     * 주요 기능 : - 카테고리ID를 입력받아 본인이 만든 카테고리이면 카테고리를 삭제합니다.
     * */
    deleteCategory : async (req,res) =>{
        Category.deleteOne({$and : [{_id : req.params.id}, {categoryWriter : req.user._id}]}, (err) => {
            if(err){
                console.log("deleteCategory Err : " + err);
                return res.json({deleteCategorySuccess : false, message : err})
            }
            return res.json({deleteCategorySuccess : true}).status(200);
        })
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 내가 생성한 카테고리를 불러오는 함수입니다.
     * 주요 기능 : - 세션에 저장된 사용자 id를 사용하여 카테고리 작성자와 일치하는 내용을 찾아 return 합니다..
     * */
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
    /**
     * 담당자 : 강재민
     * 함수 설명 : 카테고리 생성 모달에서 태그를 선택하기 위해 모든 태그를 불러오는 함수입니다.
     * 주요 기능 : - DB에 저장되어있는 모든 태그를 찾아 return 합니다.
     * */
    getTagList : (req, res) => {
        Tags.find({}, (err, result) => {
            if(err){
                console.log(err);
                return res.json({getTagSuccess : false, message : err});
            }
            return res.json({getTagSuccess : true, tags : result});
        })
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 카테고리 생성 모달에서 공유자를 선택하기위해 모든 사용자를 불러오는 함수입니다.
     * 주요 기능 : - 나를 제외한 모든 사용자를 찾아 return 합니다.
     * */
    getUserList : (req, res) => {
        User.find({_id : {$ne : req.user._id}}, (err, result) => {
            if(err){
                console.log(err);
                return res.json({getUserSuccess : false, message : err});
            }
            return res.json({getUserSuccess : true, users : result});
        })
    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 카테고리 생성 모달에서 사용자를 검색하기 위해 사용하는 함수입니다.
     * 주요 기능 : - 사용자명 혹은 사용자 E-mail에서 입력받은 값을 포함하는 사용자를 찾아 return 합니다.
     * 수정 사항 : 본인의 데이터는 return 하지 않는 것으로 변경
     * */
    searchUser : (req, res) => {
        User.find({$and : [{$or : [{name : {$regex : req.body.keyword}}, {email : {$regex : req.body.keyword}}]}, {_id : {$ne : req.user._id}}]}
        , (err, result) => {
            if(err){
                console.log(err);
                return res.json({searchUserSuccess : false, message : err});
            }
            return res.json({searchUserSuccess : true, users : result});
            });

    },
    /**
     * 담당자 : 강재민
     * 함수 설명 : 공유함에 내가 공유받은 카테고리 내용을 불러오기 위한 함수
     * 주요 기능 : - 공유자에 '나'가 포함되어있고, 카테고리 작성자가 '나'가 아닌 카테고리의 정보들을 불러오는 함수입니다.
     * */
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
