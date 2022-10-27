window.onload = function() {

}

function changeComplete(id, bool){
    const data = {
        id : id,
        bool : bool
    }

    fetch('/updateComplete', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then((res) => {
            if(!res.updateCompleteSuccess){
                window.alert(res.message);
            }
            else{
                window.location.reload();
            }
        }).catch((err) => {
        console.log(err);
    })
}
