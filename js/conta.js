// js/conta.js
const formDados = document.querySelector(".dados-conta form");
const formSenha = document.querySelector(".alterar-senha form");
const btnExcluir = document.querySelector(".button-trash");
const btnSalvar = document.querySelector(".acoes-conta button");

document.addEventListener("DOMContentLoaded", async () => {
  const id = localStorage.getItem("usuarioIdSelecionado");
  if (!id) return;

  try {
    const usuarios = await Services.getUsers();
    const user = usuarios.find(u => u._id === id);

    if (user) {
      formDados.nome.value = user.nome || "";
      formDados.email.value = user.email || "";
      formDados.telefone.value = user.telefone || "";
    }
  } catch (err) {
    console.error(err);
  }
});

btnSalvar.addEventListener("click", async (e) => {
  e.preventDefault();
  const id = localStorage.getItem("usuarioIdSelecionado");

  try {
    await Services.updateUser(id, {
      nome: formDados.nome.value,
      email: formDados.email.value,
      telefone: formDados.telefone.value,
    });
    alert("Dados atualizados!");
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar dados.");
  }
});

btnExcluir.addEventListener("click", async () => {
  const id = localStorage.getItem("usuarioIdSelecionado");
  if (confirm("Tem certeza que deseja excluir a conta?")) {
    try {
      await Services.deleteUser(id);
      alert("Conta excluída!");
      window.location.href = "usuarios.html";
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir conta.");
    }
  }
});

formSenha.addEventListener("submit", async (e) => {
  e.preventDefault();
  const novaSenha = formSenha["nova-senha"].value;
  const confirma = formSenha["confirma-senha"].value;

  if (novaSenha !== confirma) {
    alert("As senhas não coincidem!");
    return;
  }

  const id = localStorage.getItem("usuarioIdSelecionado");
  try {
    await Services.updateUser(id, { senha: novaSenha });
    alert("Senha alterada!");
  } catch (err) {
    console.error(err);
    alert("Erro ao alterar senha.");
  }
});
