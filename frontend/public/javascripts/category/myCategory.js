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