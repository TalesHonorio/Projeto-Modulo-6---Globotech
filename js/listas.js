// js/listas.js
const usuarioSelect   = document.getElementById("usuario");
const listasContainer = document.getElementById("listas-conteudo");
const btnNovaLista    = document.getElementById("btnNovaLista");

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const usuarios = await Services.getUsers();
    const qs = new URLSearchParams(location.search);
    const fromUrl = qs.get("userId");             // prioridade 1
    const fromLS  = localStorage.getItem("gt_lastUserId"); // prioridade 2

    let currentUserId = fromUrl || fromLS || (usuarios[0] && usuarios[0]._id);

    // monta o select
    usuarioSelect.innerHTML = usuarios
      .map(u => `<option value="${u._id}">${u.nome || u.email || "Sem nome"}</option>`)
      .join("");

    // Se veio pela URL, força a seleção (mesmo que não esteja na lista por algum motivo)
    if (fromUrl) {
      if (!usuarios.some(u => String(u._id) === String(fromUrl))) {
        const opt = document.createElement("option");
        opt.value = fromUrl;
        opt.textContent = "(usuário selecionado)";
        usuarioSelect.prepend(opt);
      }
      currentUserId = fromUrl;
    }

    usuarioSelect.value = currentUserId;
    localStorage.setItem("gt_lastUserId", currentUserId);

    usuarioSelect.addEventListener("change", () => carregarListas(usuarioSelect.value));

    if (currentUserId) {
      carregarListas(currentUserId);
    } else {
      listasContainer.innerHTML = "<p>Nenhum usuário encontrado.</p>";
    }

    // Botão nova lista
    btnNovaLista.addEventListener("click", async () => {
      if (!usuarioSelect.value) {
        showToast({ message: "Selecione um usuário antes de criar a lista.", variant: "error" });
        return;
      }

      const nome = await promptAsync("Digite o nome da nova lista:", { placeholder: "Ex.: Estudos, Compras..." });
      if (nome == null || !nome.trim()) return;

      try {
        await Services.createList({
          nome: nome.trim(),
          userId: usuarioSelect.value,
          tarefas: []
        });
        showToast({ message: "Lista criada com sucesso!", variant: "success" });
        carregarListas(usuarioSelect.value);
      } catch (e) {
        console.error(e);
        showToast({ message: "Falha ao criar lista.", variant: "error" });
      }
    });

  } catch (err) {
    console.error(err);
    listasContainer.innerHTML = "<p>Erro ao carregar usuários.</p>";
  }
}

async function carregarListas(usuarioId) {
  try {
    localStorage.setItem("gt_lastUserId", usuarioId);

    const listas = await Services.getLists();
    const doUsuario = listas.filter(l => String(l.userId) === String(usuarioId));

    renderListas(doUsuario);
  } catch (err) {
    console.error(err);
    listasContainer.innerHTML = "<p>Erro ao carregar listas.</p>";
  }
}

function renderListas(listasDoUsuario) {
  if (!listasDoUsuario.length) {
    listasContainer.innerHTML = "<p>Este usuário ainda não tem listas.</p>";
    return;
  }

  listasContainer.innerHTML = listasDoUsuario.map(lista => `
  <div class="lista" data-id="${lista._id}">
    <h4>${lista.nome || "Sem título"}</h4>
    <button class="button-trash" data-id="${lista._id}" aria-label="Excluir lista"></button>
    <ul>
      ${(lista.tarefas || []).map((t, idx) => `
        <li>
          <label>
            <input type="checkbox" data-idx="${idx}" ${t.concluido ? "checked" : ""}>
            <span>${t.texto}</span>
          </label>
          <button class="remover" data-idx="${idx}" aria-label="remover item"></button>
        </li>
      `).join("")}
    </ul>
    <button class="adicionar-item" aria-label="adicionar item"></button>
  </div>
`).join("");


  // Adicionar item
  listasContainer.querySelectorAll(".adicionar-item").forEach(btn => {
    btn.addEventListener("click", async () => {
      const listaId = btn.closest(".lista").dataset.id;

      const texto = await promptAsync("Digite o novo item:", { placeholder: "Ex.: Comprar leite" });
      if (texto == null || !texto.trim()) return;

      try {
        const lista = await getListaById(listaId);
        const tarefas = Array.isArray(lista.tarefas) ? [...lista.tarefas] : [];
        tarefas.push({ texto: texto.trim(), concluido: false });

        await Services.updateList(listaId, { nome: lista.nome, userId: lista.userId, tarefas });
        showToast({ message: "Item adicionado!", variant: "success" });
        carregarListas(usuarioSelect.value);
      } catch (e) {
        console.error(e);
        showToast({ message: "Falha ao adicionar item.", variant: "error" });
      }
    });
  });

  // Remover item
  listasContainer.querySelectorAll(".remover").forEach(btn => {
    btn.addEventListener("click", async () => {
      const listaId = btn.closest(".lista").dataset.id;
      const idx = Number(btn.dataset.idx);

      const ok = await confirmAsync("Remover este item?");
      if (!ok) return;

      try {
        const lista = await getListaById(listaId);
        const tarefas = (lista.tarefas || []).filter((_, i) => i !== idx);

        await Services.updateList(listaId, { nome: lista.nome, userId: lista.userId, tarefas });
        showToast({ message: "Item removido.", variant: "success" });
        carregarListas(usuarioSelect.value);
      } catch (e) {
        console.error(e);
        showToast({ message: "Falha ao remover item.", variant: "error" });
      }
    });
  });

  // Toggle concluído
  listasContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", async () => {
      const listaId = cb.closest(".lista").dataset.id;
      const idx = Number(cb.dataset.idx);

      try {
        const lista = await getListaById(listaId);
        const tarefas = [...(lista.tarefas || [])];
        tarefas[idx] = { ...tarefas[idx], concluido: cb.checked };

        await Services.updateList(listaId, { nome: lista.nome, userId: lista.userId, tarefas });
        showToast({ message: cb.checked ? "Concluída!" : "Marcada como pendente.", variant: "info", duration: 1400 });
      } catch (e) {
        console.error(e);
        showToast({ message: "Não foi possível atualizar.", variant: "error" });
      }
    });
  });

  // Remover lista inteira
listasContainer.querySelectorAll(".button-trash").forEach(btn => {
  btn.addEventListener("click", async () => {
    const listaId = btn.dataset.id;
    const ok = await confirmAsync("Deseja remover esta lista inteira?");
    if (!ok) return;

    try {
      await Services.deleteList(listaId);
      showToast({ message: "Lista removida.", variant: "success" });
      carregarListas(usuarioSelect.value);
    } catch (e) {
      console.error(e);
      showToast({ message: "Falha ao remover lista.", variant: "error" });
    }
  });
});
}


// Helper
async function getListaById(id) {
  const listas = await Services.getLists();
  const l = listas.find(x => String(x._id) === String(id));
  if (!l) throw new Error("Lista não encontrada");
  return l;
}
