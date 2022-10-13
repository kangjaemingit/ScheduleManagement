function categoryDelete(id){
    if(window.confirm("정말 카테고리를 삭제하시겠습니까?")){
        fetch('/calendar/deleteCategory/' + id, {
            method : "get"
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

    let tagRows = [];
    tagList.map((t) => {
        tagRows += `<p>${t.tagName}</p>`
    });
    document.getElementById('tagSelectedArea').innerHTML = tagRows;

    chosenUserRender(userList);

    let sharerRows = [];
    userList.map((user) => {
        sharerRows += `<div class="sharers"><span class="sharerSpan">${user.name}(${user.email})</span></div>`
    })
    document.getElementById('chosenSharer').innerHTML = sharerRows;

    document.getElementById('categoryName').value = category.categoryName;

    if(userList.length){
        document.getElementById('sharerCheckBox').checked = true;
        sharerChecked(document.getElementById('sharerCheckBox'));
    }

    newCategoryModal.classList.toggle('show');
}