'use strict';

// Renderiza datos de contacto desde la configuración central para evitar copias divergentes.
const config = window.SITE_CONFIG;
if (config) {
  document.querySelectorAll('[data-config]').forEach((element) => {
    const key = element.dataset.config;
    if (key in config) element.textContent = config[key];
  });

  document.querySelectorAll('[data-config-href]').forEach((element) => {
    const type = element.dataset.configHref;
    const key = element.dataset.config;
    if (type === 'mailto' && key === 'email') element.href = `mailto:${config.email}`;
    if (type === 'tel') element.href = `tel:${config.phoneInternational}`;
    if (type === 'page') element.href = config.pageUrl;
  });
}
