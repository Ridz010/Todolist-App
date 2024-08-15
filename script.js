const todoValue = document.getElementById("todoText"),
    listItems = document.getElementById("list-items"),
    addUpdateClick = document.getElementById("AddUpdateClick");

let editMode = false;
let currentEditItem = null;
let todoData = JSON.parse(localStorage.getItem("todoData")) || [];

// Fungsi untuk mengubah logo
function toggleLogo(isEditMode) {
    const logoSrc = isEditMode ? "/assets/icons8-refresh-60.png" : "/assets/icons8-plus-30.png";
    addUpdateClick.setAttribute("src", logoSrc);
}

// Fungsi untuk menambahkan atau mengupdate item todo
function createToDoData() {
    const todoText = todoValue.value.trim();

    if (!todoText) {
        Swal.fire({
            title: "Error!",
            text: "Please enter your todo text!",
            icon: "error"
        });
        todoValue.focus();
        return;
    }

    if (editMode) {
        const editIndex = todoData.findIndex(item => item.item === currentEditItem.querySelector('.todo-text').innerText);
        todoData[editIndex].item = todoText;
        currentEditItem.querySelector('.todo-text').innerText = todoText;
        editMode = false;
        currentEditItem = null;
        toggleLogo(false); // Mengembalikan logo ke tambah setelah update berhasil

        Swal.fire({
            title: "Success!",
            text: "Task updated successfully!",
            icon: "success"
        });
    } else {
        const li = document.createElement("li");
        const todoItems = `
            <div onclick="completeTodoItem(this)" class="todo-text">${todoText}</div>
            <div class="todo-actions">
                <img class="edit todo-controls" src="assets/icons8-edit-60.png" alt="Edit" onclick="editTodoItem(this)"/>
                <img class="delete todo-controls" src="assets/icons8-delete-60.png" alt="Delete" onclick="deleteTodoItem(this)"/>
            </div>
        `;

        li.innerHTML = todoItems;
        listItems.appendChild(li);

        Swal.fire({
            title: "Success!",
            text: "Task added successfully!",
            icon: "success"
        });

        // Tambahkan data ke dalam array todoData
        todoData.push({ item: todoText, status: false });
    }

    updateLocalStorage(); // Simpan perubahan ke local storage
    todoValue.value = ""; // Mengosongkan input setelah menambah atau mengupdate item
}

// Fungsi untuk menandai item todo sebagai selesai
function completeTodoItem(element) {
    const todoText = element.innerText;
    const todoItem = todoData.find(item => item.item === todoText);
    todoItem.status = !todoItem.status;
    element.style.textDecoration = todoItem.status ? "line-through" : "";
    updateLocalStorage(); // Simpan perubahan ke local storage saat menandai selesai
}

// Fungsi untuk menghapus item todo
function deleteTodoItem(element) {
    const li = element.closest("li");
    const todoText = li.querySelector('.todo-text').innerText;

    // Hapus item dari todoData berdasarkan teks todo
    todoData = todoData.filter(item => item.item !== todoText);
    updateLocalStorage(); // Simpan perubahan ke local storage

    li.remove();

    Swal.fire({
        title: "Deleted!",
        text: "Task has been deleted.",
        icon: "info"
    });
}

// Fungsi untuk mengedit item todo
function editTodoItem(element) {
    const li = element.closest("li");
    const todoText = li.querySelector('.todo-text').innerText;
    todoValue.value = todoText;
    editMode = true;
    currentEditItem = li;
    toggleLogo(true); // Mengubah logo ke refresh saat edit
    todoValue.focus();
}

// Fungsi untuk memperbarui local storage dengan data terbaru
function updateLocalStorage() {
    localStorage.setItem("todoData", JSON.stringify(todoData));
}

// Menambahkan event listener untuk tombol tambah/update
addUpdateClick.addEventListener("click", createToDoData);

// Menambahkan event listener untuk tombol Enter pada input
todoValue.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        createToDoData();
    }
});

// Mengatur logo awal menjadi tambah
toggleLogo(false);

// Inisialisasi list dari data yang tersimpan di local storage saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    todoData.forEach(todo => {
        const li = document.createElement("li");
        const todoItems = `
            <div onclick="completeTodoItem(this)" class="todo-text" style="${todo.status ? 'text-decoration: line-through;' : ''}">${todo.item}</div>
            <div class="todo-actions">
                <img class="edit todo-controls" src="assets/icons8-edit-60.png" alt="Edit" onclick="editTodoItem(this)"/>
                <img class="delete todo-controls" src="assets/icons8-delete-60.png" alt="Delete" onclick="deleteTodoItem(this)"/>
            </div>
        `;
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
});