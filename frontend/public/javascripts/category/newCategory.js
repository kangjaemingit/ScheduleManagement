let tagList = []; // 태그를 담을 변수

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 선택란의 태그를 렌더하는 함수입니다.
 * 주요 기능 : - tagList 변수에 들어있는 태그는 체크박스에 체크된 상태로 표시되게 하였습니다.
 *            - 입력받은 태그를 렌더해주었습니다.
 * */
function selectTagRender(tags){
    let rows = "";
    tags.map((tag) => {
        rows += (tagList.some(t => t._id === tag._id)) ?
        `<label><input type="checkbox" checked name='${tag.tagName}' id='cb_${tag._id}' onchange='tagChecked(${JSON.stringify(tag)} ,this)'>${tag.tagName}</label>`
        : `<label><input type="checkbox" name='${tag.tagName}' id='cb_${tag._id}' onchange='tagChecked(${JSON.stringify(tag)} ,this)'>${tag.tagName}</label>`
    });
    document.getElementById('tagSelectBox').innerHTML = rows;
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 선택된 태그를 렌더링 해주는 함수입니다.
 * 주요 기능 : - 태그 선택란에서 태그가 선택되면 선택된 태그란의 태그들을 렌더합니다.
 * */
function selectedTagRender(){
    let rows = [];
    // 태그리스트에 담긴 태그들을 렌더
    tagList.map((t) => {
        rows += `<div class="tags"><span class="tagSpan">${t.tagName}</span><img class="tagRemove" id="tagRemove" onclick='tagRemove("${t._id}")' src="/images/schedule/tag_delete.png"></div>`
    })

    document.getElementById('tagSelectedBox').innerHTML = rows;
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 상세정보 한정 삭제 버튼이 없는 태그목록을 렌더링 하는 함수입니다.
 * 주요 기능 : - 선택된 태그란에 선택된 태그를 삭제버튼 없이 렌더해주는 역할을 합니다.
 * */
function selectedTagRenderNotDeleteBtn(){
    let rows = [];
    tagList.map((t) => {
        rows += `<div class="tags"><span class="tagSpan">${t.tagName}</span></div>`
    })

    document.getElementById('tagSelectedBox').innerHTML = rows;
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 생성 모달에서 선택된 태그를 삭제할 때 실행되는 함수입니다.
 * 주요 기능 : - tagList 배열에서 삭제 버튼을 클릭한 태그를 삭제합니다.
 *            - 선택된 태그를 재렌더합니다.
 * */
function tagRemove(tagId){
    tagList = tagList.filter((t) => t._id !== tagId) // 태그리스트에서 삭제를 클릭한 태그 삭제
    document.getElementById('cb_' + tagId).checked = false; // 태그 선택란에서 삭제한 태그 체크 해제
    selectedTagRender(); // 선택된 태그 렌더
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 생성 모달을 열 때 사용하는 함수 입니다.
 * 주요 기능 : - 전체 태그 목록을 불러와 태그 선택란에 렌더 합니다.
 *            - 카테고리 생성 모달을 엽니다.
 * */
async function newCategoryModalOpen(){
    const newCategoryModal = document.querySelector('.newCategoryModal');
    const bodyScrollHidden=document.getElementsByTagName('body');
    document.getElementById('categoryModalTitle').innerText = "새로운 카테고리 등록"
    bodyScrollHidden[0].style.overflow='hidden'

    // 태그 리스트 불러오기
    fetch('calendar/getTagList', {
        method : 'get'
    }).then((res) => res.json())
        .then((res) => {
            if(res.getTagSuccess === false){
                window.alert("태그를 불러오지 못했습니다.");
                console.log(res.message);
                return;
            }

            selectTagRender(res.tags); // 태그 렌더
        }).catch((err) => {
            window.alert("태그 불러오기 데이터 통신 실패");
            console.log(err);
    })

    newCategoryModal.classList.toggle('show');

    if(newCategoryModal.classList.contains('show')){
        // body.style.overflow = 'hidden';
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 생성 모달을 닫을 때 사용하는 함수 입니다.
 * 주요 기능 : - 모든 변수를 초기화 해줍니다.
 *            - 수정, 상세, 생성 등에서 변환되었던 컴포넌트를 원래대로 복원시켜주는 작업을 합니다.
 *            - 카테고리 생성 모달을 닫습니다.
 * */
function newCategoryModalClose(){
    const newCategoryModal = document.querySelector('.newCategoryModal');
    const bodyScrollHidden=document.getElementsByTagName('body');
    userList = [];
    tagList = [];

    // 카테고리명 input 속성 변경
    document.getElementById('categoryName').readOnly = false; // 읽기 전용 해제
    document.getElementById('categoryName').value = ""; // 값 삭제
    document.getElementById('categoryName').classList.replace('input-primary-readOnly', 'input-primary'); // 읽기전용 디자인 -> input 디자인

    document.getElementById('tagSelectArea').style.display = 'block'; // 태그 선택란 보이게
    document.getElementById('categoryModalTitle').innerText = "새로운 카테고리 등록"; // 모달 제목 변경
    document.getElementById('sharerCheckBox').disabled = false; // 공유여부 체크박스 disabled 해제
    document.getElementById('sharerCheckBox').checked = false; // 공유여부 체크박스 체크 해제
    sharerChecked(document.getElementById('sharerCheckBox')); // 공유여부 체크박스 해제에 따른 로직 함수 실행
    document.getElementById('categoryCompleteBtnArea').style.display = 'block'; // 카테고리 저장 버튼 보이게
    document.getElementById('tagSelectedArea').style.width = '50%'; // 태그 선택란 넓이 변경
    document.getElementById('tagSelectedArea').style.height = '200px'; // 태그 선택란 높이 변경
    document.getElementById('tagSelectedBox').innerHTML = ""; // 선택된 태그 란 비우기
    document.getElementById('chosenUserTableBody').innerHTML = ""; // 선택된 공유자 란 비우기
    document.getElementById('chosenSharer').innerHTML = ""; // 공유자 선택 모달의 선택된 공유자 란 비우기
    document.getElementById('categoryDetailSchedule').innerHTML = ""; // 카테고리 상세정보 일정 목록 비우기
    document.getElementById('categoryDetailScheduleArea').style.display = 'none'; // 카테고리 상세정보 일정 목록 보이지 않게
    document.getElementById('chooseSharerBtn').style.display = 'block'; // 공유자 선택 버튼 보이게

    document.getElementById('saveCategoryButton').setAttribute("onClick", `saveNewCategory()`) // 카테고리 저장 버튼 onclick 속성 변경

    newCategoryModal.classList.toggle('show'); // 모달 닫기
    bodyScrollHidden[0].style.overflow='auto' // 스크롤 보이게
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 모달의 태그 선택란에서 태그가 선택되었을 때 실행되는 함수 입니다.
 * 주요 기능 : - 체크가 true 이면 tagList 배열에 태그를 담아줍니다.
 *            - 체크가 false 이면 tagList 배열에 있는 태그를 삭제합니다.
 *            - 선택된 태그를 재렌더합니다.
 * */
function tagChecked(tag, checkBox){
    if(checkBox.checked){ // 체크박스가 체크되었을 때
        tagList.push(tag);
    } else{ // 체크박스 체크가 해제되었을 때
        tagList = tagList.filter((t) => t._id !== tag._id)
    }
    selectedTagRender(); // 선택된 태그 렌더
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유자 선택 여부 체크박스 체크 시 발생하는 함수입니다.
 * 주요 기능 : - 체크가 true이면 공유자 선택 버튼과, 선택된 공유자 표시란을 보이게 합니다
 *          - 체크가 false이면 공유자 선택 버튼과, 선택된 공유자 표시란을 보이지 않게 합니다.
 * */
function sharerChecked(check){
    if(check.checked){
        document.getElementById('chosenSharerContainer').style.display = 'flex';
        document.getElementById('chosenSharer').style.display = 'flex';
    } else{
        document.getElementById('chosenSharerContainer').style.display = 'none';
        document.getElementById('chosenSharer').style.display = 'none';
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 저장 완료를 처리해주는 함수입니다.
 * 주요 기능 : - 제목, 태그수의 유효성을 검사합니다.
 *            - 공유자 체크박스를 해제하면 유저목록을 비워 줍니다.
 *            - 태그와 공유자를 id만 추출하여 배열에 담습니다.
 *            - 입력내용을 데이터변수에 담아 create API를 실행합니다.
 * */
function saveNewCategory(){
    if(document.getElementById('categoryName').value.trim() === ""){
        toast("카테고리 제목을 입력해주세요.")
        return;
    }

    if(!tagList.length){
        toast("태그를 1개 이상 선택해주세요.")
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

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 선택란의 태그를 검색하는 함수입니다.
 * 주요 기능 : - 키워드를 입력받아 태그를 검색하여 태그 선택란을 렌더합니다.
 * */
function searchTag(key){
    // 태그 검색
    fetch('schedule/autoComplete', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({keyword : key.value})
    })
        .then((res) => res.json())
        .then((result) => {
            selectTagRender(result.autoComplete); // 태그 선택란 렌더
        }).catch((err) => {
        console.log(err);
    })
}