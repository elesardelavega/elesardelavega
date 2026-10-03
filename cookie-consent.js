'use strict';

(() => {
  const KEY = 'elesar-cookie-consent-v1';
  const root = document.querySelector('#cookie-consent-root');
  if (!root) return;

  const readConsent = () => {
    for (const storageName of ['localStorage', 'sessionStorage']) {
      try {
        const storage = window[storageName];
        const value = JSON.parse(storage.getItem(KEY));
        if (value && value.version === 1) return value;
      } catch { /* Algunos navegadores privados bloquean el almacenamiento web. */ }
    }
    return null;
  };

  root.innerHTML = `
    <dialog class="cookie-banner" aria-labelledby="cookie-title" aria-describedby="cookie-description">
      <div class="cookie-copy"><p class="eyebrow">TU PRIVACIDAD</p><h2 id="cookie-title">Tú decides sobre las cookies.</h2><p id="cookie-description">Usamos almacenamiento técnico para recordar tus preferencias. No hay analítica ni publicidad activas. Puedes aceptar, rechazar o revisar las categorías opcionales.</p><a href="cookies.html">Más información sobre cookies</a></div>
      <div class="cookie-actions"><button type="button" class="button button-blue" data-cookie-accept> Aceptar todas </button><button type="button" class="cookie-button" data-cookie-reject>Rechazar opcionales</button><button type="button" class="cookie-button" data-cookie-configure>Configurar</button></div>
    </dialog>
    <dialog class="cookie-preferences" aria-labelledby="cookie-preferences-title">
      <button class="dialog-close" type="button" data-cookie-close>Cerrar <span aria-hidden="true">×</span></button>
      <p class="eyebrow">PREFERENCIAS</p><h2 id="cookie-preferences-title">Configura las cookies</h2>
      <p>Las cookies necesarias mantienen la web y recuerdan tu elección. Están siempre activas. Las categorías opcionales solo se activarán si más adelante se incorporan herramientas que las utilicen y das tu consentimiento.</p>
      <label class="cookie-option"><span><strong>Necesarias</strong><small>Preferencias de consentimiento y funcionamiento básico.</small></span><input type="checkbox" checked disabled aria-label="Cookies necesarias, siempre activas"></label>
      <label class="cookie-option"><span><strong>Analítica</strong><small>Medición agregada del uso de la web. Actualmente no instalada.</small></span><input type="checkbox" name="analytics"></label>
      <label class="cookie-option"><span><strong>Marketing</strong><small>Publicidad y medición de campañas. Actualmente no instalada.</small></span><input type="checkbox" name="marketing"></label>
      <div class="cookie-preference-actions"><button class="button button-blue" type="button" data-cookie-save>Guardar selección</button><button class="cookie-button" type="button" data-cookie-reject>Rechazar opcionales</button></div>
    </dialog>`;

  const banner = root.querySelector('.cookie-banner');
  const dialog = root.querySelector('.cookie-preferences');
  const analytics = dialog.querySelector('[name="analytics"]');
  const marketing = dialog.querySelector('[name="marketing"]');
  const openDialog = (target) => {
    if (typeof target.showModal === 'function') target.showModal();
    else target.setAttribute('open', '');
  };
  const closeDialog = (target) => {
    if (typeof target.close === 'function' && target.open) target.close();
    else target.removeAttribute('open');
  };

  const save = (analyticsValue, marketingValue, choice) => {
    const consent = { version: 1, necessary: true, analytics: Boolean(analyticsValue), marketing: Boolean(marketingValue), choice, updatedAt: new Date().toISOString() };
    const serialized = JSON.stringify(consent);
    for (const storageName of ['localStorage', 'sessionStorage']) {
      try { window[storageName].setItem(KEY, serialized); } catch { /* Se intenta el almacenamiento alternativo. */ }
    }
    closeDialog(banner);
    closeDialog(dialog);
  };

  const openPreferences = () => {
    const current = readConsent();
    analytics.checked = Boolean(current?.analytics);
    marketing.checked = Boolean(current?.marketing);
    closeDialog(banner);
    openDialog(dialog);
    dialog.querySelector('[name="analytics"]').focus();
  };

  root.querySelectorAll('[data-cookie-accept]').forEach((button) => button.addEventListener('click', () => save(true, true, 'accepted')));
  root.querySelectorAll('[data-cookie-reject]').forEach((button) => button.addEventListener('click', () => save(false, false, 'rejected')));
  root.querySelector('[data-cookie-configure]').addEventListener('click', openPreferences);
  root.querySelector('[data-cookie-save]').addEventListener('click', () => save(analytics.checked, marketing.checked, 'custom'));
  const showBanner = () => { if (!readConsent() && !banner.open) openDialog(banner); };
  root.querySelector('[data-cookie-close]').addEventListener('click', () => { closeDialog(dialog); showBanner(); });
  document.querySelectorAll('[data-cookie-settings]').forEach((button) => button.addEventListener('click', openPreferences));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { closeDialog(dialog); showBanner(); } });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); });
  banner.addEventListener('cancel', (event) => { event.preventDefault(); });

  if (!readConsent()) {
    // Deja que la página termine de mostrarse antes de presentar el diálogo.
    window.setTimeout(showBanner, 350);
  }
})();
