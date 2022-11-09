/**
 * 담당자 : 강재민
 * 함수 설명 : 나의 카테고리를 삭제해주는 함수입니다. 캘린더 페이지의 좌측에 있는 카테고리 목록에서 삭제 버튼을 클릭했을 시 발생하는 함수입니다.
 * 주요 기능 : - 카테고리 삭제 요청 시 confirm 메시지를 띄워주고, 확인을 누르면 삭제 API를 요청합니다.
 *            - 공유자 모달을 닫습니다.
 * */
function categoryDelete(id){
    if(window.confirm("정말 카테고리를 삭제하시겠습니까?")){ // 삭제 여부 확인
        fetch('/calendar/deleteCategory/' + id, {
            method : "delete"
        }).then((res) => res.json())
            .then((res) => {
                if(res.deleteCategorySuccess){ // 삭제 성공
                    window.alert("카테고리가 정상적으로 삭제되었습니다.") // 카테고리 삭제
                    window.location.reload(); // 새로고침
                } else{ // 삭제 실패
                    window.alert("카테고리 삭제에 실패했습니다.") // 오류
                    console.log(res.message);
                }
            }).catch((e) => {
            console.log(e);
        })
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 좌측 나의 카테고리 목록에서 카테고리를 선택했을 때 실행되는 함수입니다.
 * 주요 기능 : - 카테고리를 입력받아 캘린더에 카테고리에 해당하는 일정을 표시합니다.
 *            - 카테고리 상세 모달을 표시합니다.
 * */
function myCategorySelect(category){
    changeCategoryMySchedule(category);
    categoryDetailModalOpen(category);
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 상세 페이지에서 해당 카테고리에 해당하는 일정들을 렌더링하는 함수입니다.
 * 주요 기능 : - 일정을 인자로 받아 카테고리 상세페이지의 일정 목록을 표시합니다.
 * */
function categoryDetailScheduleRender(schedule){
    let rows = "";

    // 일정 표시
    schedule.map((s) => {
        let startDate = new Date(s.date.startDate); // 시작일
        let endDate = new Date(s.date.endDate); // 마감일
        rows += `<div class="categoryDetailScheduleBox"><div class="listIcon"></div>`
            + `<span style="margin-left: 5px; margin-right: 5px">${startDate.getFullYear()}.${startDate.getMonth() + 1}.${startDate.getDate()}
                - ${endDate.getFullYear()}.${endDate.getMonth() + 1}.${endDate.getDate()}</span>`
            + `<span>${s.title}</span></div>`
    });

    document.getElementById('categoryDetailSchedule').innerHTML = rows;
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 상세 모달을 열어주는 함수입니다.
 * 주요 기능 : - userList, tagList 변수에 해당하는 공유자와 태그를 담아줍니다.
 *            - 태그를 렌더하고, 공유자를 렌더합니다.
 *            - 제목 등 값들을 바인딩 하고, 상세페이지에서 보여야 할 컴포넌트들의 display를 보이게 합니다.
 * */
function categoryDetailModalOpen(category){
    userList = category.sharer; // 공유자
    tagList = category.tags; // 태그

    // 모달 열림 시 스크롤 숨김(김건희)
    const bodyScrollHidden=document.getElementsByTagName('body');
    bodyScrollHidden[0].style.overflow='hidden'

    // 태그 선택 란 display 해제
    document.getElementById('tagSelectArea').style.display = 'none';

    selectedTagRenderNotDeleteBtn(); // 선택된 태그 목록 렌더링
    saveChooseSharer(); // 선택된 공유자 렌더링

    document.getElementById('categoryName').readOnly = true; // 카테고리 명을 읽을수만 있도록 변경
    document.getElementById('categoryName').classList.replace('input-primary', 'input-primary-readOnly'); // input 디자인 변경을 위한 클래스 변경
    document.getElementById('categoryModalTitle').innerText=`<${category.categoryName}>` // 카테고리 이름 바인딩(모달 제목)
    document.getElementById('categoryName').value = category.categoryName; // 카테고리 이름 바인딩(input)
    document.getElementById('sharerCheckBox').disabled = true; // 공유자 선택 체크박스 선택 불가하게 변경
    document.getElementById('categoryCompleteBtnArea').style.display = 'none'; // 카테고리 저장 완료 버튼 숨김
    document.getElementById('tagSelectedArea').style.width = '100%'; // 선택된 태그 영역 가로 확장
    document.getElementById('tagSelectedArea').style.height = '100px'; // 선택된 태그 영역 세로 축소
    document.getElementById('categoryDetailScheduleArea').style.display = 'block'; // 카테고리 일정 표시란 숨김 해제

    if(userList.length){ // 공유자가 존재 할 경우
        document.getElementById('sharerCheckBox').checked = true; // 공유자 선택 체크박스에 체크
        sharerChecked(document.getElementById('sharerCheckBox')); // 공유자 선택 체크박스 함수 실행( 아래의 공유자 목록을 보이게 하기 위함 )
        document.getElementById('chooseSharerBtn').style.display = 'none'; // 공유자 선택 버튼 숨김
    }

    newCategoryModal.classList.toggle('show'); // 상세 모달 열기
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 편집 모달을 열어주는 함수입니다.
 * 주요 기능 : - userList, tagList 변수에 해당하는 공유자와 태그를 담아줍니다.
 *            - 태그, 공유자, 태그목록, 사용자목록을 렌더합니다.
 *            - 제목 등 값들을 바인딩 하고, 편집 모달에 보여야 할 컴포넌트들의 display를 보이게 합니다.
 * */
function categoryEditModalOpen(category){
    userList = category.sharer; // 공유자
    tagList = category.tags; // 태그

    // 모달 열림 시 스크롤 숨김(김건희)
    const bodyScrollHidden=document.getElementsByTagName('body');
    bodyScrollHidden[0].style.overflow='hidden'

    // 태그 목록 받아오기
    fetch('calendar/getTagList', {
        method : 'get'
    }).then((res) => res.json())
        .then((res) => {
            if(res.getTagSuccess === false){
                window.alert("태그를 불러오지 못했습니다.");
                console.log(res.message);
                return;
            }
            selectTagRender(res.tags); // 태그 선택란 태그 렌더
        }).catch((err) => {
        window.alert("태그 불러오기 데이터 통신 실패");
        console.log(err);
    })

    selectedTagRender(); // 선택된 태그 렌더
    chosenUserRender(); // 공유자 모달에 선택된 사용자 렌더
    saveChooseSharer(); // 카테고리 모달에 선택된 사용자 렌더

    document.getElementById('categoryModalTitle').innerText = "카테고리 편집" // 모달 제목 변경
    document.getElementById('categoryName').value = category.categoryName; // 모달 내 카테고리 제목 input 설정

    // 공유자가 있을 시
    if(userList.length){
        document.getElementById('sharerCheckBox').checked = true; // 공유자 선택 체크박스 true
        sharerChecked(document.getElementById('sharerCheckBox')); // 공유자 선택 됐을 떄 실행되는 함수 실행
    }

    // 완료 버튼 onclick 속성 변경
    document.getElementById('saveCategoryButton').setAttribute("onClick", `categoryUpdate('${category._id}')`)

    // 모달 열기
    newCategoryModal.classList.toggle('show');
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 카테고리 수정 완료를 처리해주는 함수입니다.
 * 주요 기능 : - 제목, 태그수의 유효성을 검사합니다.
 *            - 공유자 체크박스를 해제하면 유저목록을 비워 줍니다.
 *            - 태그와 공유자를 id만 추출하여 배열에 담습니다.
 *            - 입력내용을 데이터변수에 담아 update API를 실행합니다.
 * */
function categoryUpdate(categoryId){
    // 제목 입력여부 검사
    if(document.getElementById('categoryName').value.trim() === ""){
        toast("카테고리 제목을 입력해주세요.")
        return;
    }

    // 태그 선택 여부 검사
    if(!tagList.length){
        toast("태그를 1개 이상 선택해주세요.")
        return;
    }

    // 공유자 선택 체크박스 해제시 유저목록 비움
    if(!document.getElementById('sharerCheckBox').checked){
        userList = [];
    }

    // 선택한 태그 ID 추출
    let tagIdList = tagList.map((tag) => {
        return tag._id
    })

    // 선택한 공유자 ID 추출
    let userIdList = userList.map((user) => {
        return user._id;
    })

    // 데이터 정리
    const category = {
        categoryId : categoryId,
        categoryName : document.getElementById('categoryName').value,
        tags : tagIdList,
        sharer : userIdList,
    }

    // API 요청
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
   // let moreButton = document.getElementById('moreButton');
   let categoryEdit = document.getElementById('categoryEdit');
   let categoryDelete = document.getElementById('categoryDelete');

   // moreButton.style.display='none';
   categoryEdit.style.display='block';
   categoryDelete.style.display='block';
}