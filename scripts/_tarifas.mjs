/* Los precios, en un solo sitio.

   Aparecen en dos páginas: la portada y /servicios. Si cada una llevara su
   propio HTML acabarían divergiendo, y el día que enseñen cifras distintas
   la credibilidad se va entera. Así que el bloque se escribe aquí una vez y
   las dos páginas lo reciben de este módulo.

   El guion de llamada dice las mismas cifras. Si cambian aquí, hay que
   cambiarlas también en plantillas/captacion/01-llamada.md. */

export const PLAZAS = 'para los cinco primeros proyectos, hasta el 31 de octubre';

export const PLANES = [
  {
    n: 'Esencial',
    d: 'Presencia profesional para que te encuentren, entiendan a qué te dedicas y te contacten.',
    desde: '690 €',
    habitual: '890 €',
    l: [
      'Diseño y desarrollo profesional',
      'Diseño a medida, sin plantillas',
      'Estructura clara',
      'Textos a medida',
      'Formularios y botones funcionales',
      'Optimización de velocidad y SEO',
      'Web conforme a la normativa: aviso legal, privacidad y cookies',
      'Dominio y alojamiento configurados y a tu nombre',
      'Una ronda de revisión',
      'Seguimiento del proyecto con entregables claros'
    ]
  },
  {
    n: 'Profesional',
    d: 'Para negocios que necesitan que su web genere oportunidades y poder gestionarla internamente.',
    desde: '1.290 €',
    habitual: '1.690 €',
    dest: 'La que recomendamos',
    l: [
      'Todo lo del plan Esencial',
      'Auditoría estratégica del negocio y del sitio web',
      'Diseño 100 % a medida, alineado con tu identidad de marca',
      'Desarrollo premium orientado a la conversión',
      'Optimización de velocidad y SEO técnico',
      'Acabado visual trabajado para reforzar la percepción y la autoridad de tu marca',
      '<b>Panel de gestión propio</b> para actualizar la web sin depender de nadie',
      'Registro de las solicitudes recibidas y de las visitas',
      'Datos estructurados y posicionamiento local',
      'Dos rondas de revisión',
      'Seguimiento del proyecto con entregables claros'
    ]
  }
];

export const ECOMMERCE = {
  n: 'Comercio electrónico',
  d: 'Catálogo, ficha de producto, pasarela de pago, envíos e impuestos y gestión de pedidos.',
  desde: '1.490 €'
};

export const MANTENIMIENTO = {
  t: 'Mantenimiento y soporte',
  d: 'Alojamiento, copias de seguridad, actualizaciones, vigilancia del rendimiento y cambios sobre la marcha. Sin permanencia: el mes que decidas parar, paras.',
  cifras: '29 € / 49 €',
  unidad: 'al mes, según el plan'
};

const plan = (p) => `
      <article class="plan${p.dest ? ' plan--dest' : ''}">
        ${p.dest ? `<span class="plan__tag">${p.dest}</span>\n        ` : ''}<h3 class="plan__n">${p.n}</h3>
        <p class="plan__d">${p.d}</p>
        <p class="plan__p"><span class="plan__desde">desde</span>${p.desde}<s><span class="sr-only">Precio habitual: </span>${p.habitual}</s></p>
        <ul class="plan__l">
${p.l.map((i) => `          <li>${i}</li>`).join('\n')}
        </ul>
        <p class="plan__pie">Pago único a la entrega.</p>
      </article>`;

/* inv = piel oscura, para la portada. */
export const bloqueTarifas = ({ inv = false, sangria = '    ' } = {}) => {
  const html = `<div class="tarifas${inv ? ' tarifas--inv' : ''}">
  <p class="plazas"><b>Precios de lanzamiento</b> ${PLAZAS}.</p>

  <div class="planes">
${PLANES.map(plan).join('\n')}
  </div>

  <article class="plan plan--ancho">
    <div>
      <h3 class="plan__n">${ECOMMERCE.n}</h3>
      <p class="plan__d">${ECOMMERCE.d}</p>
    </div>
    <p class="plan__p"><span class="plan__desde">desde</span>${ECOMMERCE.desde}</p>
  </article>

  <div class="mant">
    <div class="mant__txt">
      <b>${MANTENIMIENTO.t}</b>
      <p>${MANTENIMIENTO.d}</p>
      <p class="mant__cifras">${MANTENIMIENTO.cifras}<span>${MANTENIMIENTO.unidad}</span></p>
    </div>
    <a class="btn btn--sm ${inv ? 'btn--ghost-inv' : 'btn--ghost'}" href="/mantenimiento"><span>Ver qué incluye</span></a>
  </div>
</div>`;

  return html
    .split('\n')
    .map((l) => (l ? sangria + l : l))
    .join('\n');
};
