import { FIGURE } from './figures';

export const content = `## Todo empezó con Devil May Cry

Hola a todos. Esta es la primera publicación de este blog recién creado. La idea es compartir aquí experiencias de mi día a día profesional, esas cosas que se me quedan en la cabeza pero que no le cuento a nadie. Este blog va a ser la forma en que esos pensamientos y reflexiones salgan al mundo.

Siempre fui fan de *Devil May Cry* y jugué los tres primeros juegos de la saga en la PlayStation 2 (lamentablemente no tuve la PlayStation 3 ni las consolas siguientes para jugar los demás). Para quien no la conozca, es una saga de juegos de Capcom conocida por su combate frenético, sus personajes memorables y una identidad visual muy particular. Cuando Netflix lanzó una adaptación animada, me interesó de inmediato, sobre todo porque ya había visto el anime de Madhouse de 2007.

Después de verla, la curiosidad me llevó a investigar quién estaba detrás de la producción. Así llegué a **Studio Mir**, un estudio de animación surcoreano responsable de trabajos como *The Legend of Korra*, *The Witcher: Nightmare of the Wolf* y *X-Men '97*.

Mi objetivo era simple: conocer mejor el estudio y descubrir qué otras animaciones de calidad habían hecho. Era muy posible que ya hubiera visto alguna sin saberlo, y eso fue lo que pasó: *The Legend of Korra* es suya. No estaba buscando problemas técnicos ni pensaba evaluar el sitio web. Solo quería conocer el trabajo de una empresa que había despertado mi admiración.

Pero, al entrar en el sitio, algo me llamó la atención y, por ser ingeniero de software, ya no pude concentrarme en lo demás. Algunas imágenes tardaban bastante en cargar, otras no parecían respetar sus proporciones y la presentación del portafolio, aunque visualmente interesante, me pareció limitada.

Mi primera reacción fue intentar entender qué estaba pasando. ¿Serían imágenes demasiado grandes? ¿Problemas de infraestructura? ¿Alguna decisión de implementación? Cuando entiendes del tema, te quedas cuestionando los detalles (¿un hábito bueno o malo?). Sin embargo, después de unos instantes, surgió una pregunta más interesante:

**¿Cuánto puede perjudicar una mala experiencia digital la forma en que percibimos a una empresa, incluso cuando su trabajo es excepcional?**

## La primera impresión también forma parte de la experiencia

Imagina descubrir un estudio de animación después de ver una producción que te gustó mucho. Buscas el nombre de la empresa, encuentras su sitio web y entras esperando conocer otros trabajos. Pero, antes de ver cualquier contenido, tienes que esperar, y seguir esperando. Algo así me pasó cuando visité el sitio de Studio Mir.

Antes de investigar a fondo, eché un vistazo rápido a los sitios de competidores de Studio Mir, como Madhouse y MAPPA. Son dos estudios de primer nivel, responsables de animes famosos como *Death Note*, *One Punch Man*, *Attack on Titan* y *Jujutsu Kaisen*. Los dos presentaban sus trabajos de forma coherente y organizada (aunque noté algunos problemas de rendimiento en el sitio de MAPPA), algo que no encontré en Studio Mir.

Para entender mejor lo que pasaba, hice una investigación con herramientas de auditoría y grabaciones automatizadas del navegador. En una de las grabaciones, hecha el 18 de octubre de 2026 desde Brasil, la página de inicio permaneció completamente en blanco durante unos **14,3 segundos en escritorio**. En una ejecución móvil, fueron **7,9 segundos**.

Estos números no representan necesariamente la experiencia de todos los visitantes. Fueron observaciones puntuales, con la caché vacía y sin limitación artificial de red, y otras condiciones de conexión, ubicación e infraestructura pueden dar resultados diferentes. Aun así, las grabaciones muestran una experiencia muy lejana a lo que se espera de un portafolio visual.

![Grabación de la carga de la página de inicio de Studio Mir en escritorio: la página permanece en blanco durante varios segundos antes de mostrar el contenido](${FIGURE.homeLoad})

*Grabación del 18/10/2026, realizada desde Brasil, a velocidad real. El GIF muestra un fragmento de la navegación original; el cronómetro indica el tiempo transcurrido desde el inicio del acceso.*

Hay una diferencia entre saber que una página es lenta y vivir esa lentitud. Para quien desarrolla software, unos segundos pueden ser solo una métrica más. Para quien navega, son segundos en los que no pasa nada: no aparece ningún trabajo ni se muestra ninguna información. Y el visitante no debería tener que entender los motivos técnicos para ver el contenido que vino a buscar.

## El peso de las imágenes

Quizá lo más curioso de la investigación sea que uno de los mayores problemas involucra justamente las imágenes. En un estudio de animación, el contenido visual es parte central de lo que ofrece la empresa: las imágenes presentan personajes, estilos y producciones, y es a través de ellas que el visitante reconoce la calidad del trabajo. Cuando esos archivos no se entregan de forma adecuada, acaban estorbando la experiencia que deberían enriquecer.

El ejemplo más claro fue una imagen JPEG de unos **12,6 MB**, de 7952 × 5304 píxeles, usada en un área de solo 566 × 283 píxeles. Son más de 42 millones de píxeles para llenar un espacio pequeño de la interfaz. También encontré miniaturas del portafolio con archivos de casi 4 MB cada una.

![Página de inicio de Studio Mir con el área de 566 × 283 píxeles resaltada, todavía parcialmente cargada, donde se muestra la imagen original de 7952 × 5304 píxeles y 12,6 MB](${FIGURE.oversizedImage})

*Ejemplo observado en la auditoría del 18/10/2026. La imagen original tenía 7952 × 5304 píxeles y aproximadamente 12,6 MB, aunque se mostraba en una región de 566 × 283 píxeles.*

En un portafolio artístico, preservar la fidelidad visual es importante, y nadie está pidiendo imágenes de baja calidad. Calidad y eficiencia pueden ir de la mano: las imágenes pueden redimensionarse, comprimirse y entregarse en formatos y resoluciones adecuados a cada dispositivo. El navegador no necesita descargar la misma imagen gigantesca para mostrarla en una pequeña área de la pantalla.

Una decisión aparentemente técnica, como la forma de entregar una imagen, puede afectar directamente el acceso de las personas al contenido de una empresa. Y cuando ese contenido es justamente lo que demuestra la calidad del negocio, el efecto es aún mayor.

## Un portafolio difícil de explorar y de compartir

Cuando el portafolio por fin aparece, es visualmente fuerte. Son producciones reconocidas y personajes conocidos que muestran la relevancia del estudio en la industria de la animación, y la cuadrícula transmite bien la variedad de sus trabajos.

![Cuadrícula del portafolio de Studio Mir con miniaturas de producciones como Devil May Cry, X-Men '97, The Witcher: Nightmare of the Wolf y Dota: Dragon's Blood](${FIGURE.portfolioGrid})

*El portafolio reúne producciones reconocidas internacionalmente en una cuadrícula visualmente atractiva.*

Pero un portafolio profesional también necesita ayudar a las personas a entender, descubrir y compartir el trabajo. En el sitio de MAPPA, por ejemplo, las producciones están organizadas por año, de la más reciente a la más antigua, y eso, junto con una buena presentación artística, me dio ganas de ir recorriendo año por año para conocerlo todo. No sentí eso en el portafolio de Studio Mir.

El portafolio tenía 25 elementos, y los títulos solo aparecían al pasar el cursor sobre las imágenes. En celulares, donde esa interacción no funciona igual, los títulos no estaban disponibles en la cuadrícula.

![Comparación lado a lado: en escritorio, el título del proyecto aparece sobre la miniatura al pasar el cursor; en móvil, la misma miniatura se muestra sin título](${FIGURE.titlesDesktopVsMobile})

*En escritorio, el título aparece al pasar el cursor sobre la imagen; en móvil, la misma miniatura se muestra sin título.*

Los proyectos tampoco tenían direcciones propias para compartir. Imagina encontrar una producción interesante y querer enviársela a un colega: en lugar de un enlace a ese proyecto, tienes que enviar el enlace del portafolio y esperar que la otra persona encuentre el mismo contenido. Parece un detalle, pero son interacciones así las que convierten un portafolio en una herramienta de comunicación.

Para una empresa creativa, presentar su trabajo es parte de demostrar lo que sabe hacer. Un posible cliente puede querer entender la experiencia del estudio con cierto tipo de producción, alguien interesado en trabajar allí puede querer conocer sus proyectos anteriores, y un fan puede simplemente querer descubrir otras animaciones del mismo equipo (mi caso). Son públicos con objetivos distintos, pero todos dependen de que el sitio comunique esa información con claridad.

## El costo que no aparece en Lighthouse

Como parte de la investigación, ejecuté 18 auditorías con Lighthouse, una herramienta que evalúa distintos aspectos de la calidad de las páginas web. Los resultados de rendimiento fueron estos:

| Página | Escritorio | Móvil |
|---|---:|---:|
| Página de inicio | 32/100 | 33/100 |
| Portafolio | 64/100 | 54/100 |
| Proyecto | 63/100 | 54/100 |

*Medianas de tres ejecuciones por entorno, realizadas el 18/10/2026. Las pruebas usaron las condiciones simuladas de Lighthouse. Hubo carga incompleta en 15 de las 18 ejecuciones; por lo tanto, estos resultados deben interpretarse con cautela y no representan datos de usuarios reales.*

Los números muestran que hay oportunidades técnicas de mejora, pero creo que la reflexión más importante no está en las notas. Lighthouse señala problemas de carga, pero no responde preguntas como:

- ¿Un visitante dejó de explorar el portafolio porque la experiencia le pareció lenta?
- ¿Un posible socio encontró fácilmente las producciones relevantes para su proyecto?
- ¿Un profesional interesado en el estudio logró comprender sus capacidades?
- ¿La presentación digital reforzó la calidad artística que se percibe en las animaciones?

Estas preguntas involucran comportamiento, expectativas, confianza y objetivos de negocio. Para responderlas con seguridad harían falta datos que no son públicos, como análisis del comportamiento de los visitantes, investigaciones con usuarios e información comercial, cosas que solo tiene el estudio. Por eso, no sería correcto afirmar que Studio Mir perdió clientes o contratos por culpa de su sitio web.

Lo que sí se puede hacer es identificar posibles puntos de fricción y pensar en cómo interfieren en la forma en que el estudio comunica su valor. Una experiencia digital merece atención incluso sin una pérdida económica comprobada, porque es una oportunidad de fortalecer la marca, facilitar el descubrimiento de los trabajos y respetar el tiempo de quien visita.

## Mejorar sin rehacerlo todo

Ante problemas así, sería tentador proponer reconstruir el sitio desde cero, con una interfaz moderna, nuevas animaciones, otra arquitectura y tecnologías más recientes. Pero ¿eso resolvería el problema principal?

La investigación sugiere que buena parte de las dificultades podría resolverse sin tocar la identidad visual del sitio. La carga de las imágenes mejoraría con formatos más eficientes, varias resoluciones y carga bajo demanda. La entrega de los recursos se beneficiaría de una mejor configuración de caché y de conexiones. Y la navegación podría tener títulos más accesibles y un enlace propio para cada proyecto.

Son mejoras que parten de problemas concretos, y no de las ganas de usar tecnologías más nuevas. Una decisión de ingeniería debería evaluarse por el problema que resuelve y por el valor que entrega, además de por la elegancia de su implementación. No siempre el mejor camino es reconstruirlo todo; a veces, es lograr que lo que ya existe funcione mejor para las personas.

## Más allá del código

Esta experiencia me hizo pensar en un cambio de perspectiva importante en mi trayectoria como ingeniero de software. A lo largo de la carrera, es natural dedicar mucho tiempo a lenguajes, frameworks, arquitecturas y buenas prácticas, y ese conocimiento es fundamental. Pero desarrollar software también exige entender por qué estamos construyendo una solución, quién se beneficiará de ella y qué resultados esperamos.

Esto tiene mucho que ver con mis últimos dos años de carrera, cuando dejé de prestar tanta atención a frameworks y tecnologías y empecé a fijarme más en cómo optimizar la experiencia de los productos en los que trabajo.

En el caso de Studio Mir, mi curiosidad empezó con algunas imágenes que tardaban en cargar, y la investigación reveló problemas de rendimiento, de presentación visual y de organización del portafolio. Pero la reflexión que me quedó fue otra. El trabajo de este estudio impresiona a personas de todo el mundo, y su sitio web es una oportunidad de acercar aún más a la gente a ese trabajo. Para eso, la experiencia digital tiene que tratarse como parte de la comunicación de la empresa, y no solo como una preocupación de quien escribe el código.

## Consideraciones finales

Cuando entré en el sitio de Studio Mir, no esperaba encontrar un tema sobre el cual escribir. Solo quería hojear las otras animaciones del estudio. Terminé encontrando una oportunidad de reflexionar sobre algo cada vez más relevante para mí en el desarrollo de software: la relación entre las decisiones técnicas, la experiencia de las personas y el valor de negocio.

El trabajo de Studio Mir sigue siendo admirable, a pesar de las limitaciones de su sitio, y quizá sea justamente por admirar ese trabajo que la experiencia me llamó tanto la atención. Al final, la pregunta que me quedó es cómo garantizar que la tecnología ayude a una empresa a comunicar la calidad que ya tiene. Hacer la página más rápida es solo una parte de eso.

A veces, la mejor contribución de la ingeniería de software es quitar de en medio lo que separa a las personas de aquello que vinieron a encontrar.

---

### Sobre la investigación

Hice este análisis el 18 de octubre de 2026, en páginas públicas de Studio Mir, con herramientas de automatización del navegador, grabación de pantalla y Lighthouse. Fueron 18 auditorías sintéticas, además de capturas de navegación, inventario de recursos y análisis de la estructura del portafolio.

Las observaciones reflejan las condiciones y el periodo de las pruebas. No obtuve datos de usuarios reales (CrUX) ni saqué ninguna conclusión sobre pérdidas económicas o comerciales.

*Studio Mir, Devil May Cry y los demás nombres y obras mencionados pertenecen a sus respectivos titulares. Este artículo es un análisis independiente y no tiene ningún vínculo con el estudio.*

## Referencias

- [Studio Mir](https://www.studiomir.co.kr/en/): sitio web oficial del estudio, analizado en esta investigación (en inglés).
- [Introducción a Lighthouse](https://developer.chrome.com/docs/lighthouse/overview?hl=es-419): qué mide la herramienta y cómo ejecutarla.
- [Puntuación de rendimiento de Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring?hl=es-419): cómo se calculan las puntuaciones de 0 a 100 de la tabla anterior.
- [Usa el tamaño adecuado para las imágenes](https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images?hl=es-419): la auditoría que señala imágenes más grandes que el área en la que se muestran.
- [Entrega imágenes en formatos modernos](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images?hl=es-419): WebP y AVIF como alternativas más ligeras al JPEG.
- [Carga diferida de imágenes a nivel del navegador para la Web](https://web.dev/articles/browser-level-image-lazy-loading?hl=es-419): cargar imágenes bajo demanda con el atributo \`loading\`.
- [Por qué los datos de lab y de campo pueden ser diferentes](https://web.dev/articles/lab-and-field-data-differences?hl=es-419): por qué las auditorías sintéticas no sustituyen los datos de usuarios reales.
- [Descripción general de CrUX](https://developer.chrome.com/docs/crux?hl=es-419): el Chrome UX Report, la fuente pública de datos de campo citada en la nota metodológica.
`;
