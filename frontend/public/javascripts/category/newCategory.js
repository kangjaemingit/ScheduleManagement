const body = document.querySelector('body');
const newCategoryModal = document.querySelector('.newCategoryModal');
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
            let rows = "";
            res.tags.map((t) => {
                rows += `<label><input type="checkbox" name="${t.tagName}" value="${t._id}" onchange="tagChecked(this)">${t.tagName}</label>`
            })
            document.getElementById('tagSelectArea').innerHTML = rows;
        }).catch((err) => {
            window.alert("태그 불러오기 데이터 통신 실패");
            console.log(err);
    })

    newCategoryModal.classList.toggle('show');

    if(newCategoryModal.classList.contains('show')){
        body.style.overflow = 'hidden';
    }
}

function newCategoryModalClose(){
    newCategoryModal.classList.toggle('show');
}

let tagIdList = [];
let tagNameList = [];
function tagChecked(t){
    if(t.checked){
        console.log(t.value);
        tagIdList.push(t.value);
        tagNameList.push(t.name);
    } else{
        tagIdList = tagIdList.filter((tag) => tag !== t.value);
        tagNameList = tagNameList.filter((tag) => tag !== t.name);
    }

    let rows = [];
    tagNameList.map((tag) => {
        rows += `<p>${tag}</p>`
    })

    document.getElementById('tagSelectedArea').innerHTML = rows;


}

function sharerChecked(check){
    if(check.checked){
        document.getElementById('chooseSharerBtn').style.display = 'block';
    } else{
        document.getElementById('chooseSharerBtn').style.display = 'none';
    }

}

function saveNewCategory(){

}