// Datos centrales del titular y del contacto para el sitio y las páginas legales.
// El origen y la ruta pública se resuelven desde la URL actual, sin fijar un dominio.
window.SITE_CONFIG = Object.freeze({
  owner: 'Elesar De La Vega',
  taxId: '73165105N',
  professionalAddress: 'C/ Hermanos Serrano Marcén, 25, 50840 San Mateo de Gállego, Zaragoza, España',
  email: 'elesarvega@gmail.com',
  phoneDisplay: '691 069 240',
  phoneInternational: '+34691069240',
  get baseUrl() {
    const path = window.location.pathname.endsWith('/')
      ? window.location.pathname
      : window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/') + 1);
    return `${window.location.origin}${path}`;
  },
  get pageUrl() { return this.baseUrl; },
  get legalUrl() { return `${this.baseUrl}aviso-legal.html`; }
});

// Mantiene email, teléfono, enlaces y metadatos sincronizados al cambiar de dominio.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-config]').forEach((element) => {
    const key = element.dataset.config;
    if (key in window.SITE_CONFIG) element.textContent = window.SITE_CONFIG[key];
  });
  document.querySelectorAll('[data-contact="email"]').forEach((element) => {
    element.href = `mailto:${window.SITE_CONFIG.email}`;
    element.textContent = window.SITE_CONFIG.email;
  });
  document.querySelectorAll('[data-contact="phone"]').forEach((element) => {
    element.href = `tel:${window.SITE_CONFIG.phoneInternational}`;
    element.textContent = window.SITE_CONFIG.phoneDisplay;
  });
  document.querySelectorAll('[data-contact="whatsapp"]').forEach((element) => {
    const number = window.SITE_CONFIG.phoneInternational.replace(/\D/g, '');
    element.href = `https://wa.me/${number}?text=Hola%20Elesar%2C%20he%20visto%20tu%20web`;
  });
  document.querySelectorAll('meta[property="og:url"]').forEach((element) => { element.content = window.SITE_CONFIG.pageUrl; });
  document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]').forEach((element) => { element.content = `${window.SITE_CONFIG.baseUrl}assets/social-preview.jpg`; });
  const schema = document.querySelector('#professional-service-schema');
  if (schema) {
    const data = JSON.parse(schema.textContent);
    data.url = window.SITE_CONFIG.pageUrl;
    data.email = window.SITE_CONFIG.email;
    data.telephone = window.SITE_CONFIG.phoneInternational;
    schema.textContent = JSON.stringify(data);
  }
});
