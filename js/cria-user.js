// js/cria-user.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCriaUsuario");
  const nomeEl = document.getElementById("nome");
  const listaEl = document.getElementById("lista");

  // opcional: sincroniza o título do header
  const pageTitle = document.getElementById("page-title");
  if (pageTitle) pageTitle.textContent = "Criar usuário";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = nomeEl.value.trim();
    const listaNome = listaEl.value.trim();

    if (!nome || !listaNome) {
      form.reportValidity?.();
      alert("Preencha todos os campos!");
      return;
    }

    try {
      // 1) Cria o usuário
      const novoUsuario = await Services.createUser({ nome });

      // 2) Cria a primeira lista para esse usuário
      const novaLista = await Services.createList({
        nome: listaNome,
        userId: novoUsuario._id,
        tarefas: []
      });

      // (opcional) guarda o último contexto
      localStorage.setItem("gt_lastUserId", novoUsuario._id);
      localStorage.setItem("gt_lastListId", novaLista._id);

      // 3) Redireciona com todos os parâmetros necessários
      const url = `/html/nova-lista.html` +
        `?userId=${encodeURIComponent(novoUsuario._id)}` +
        `&listaId=${encodeURIComponent(novaLista._id)}` +
        `&nomeLista=${encodeURIComponent(novaLista.nome)}`;

      window.location.href = url;
    } catch (err) {
      console.error("Erro ao criar usuário/lista:", err);
      alert("Erro ao criar usuário/lista. Verifique sua chave do CrudCrud e tente novamente.");
    }
  });
});

// final do cria-user.js
const url = `/html/nova-lista.html` +
  `?userId=${encodeURIComponent(novoUsuario._id)}` +
  `&listaId=${encodeURIComponent(novaLista._id)}` +
  `&nomeLista=${encodeURIComponent(novaLista.nome)}`;
window.location.href = url;
