// Gerenciamento de Listas

function getLists() {
  const data = localStorage.getItem("lists");
  return data ? JSON.parse(data) : [];
}

function saveLists(lists) {
  localStorage.setItem("lists", JSON.stringify(lists));
}

function addList(userId, title) {
  const lists = getLists();
  const newId = lists.length ? Math.max(...lists.map(l => l.id)) + 1 : 1;
  lists.push({ id: newId, userId, title });
  saveLists(lists);
}

function deleteList(id) {
  const lists = getLists().filter(l => l.id !== id);
  saveLists(lists);

  // também remover tarefas associadas à lista
  let tasks = getTasks().filter(t => t.listId !== id);
  saveTasks(tasks);
}
