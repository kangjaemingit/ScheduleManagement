// const body = document.querySelector('body');
const newCategoryModal = document.querySelector('.newCategoryModal');

let tagList = [];
function selectTagRender(tags){
    let rows = "";
    tags.map((tag) => {
        rows += (tagList.some(t => t._id === tag._id)) ?
        `<label><input type="checkbox" checked name='${tag.tagName}' id='cb_${tag._id}' onchange='tagChecked(${JSON.stringify(tag)} ,this)'>${tag.tagName}</label>`
        : `<label><input type="checkbox" name='${tag.tagName}' id='cb_${tag._id}' onchange='tagChecked(${JSON.stringify(tag)} ,this)'>${tag.tagName}</label>`
    });
    document.getElementById('tagSelectBox').innerHTML = rows;
}

function selectedTagRender(){
    let rows = [];
    tagList.map((t) => {
        rows += `<div class="tags"><span class="tagSpan">${t.tagName}</span><img class="tagRemove" id="tagRemove" onclick='tagRemove("${t._id}")' src="/images/schedule/tag_delete.png"></div>`
    })

    document.getElementById('tagSelectedBox').innerHTML = rows;
}

function tagRemove(tagId){
    tagList = tagList.filter((t) => t._id !== tagId)
    document.getElementById('cb_' + tagId).checked = false;
    selectedTagRender();
}

async function newCategoryModalOpen(){
    fetch('calendar/getTagList', {
        method : 'get'
    }).then((res) => res.json())
        .then((res) => {
            if(res.getTagSuccess === false){
                window.alert("태그를 불러오지 못했습니다.");
                console.log(res.message);
                return;
            }
            selectTagRender(res.tags);
        }).catch((err) => {
            window.alert("태그 불러오기 데이터 통신 실패");
            console.log(err);
    })

    newCategoryModal.classList.toggle('show');

    if(newCategoryModal.classList.contains('show')){
        // body.style.overflow = 'hidden';
    }
}

function newCategoryModalClose(){
    newCategoryModal.classList.toggle('show');

    window.location.reload();
}


function tagChecked(tag, checkBox){
    if(checkBox.checked){
        tagList.push(tag);
    } else{
        tagList = tagList.filter((t) => t._id !== tag._id)
    }
    selectedTagRender();

}

function sharerChecked(check){
    if(check.checked){
        document.getElementById('chooseSharerBtn').style.display = 'block';
        document.getElementById('chosenSharer').style.display = 'block';
    } else{
        document.getElementById('chooseSharerBtn').style.display = 'none';
        document.getElementById('chosenSharer').style.display = 'none';
    }
}

function saveNewCategory(){
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

    const newCategory = {
        categoryName : document.getElementById('categoryName').value,
        tags : tagIdList,
        sharer : userIdList,
    }

    fetch('calendar/newCategory', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(newCategory)
    }).then((res) => res.json())
        .then((res) => {
            if(res.newCategorySuccess){
                window.alert("카테고리가 정상적으로 등록되었습니다.");
                window.location.reload();
            } else{
                window.alert(res.message);
            }
        }).catch((err) => {
        console.log(err);
    })
}

function searchTag(key){
    fetch('schedule/autoComplete', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({keyword : key.value})
    })
        .then((res) => res.json())
        .then((result) => {
            selectTagRender(result.autoComplete);
        }).catch((err) => {
        console.log(err);
    })
}