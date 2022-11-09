/**
 * 담당자 : 강재민, 김건희
 * 함수 설명 : 공유함을 열 때 사용하는 함수입니다.
 * 주요 기능 : 강재민
 *            - 공유받은 카테고리 목록을 불러옵니다.
 *            - 공유받은 카테고리 목록을 공유한 사용자 이름에 맞게 데이터를 가공합니다.
 *            - 공유함에 공유한 사용자의 이름과 카테고리를 렌더합니다.
 *            김건희
 *            - 공유함 버튼 클릭시 모달 해당 위치 설정
 *            - 공유함 버튼 클릭시 모달 이 차지하는 크기만큼 캘린더 밀리게 설정
 *            - 공유함 버튼 클릭시 모달 보이게 설정
 *            - 전체 영역 스크롤 안되게 설정
 *            - 모달 닫았을때 캘린더 다시 원래자리로 오게 설정
 * */
async function sharedDirectoryModalOpen() {
    const sharedDirectoryModal = document.getElementById('sharedDirectoryModal');
    sharedDirectoryModal.style.display = 'block';
    const moveRightContainer = document.getElementById('indexRight');
    moveRightContainer.style.marginLeft = '301px';
    moveRightContainer.style.transition = '0.1s'
    const bodyScrollHidden=document.getElementsByTagName('body');
    bodyScrollHidden[0].style.overflow = 'hidden';
    // const modalOpenBtn = document.getElementById('modalOpenBtn');
    // modalOpenBtn.style.display = 'none'

    // 공유받은 카테고리 받아오기
    await fetch('calendar/sharedCategory', {
        method: "get"
    }).then((res) => res.json())
        .then(async (res) => { // 받아오기 실패시
            if (res.sharedCategorySuccess === false) {
                console.log(res.message);
                window.alert("공유받은 카테고리 정보 불러오기 실패");
                return;
            }

            let array = [{}]; // 데이터를 정리해줄 객체 변수 선언
            await res.sharedCategories.map((c) => {
                let idx; // 인덱스 변수 선언
                let writerExist = array.some(function (element, index, arr) {
                    if (element.categoryWriterId === c.categoryWriter._id) { // array에 작성자가 이미 있을 경우
                        idx = index; // idx에 index 저장
                        return true; // true 반환
                    } else return false;
                });
                if (writerExist) { // writerExist가 true일 경우(작성자가 이미 있을경우)
                    array[idx].categories.push(c) // 작성자가 있는 array[인덱스]에 해당 카테고리 저장
                } else {
                    return array.push({ // 없으면 새로운 객체 생성
                        categoryWriterId: c.categoryWriter._id,
                        writerProfile: c.categoryWriter.profilePhoto,
                        writerName: c.categoryWriter.name,
                        categories: [c]
                    })
                }
            });

            array.shift(); // 객체 첫번째 값 삭제

            // 가공해준 데이터 공유함에 바인딩
            let rows = [];
            array.map((c) => {
                // 사용자 이름
                rows += `<div class="sharerRootNode">`
                    + `<img class='arrowIcon' src="images/category/arrow-up.png" id='arrow_${c.categoryWriterId}' onclick='sharerChildNodeControl("${c.categoryWriterId}")'>`
                    + `<img class='dirSharerProfilePhoto' src='${c.writerProfile}'>`
                    + `<span>${c.writerName}</span></div>`
                    + `<div class="sharerChildNode" id='cn_${c.categoryWriterId}' style="display: none;">`;

                // 사용자 이름에 해당하는 카테고리
                c.categories.map((c) => {
                    rows += `<div class="sharerNodeCategory" onclick='categorySelect(${JSON.stringify(c)})'><li class="sharerNodeCategoryLi">${c.categoryName}</li></div>`
                });

                rows += `</div>`;
            })
            document.getElementById('sharerList').innerHTML = rows;
        })
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유함에 있는 카테고리를 선택했을 때 실행되는 함수 입니다.
 * 주요 기능 : - 태그와 작성자를 통해 해당하는 일정을 불러옵니다.
 *            - 캘린더에 카테고리에 해당하는 일정들을 바인딩합니다.
 *            - 카테고리 상세 모달의 일정 목록을 렌더합니다.
 *            - 카테고리 상세 모달을 엽니다.
 * */
function categorySelect(category) {
    // 데이터 가공
    const data = {
        tags: category.tags,
        categoryWriter: category.categoryWriter
    }

    // 일정 데이터 요청
    fetch('calendar/getScheduleByCategory', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then(async (res) => {
            changeCategorySchedule(res.schedule); // 캘린더의 일정 변경
            categoryDetailScheduleRender(res.schedule); // 카테고리 상세 페이지의 일정 목록 렌더
        }).catch((err) => {
        console.log(err);
    })
    categoryDetailModalOpen(category); // 카테고리 상세 모달 열기
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유함의 사용자 열기 버튼을 눌렀을때 자식 노드들을 컨트롤 하는 함수입니다.
 * 주요 기능 : - 닫혀있으면 자식 노드를 보이게 하고, 열려있으면 자식노드를 보이지 않게 하였습니다.
 * */
function sharerChildNodeControl(id) {
    let childNode = document.getElementById('cn_' + id); // 자식 노드 id로 요소 선언

    if (childNode.style.display === 'none') { // 자식노드의 display가 none 일 경우
        childNode.style.display = 'block'; // 보이게 함
        document.getElementById('arrow_' + id).src = "/images/category/arrow-down.png"; // 왼쪽의 열림 버튼 모양 변경
    } else {
        childNode.style.display = 'none'; // 자식노드의 display가 block 일 경우
        document.getElementById('arrow_' + id).src = "/images/category/arrow-up.png"; // 왼쪽의 닫힘 버튼 모양 변경
    }
}

/*************************************************************
 * 담당자 : 김건희
 * 함수 : sharedDirectoryModalClose()
 * 기능 : 1. 전체 영역 스크롤 안되게 설정
 *       2. 모달 닫았을때 캘린더 다시 원래자리로 오게 설정
 *************************************************************/
// 팝업 닫기
function sharedDirectoryModalClose() {
    const sharedDirectoryModal = document.getElementById('sharedDirectoryModal');
    sharedDirectoryModal.style.display = 'none';
    const moveRightContainer = document.getElementById('indexRight');
    moveRightContainer.style.marginLeft = '0px'
    moveRightContainer.style.transition = '1s'
    const bodyScrollHidden=document.getElementsByTagName('body');
    bodyScrollHidden[0].style.overflow = 'hidden';
}