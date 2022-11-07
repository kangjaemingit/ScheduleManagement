// 팝업 열기
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
    await fetch('calendar/sharedCategory', {
        method: "get"
    }).then((res) => res.json())
        .then(async (res) => {
            if (res.sharedCategorySuccess === false) {
                console.log(res.message);
                window.alert("공유받은 카테고리 정보 불러오기 실패");
                return;
            }
            let array = [{}];
            await res.sharedCategories.map((c) => {
                let idx;
                let writerExist = array.some(function (element, index, arr) {
                    if (element.categoryWriterId === c.categoryWriter._id) {
                        idx = index;
                        return true;
                    } else return false;
                });
                if (writerExist) {
                    array[idx].categories.push(c)
                } else {
                    return array.push({
                        categoryWriterId: c.categoryWriter._id,
                        writerProfile: c.categoryWriter.profilePhoto,
                        writerName: c.categoryWriter.name,
                        categories: [c]
                    })
                }
            });

            array.shift();

            let rows = [];
            array.map((c) => {
                rows += `<div class="sharerRootNode">`
                    + `<img class='arrowIcon' src="images/category/arrow-up.png" id='arrow_${c.categoryWriterId}' onclick='sharerChildNodeControl("${c.categoryWriterId}")'>`
                    + `<img class='dirSharerProfilePhoto' src='${c.writerProfile}'>`
                    + `<span>${c.writerName}</span></div>`
                    + `<div class="sharerChildNode" id='cn_${c.categoryWriterId}' style="display: none;">`;

                c.categories.map((c) => {
                    rows += `<div class="sharerNodeCategory" onclick='categorySelect(${JSON.stringify(c)})'><li class="sharerNodeCategoryLi">${c.categoryName}</li></div>`
                });

                rows += `</div>`;
            })
            document.getElementById('sharerList').innerHTML = rows;
        })
}

function categorySelect(category) {
    const data = {
        tags: category.tags,
        categoryWriter: category.categoryWriter
    }
    fetch('calendar/getScheduleByCategory', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then(async (res) => {
            changeCategorySchedule(res.schedule);
            categoryDetailScheduleRender(res.schedule);
        }).catch((err) => {
        console.log(err);
    })
    categoryDetailModalOpen(category);
}

function sharerChildNodeControl(id) {
    let childNode = document.getElementById('cn_' + id);

    if (childNode.style.display === 'none') {
        childNode.style.display = 'block';
        document.getElementById('arrow_' + id).src = "/images/category/arrow-down.png";
    } else {
        childNode.style.display = 'none';
        document.getElementById('arrow_' + id).src = "/images/category/arrow-up.png";
    }
}

function movechildModal1() {
    const element2 = document.getElementById('categorychild1bg');
    // 2. style 변경
    element2.style.display = 'block';
}

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