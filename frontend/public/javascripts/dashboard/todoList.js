function createTodoList()  {
    const addBox=document.getElementById('todayScheduleBox');
    // 1. 추가할 값을 input창에서 읽어온다
    const addValue
        = document.getElementById('todaySelect').value;

    // 2. 추가할 li element 생성
    // 2-1. 추가할 li element 생성
    const input = document.createElement('input');
    const div1 = document.createElement("div");
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    // 2-2. li에 id 속성 추가
    div3.setAttribute('id',addValue);
    input.setAttribute('type','checkbox');
    div2.setAttribute('id',addValue+'Date');

    // 2-3. li에 text node 추가
    const textNode = document.createTextNode(addValue);
    div1.appendChild(textNode);

    // 3. 생성된 li를 ul에 추가
    addBox.appendChild(input)
    addBox.appendChild(div1)
    addBox.appendChild(div2)
    addBox.style.display='flex'
}