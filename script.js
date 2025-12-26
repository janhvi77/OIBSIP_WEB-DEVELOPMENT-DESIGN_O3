/* =======================
   GLOBAL DATA
======================= */
let myTasks = JSON.parse(localStorage.getItem("savedTasks")) || [];

/* =======================
   LOGIN / LOGOUT
======================= */
function login() {
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;

    if (!email || !pass) {
        alert("Please enter email and password");
        return;
    }

    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("app-screen").classList.remove("hidden");

    refreshUI();
}

function logout() {
    location.reload();
}

/* =======================
   ADD TASK
======================= */
function addTask() {
    const name = document.getElementById("task-name").value.trim();
    const date = document.getElementById("task-date").value;
    const time = document.getElementById("task-time").value;
    const reminder = document.getElementById("reminder-val").value;

    if (!name || !date || !time) {
        alert("Please fill all fields");
        return;
    }

    myTasks.push({
        id: Date.now(),
        name,
        date,
        time,
        reminder,
        status: "pending"
    });

    saveTasks();
    clearInputs();
}

/* =======================
   DELETE TASK
======================= */
function deleteTask(id) {
    myTasks = myTasks.filter(task => task.id !== id);
    saveTasks();
}

/* =======================
   TOGGLE STATUS
======================= */
function toggleStatus(id) {
    myTasks = myTasks.map(task =>
        task.id === id ? {...task, status: task.status === "pending" ? "completed" : "pending" } :
        task
    );
    saveTasks();
}

/* =======================
   SAVE & LOAD
======================= */
function saveTasks() {
    localStorage.setItem("savedTasks", JSON.stringify(myTasks));
    refreshUI();
}

/* =======================
   UI RENDER
======================= */
function refreshUI() {
    const pendingList = document.getElementById("pending-list");
    const completedList = document.getElementById("completed-list");

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    if (myTasks.length === 0) {
        pendingList.innerHTML = `<p style="color:#6b7280;">No tasks yet</p>`;
        return;
    }

    myTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";

        card.innerHTML = `
            <h4>${task.name}</h4>
            <p>📅 ${task.date} | ⏰ ${formatTime12(task.time)}</p>
            <div class="btn-row">
                <button class="done-btn" onclick="toggleStatus(${task.id})">
                    ${task.status === "pending" ? "Complete" : "Reopen"}
                </button>
                <button class="del-btn" onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        `;

        if (task.status === "pending") {
            pendingList.appendChild(card);
        } else {
            completedList.appendChild(card);
        }
    });
}

/* =======================
   CLEAR INPUTS
======================= */
function clearInputs() {
    document.getElementById("task-name").value = "";
    document.getElementById("task-date").value = "";
    document.getElementById("task-time").value = "";
}

/* =======================
   TIME FORMAT (AM / PM)
======================= */
function formatTime12(time24) {
    if (!time24) return "";

    let [h, m] = time24.split(":");
    h = parseInt(h, 10);

    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    return `${h}:${m} ${ampm}`;
}
// DARK MODE TOGGLE
const darkModeBtn = document.getElementById("darkModeToggle");

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Change button text dynamically
    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️ Light Mode";
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
    }
});