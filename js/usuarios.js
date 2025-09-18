// js/usuarios.js
const usersGrid =
  document.getElementById("usersGrid") || document.querySelector(".content-users");
const btnNovo =
  document.getElementById("btnNovoUsuario") || document.querySelector(".btn button");

document.addEventListener("DOMContentLoaded", () => {
  carregarUsuarios();

  btnNovo?.addEventListener("click", () => {
    window.location.href = "/html/cria-user.html";
  });
});

async function carregarUsuarios() {
  try {
    const [usuariosRaw, listas] = await Promise.all([
      Services.getUsers(),
      Services.getLists(),
    ]);

    // ⚠️ Filtra qualquer registro que tenha sobrado como “account”
    const accEmail = localStorage.getItem("gt_accountEmail");
    const usuarios = usuariosRaw.filter(
      u => !(u.tipo === "account" || (accEmail && u.email === accEmail))
    );

    // Mapa userId -> quantidade de listas
    const contagem = listas.reduce((acc, l) => {
      const uid = l.userId;
      if (!uid) return acc;
      acc[uid] = (acc[uid] || 0) + 1;
      return acc;
    }, {});

    renderUsuarios(usuarios, contagem);
  } catch (err) {
    console.error(err);
    if (usersGrid) usersGrid.innerHTML = "<p>Erro ao carregar usuários.</p>";
  }
}

function renderUsuarios(usuarios, contagem) {
  if (!usersGrid) return;

  usersGrid.innerHTML = usuarios
    .map((u) => {
      const qtd = contagem[u._id] || 0;
      const plural = qtd === 1 ? "lista" : "listas";
      const nome = u.nome || u.email || "Sem nome";
      return `
        <article data-id="${u._id}">
          <button class="button-trash" title="Excluir usuário"></button>
          <div>
            <div>
              <span>Nome</span>
              <p>${nome}</p>
            </div>
            <button type="button" class="btn-editar">editar</button>
          </div>
          <div>
            <div>
              <span>Listas</span>
              <p>${qtd} ${plural}</p>
            </div>
            <button type="button" class="btn-ver">ver</button>
          </div>
        </article>
      `;
    })
    .join("");

  usersGrid.querySelectorAll("article").forEach((card) => {
    const id = card.dataset.id;

    // Excluir (com cascata)
    card.querySelector(".button-trash").addEventListener("click", async () => {
      const ok = await confirmAsync("Excluir este usuário? As listas dele serão apagadas.");
      if (!ok) return;
      try {
        await Services.deleteUserWithLists(id);
        showToast({ message: "Usuário excluído.", variant: "success" });
        carregarUsuarios();
      } catch (e) {
        console.error(e);
        showToast({ message: "Erro ao excluir usuário.", variant: "error" });
      }
    });

    // Editar (usa modal prompt)
    card.querySelector(".btn-editar").addEventListener("click", async () => {
      const atual = card.querySelector("p").textContent.trim();
      const novoNome = await promptAsync("Novo nome do usuário:", {
        initialValue: atual,
        placeholder: "Digite o novo nome",
      });
      if (!novoNome || !novoNome.trim()) return;
      try {
        await Services.updateUser(id, { nome: novoNome.trim() });
        showToast({ message: "Usuário atualizado!", variant: "success" });
        carregarUsuarios();
      } catch (e) {
        console.error(e);
        showToast({ message: "Erro ao atualizar usuário.", variant: "error" });
      }
    });

    // Ver listas do usuário
    card.querySelector(".btn-ver").addEventListener("click", () => {
      window.location.href = `/html/listas.html?userId=${encodeURIComponent(id)}`;
    });
  });
}
