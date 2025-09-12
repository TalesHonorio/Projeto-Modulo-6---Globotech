// Arquivo principal - inicializa os scripts em cada página

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Página de usuários
  if (path.includes("usuarios.html")) {
    renderUsers();
    const form = document.querySelector("#user-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const name = form.elements["name"].value;
        const email = form.elements["email"].value;
        addUser(name, email);
        form.reset();
        renderUsers();
      });
    }
  }

  // Página de listas
  if (path.includes("listas.html")) {
    renderLists();
    const form = document.querySelector("#list-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const userId = parseInt(form.elements["userId"].value);
        const title = form.elements["title"].value;
        addList(userId, title);
        form.reset();
        renderLists();
      });
    }
  }

  // Página de tarefas
  if (path.includes("tarefas.html")) {
    renderTasks();
    const form = document.querySelector("#task-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const listId = parseInt(form.elements["listId"].value);
        const description = form.elements["description"].value;
        addTask(listId, description);
        form.reset();
        renderTasks();
      });
    }
  }
});


// ---------------- RENDER FUNCTIONS ----------------

function renderUsers() {
  const container = document.querySelector("#users-list");
  if (!container) return;
  container.innerHTML = "";
  getUsers().forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.name} (${u.email})`;

    const btnDel = document.createElement("button");
    btnDel.textContent = "Excluir";
    btnDel.onclick = () => {
      deleteUser(u.id);
      renderUsers();
    };

    li.appendChild(btnDel);
    container.appendChild(li);
  });
}

function renderLists() {
  const container = document.querySelector("#lists-list");
  if (!container) return;
  container.innerHTML = "";
  getLists().forEach(l => {
    const li = document.createElement("li");
    const user = getUsers().find(u => u.id === l.userId);
    li.textContent = `${l.title} (Usuário: ${user ? user.name : "?"})`;

    const btnDel = document.createElement("button");
    btnDel.textContent = "Excluir";
    btnDel.onclick = () => {
      deleteList(l.id);
      renderLists();
    };

    li.appendChild(btnDel);
    container.appendChild(li);
  });
}

function renderTasks() {
  const container = document.querySelector("#tasks-list");
  if (!container) return;
  container.innerHTML = "";
  getTasks().forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.description} ${t.done ? "✔️" : ""}`;

    const btnToggle = document.createElement("button");
    btnToggle.textContent = t.done ? "Desmarcar" : "Concluir";
    btnToggle.onclick = () => {
      toggleTaskDone(t.id);
      renderTasks();
    };

    const btnDel = document.createElement("button");
    btnDel.textContent = "Excluir";
    btnDel.onclick = () => {
      deleteTask(t.id);
      renderTasks();
    };

    li.appendChild(btnToggle);
    li.appendChild(btnDel);
    container.appendChild(li);
  });
}
