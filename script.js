'use strict';
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
const mobile = window.matchMedia('(max-width: 760px)');
function setMenu(open) {
  menu.hidden = mobile.matches && !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? '−' : '＋';
}
setMenu(false);
mobile.addEventListener('change', () => setMenu(false));
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobile.matches) setMenu(false);
});

// Atajo visible después de avanzar por la página.
const backToTop = document.querySelector('#back-to-top');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function updateBackToTop() {
  backToTop.hidden = window.scrollY < 520;
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
});
updateBackToTop();

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobile.matches && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

// Datos resumidos de los proyectos. Revisar y ampliar cuando existan métricas o capturas nuevas.
const projects = {
  corporativas: {
    title: 'Webs corporativas',
    category: 'WEBS CORPORATIVAS / SERVICIO PROPIO',
    context: 'Webs para empresas, autónomos y negocios que necesitan presentar sus servicios, captar contactos y transmitir confianza desde el primer vistazo.',
    contribution: 'Definición de estructura, diseño visual, desarrollo en WordPress o código, formularios de contacto, SEO básico, mantenimiento y ajustes para que la web sea fácil de actualizar.',
    tags: ['WordPress', 'PHP', 'HTML', 'CSS', 'JavaScript', 'SEO'],
    result: 'Cada proyecto se adapta al sector, objetivos y presupuesto disponible, con una base preparada para crecer y mantenerse en el tiempo.'
  },
  tienda: {
    title: 'Tiendas online y ecommerce',
    category: 'TIENDAS ONLINE / ECOMMERCE',
    context: 'Proyecto de ecommerce para presentar y vender productos con un catálogo visual, navegación clara y una experiencia de compra sencilla.',
    contribution: 'Diseño de catálogo y fichas de producto, organización de contenidos e inventario y configuración de la base de la tienda según las necesidades del negocio.',
    tags: ['WordPress', 'PHP', 'Ecommerce', 'HTML', 'CSS', 'JavaScript'],
    result: 'Una tienda online adaptable a distintos sectores, preparada para mostrar productos y facilitar la compra desde cualquier dispositivo.'
  },
  webdj: {
    title: 'Web para profesionales de eventos',
    category: 'WEB PARA PROFESIONALES / EVENTOS',
    context: 'Landing sectorial para profesionales de eventos que necesitan presentar servicios, galería, propuesta de valor y contacto directo.',
    contribution: 'Estructura de landing, navegación clara, secciones de presentación, galería, llamadas a la acción y adaptación visual al tipo de servicio.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Netlify'],
    result: 'Una web enfocada a convertir visitas en contactos, con una presentación clara para clientes que buscan contratar servicios de eventos.'
  },
  soporte: {
    title: 'Soporte y mantenimiento informático',
    category: 'SOPORTE TÉCNICO / MANTENIMIENTO',
    context: 'Asistencia para equipos, redes, sistemas y software en entornos personales y profesionales, con atención remota o presencial.',
    contribution: 'Diagnóstico, configuración, instalación, limpieza, copias de seguridad, puesta a punto, redes, routers, impresoras y mantenimiento diario.',
    tags: ['Soporte técnico', 'Sistemas', 'Mantenimiento', 'Windows', 'Linux', 'Redes'],
    result: 'Servicio por horas o por proyecto cerrado para resolver incidencias, mejorar equipos y mantener la tecnología lista para trabajar.'
  }
};
const dialog = document.querySelector('#project-dialog');
let lastProjectButton;
document.querySelectorAll('.project-open').forEach((button) => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    lastProjectButton = button;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-category').textContent = project.category;
    const content = document.querySelector('#dialog-content');
    content.replaceChildren();
    [['Contexto', project.context], ['Mi aportación', project.contribution]].forEach(([title, text]) => {
      const heading = document.createElement('h3');
      heading.textContent = title;
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      content.append(heading, paragraph);
    });
    const list = document.createElement('ul');
    list.className = 'tags';
    list.setAttribute('aria-label', 'Tecnologías del proyecto');
    project.tags.forEach((tag) => {
      const item = document.createElement('li');
      item.textContent = tag;
      list.append(item);
    });
    const result = document.createElement('p');
    result.className = 'dialog-note';
    result.textContent = project.result;
    content.append(list, result);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  lastProjectButton?.focus();
});
document.querySelector('#dialog-contact').addEventListener('click', () => dialog.close());
