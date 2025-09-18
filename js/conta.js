// js/conta.js
const formDados  = document.querySelector(".dados-conta form");
const formSenha  = document.querySelector(".alterar-senha form");
const btnExcluir = document.querySelector(".button-trash");
const btnSalvar  = document.querySelector(".acoes-conta button");

let account = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    // tenta por id salvo; se falhar, pega a primeira conta
    const savedId = localStorage.getItem("gt_accountId");
    account = savedId
      ? await Services.getAccount(savedId).catch(() => null)
      : null;

    if (!account) {
      const all = await Services.getAccounts();
      const email = localStorage.getItem("gt_accountEmail");
      account = (email && all.find(a => a.email === email)) || all[0] || null;
      if (account) {
        localStorage.setItem("gt_accountId", account._id);
        localStorage.setItem("gt_accountEmail", account.email || "");
      }
    }

    if (!account) {
      await alertAsync("Conta não encontrada. Crie a conta na tela inicial.", { title: "Ops!" });
      return;
    }

    // Preenche
    formDados.nome.value     = account.nome     || "";
    formDados.email.value    = account.email    || "";
    formDados.telefone.value = account.telefone || "";
    formDados.email.readOnly = true;
    formDados.email.style.opacity = .85;
  } catch (err) {
    console.error(err);
    showToast({ message: "Erro ao carregar dados da conta.", variant: "error" });
  }
}

// Salvar dados básicos
btnSalvar?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!account) return;
  try {
    await Services.updateAccount(account._id, {
      nome:     formDados.nome.value.trim(),
      telefone: formDados.telefone.value.trim(),
    });
    showToast({ message: "Dados atualizados!", variant: "success" });
  } catch (err) {
    console.error(err);
    showToast({ message: "Erro ao salvar dados.", variant: "error" });
  }
});

// Alterar senha (checa senha atual)
formSenha?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!account) return;

  const atual   = formSenha["senha-atual"]?.value ?? "";
  const nova    = formSenha["nova-senha"]?.value ?? "";
  const confirma= formSenha["confirma-senha"]?.value ?? "";

  if (!atual) { await alertAsync("Informe a senha atual.", { title: "Atenção" }); return; }
  if (nova.length < 6) { await alertAsync("A nova senha deve ter pelo menos 6 caracteres.", { title: "Atenção" }); return; }
  if (nova !== confirma) { await alertAsync("As senhas não coincidem!", { title: "Erro" }); return; }

  try {
    // recarrega a conta para garantir leitura correta
    const fresh = await Services.getAccount(account._id);
    if ((fresh.senha || "") !== atual) {
      await alertAsync("Senha atual incorreta.", { title: "Erro" });
      return;
    }

    await Services.updateAccount(account._id, { senha: nova });
    account.senha = nova;
    formSenha.reset();
    showToast({ message: "Senha alterada com sucesso!", variant: "success" });
  } catch (err) {
    console.error(err);
    showToast({ message: "Erro ao alterar senha.", variant: "error" });
  }
});

// Excluir conta (apaga tudo)
btnExcluir?.addEventListener("click", async () => {
  const ok = await confirmAsync(
    "Excluir a conta? Isso apagará TODOS os usuários e TODAS as listas.",
    { title: "Confirmação" }
  );
  if (!ok) return;

  try {
    await Services.deleteAccountDeep(account?._id);
    localStorage.removeItem("gt_accountId");
    localStorage.removeItem("gt_accountEmail");
    showToast({ message: "Conta excluída.", variant: "success" });
    setTimeout(() => (window.location.href = "/html/index.html"), 700);
  } catch (err) {
    console.error(err);
    showToast({ message: "Erro ao excluir conta.", variant: "error" });
  }
});
