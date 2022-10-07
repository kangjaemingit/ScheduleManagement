console.log(document.getElementById('categorySubject'))
// 팝업 열기
function categoryadd() {
    const element1 = document.getElementById('categoryAddGround');
    // 2. style 변경
    element1.style.display='block';
    const element2=document.getElementById('categoryModalBg');
    element2.style.display='block'
    const elementTag=document.getElementsByTagName("body")[0];
    elementTag.style.overflow='hidden'
}

// 팝업 닫기
function thisModalClose() {
    const element1 = document.getElementById('categoryAddGround');
    // 2. style 변경
    element1.style.display = 'none';
    const element2 = document.getElementById('categoryModalBg');
    // 2. style 변경
    element2.style.display = 'none';
    const elementTag=document.getElementsByTagName("body")[0];
    elementTag.style.overflow='scroll'
}
function selectprovider(){
    const checkbox = document.getElementById('selectProvider');
    const containerView=document.getElementById('providerSelecter')
    // 2. checked 속성을 체크합니다.
    const is_checked = checkbox.checked;
    // 3. 결과를 출력합니다.
   console.log(is_checked);
   if(is_checked===true){
       containerView.style.display='block'
   }
   else{
       containerView.style.display='none'
   }
}