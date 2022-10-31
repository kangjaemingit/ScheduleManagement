function createFeed()  {
    const addBox=document.getElementById('feedContentContainer');
    // 1. 추가할 값을 input창에서 읽어온다
    const addValue
        = document.getElementById('feedSelectContent').value;

    // 2. 추가할 li element 생성
    // 2-1. 추가할 li element 생성
    const div1 = document.createElement("div");
    const div2 = document.createElement('div')

    // 2-2. li에 id 속성 추가
    div1.setAttribute('id',addValue);
    div2.setAttribute('id',addValue+'Date');

    // 2-3. li에 text node 추가
    const textNode = document.createTextNode(addValue);
    div1.appendChild(textNode);

    // 3. 생성된 li를 ul에 추가
    addBox.appendChild(div1);
    addBox.appendChild(div2);
    addBox.style.display='flex'
}