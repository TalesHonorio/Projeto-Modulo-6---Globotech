// Gerenciamento de Usuários

function getUsers() {
  const data = localStorage.getItem("users");
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function addUser(name, email) {
  const users = getUsers();
  const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  users.push({ id: newId, name, email });
  saveUsers(users);
}

function deleteUser(id) {
  const users = getUsers().filter(u => u.id !== id);
  saveUsers(users);

  // também remover listas associadas ao usuário
  let lists = getLists().filter(l => l.userId !== id);
  saveLists(lists);
}
