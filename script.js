// =====================
// 初期化
// =====================
const input = document.getElementById("nameInput");
const list = document.getElementById("nameList");

document.getElementById("addBtn").onclick = addName;
document.getElementById("selectAllBtn").onclick = selectAll;
document.getElementById("clearBtn").onclick = clearSelection;
document.getElementById("resetBtn").onclick = resetList;
document.getElementById("groupBtn").onclick = createGroups;
document.getElementById("saveBtn").onclick = saveNameSet;

window.addEventListener("DOMContentLoaded", () => {
    renderSetList();
    updateCount();
});

// =====================
// 名前操作
// =====================
function createNameItem(name) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = name;
    span.className = "name";
    span.onclick = () => li.classList.toggle("selected");

    const del = document.createElement("button");
    del.textContent = "削除";
    del.className = "delete-btn";
    del.onclick = (e) => {
        e.stopPropagation();
        li.remove();
        updateCount();
    };

    li.appendChild(span);
    li.appendChild(del);
    return li;
}

function addName() {
    const name = input.value.trim();
    if (!name) return;

    list.appendChild(createNameItem(name));
    input.value = "";
    input.focus();

    updateCount();
}

// Enter対応
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addName();
});

// =====================
// 選択操作
// =====================
function getSelectedNames() {
    return Array.from(document.querySelectorAll("li.selected .name"))
        .map(el => el.textContent);
}

function selectAll() {
    document.querySelectorAll("#nameList li")
        .forEach(li => li.classList.add("selected"));
}

function clearSelection() {
    document.querySelectorAll("#nameList li")
        .forEach(li => li.classList.remove("selected"));
}

// =====================
// カウント
// =====================
function updateCount() {
    const count = list.children.length;
    document.getElementById("count").textContent = `${count}人`;
}

// =====================
// リセット
// =====================
function resetList() {
    if (!confirm("すべて削除しますか？")) return;
    list.innerHTML = "";
    updateCount();
}

// =====================
// グループ分け
// =====================
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createGroups() {
    const selected = getSelectedNames();
    if (selected.length === 0) {
        alert("メンバーを選択してください");
        return;
    }

    const size = parseInt(document.getElementById("groupSize").value);
    const shuffled = shuffle([...selected]);

    const groups = [];
    for (let i = 0; i < shuffled.length; i += size) {
        groups.push(shuffled.slice(i, i + size));
    }

    renderGroups(groups);
}

function renderGroups(groups) {
    const container = document.getElementById("groupResult");
    container.innerHTML = "";

    groups.forEach((group, i) => {
        const div = document.createElement("div");
        div.className = "group";

        const title = document.createElement("div");
        title.className = "group-title";
        title.textContent = `グループ ${i + 1}`;

        const members = document.createElement("div");

        group.forEach(name => {
            const tag = document.createElement("span");
            tag.className = "member";
            tag.textContent = name;
            members.appendChild(tag);
        });

        div.appendChild(title);
        div.appendChild(members);
        container.appendChild(div);
    });
}

// =====================
// 保存・読み込み
// =====================
function getAllNames() {
    return Array.from(document.querySelectorAll("#nameList .name"))
        .map(el => el.textContent);
}

function saveNameSet() {
    const setName = document.getElementById("setName").value.trim();
    if (!setName) {
        alert("セット名を入力してください");
        return;
    }

    const names = getAllNames();
    if (names.length === 0) {
        alert("保存する名前がありません");
        return;
    }

    const data = JSON.parse(localStorage.getItem("name_sets") || "{}");

    if (data[setName] && !confirm("上書きしますか？")) return;

    data[setName] = names;
    localStorage.setItem("name_sets", JSON.stringify(data));

    renderSetList();
    alert("保存しました");
}

function renderSetList() {
    const container = document.getElementById("setList");
    container.innerHTML = "";

    const data = JSON.parse(localStorage.getItem("name_sets") || "{}");

    Object.keys(data).forEach(setName => {
        const div = document.createElement("div");
        div.className = "set-item";

        const name = document.createElement("div");
        name.className = "set-name";
        name.textContent = setName;

        const actions = document.createElement("div");
        actions.className = "set-actions";

        const loadBtn = document.createElement("button");
        loadBtn.textContent = "読込";
        loadBtn.className = "load-btn";
        loadBtn.onclick = () => loadSet(setName);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "削除";
        deleteBtn.className = "delete-set-btn";
        deleteBtn.onclick = () => deleteSet(setName);

        actions.appendChild(loadBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(name);
        div.appendChild(actions);
        container.appendChild(div);
    });
}

function loadSet(setName) {
    const data = JSON.parse(localStorage.getItem("name_sets") || "{}");
    const names = data[setName];

    if (!names) return;
    if (!confirm("上書きしますか？")) return;

    list.innerHTML = "";
    names.forEach(name => list.appendChild(createNameItem(name)));

    updateCount();
}

function deleteSet(setName) {
    if (!confirm("削除しますか？")) return;

    const data = JSON.parse(localStorage.getItem("name_sets") || "{}");
    delete data[setName];

    localStorage.setItem("name_sets", JSON.stringify(data));
    renderSetList();
}

// =====================
// デバッグ
// =====================
window.getSelectedNames = getSelectedNames;
