export type BlogSection = "tips" | "mundo";

export interface BlogPost {
  slug: string;
  section: BlogSection;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  color: string;
  merquitoQuote?: string;   // short quote shown on card for tips
  body: string;
}

/* ── Tips de Merquito ──────────────────────────────────────────────── */

const TIPS: BlogPost[] = [
  {
    slug:    "como-saber-cuando-cambiar-llantas",
    section: "tips",
    category: "Mantenimiento",
    title:   "Cómo saber cuándo es hora de cambiar tus llantas",
    excerpt: "La profundidad del dibujo, las grietas en los flancos y la vibración al frenar son señales que no debes ignorar. Aprende a leerlas antes de que sea demasiado tarde.",
    date:    "18 jul 2026",
    readTime: "4 min",
    color:   "#1a0d00",
    merquitoQuote: "¡Una llanta mala es peligro puro!",
    body: `
      <p>Las llantas son el único punto de contacto entre tu vehículo y la vía. Mantenerlas en buen estado no es una opción, es una obligación de seguridad.</p>
      <h2>La regla del peso de una moneda</h2>
      <p>Inserta una moneda de $200 en el dibujo de la llanta. Si puedes ver la orilla completa de la moneda, el dibujo mide menos de 2mm y es hora de cambiar. En Colombia, la ley exige un mínimo de 1.6mm, pero los expertos recomiendan cambiar a los 3mm.</p>
      <h2>Señales visuales que no debes ignorar</h2>
      <ul>
        <li>Grietas o cortes en los flancos (costados de la llanta)</li>
        <li>Desgaste irregular (más de un lado que del otro)</li>
        <li>Abultamientos o hernias en cualquier parte</li>
        <li>Objetos incrustados como tornillos o clavos</li>
      </ul>
      <h2>Señales al conducir</h2>
      <p>Si sientes vibración en el volante, el vehículo jala hacia un lado o el frenado se vuelve impreciso, no lo atribuyas al pavimento: revisa las llantas primero.</p>
      <h2>Cada cuánto cambiarlas por tiempo</h2>
      <p>Aunque tengan buen dibujo, las llantas con más de 6 años deben revisarse por un experto. El caucho envejece internamente aunque no lo veas. A los 10 años, cambio obligatorio sin excepción.</p>
    `,
  },
  {
    slug:    "diferencia-aceite-sintetico-vs-mineral",
    section: "tips",
    category: "Lubricantes",
    title:   "Sintético vs. mineral: cuál aceite le conviene a tu motor",
    excerpt: "No todos los motores necesitan el mismo aceite. Te explicamos las diferencias reales entre aceite sintético, semi-sintético y mineral para que no gastes de más.",
    date:    "10 jul 2026",
    readTime: "5 min",
    color:   "#0d1a2d",
    merquitoQuote: "El aceite correcto = motor feliz.",
    body: `
      <p>El aceite de motor es la sangre de tu vehículo. Elegir mal puede costarle la vida a tu motor. Aquí te explicamos cada tipo sin tecnicismos innecesarios.</p>
      <h2>Aceite mineral</h2>
      <p>Se deriva directamente del petróleo con refinación básica. Es el más económico, pero también el que menos protege bajo condiciones extremas de temperatura. Recomendado para vehículos antiguos con motores de diseño simple.</p>
      <h2>Aceite semi-sintético</h2>
      <p>Mezcla de base mineral con aditivos sintéticos. Ofrece mejor protección que el mineral a un precio moderado. Ideal para vehículos con uso urbano intensivo o motores de mediana cilindrada.</p>
      <h2>Aceite 100% sintético</h2>
      <p>Fabricado en laboratorio con moléculas diseñadas para proteger en condiciones extremas. Menor fricción, mayor limpieza del motor, mejor rendimiento en frío y en calor. El estándar para vehículos modernos y turboalimentados.</p>
      <h2>Cómo elegir</h2>
      <p>Revisa el manual de tu vehículo. Ahí encontrarás la viscosidad recomendada (por ejemplo 5W-30) y la norma API exigida (SN, SP). Si tu vehículo tiene más de 150.000 km, considera un aceite para alto kilometraje.</p>
    `,
  },
  {
    slug:    "guia-llantas-suv-colombia",
    section: "tips",
    category: "Guía de compra",
    title:   "Guía definitiva para elegir llantas de SUV en Colombia",
    excerpt: "Vías destapadas, lluvia intensa y peajes de montaña: las condiciones colombianas exigen llantas distintas. Esta es la guía que necesitabas antes de comprar.",
    date:    "2 jul 2026",
    readTime: "7 min",
    color:   "#0d1500",
    merquitoQuote: "¡No todas las llantas son iguales, amigo!",
    body: `
      <p>Colombia no es un país de un solo terreno. Bogotá, Medellín, la costa, los llanos y las vías intermunicipales le exigen cosas distintas a tus llantas.</p>
      <h2>Uso 100% urbano</h2>
      <p>Si tu SUV nunca sale de la ciudad, una llanta de tipo Touring o Highway Terrain (HT) es suficiente. Son más silenciosas, cómodas y duran más en asfalto.</p>
      <h2>Uso mixto: ciudad y carretera</h2>
      <p>El 80% de los dueños de SUV en Colombia cae en esta categoría. Una llanta All-Terrain (AT) de buena calidad ofrece el equilibrio perfecto: agarre en mojado, confort en autopista y tracción decente en caminos sin pavimentar.</p>
      <h2>Uso off-road intensivo</h2>
      <p>Si recorres trochas y vías destapadas con frecuencia, necesitas una Mud-Terrain (MT). Son agresivas, ruidosas en asfalto, pero imbatibles en barro y piedra.</p>
      <h2>Factores clave al comprar</h2>
      <ul>
        <li>Medida correcta: nunca compres una llanta de medida diferente sin consultar a un experto</li>
        <li>Índice de carga: debe ser igual o mayor al del manual del vehículo</li>
        <li>Presupuesto: mejor dos buenas delante y dos económicas atrás</li>
      </ul>
    `,
  },
  {
    slug:    "presion-llantas-como-y-cuando-inflar",
    section: "tips",
    category: "Mantenimiento",
    title:   "¿Cada cuánto inflar tus llantas y cómo hacerlo bien?",
    excerpt: "La presión incorrecta desgasta tus llantas antes de tiempo y aumenta el consumo de combustible. Merquito te enseña el método correcto en 3 pasos.",
    date:    "25 jun 2026",
    readTime: "3 min",
    color:   "#1a0a00",
    merquitoQuote: "¡Ni muy duras ni muy blandas!",
    body: `
      <p>Conducir con presión incorrecta en las llantas puede costar hasta un 8% más en combustible y reduce la vida útil de las llantas hasta en un 25%. Es un error fácil de evitar.</p>
      <h2>¿Cuánta presión necesitan mis llantas?</h2>
      <p>La presión correcta está en la pegatina dentro de la puerta del conductor o en el manual del vehículo. No en el costado de la llanta (ese número es el máximo permitido, no el recomendado).</p>
      <h2>Cuándo revisar la presión</h2>
      <p>Una vez al mes y siempre antes de viajes largos. Hazlo con las llantas frías (el vehículo parado más de 3 horas) porque el calor de la conducción aumenta artificialmente la presión.</p>
      <h2>Los 3 pasos de Merquito</h2>
      <ul>
        <li>1. Retira la tapa de la válvula y guárdala en el bolsillo</li>
        <li>2. Conecta el manómetro o la manguera del inflador firmemente</li>
        <li>3. Infla hasta la presión recomendada, vuelve a revisar y pon la tapa</li>
      </ul>
      <p>Si no tienes manómetro, cualquier estación de servicio o punto Merquellantas tiene uno disponible sin costo.</p>
    `,
  },
  {
    slug:    "cuanto-dura-bateria-carro",
    section: "tips",
    category: "Baterías",
    title:   "¿Cuánto dura la batería de tu carro y cómo saber cuándo cambiarla?",
    excerpt: "Una batería débil puede dejarte varado sin aviso. Aprende a identificar los síntomas a tiempo y cuántos años de vida útil puedes esperar de la tuya.",
    date:    "18 jun 2026",
    readTime: "4 min",
    color:   "#10001a",
    merquitoQuote: "¡Que no te deje varado, pana!",
    body: `
      <p>La batería es el corazón eléctrico de tu vehículo. Sin ella, ni el motor arranca ni los sistemas electrónicos funcionan. La buena noticia: da señales antes de morir.</p>
      <h2>Vida útil promedio</h2>
      <p>En Colombia, con el calor y el uso intensivo urbano, una batería convencional dura entre 3 y 5 años. Las AGM (para vehículos con Start-Stop) pueden llegar a 6-7 años.</p>
      <h2>Señales de que va a fallar</h2>
      <ul>
        <li>El motor arranca más despacio de lo normal ("gira lento")</li>
        <li>Las luces se oscurecen cuando el motor está en ralentí</li>
        <li>El botón de arranque requiere varios intentos</li>
        <li>El tablero muestra la luz de batería encendida</li>
      </ul>
      <h2>Prueba rápida</h2>
      <p>Con el motor apagado, enciende los faros por 15 segundos. Luego arranca el vehículo. Si los faros se oscurecen notablemente al encender el motor, la batería ya no guarda carga suficiente.</p>
      <h2>Cuándo cambiarla</h2>
      <p>Si tu batería tiene más de 3 años y empieza a dar señales, cámbiala antes de que te deje varado. En cualquier punto Merquellantas hacemos la prueba de carga gratis.</p>
    `,
  },
  {
    slug:    "como-leer-numeros-llanta",
    section: "tips",
    category: "Guía de compra",
    title:   "Cómo leer los números del costado de tu llanta",
    excerpt: "225/45 R17 91W… ¿qué significa todo eso? Merquito te lo explica de forma sencilla para que nunca vuelvas a comprar la llanta equivocada.",
    date:    "10 jun 2026",
    readTime: "3 min",
    color:   "#001020",
    merquitoQuote: "¡Saber leer tu llanta te salva!",
    body: `
      <p>Todos esos números y letras en el costado de la llanta parecen un código secreto. No lo son. Te los explicamos uno a uno.</p>
      <h2>El ejemplo: 225/45 R17 91W</h2>
      <p><strong>225</strong> = ancho de la llanta en milímetros (de hombro a hombro)</p>
      <p><strong>45</strong> = perfil o serie: la altura del flanco es el 45% del ancho. A menor número, más deportiva y más baja.</p>
      <p><strong>R</strong> = construcción radial (el estándar de hoy en día)</p>
      <p><strong>17</strong> = diámetro del rin en pulgadas al que se monta la llanta</p>
      <p><strong>91</strong> = índice de carga: la llanta soporta hasta 615 kg por unidad</p>
      <p><strong>W</strong> = índice de velocidad: homologada hasta 270 km/h</p>
      <h2>¿Puedo cambiar la medida?</h2>
      <p>Pequeñas variaciones en el perfil (+/- 5) son aceptables si el diámetro total se mantiene igual. Cambios mayores afectan el odómetro, la dirección y la seguridad. Siempre consulta a un experto antes de cambiar la medida original.</p>
    `,
  },
];

/* ── Mundo Merque ──────────────────────────────────────────────────── */

const MUNDO: BlogPost[] = [
  {
    slug:    "merquellantas-abre-barranquilla",
    section: "mundo",
    category: "Expansión",
    title:   "Merquellantas llega a Barranquilla con su tienda más grande del Caribe",
    excerpt: "Abrimos nuestro primer punto en la Costa Atlántica, ubicado en el corredor industrial de Murillo. Más de 800 m² de espacio, instalación express y stock completo.",
    date:    "15 ago 2026",
    readTime: "2 min",
    color:   "#001a0d",
    body: `
      <p>Merquellantas expande su red de tiendas físicas con la apertura de su primer punto en Barranquilla, ubicado en la Carrera 46 # 70-34, en el corredor industrial de Murillo.</p>
      <h2>La tienda más grande de la Costa</h2>
      <p>Con más de 800 m² de área de exhibición y taller, el punto de Barranquilla cuenta con 8 bahías de instalación simultánea, stock de más de 400 referencias de llantas y un equipo de 14 técnicos certificados.</p>
      <h2>Horarios de apertura</h2>
      <p>Lunes a sábado de 7:00 a.m. a 7:00 p.m. Domingos de 8:00 a.m. a 2:00 p.m. Para los primeros 30 días de apertura, la instalación de llantas es completamente gratis para todos los clientes.</p>
    `,
  },
  {
    slug:    "distribuidores-oficiales-continental",
    section: "mundo",
    category: "Alianzas",
    title:   "Somos distribuidores oficiales de Continental Tires en Colombia",
    excerpt: "Tras meses de negociaciones, Merquellantas firma acuerdo de distribución exclusiva con Continental para el mercado colombiano. Stock permanente garantizado.",
    date:    "8 ago 2026",
    readTime: "3 min",
    color:   "#0d0d1a",
    body: `
      <p>Merquellantas firma acuerdo de distribución oficial con Continental AG, uno de los fabricantes de llantas más importantes del mundo, para comercializar su línea completa en Colombia.</p>
      <h2>¿Qué significa esto para ti?</h2>
      <p>Stock permanente de las referencias más vendidas de Continental en Colombia, precios directos de distribuidor, garantía de fábrica completa y acceso prioritario a las novedades de la marca antes que cualquier otro punto de venta.</p>
      <h2>Las líneas disponibles</h2>
      <p>SportContact, CrossContact, EcoContact y PremiumContact estarán disponibles en todas nuestras tiendas y en la plataforma digital desde el 1 de septiembre de 2026.</p>
    `,
  },
  {
    slug:    "lanzamiento-merqueclub",
    section: "mundo",
    category: "Producto",
    title:   "Nace MerqueClub: beneficios reales para nuestros clientes frecuentes",
    excerpt: "Lanzamos nuestro programa de fidelización con descuentos exclusivos, instalación prioritaria y sorpresas en cada compra. Inscríbete gratis desde la app.",
    date:    "1 ago 2026",
    readTime: "2 min",
    color:   "#1a0005",
    body: `
      <p>Hoy lanzamos MerqueClub, el programa de beneficios diseñado para premiar a nuestros clientes más frecuentes con ventajas reales en cada compra.</p>
      <h2>Cómo funciona</h2>
      <p>Por cada compra acumulas MerquePuntos que puedes canjear por descuentos en tu siguiente compra, instalaciones gratuitas o productos de la tienda. El canje es inmediato desde la app.</p>
      <h2>Niveles del club</h2>
      <p><strong>Merquito Básico</strong> (0-5 compras): 5% de descuento permanente.<br/><strong>Merquito Pro</strong> (6-15 compras): 10% + instalación prioritaria.<br/><strong>Merquito Elite</strong> (16+ compras): 15% + asesoría personalizada + despacho gratis.</p>
      <h2>Cómo inscribirse</h2>
      <p>La inscripción es gratuita y automática en tu primera compra online o en cualquier punto físico Merquellantas. También puedes pre-registrarte en nuestra app antes del 31 de agosto y recibir 200 puntos de bienvenida.</p>
    `,
  },
  {
    slug:    "expocar-2026",
    section: "mundo",
    category: "Eventos",
    title:   "Merquellantas en ExpoCar 2026: lo que pasó en nuestro stand",
    excerpt: "Más de 3.000 personas visitaron nuestro espacio en el evento automotor más grande de Colombia. Acuerdos firmados, demos en vivo y mucho Merquito.",
    date:    "22 jul 2026",
    readTime: "3 min",
    color:   "#0a1500",
    body: `
      <p>ExpoCar 2026 fue el evento más grande en la historia de la feria automotriz colombiana, y Merquellantas estuvo presente con uno de los stands más visitados del pabellón de accesorios.</p>
      <h2>Lo que presentamos</h2>
      <p>Demostraciones en vivo de instalación de rines Alcoa, pruebas de adherencia con Continental SportContact en piso mojado (simulado), y la presentación oficial de MerqueClub ante el público por primera vez.</p>
      <h2>Los números del evento</h2>
      <p>3.284 visitantes en nuestro stand. 147 cotizaciones generadas. 38 instalaciones realizadas en vivo durante el evento. Y Merquito firmó más de 200 autógrafos en pegatinas de regalo.</p>
      <h2>Nos vemos el próximo año</h2>
      <p>Ya confirmamos nuestra participación en ExpoCar 2027 con un espacio el doble de grande y nuevas sorpresas que aún no podemos revelar.</p>
    `,
  },
  {
    slug:    "alianza-alcoa-colombia",
    section: "mundo",
    category: "Alianzas",
    title:   "Alcoa Wheels llega a Colombia de la mano de Merquellantas",
    excerpt: "Los rines de aluminio forjado más reconocidos en el mercado de flota pesada de Norteamérica ahora disponibles en Colombia. Exclusividad Merquellantas.",
    date:    "14 jul 2026",
    readTime: "2 min",
    color:   "#101010",
    body: `
      <p>Merquellantas firma acuerdo de distribución exclusiva con Alcoa Wheels para llevar sus rines de aluminio forjado al mercado colombiano, comenzando por el segmento de flota pesada.</p>
      <h2>Por qué Alcoa</h2>
      <p>Los rines Alcoa son el estándar de la industria del transporte en Norteamérica. Su tecnología Dura-Bright EVO elimina la necesidad de pulido manual, reduce peso hasta en 40 kg por vehículo y puede ahorrar hasta 5% en consumo de combustible.</p>
      <h2>Disponibilidad</h2>
      <p>Las referencias 22.5" para camiones y tractomulas ya están disponibles en stock en todas nuestras tiendas. Las referencias para vehículo de pasajeros (17", 18" y 20") estarán disponibles a partir del cuarto trimestre de 2026.</p>
    `,
  },
];

export const ALL_POSTS: BlogPost[] = [...TIPS, ...MUNDO];

export const TIPS_POSTS:  BlogPost[] = TIPS;
export const MUNDO_POSTS: BlogPost[] = MUNDO;

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug);
}
