// js/services.js
const API_BASE = "https://crudcrud.com/api/200b70a1ec974fe8ab3bd89399f772ae";

// Endpoints
const ACCOUNTS_ENDPOINT = `${API_BASE}/accounts`; // NOVO
const USERS_ENDPOINT    = `${API_BASE}/users`;
const LISTS_ENDPOINT    = `${API_BASE}/lists`;
const TASKS_ENDPOINT    = `${API_BASE}/tasks`;

const Services = {
  // ==========================
  // ACCOUNT (dono da conta)
  // ==========================
  async createAccount(account) {
    const r = await fetch(ACCOUNTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    });
    if (!r.ok) throw new Error("Erro ao criar conta");
    return r.json();
  },

  async getAccounts() {
    const r = await fetch(ACCOUNTS_ENDPOINT);
    if (!r.ok) throw new Error("Erro ao buscar contas");
    return r.json();
  },

  async getAccount(id) {
    const r = await fetch(`${ACCOUNTS_ENDPOINT}/${id}`);
    if (!r.ok) throw new Error("Erro ao buscar conta");
    return r.json();
  },

  async updateAccount(id, data) {
    const current = await this.getAccount(id);
    const payload = { ...current, ...data };
    delete payload._id;
    const r = await fetch(`${ACCOUNTS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("Erro ao atualizar conta");
    return true;
  },

  async deleteAccount(id) {
    const r = await fetch(`${ACCOUNTS_ENDPOINT}/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Erro ao excluir conta");
    return true;
  },

  // Apaga TUDO: listas, usuários e a conta
  async deleteAccountDeep(accountId) {
    // 1) Listas
    const listas = await this.getLists().catch(() => []);
    await Promise.all(
      (listas || []).map(l =>
        fetch(`${LISTS_ENDPOINT}/${l._id}`, { method: "DELETE" })
      )
    );

    // 2) Usuários
    const usuarios = await this.getUsers().catch(() => []);
    await Promise.all(
      (usuarios || []).map(u =>
        fetch(`${USERS_ENDPOINT}/${u._id}`, { method: "DELETE" })
      )
    );

    // 3) Conta (se veio id, apaga só ela; senão, apaga todas as contas)
    if (accountId) {
      await this.deleteAccount(accountId);
    } else {
      const contas = await this.getAccounts().catch(() => []);
      await Promise.all(
        (contas || []).map(c =>
          fetch(`${ACCOUNTS_ENDPOINT}/${c._id}`, { method: "DELETE" })
        )
      );
    }
    return true;
  },

  // ==========================
  // USUÁRIOS
  // ==========================
  async createUser(user) {
    const r = await fetch(USERS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!r.ok) throw new Error("Erro ao criar usuário");
    return r.json();
  },

  async getUsers() {
    const r = await fetch(USERS_ENDPOINT);
    if (!r.ok) throw new Error("Erro ao buscar usuários");
    return r.json();
  },

  async updateUser(id, user) {
    const current = await fetch(`${USERS_ENDPOINT}/${id}`).then(r => r.json());
    const updated = { ...current, ...user };
    delete updated._id;

    const r = await fetch(`${USERS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!r.ok) throw new Error("Erro ao atualizar usuário");
    return true;
  },

  // Exclui o usuário + TODAS as listas dele
  async deleteUserWithLists(userId) {
    const listas = await this.getLists();
    const doUsuario = listas.filter(l => l.userId === userId);
    await Promise.all(
      doUsuario.map(l =>
        fetch(`${LISTS_ENDPOINT}/${l._id}`, { method: "DELETE" })
      )
    );
    const r = await fetch(`${USERS_ENDPOINT}/${userId}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Erro ao excluir usuário");
    return true;
  },

  // ==========================
  // LISTAS
  // ==========================
  async createList(list) {
    const r = await fetch(LISTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    if (!r.ok) throw new Error("Erro ao criar lista");
    return r.json();
  },

  async getLists() {
    const r = await fetch(LISTS_ENDPOINT);
    if (!r.ok) throw new Error("Erro ao buscar listas");
    return r.json();
  },

  async updateList(id, list) {
    const { _id, ...payload } = list;
    const r = await fetch(`${LISTS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("Erro ao atualizar lista");
    return true;
  },

  async deleteList(id) {
    const r = await fetch(`${LISTS_ENDPOINT}/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Erro ao excluir lista");
    return true;
  },

  // ==========================
  // TAREFAS (se estiver usando)
  // ==========================
  async createTask(task) {
    const r = await fetch(TASKS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!r.ok) throw new Error("Erro ao criar tarefa");
    return r.json();
  },

  async getTasks() {
    const r = await fetch(TASKS_ENDPOINT);
    if (!r.ok) throw new Error("Erro ao buscar tarefas");
    return r.json();
  },

  async updateTask(id, task) {
    const current = await fetch(`${TASKS_ENDPOINT}/${id}`).then(r => r.json());
    const updated = { ...current, ...task };
    delete updated._id;

    const r = await fetch(`${TASKS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!r.ok) throw new Error("Erro ao atualizar tarefa");
    return true;
  },

  async deleteTask(id) {
    const r = await fetch(`${TASKS_ENDPOINT}/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Erro ao excluir tarefa");
    return true;
  },
};
