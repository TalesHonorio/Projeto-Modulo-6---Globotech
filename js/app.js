// js/app.js
async function loadPartial(id, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error("Erro ao carregar partial:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // como o index.html está dentro de /html/, precisamos voltar um nível
  loadPartial("header-container", "../components/header.html");
  loadPartial("footer-container", "../components/footer.html");
});

