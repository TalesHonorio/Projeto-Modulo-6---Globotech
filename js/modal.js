// js/modal.js
(() => {
  const ROOT_ID = "gt-modal-root";
  const TOAST_ID = "gt-toast-root";

  function ensureRoot(id) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
    return el;
  }

  function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.add("closing");
    setTimeout(() => overlay.remove(), 160);
  }

  // ---- Modal principal
  function showModal(opts = {}) {
    const {
      title = "",
      message = "",
      type = "alert",           // "alert" | "confirm" | "prompt"
      placeholder = "",
      confirmText = "OK",
      cancelText  = "Cancelar",
      initialValue = "",
      onConfirm,
      onCancel,
      allowCloseOnBackdrop = true,
    } = opts;

    ensureRoot(ROOT_ID);

    const overlay = document.createElement("div");
    overlay.className = "gt-modal-overlay";
    overlay.innerHTML = `
      <div class="gt-modal" role="dialog" aria-modal="true">
       <div class="gt-modal-header">
        <h4>${message || title}</h4>
        <button class="gt-close" aria-label="Fechar">×</button>
      </div>

        ${
          type === "prompt"
            ? `<div class="gt-modal-body">
                 <input class="gt-input" type="text" placeholder="${placeholder}" value="${initialValue || ""}"/>
               </div>`
            : ""
        }

        <div class="gt-modal-actions">
          ${type !== "alert" ? `<button class="gt-btn gt-btn-secondary">${cancelText}</button>` : ""}
          <button class="gt-btn gt-btn-primary">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input   = overlay.querySelector(".gt-input");
    const btnOk   = overlay.querySelector(".gt-btn-primary");
    const btnNo   = overlay.querySelector(".gt-btn-secondary");
    const btnX    = overlay.querySelector(".gt-close");
    const box     = overlay.querySelector(".gt-modal");

    setTimeout(() => (input ? input.focus() : btnOk.focus()), 10);

    let resolver;
    const doCancel = (val) => {
      closeOverlay(overlay);
      onCancel && onCancel(val);
      resolver && resolver({ confirmed: false, value: val ?? null });
    };
    const doConfirm = () => {
      const val = type === "prompt" ? (input.value || "").trim() : true;
      if (type === "prompt" && !val) return; // não confirma vazio
      closeOverlay(overlay);
      onConfirm && onConfirm(val);
      resolver && resolver({ confirmed: true, value: val });
    };

    btnOk.addEventListener("click", doConfirm);
    btnX.addEventListener("click", () => doCancel(null));
    if (btnNo) btnNo.addEventListener("click", () => doCancel(null));

    overlay.addEventListener("click", (e) => {
      if (!allowCloseOnBackdrop) return;
      if (!box.contains(e.target)) doCancel(null);
    });

    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") doCancel(null);
      if (e.key === "Enter")  doConfirm();
    });

    return new Promise((res) => (resolver = res));
  }

  // ---- Toast rápido
  function showToast({ message = "", variant = "success", duration = 2500 } = {}) {
    const root = ensureRoot(TOAST_ID);
    root.classList.add("gt-toast-container");

    const t = document.createElement("div");
    t.className = `gt-toast ${variant}`;
    t.textContent = message;
    root.appendChild(t);

    requestAnimationFrame(() => t.classList.add("in"));
    setTimeout(() => {
      t.classList.remove("in");
      setTimeout(() => t.remove(), 200);
    }, duration);
  }

  // ---- Helpers assíncronos
  async function alertAsync(message, opts = {}) {
    await showModal({ type: "alert", message, ...opts });
  }

  async function confirmAsync(message, opts = {}) {
    const { confirmed } = await showModal({ type: "confirm", message, ...opts });
    return confirmed;
  }

  async function promptAsync(
    message,
    { placeholder = "", initialValue = "", ...opts } = {}
  ) {
    const { confirmed, value } = await showModal({
      type: "prompt",
      message,
      placeholder,
      initialValue,
      ...opts,
    });
    return confirmed ? value : null;
  }

  // Expõe global
  window.showModal = showModal;
  window.showToast = showToast;
  window.alertAsync = alertAsync;
  window.confirmAsync = confirmAsync;
  window.promptAsync = promptAsync;
})();
