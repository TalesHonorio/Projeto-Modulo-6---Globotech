// js/usuarios.js
const usersGrid =
  document.getElementById("usersGrid") || document.querySelector(".content-users");
const btnNovo =
  document.getElementById("btnNovoUsuario") || document.querySelector(".btn button");

document.addEventListener("DOMContentLoaded", () => {
  carregarUsuarios();

  if (btnNovo) {
    btnNovo.addEventListener("click", () => {
      window.location.href = "/html/cria-user.html";
    });
  }
});

async function carregarUsuarios() {
  try {
    const [usuarios, listas] = await Promise.all([
      Services.getUsers(),
      Services.getLists(),
    ]);

    // Mapa userId -> quantidade de listas
    const contagem = listas.reduce((acc, l) => {
      const uid = l.userId; // <— padrão do projeto
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

  // Handlers por card
  usersGrid.querySelectorAll("article").forEach((card) => {
    const id = card.dataset.id;

    // Excluir
    card.querySelector(".button-trash").addEventListener("click", async () => {
      if (!confirm("Excluir este usuário? (as listas permanecerão)")) return;
      try {
        await Services.deleteUser(id);
        carregarUsuarios();
      } catch (e) {
        alert("Erro ao excluir usuário");
      }
    });

    // Editar
    card.querySelector(".btn-editar").addEventListener("click", async () => {
      const atual = card.querySelector("p").textContent.trim();
      const novoNome = prompt("Novo nome do usuário:", atual);
      if (!novoNome) return;
      try {
        await Services.updateUser(id, { nome: novoNome });
        carregarUsuarios();
      } catch (e) {
        alert("Erro ao atualizar usuário");
      }
    });

    // Ver listas do usuário
    card.querySelector(".btn-ver").addEventListener("click", () => {
      window.location.href = `/html/listas.html?userId=${encodeURIComponent(id)}`;
    });
  });
}
