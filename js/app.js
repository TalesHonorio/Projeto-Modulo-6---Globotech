// js/app.js
document.addEventListener("DOMContentLoaded", () => {
  // FOOTER padrão
  const nomes = ["André", "Mirra Bernardo", "Tales Honório"];
  const footer = document.createElement("footer");
  footer.classList.add("footer");
  footer.style.textAlign = "center";
  footer.style.marginTop = "2rem";
  footer.style.padding = "1rem 0";
  footer.style.borderTop = "1px solid #ccc";
  footer.textContent = "Equipe: " + nomes.join(" · ");
  document.body.appendChild(footer);

  // -------------------------------
  // Funções de apoio
  // -------------------------------
  function criarItem(listaUl, texto) {
    const li = document.createElement("li");

    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = texto;

    label.appendChild(input);
    label.appendChild(span);

    const btnRemover = document.createElement("button");
    btnRemover.classList.add("remover");
    btnRemover.textContent = "-";
    btnRemover.addEventListener("click", () => {
      li.remove();
    });

    li.appendChild(label);
    li.appendChild(btnRemover);
    listaUl.appendChild(li);
  }

  function adicionarEventosLista(listaDiv) {
    const btnAdicionar = listaDiv.querySelector(".adicionar-item");
    if (btnAdicionar) {
      btnAdicionar.addEventListener("click", () => {
        const texto = prompt("Digite o novo item:");
        if (texto) {
          const ul = listaDiv.querySelector("ul");
          criarItem(ul, texto);
        }
      });
    }

    listaDiv.querySelectorAll(".remover").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest("li").remove();
      });
    });
  }

  // -------------------------------
  // Detectar página e aplicar lógica
  // -------------------------------
  const path = window.location.pathname;

  // Página NOVA-LISTA
  if (path.includes("nova-lista.html")) {
    const form = document.getElementById("lista-form");
    if (form) {
      const btnSalvar = form.querySelector("button[type='button']");
      if (btnSalvar) {
        btnSalvar.addEventListener("click", () => {
          alert("Lista salva com sucesso!");
          window.location.href = "usuarios.html";
        });
      }
    }
  }

  // Página LISTAS
  if (path.includes("listas.html")) {
    document.querySelectorAll(".lista").forEach((listaDiv) => {
      adicionarEventosLista(listaDiv);
    });

    const btnNovaLista = document.querySelector(".btn button");
    if (btnNovaLista) {
      btnNovaLista.addEventListener("click", () => {
        const nomeLista = prompt("Digite o nome da nova lista:");
        if (nomeLista) {
          const grid = document.querySelector(".listas");
          const novaDiv = document.createElement("div");
          novaDiv.classList.add("lista");

          const h4 = document.createElement("h4");
          h4.textContent = nomeLista;

          const ul = document.createElement("ul");
          const btnAdd = document.createElement("button");
          btnAdd.classList.add("adicionar-item");
          btnAdd.textContent = "+";

          novaDiv.appendChild(h4);
          novaDiv.appendChild(ul);
          novaDiv.appendChild(btnAdd);

          grid.appendChild(novaDiv);
          adicionarEventosLista(novaDiv);
        }
      });
    }
  }
});
