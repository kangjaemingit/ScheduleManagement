function categoryDelete(id){
    if(window.confirm("정말 카테고리를 삭제하시겠습니까?")){
        fetch('/calendar/deleteCategory/' + id, {
            method : "delete"
        }).then((res) => res.json())
            .then((res) => {
                if(res.deleteCategorySuccess){
                    window.alert("카테고리가 정상적으로 삭제되었습니다.")
                    window.location.reload();
                } else{
                    window.alert("카테고리 삭제에 실패했습니다.")
                    console.log(res.message);
                }
            }).catch((e) => {
            console.log(e);
        })
    }
}

function categoryEditModalOpen(category){
    console.log(category);
    userList = category.sharer;
    tagList = category.tags;

    fetch('calendar/getTagList', {
        method : 'get'
    }).then((res) => res.json())
        .then((res) => {
            if(res.getTagSuccess === false){
                window.alert("태그를 불러오지 못했습니다.");
                console.log(res.message);
                return;
            }
            let rows = "";
            res.tags.map((tag) => {
                rows +=
                tagList.some((t) => t.tagName === tag.tagName) ?
                 `<label><input type="checkbox" name='${tag.tagName}' value='${tag._id}' checked onchange='tagChecked(${JSON.stringify(tag)} ,this)'>${tag.tagName}</label>`
                    : `<label><input type="checkbox" name='${tag.tagName}' value='${tag._id}' onchange='tagChecked(${JSON.stringify(tag)} ,this)'>${tag.tagName}</label>`
            })
            document.getElementById('tagSelectArea').innerHTML = rows;
        }).catch((err) => {
        window.alert("태그 불러오기 데이터 통신 실패");
        console.log(err);
    })

    selectedTagRender();
    chosenUserRender();
    saveChooseSharer();

    document.getElementById('categoryModalTitle').innerText = "카테고리 편집"
    document.getElementById('categoryName').value = category.categoryName;

    if(userList.length){
        document.getElementById('sharerCheckBox').checked = true;
        sharerChecked(document.getElementById('sharerCheckBox'));
    }

    document.getElementById('saveCategoryButton').setAttribute("onClick", `categoryUpdate('${category._id}')`)

    newCategoryModal.classList.toggle('show');
}

function categoryUpdate(categoryId){
    if(document.getElementById('categoryName').value.trim() === ""){
        window.alert("카테고리 제목을 입력해주세요.")
        return;
    }

    if(!tagList.length){
        window.alert("태그를 1개 이상 선택해주세요.")
        return;
    }

    if(!document.getElementById('sharerCheckBox').checked){
        userList = [];
    }

    let tagIdList = tagList.map((tag) => {
        return tag._id
    })

    let userIdList = userList.map((user) => {
        return user._id;
    })

    const category = {
        categoryId : categoryId,
        categoryName : document.getElementById('categoryName').value,
        tags : tagIdList,
        sharer : userIdList,
    }



    fetch('calendar/updateCategory', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(category)
    }).then((res) => res.json())
        .then((res) => {
            if(res.updateCategorySuccess){
                window.alert("카테고리가 정상적으로 수정되었습니다.");
                window.location.reload();
            } else{
                window.alert(res.message);
            }
        }).catch((err) => {
        console.log(err);
    })
}

function moreButton(){
   let moreButton = document.getElementById('moreButton');
   let categoryEdit = document.getElementById('categoryEdit');
   let categoryDelete = document.getElementById('categoryDelete');
   moreButton.style.display='none';
   categoryEdit.style.display='block';
   categoryDelete.style.display='block';

}