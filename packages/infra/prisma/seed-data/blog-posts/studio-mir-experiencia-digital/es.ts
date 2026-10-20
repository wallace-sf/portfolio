import { FIGURE } from './figures';

export const content = `## Todo empezó con Devil May Cry

Siempre he sido fan de *Devil May Cry*.

Para quien no la conozca, es una franquicia de videojuegos de Capcom conocida por su combate frenético, sus personajes memorables y una identidad visual muy particular. Cuando Netflix lanzó una adaptación animada, naturalmente me interesó.

Después de verla, la curiosidad me llevó a investigar quién estaba detrás de la producción.

Así llegué a **Studio Mir**, un estudio de animación surcoreano responsable de trabajos como *The Legend of Korra*, *The Witcher: Nightmare of the Wolf* y *X-Men '97*.

Mi objetivo era sencillo: conocer mejor el estudio, descubrir otras producciones y explorar su portafolio.

No estaba buscando problemas técnicos. Tampoco pretendía evaluar el sitio web.

Solo quería conocer el trabajo de una empresa que se había ganado mi admiración.

Pero, al entrar en el sitio, algo me llamó la atención.

Algunas imágenes tardaban bastante en cargar. Otras no parecían respetar adecuadamente sus proporciones. La presentación del portafolio, aunque visualmente interesante, también me pareció limitada.

Como desarrollador de software, mi primera reacción fue intentar entender qué estaba pasando.

¿Serían imágenes demasiado grandes? ¿Problemas de infraestructura? ¿Alguna decisión de implementación?

Sin embargo, tras unos instantes, empezó a surgir una pregunta más interesante.

**¿Cuánto puede perjudicar una mala experiencia digital la forma en que percibimos a una empresa, incluso cuando su trabajo es excepcional?**

## La primera impresión también forma parte de la experiencia

Imagina descubrir un estudio de animación después de ver una producción que te gustó mucho.

Buscas el nombre de la empresa, encuentras su sitio web y abres la página esperando conocer otros trabajos.

Pero, antes de encontrar cualquier contenido, tienes que esperar.

Y seguir esperando.

Algo parecido me pasó cuando visité el sitio de Studio Mir.

Para entender mejor el comportamiento, decidí hacer una investigación con herramientas de auditoría y grabaciones automatizadas del navegador.

En una de las grabaciones, realizada el 18 de octubre de 2026 desde Brasil, la página de inicio se quedó completamente en blanco durante aproximadamente **14,3 segundos en escritorio**. En una ejecución móvil, fueron **7,9 segundos**.

Estas cifras no representan necesariamente la experiencia de todos los visitantes. Fueron observaciones puntuales, con caché vacía y sin limitación artificial de red. Otras condiciones de conexión, ubicación e infraestructura pueden producir resultados diferentes.

Aun así, las grabaciones documentan una experiencia bastante alejada de lo que se espera al visitar un portafolio visual.

![Grabación de la carga de la página de inicio de Studio Mir en escritorio: la página permanece en blanco durante varios segundos antes de mostrar contenido](${FIGURE.homeLoad})

*Grabación del 18/10/2026, realizada desde Brasil, a velocidad real. El GIF muestra un fragmento de la navegación original; el cronómetro indica el tiempo transcurrido desde el inicio del acceso.*

Hay una diferencia entre saber que una página es lenta y vivir esa lentitud.

Para quien desarrolla software, unos segundos pueden parecer solo una métrica más.

Para quien navega, son segundos en los que no pasa nada.

No aparece ningún trabajo. No se presenta ninguna información. No se cumple ninguna expectativa.

Y el visitante no debería necesitar entender los motivos técnicos para poder explorar el contenido que buscaba.

## La paradoja de las imágenes

Quizá el aspecto más curioso de esta investigación es que uno de los mayores problemas encontrados tiene que ver precisamente con las imágenes.

En un estudio de animación, el contenido visual no es solo un elemento decorativo. Es una parte esencial de lo que la empresa ofrece.

Las imágenes presentan personajes, estilos artísticos, producciones y capacidades creativas. Son ellas las que permiten al visitante reconocer la calidad del trabajo.

Pero, cuando estos recursos no se entregan adecuadamente, pueden acabar perjudicando la misma experiencia que deberían enriquecer.

Durante la auditoría, encontramos un ejemplo significativo.

Una imagen JPEG de aproximadamente **12,6 MB**, con una resolución de 7952 × 5304 píxeles, se usaba en un área visual de apenas 566 × 283 píxeles.

Para ponerlo en perspectiva, hablamos de una imagen con más de 42 millones de píxeles ocupando un espacio relativamente pequeño de la interfaz.

También encontramos miniaturas del portafolio con archivos cercanos a 4 MB cada una.

No se trata de defender imágenes de baja calidad. Especialmente en un portafolio artístico, preservar la fidelidad visual es importante.

La cuestión es que calidad y eficiencia no tienen por qué ser objetivos opuestos.

Las imágenes pueden redimensionarse, comprimirse y entregarse en formatos adecuados, teniendo en cuenta distintos dispositivos y resoluciones.

El navegador no necesita descargar la misma imagen gigantesca para mostrarla en una pequeña zona de la pantalla.

![Página de inicio de Studio Mir con el área de 566 × 283 píxeles resaltada, todavía cargándose parcialmente, donde se muestra la imagen original de 7952 × 5304 píxeles y 12,6 MB](${FIGURE.oversizedImage})

*Ejemplo observado en la auditoría del 18/10/2026. La imagen original tenía 7952 × 5304 píxeles y aproximadamente 12,6 MB, aunque se mostraba en una región de 566 × 283 píxeles.*

Este problema ilustra algo mayor.

Una decisión aparentemente técnica, como la forma de entregar una imagen, puede influir directamente en el acceso de las personas al contenido de una empresa.

Y, cuando ese contenido es precisamente lo que demuestra la calidad del negocio, esa relación se vuelve todavía más relevante.

## Un portafolio no es solo una galería

Hay otro aspecto que considero importante.

Cuando por fin conseguimos ver los trabajos de Studio Mir, encontramos un portafolio visualmente sólido.

Son producciones reconocidas, personajes familiares y proyectos que ayudan a demostrar la relevancia del estudio en la industria de la animación.

La organización en cuadrícula funciona bien visualmente, y las imágenes consiguen transmitir la diversidad de los trabajos.

Pero un portafolio profesional tiene que hacer más que mostrar imágenes bonitas.

También tiene que ayudar a las personas a entender, descubrir y compartir el trabajo.

Durante el análisis, encontramos 25 elementos en el portafolio. Los títulos aparecían al pasar el cursor del ratón sobre las imágenes.

En dispositivos móviles, donde esa interacción no existe de la misma manera, los títulos no estaban disponibles en la cuadrícula.

También observamos que los proyectos no tenían direcciones individuales que se pudieran compartir directamente.

Imagina encontrar una producción interesante y querer enviársela a un colega.

En lugar de compartir un enlace específico de ese proyecto, tienes que dirigir a la persona al portafolio y esperar que encuentre el mismo contenido.

Puede parecer un detalle menor.

Pero es justamente a través de estas interacciones que un portafolio deja de ser solo una colección de trabajos y pasa a funcionar como una herramienta de comunicación.

![Cuadrícula del portafolio de Studio Mir con miniaturas de producciones como Devil May Cry, X-Men '97, The Witcher: Nightmare of the Wolf y Dota: Dragon's Blood](${FIGURE.portfolioGrid})

*El portafolio reúne producciones reconocidas internacionalmente y presenta una organización visual atractiva.*

![Comparación lado a lado: en escritorio, el título del proyecto aparece sobre la miniatura al pasar el cursor; en móvil, la misma miniatura se muestra sin título](${FIGURE.titlesDesktopVsMobile})

*En la versión de escritorio, los títulos aparecen al pasar el cursor sobre las imágenes. La navegación móvil presenta limitaciones en ese descubrimiento.*

Para una empresa creativa, presentar su trabajo es parte del proceso de demostrar sus capacidades.

Un posible cliente puede querer entender la experiencia del estudio con cierto tipo de producción.

Un profesional interesado en trabajar en la empresa puede querer conocer sus proyectos anteriores.

Un fan puede simplemente querer descubrir otras animaciones hechas por el mismo equipo.

Son públicos distintos, con objetivos distintos, pero todos dependen de la capacidad del sitio web para comunicar información con claridad.

## El costo que no aparece en Lighthouse

Como parte de la investigación, realizamos 18 auditorías con Lighthouse, una herramienta que evalúa distintos aspectos de la calidad de las páginas web.

Los resultados de rendimiento fueron los siguientes:

| Página | Escritorio | Móvil |
|---|---:|---:|
| Página de inicio | 32/100 | 33/100 |
| Portafolio | 64/100 | 54/100 |
| Proyecto | 63/100 | 54/100 |

*Medianas de tres ejecuciones por entorno, realizadas el 18/10/2026. Las pruebas usaron las condiciones simuladas de Lighthouse. Hubo carga incompleta en 15 de las 18 ejecuciones; por lo tanto, estos resultados deben interpretarse con cautela y no representan datos de usuarios reales.*

Las cifras ayudan a entender que existen oportunidades técnicas de mejora.

Pero creo que la reflexión más importante no está en las puntuaciones.

Lighthouse puede señalar problemas de carga, pero no puede responder directamente preguntas como:

- ¿Un visitante dejó de explorar el portafolio porque la experiencia le pareció lenta?
- ¿Un posible socio encontró fácilmente las producciones relevantes para su proyecto?
- ¿Un profesional interesado en el estudio pudo entender sus capacidades?
- ¿La presentación digital reforzó la calidad artística percibida en las animaciones?

Estas preguntas involucran comportamiento, expectativas, confianza y objetivos de negocio.

Para responderlas de forma concluyente, necesitaríamos datos que no están disponibles públicamente, como análisis del comportamiento de los visitantes, investigaciones con usuarios e información comercial de la empresa.

Por lo tanto, no sería correcto afirmar que Studio Mir perdió clientes o contratos por culpa de su sitio web.

Pero sí podemos identificar posibles puntos de fricción y reflexionar sobre cómo interfieren en la comunicación de valor.

**Una experiencia digital no necesita ser la causa de una pérdida económica comprobada para merecer atención.**

También puede representar una oportunidad para fortalecer la presentación de una marca, facilitar el descubrimiento de sus productos y respetar el tiempo de sus visitantes.

## La solución no tiene por qué empezar con un rediseño

Ante problemas como estos, sería tentador proponer una reconstrucción completa del sitio web.

Una interfaz moderna, nuevas animaciones, otra arquitectura, tecnologías más recientes.

Pero ¿eso resolvería el problema principal?

La investigación sugiere que una parte importante de las dificultades encontradas podría abordarse sin necesidad de modificar la identidad visual del sitio.

La carga de las imágenes podría mejorar mediante formatos más eficientes, distintas resoluciones y estrategias adecuadas de carga diferida.

La entrega de recursos podría beneficiarse de una mejor configuración de caché y conexiones.

La navegación podría ofrecer títulos más accesibles y enlaces específicos para los proyectos.

Son mejoras que parten de problemas concretos, no simplemente del deseo de usar tecnologías más nuevas.

Y esa distinción importa.

Una decisión de ingeniería no debería evaluarse solo por la elegancia de su implementación, sino también por el problema que resuelve y el valor que entrega.

El mejor camino no siempre es reconstruirlo todo.

A veces, es hacer que lo que ya existe funcione mejor para las personas.

## Más allá del código

Esta experiencia me hizo pensar en un cambio de perspectiva que considero importante en mi trayectoria como ingeniero de software.

A lo largo de la carrera, es natural dedicar mucho tiempo a aprender lenguajes, frameworks, arquitecturas y buenas prácticas.

Son conocimientos fundamentales.

Pero hay una dimensión del desarrollo de software que va más allá de la implementación.

Necesitamos entender por qué estamos construyendo determinada solución, a quién beneficiará y qué resultados esperamos producir.

En el caso de Studio Mir, mi curiosidad empezó con algunas imágenes que tardaban en cargar.

La investigación reveló cuestiones de rendimiento, presentación visual y organización del portafolio.

Pero la reflexión que permaneció fue otra.

Hablamos de un estudio cuyo trabajo es capaz de impresionar a personas de todo el mundo. Sus producciones demuestran creatividad, talento y capacidad técnica.

Su sitio web es una oportunidad para acercar todavía más a las personas a ese trabajo.

Y, para ello, la experiencia digital tiene que tratarse como parte de la comunicación de la empresa, no solo como una preocupación de quien escribe el código.

## Consideraciones finales

Cuando entré en el sitio de Studio Mir, no esperaba encontrar un tema sobre el que escribir.

Solo quería saber más sobre los artistas y profesionales responsables de una animación basada en uno de mis videojuegos favoritos.

Acabé encontrando una oportunidad para reflexionar sobre algo que considero cada vez más relevante en el desarrollo de software: la relación entre las decisiones técnicas, la experiencia humana y el valor de negocio.

El trabajo de Studio Mir sigue siendo admirable, independientemente de las limitaciones encontradas en su sitio web.

Y quizá sea justamente por admirar ese trabajo que la experiencia me llamó tanto la atención.

Al final, la pregunta que quedó no es solo cómo hacer una página más rápida.

Es cómo garantizar que la tecnología ayude a una empresa a comunicar la calidad que ya tiene.

**Porque, a veces, la mejor contribución de la ingeniería de software no es crear algo nuevo, sino eliminar los obstáculos entre las personas y aquello que vinieron a encontrar.**

---

### Sobre la investigación

Este análisis se realizó con herramientas de automatización del navegador, grabación de pantalla y Lighthouse, utilizando páginas públicas de Studio Mir el 18 de octubre de 2026.

Se realizaron 18 auditorías sintéticas, además de capturas de navegación, un inventario de recursos y un análisis de la estructura del portafolio.

Las observaciones reflejan las condiciones y el periodo de las pruebas. No se obtuvieron datos de usuarios reales (CrUX), y no se estableció ninguna conclusión sobre pérdidas económicas o comerciales.

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
