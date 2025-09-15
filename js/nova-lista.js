// js/nova-lista.js (versão corrigida)
document.addEventListener("DOMContentLoaded", async () => {
  const qs = new URLSearchParams(location.search);
  let userId  = qs.get("userId")  || localStorage.getItem("gt_lastUserId");
  let listaId = qs.get("listaId") || localStorage.getItem("gt_lastListId");
  const nomeQS = qs.get("nomeLista");

  const form        = document.getElementById("lista-form");
  const tituloLista = document.getElementById("titulo-lista");
  const usuarioNome = document.getElementById("usuario-nome"); // se existir
  const inputNovo   = document.getElementById("novo-item");
  const btnSalvar   = document.getElementById("salvar-lista");
  const itensBox    = document.getElementById("itens-container");

  // Evita submit + reload ao apertar Enter
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    btnSalvar.click();
  });

  // Carrega usuário e lista
  let lista;
  try {
    const [usuarios, listas] = await Promise.all([
      Services.getUsers(),
      Services.getLists(),
    ]);

    const u = usuarios.find(x => x._id === userId);
    if (u && usuarioNome) usuarioNome.textContent = `Usuário: ${u.nome}`;

    lista = listaId ? listas.find(l => l._id === listaId) : null;

    // fallback: pega a última lista do usuário (se veio sem listaId)
    if (!lista && userId) {
      const minhas = listas.filter(l => l.userId === userId);
      lista = minhas[minhas.length - 1];
      if (lista) listaId = lista._id;
    }

    if (!lista) {
      tituloLista.textContent = "Erro ao carregar lista";
      return;
    }

    // persiste contexto para próximas páginas
    localStorage.setItem("gt_lastUserId", lista.userId);
    localStorage.setItem("gt_lastListId", lista._id);

    // Título
    tituloLista.textContent = nomeQS || lista.nome || "Nova Lista";

  } catch (e) {
    console.error(e);
    tituloLista.textContent = "Erro ao carregar lista";
    return;
  }

  function render() {
    const tarefas = Array.isArray(lista.tarefas) ? lista.tarefas : [];
    itensBox.innerHTML = tarefas.map((t, i) => `
      <div class="item">
        <label>
          <input type="checkbox" data-idx="${i}" ${t.concluido ? "checked" : ""}>
          <span>${t.texto}</span>
        </label>
        <button type="button" class="remover" data-idx="${i}"></button>
      </div>
      <div class="divisor"></div>
    `).join("");

    // Alternar concluído
    itensBox.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener("change", async () => {
        const idx = Number(cb.dataset.idx);
        const novas = [...(lista.tarefas || [])];
        novas[idx] = { ...novas[idx], concluido: cb.checked };

        const payload = { nome: lista.nome, userId: lista.userId, tarefas: novas };
        await Services.updateList(lista._id, payload);
        lista.tarefas = novas; // mantém em memória
      });
    });

    // Remover
    itensBox.querySelectorAll(".remover").forEach(btn => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.dataset.idx);
        const novas = (lista.tarefas || []).filter((_, i) => i !== idx);

        const payload = { nome: lista.nome, userId: lista.userId, tarefas: novas };
        await Services.updateList(lista._id, payload);
        lista.tarefas = novas;
        render();
      });
    });
  }

  render();

  // Adicionar tarefa
  btnSalvar.addEventListener("click", async () => {
    const texto = inputNovo.value.trim();
    if (!texto) return alert("Digite um item válido!");

    const novas = Array.isArray(lista.tarefas) ? [...lista.tarefas] : [];
    novas.push({ texto, concluido: false });

    const payload = { nome: lista.nome, userId: lista.userId, tarefas: novas };
    await Services.updateList(lista._id, payload);

    lista.tarefas = novas;
    inputNovo.value = "";
    render();
  });
});
