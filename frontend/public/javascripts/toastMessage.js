let removeToast;

/**
 * 담당자 : 강재민
 * 함수 설명 : 오류 표시 등 토스트 메시지를 표시해주기 위한 함수입니다.
 * 주요 기능 : - reveal 클래스를 활용하여 2초간 토스트 메시지를 출력합니다.
 * */
function toast(string) {
    const toast = document.getElementById("toast");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 2000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 2000)
    toast.classList.add("reveal"),
        toast.innerText = string
}