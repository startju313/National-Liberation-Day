let todoList = JSON.parse(localStorage.getItem("myTodos"));

if (!todoList || todoList.length === 0) {
  todoList = [
    { text: "🚩​ 태극기 달기", checked: false },
    { text: "🕊️ 독립운동가 한 명 알아보기", checked: false },
    { text: "📜 광복절 의미 되새기기", checked: false },
    { text: "🎬 독립 관련 영화 보기", checked: false }
  ];
}

const quotes = [
  "📘 안중근 의사: “하루라도 책을 읽지 않으면 입안에 가시가 돋는다.”\n💬 A day without reading leaves a thorn in your mouth.",
  "🕊️ 유관순 열사: “나라에 바칠 목숨이 하나밖에 없는 것만이 이 소녀의 유일한 슬픔입니다.”\n💬 The only sorrow of this young girl is that she has but one life to give for her country.",
  "📝 김구 선생: “내가 원하는 우리나라의 모습은 문화의 힘이 세계를 감동시키는 나라다.”\n💬 The nation I desire is one that moves the world with the power of its culture.",
  "💣 이봉창 의사: “나는 죽음을 택할지언정, 일본 천황의 만세는 부를 수 없다.”\n💬 I would rather choose death than shout ‘Long live the Japanese Emperor.’",
  "💣 윤봉길 의사: “강도 일본은 우리를 죽일지언정 우리의 정신과 혼은 죽일 수 없다.”\n💬 Bandit Japan may kill us, but it cannot kill our spirit and soul.",
  "⚖️ 조소앙 선생: “정치적 평등, 경제적 평등, 교육의 균등은 민족의 기본 권리다.”\n💬 Political equality, economic equality, and equal opportunity for education are the fundamental rights of a nation.",
  "📜 신채호 선생: “역사를 잊은 민족에게 미래는 없다.”\n💬 A nation that forgets its history has no future."
];

function saveTodoList() {
  localStorage.setItem("myTodos", JSON.stringify(todoList));
}

function renderTodoItem(todo, index) {
  const todoItem = document.createElement("li");

  const todoTextWrapper = document.createElement("div");
  todoTextWrapper.className = "todo-text";

  const todoCheckbox = document.createElement("span");
  todoCheckbox.className = "custom-checkbox";
  if (todo.checked) todoCheckbox.classList.add("checked");

  todoCheckbox.onclick = () => {
    todo.checked = !todo.checked;
    saveTodoList();
    renderTodoList();
  };

  const todoTextSpan = document.createElement("span");
  todoTextSpan.textContent = todo.text;

  todoTextWrapper.appendChild(todoCheckbox);
  todoTextWrapper.appendChild(todoTextSpan);

  const todoActionsWrapper = document.createElement("div");
  todoActionsWrapper.className = "todo-actions";

  const editBtn = document.createElement("button");
  const editIcon = document.createElement("i");
  editIcon.classList.add("fas", "fa-pen");
  editBtn.appendChild(editIcon);
  editBtn.onclick = () => {
    const newText = prompt("수정할 내용을 입력하세요", todo.text);
    if (newText && newText.trim() !== "") {
      todo.text = newText.trim();
      saveTodoList();
      renderTodoList();
    }
  };

  const deleteBtn = document.createElement("button");
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-minus-circle");
  deleteBtn.appendChild(deleteIcon);
  deleteBtn.onclick = () => {
    todoList.splice(index, 1);
    saveTodoList();
    renderTodoList();
  };

  todoActionsWrapper.appendChild(editBtn);
  todoActionsWrapper.appendChild(deleteBtn);

  todoItem.appendChild(todoTextWrapper);
  todoItem.appendChild(todoActionsWrapper);

  return todoItem;
}

function renderTodoList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  todoList.forEach((todo, index) => {
    list.appendChild(renderTodoItem(todo, index));
  });

  renderProgress();
  renderQuote();
  renderDDay();
}

function addTodo() {
  const input = document.getElementById("todo-input");
  const text = input.value.trim();
  if (text === "") {
    alert("할 일을 입력해주세요!");
    return;
  }
  todoList.push({ text, checked: false });
  input.value = "";
  saveTodoList();
  renderTodoList();
}

function renderProgress() {
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress-bar");
  const praiseMessage = document.getElementById("praise-message");

  const total = todoList.length;
  const done = todoList.filter(t => t.checked).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  progressText.textContent = `📊 진행률: ${done} / ${total} 완료 (${percent}%)`;
  progressBar.style.width = percent + "%";

  if (percent === 100) {
    praiseMessage.innerHTML = `
      🎉 <strong>모든 할 일을 완수했어요!</strong><br>
      👏 <em>당신의 작은 실천이 광복 80주년을 더욱 빛나게 합니다.</em><br>
      함께 기억하고, 함께 나아가요.
    `;
    praiseMessage.style.color = "crimson";
  } else {
    praiseMessage.textContent = "";
  }
}

function renderQuote() {
  const box = document.getElementById("quote-box");
  if (!box) return;
  const idx = Math.floor(Math.random() * quotes.length);
  box.textContent = quotes[idx];
}

function renderDDay() {
  const ddayElem = document.getElementById("dday");
  const today = new Date();
  let targetDate = new Date(today.getFullYear(), 7, 15); // 8월 15일 (월은 0부터)

  if (today > targetDate) {
    targetDate = new Date(today.getFullYear() + 1, 7, 15);
  }

  const diffMs = targetDate - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  ddayElem.textContent = `대한민국 광복절까지 D-${diffDays}일`;
}

function copyTodos() {
  const text = todoList.map(t => `${t.checked ? "[✔]" : "[ ]"} ${t.text}`).join("\n");
  navigator.clipboard.writeText(text).then(() => {
    const status = document.getElementById("copy-status");
    status.textContent = "✅ 복사 완료!";
    setTimeout(() => (status.textContent = ""), 2000);
  });
}

// 다크 모드 토글
const darkToggle = document.getElementById("dark-toggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    darkToggle.innerHTML = "🌙"; // 달 아이콘
  } else {
    darkToggle.innerHTML = `<img id="toggle-icon" src="taeguk_light.jpg" alt="태극기" width="24" height="24" />`;
  }
};

// 엔터키로 추가
document.getElementById("todo-input").addEventListener("keydown", e => {
  if (e.key === "Enter") addTodo();
});

renderTodoList();
