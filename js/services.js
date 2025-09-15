const API_BASE = "https://crudcrud.com/api/200b70a1ec974fe8ab3bd89399f772ae";

// Endpoints
const USERS_ENDPOINT = `${API_BASE}/users`;
const LISTS_ENDPOINT = `${API_BASE}/lists`;
const TASKS_ENDPOINT = `${API_BASE}/tasks`;

const Services = {
  // ==========================
  // 🔹 USUÁRIOS
  // ==========================

  async createUser(user) {
    const response = await fetch(USERS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Erro ao criar usuário");
    return response.json();
  },

  async getUsers() {
    const response = await fetch(USERS_ENDPOINT);
    if (!response.ok) throw new Error("Erro ao buscar usuários");
    return response.json();
  },

  async updateUser(id, user) {
    // Busca dados atuais
    const current = await fetch(`${USERS_ENDPOINT}/${id}`).then((r) => r.json());

    // Remove _id e mescla
    const updated = { ...current, ...user };
    delete updated._id;

    const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!response.ok) throw new Error("Erro ao atualizar usuário");
    return true;
  },

  async deleteUser(id) {
    const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir usuário");
    return true;
  },

  // ==========================
  // 🔹 LISTAS
  // ==========================

  async createList(list) {
    const response = await fetch(LISTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    if (!response.ok) throw new Error("Erro ao criar lista");
    return response.json();
  },

  async getLists() {
    const response = await fetch(LISTS_ENDPOINT);
    if (!response.ok) throw new Error("Erro ao buscar listas");
    return response.json();
  },


async updateList(id, list) {
  // CrudCrud faz REPLACE no PUT; nunca envie _id no body
  const { _id, ...payload } = list;
  const response = await fetch(`${LISTS_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Erro ao atualizar lista");
  return true;
}
,

  async deleteList(id) {
    const response = await fetch(`${LISTS_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir lista");
    return true;
  },

  // ==========================
  // 🔹 TAREFAS
  // ==========================

  async createTask(task) {
    const response = await fetch(TASKS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Erro ao criar tarefa");
    return response.json();
  },

  async getTasks() {
    const response = await fetch(TASKS_ENDPOINT);
    if (!response.ok) throw new Error("Erro ao buscar tarefas");
    return response.json();
  },

  async updateTask(id, task) {
    const current = await fetch(`${TASKS_ENDPOINT}/${id}`).then((r) => r.json());
    const updated = { ...current, ...task };
    delete updated._id;

    const response = await fetch(`${TASKS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!response.ok) throw new Error("Erro ao atualizar tarefa");
    return true;
  },

  async deleteTask(id) {
    const response = await fetch(`${TASKS_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir tarefa");
    return true;
  },
};
