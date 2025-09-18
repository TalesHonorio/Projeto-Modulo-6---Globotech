// js/index.js
document.addEventListener("DOMContentLoaded", () => {
  const form  = document.getElementById("formCadastro");
  const email = document.getElementById("email");
  const s1    = document.getElementById("senha1");
  const s2    = document.getElementById("senha2");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (s1.value !== s2.value) {
      await alertAsync("As senhas não coincidem!", { title: "Erro" });
      return;
    }

    try {
      // agora criamos uma CONTA, não um usuário
      const acc = await Services.createAccount({
        email: email.value,
        senha: s1.value
      });

      localStorage.setItem("gt_accountId", acc._id);
      localStorage.setItem("gt_accountEmail", acc.email || "");

      showToast({ message: "Conta criada com sucesso!", variant: "success" });
      window.location.href = "/html/cria-user.html";
    } catch (err) {
      console.error(err);
      showToast({ message: "Erro ao criar conta.", variant: "error" });
    }
  });
});
