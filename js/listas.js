// js/listas.js
const usuarioSelect   = document.getElementById("usuario");
const listasContainer = document.getElementById("listas");

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const usuarios = await Services.getUsers();

    // Pré-seleção por query string ou último usado
    const qs = new URLSearchParams(location.search);
    const preUserId = qs.get("userId") || localStorage.getItem("gt_lastUserId");

    // Monta o select
    usuarioSelect.innerHTML = usuarios
      .map(u => `<option value="${u._id}">${u.nome || u.email || "Sem nome"}</option>`)
      .join("");

    if (preUserId && usuarios.some(u => u._id === preUserId)) {
      usuarioSelect.value = preUserId;
    }

    usuarioSelect.addEventListener("change", () => carregarListas(usuarioSelect.value));

    const startId = usuarioSelect.value || (usuarios[0] && usuarios[0]._id);
    if (startId) carregarListas(startId);
    else listasContainer.innerHTML = "<p>Nenhum usuário encontrado.</p>";
  } catch (err) {
    console.error(err);
    listasContainer.innerHTML = "<p>Erro ao carregar usuários.</p>";
  }
}

async function carregarListas(usuarioId) {
  try {
    localStorage.setItem("gt_lastUserId", usuarioId);
    const listas = await Services.getLists();
    const doUsuario = listas.filter(l => l.userId === usuarioId);
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

  // (+) Adicionar item
  listasContainer.querySelectorAll(".adicionar-item").forEach(btn => {
    btn.addEventListener("click", async () => {
      const listaId = btn.closest(".lista").dataset.id;
      const texto = (prompt("Digite o novo item:") || "").trim();
      if (!texto) return;

      const lista = await getListaById(listaId);
      const tarefas = Array.isArray(lista.tarefas) ? [...lista.tarefas] : [];
      tarefas.push({ texto, concluido: false });

      await Services.updateList(listaId, { nome: lista.nome, userId: lista.userId, tarefas });
      carregarListas(usuarioSelect.value);
    });
  });

  // (–) Remover item
  listasContainer.querySelectorAll(".remover").forEach(btn => {
    btn.addEventListener("click", async () => {
      const listaId = btn.closest(".lista").dataset.id;
      const idx = Number(btn.dataset.idx);

      const lista = await getListaById(listaId);
      const tarefas = (lista.tarefas || []).filter((_, i) => i !== idx);

      await Services.updateList(listaId, { nome: lista.nome, userId: lista.userId, tarefas });
      carregarListas(usuarioSelect.value);
    });
  });

  // Toggle concluído
  listasContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", async () => {
      const listaId = cb.closest(".lista").dataset.id;
      const idx = Number(cb.dataset.idx);

      const lista = await getListaById(listaId);
      const tarefas = [...(lista.tarefas || [])];
      tarefas[idx] = { ...tarefas[idx], concluido: cb.checked };

      await Services.updateList(listaId, { nome: lista.nome, userId: lista.userId, tarefas });
      // não recarrega a lista aqui para ficar instantâneo
    });
  });
}

// Helper: busca lista atual por ID (sem usar endpoint direto)
async function getListaById(id) {
  const listas = await Services.getLists();
  const l = listas.find(x => x._id === id);
  if (!l) throw new Error("Lista não encontrada");
  return l;
}
