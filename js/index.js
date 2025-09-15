// js/index.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  const email = document.getElementById("email");
  const senha1 = document.getElementById("senha1");
  const senha2 = document.getElementById("senha2");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // não deixa o form recarregar a página

    if (senha1.value !== senha2.value) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const user = { email: email.value, senha: senha1.value };
      await Services.createUser(user); // salva no CrudCrud

      alert("Usuário criado com sucesso!");
      window.location.href = "/html/cria-user.html"; // redireciona só se der certo
    } catch (err) {
      console.error(err);
      alert("Erro ao criar usuário");
    }
  });
});
