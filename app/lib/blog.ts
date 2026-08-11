export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  color: string;
  body: string; // HTML string for the post body
}

export const ALL_POSTS: BlogPost[] = [
  {
    slug:     "como-saber-cuando-cambiar-llantas",
    category: "Mantenimiento",
    title:    "Como saber cuando es hora de cambiar tus llantas",
    excerpt:  "La profundidad del dibujo, las grietas en los flancos y la vibración al frenar son señales que no debes ignorar. Aprende a leerlas antes de que sea demasiado tarde.",
    date:     "18 jul 2026",
    readTime: "4 min",
    color:    "#1a1a1a",
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
      <h2>Cada cuanto cambiarlas por tiempo</h2>
      <p>Aunque tengan buen dibujo, las llantas con más de 6 años deben revisarse por un experto. El caucho envejece internamente aunque no lo veas. A los 10 años, cambio obligatorio sin excepción.</p>
    `,
  },
  {
    slug:     "diferencia-aceite-sintetico-vs-mineral",
    category: "Lubricantes",
    title:    "Sintético vs. mineral: cual aceite le conviene a tu motor",
    excerpt:  "No todos los motores necesitan el mismo aceite. Te explicamos las diferencias reales entre aceite sintético, semi-sintético y mineral para que no gastes de mas.",
    date:     "10 jul 2026",
    readTime: "5 min",
    color:    "#0d1a2d",
    body: `
      <p>El aceite de motor es la sangre de tu vehículo. Elegir mal puede costarle la vida a tu motor. Aquí te explicamos cada tipo sin tecnicismos innecesarios.</p>
      <h2>Aceite mineral</h2>
      <p>Se deriva directamente del petróleo con refinación básica. Es el más económico, pero también el que menos protege bajo condiciones extremas de temperatura. Recomendado para vehículos antiguos con motores de diseño simple que no exigen especificaciones modernas.</p>
      <h2>Aceite semi-sintético</h2>
      <p>Mezcla de base mineral con aditivos sintéticos. Ofrece mejor protección que el mineral a un precio moderado. Ideal para vehículos con uso urbano intensivo o motores de mediana cilindrada.</p>
      <h2>Aceite 100% sintético</h2>
      <p>Fabricado en laboratorio con moléculas diseñadas para proteger en condiciones extremas. Menor fricción, mayor limpieza del motor, mejor rendimiento en frío y en calor. Es el estándar para vehículos modernos, turboalimentados o de alto rendimiento.</p>
      <h2>Como elegir</h2>
      <p>Revisa el manual de tu vehículo. Ahí encontrarás la viscosidad recomendada (por ejemplo, 5W-30) y la norma API exigida (SN, SP, etc.). Si tu vehículo tiene más de 150.000 km, considera un aceite formulado para motores con alto kilometraje.</p>
    `,
  },
  {
    slug:     "guia-llantas-suv-colombia",
    category: "Guia de compra",
    title:    "Guia definitiva para elegir llantas de SUV en Colombia",
    excerpt:  "Vias destapadas, lluvia intensa y peajes de montaña: las condiciones colombianas exigen llantas distintas. Esta es la guia que necesitabas antes de comprar.",
    date:     "2 jul 2026",
    readTime: "7 min",
    color:    "#1a0d00",
    body: `
      <p>Colombia no es un país de un solo terreno. Bogotá, Medellín, la costa, los llanos y las vías intermunicipales le exigen cosas distintas a tus llantas. Esta guia te ayuda a elegir bien.</p>
      <h2>Uso 100% urbano</h2>
      <p>Si tu SUV nunca sale de la ciudad, una llanta de tipo Touring o Highway Terrain (HT) es suficiente. Son más silenciosas, más cómodas y duran más en asfalto que las todo-terreno.</p>
      <h2>Uso mixto: ciudad y carretera</h2>
      <p>El 80% de los dueños de SUV en Colombia cae en esta categoría. Una llanta All-Terrain (AT) de buena calidad (Bridgestone Dueler, Goodyear Wrangler) ofrece el equilibrio perfecto: agarre en mojado, confort en autopista y tracción decente en caminos sin pavimentar.</p>
      <h2>Uso off-road intensivo</h2>
      <p>Si recorres trochas, fincas y vías destapadas con frecuencia, necesitas una Mud-Terrain (MT). Son agresivas, ruidosas en asfalto, pero imbatibles en barro y piedra.</p>
      <h2>Factores clave al comprar</h2>
      <ul>
        <li>Medida correcta: nunca compres una llanta de medida diferente a la del fabricante sin consultar a un experto</li>
        <li>Índice de carga: debe ser igual o mayor al del manual del vehículo</li>
        <li>Marca: Michelin, Continental, Bridgestone y Pirelli tienen redes de servicio en toda Colombia</li>
        <li>Presupuesto: no compres las cuatro más baratas. Mejor dos buenas delante y dos económicas atrás</li>
      </ul>
    `,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug);
}
