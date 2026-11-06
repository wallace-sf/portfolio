import { PROPOSAL } from './figures';

const P = PROPOSAL['pt-BR'];

export const content = `Quando aceitei meu primeiro freelance, eu tinha cerca de um ano e meio de experiência profissional como desenvolvedor de software. Já tinha construído pequenas aplicações full stack para aprender, mas sentia falta de uma experiência na minha trajetória: entregar um produto completo para um cliente real. Queria entender o problema de negócio, negociar direto com o contratante, tomar as decisões técnicas e assumir a responsabilidade pela entrega. Em outras palavras, queria experimentar o que era ser meu próprio chefe.

A oportunidade surgiu em 2021, por indicação de um antigo colega de trabalho: um profissional precisava de uma plataforma digital para apoiar suas atividades comerciais. Eu sabia que seria desafiador e estava disposto a assumir os riscos para ganhar experiência. O que ainda não sabia era que desenvolver a aplicação seria só uma parte do trabalho.

## A primeira armadilha: negociar pensando apenas na experiência

Minha motivação principal não era financeira. Eu já estava empregado e via o freelance como uma oportunidade de desenvolver novas competências, por isso aceitei uma remuneração modesta para o escopo e as responsabilidades envolvidas, esperando concluir o projeto em até seis meses. Não acho que aceitar um valor menor para ganhar experiência tenha sido, por si só, um erro. O problema foi a forma como conduzi a negociação.

Minha proposta comercial era bem simples: uma descrição genérica do produto, um valor fechado, uma estimativa de horas e uma previsão de entrega. Ela não detalhava os requisitos, as responsabilidades de cada parte nem os critérios de aceitação, e também não previa nenhum procedimento para alterações de escopo. Para completar, a maior parte do pagamento dependia da entrega final. Na prática, assumi boa parte dos riscos de um projeto cujas necessidades ainda não estavam totalmente claras.

Hoje entendo que é na proposta comercial que se combinam as expectativas e as condições que permitem às duas partes trabalhar com previsibilidade. O preço é só uma parte dela.

## Quando o projeto começou a tomar forma

Comecei o desenvolvimento pela interface, construindo os principais fluxos com dados simulados. Achava que seria mais fácil começar pelo front-end, porque era onde eu tinha mais experiência, e queria validar o funcionamento da solução antes de partir para as integrações e os detalhes visuais. Só que algumas regras de negócio dependiam de informações que o cliente ainda ia me passar. Conforme o projeto avançava, percebi que entender a ideia geral de um produto é diferente de ter requisitos definidos o bastante para implementá-lo.

**Além de entender o que o cliente quer construir, é preciso definir como a solução vai funcionar e quais decisões ainda faltam tomar.**

## Quando o cronograma deixou de representar a realidade

Ao longo do projeto, minha vida profissional e pessoal mudou bastante. Mudei de cidade, comecei uma pós-graduação e passei a dividir o tempo entre novos compromissos e o desenvolvimento. O contratante também tinha pouca disponibilidade. Com isso, o trabalho perdeu ritmo, e o projeto começou a se estender muito além do planejado. Reconheço que deveria ter tratado essas mudanças de forma mais organizada, reavaliando o planejamento, registrando o estado do projeto e renegociando as expectativas.

**Quando as circunstâncias que sustentam um cronograma mudam, o planejamento também precisa ser revisado.**

## Quando as mudanças de escopo se tornaram um problema

Um dos maiores desafios veio das mudanças sucessivas nas necessidades do projeto. Funcionalidades já construídas precisaram ser modificadas ou refeitas para atender a novas regras de negócio, e a complexidade passou a crescer mais rápido do que eu conseguia administrar. Houve momentos de bastante frustração: eu investia tempo em uma funcionalidade e depois precisava rever decisões que achava já estarem fechadas.

Em certo momento, a própria arquitetura virou parte do problema. Precisei reorganizar o código e adotar uma abordagem mais simples, com responsabilidades mais bem separadas, para conseguir avançar. Uma arquitetura bem estruturada facilita mudanças, mas não elimina o custo de requisitos instáveis.

**Mudanças de escopo fazem parte de muitos projetos. O que precisa ficar combinado é como cada uma será avaliada, negociada e incorporada ao projeto.**

## A entrega não é necessariamente o fim

Finalmente, em agosto de 2024, concluí a entrega da aplicação. Depois disso, fiz algumas melhorias solicitadas e ofereci um período de suporte para corrigir problemas funcionais.

A experiência também me fez pensar na diferença entre entregar uma aplicação que funciona e dar condições para que ela seja operada com autonomia. Algumas operações ainda dependiam de procedimentos técnicos, porque funcionalidades extras de administração não faziam parte da solução combinada.

Em maio de 2026, fiz o handoff final, organizando a documentação e as informações necessárias para que outra pessoa desse continuidade técnica ao projeto, e assim encerrei formalmente minha participação. Essa última etapa reforçou a importância de definir limites claros para a manutenção, o suporte e a evolução do software.

## O que faria diferente hoje?

Depois dessa experiência, passei a ver a proposta comercial como muito mais do que um orçamento. Se eu fosse começar um freelance hoje, daria atenção especial a seis pontos:

1. **Entender o problema antes de precificar a solução.** Tentaria compreender os processos, os objetivos e as principais restrições do negócio.

2. **Definir o que está dentro e fora do escopo.** Documentaria as funcionalidades previstas, as exclusões e os critérios de aceitação.

3. **Distribuir responsabilidades.** Deixaria definido quais informações, acessos, materiais e aprovações dependeriam do cliente e quais seriam as minhas obrigações.

4. **Estabelecer marcos de entrega e pagamento.** Evitaria concentrar a maior parte da remuneração na conclusão do projeto.

5. **Definir um processo para mudanças.** Avaliaria o impacto em prazo e custo antes de incorporar novos requisitos.

6. **Separar entrega, garantia, suporte e manutenção.** Deixaria claro o que está incluído na contratação e o que exige um novo acordo.

Essas práticas não eliminam os riscos, mas deixam as expectativas mais claras e a relação comercial mais equilibrada.

## Como minha proposta comercial evoluiu

Recentemente, transformei parte desses aprendizados em um modelo de proposta comercial para o desenvolvimento de um MVP. É um material didático e fictício: o cliente, os valores e os prazos são inventados, e o documento vem comentado, com notas que explicam por que cada cláusula existe e uma página final com um checklist para adaptá-lo ao seu projeto. Ele trata de escopo, exclusões, responsabilidades, marcos e critérios de aceite, pagamento, mudanças de escopo, garantia, suporte e handoff.

![As oito páginas do modelo de proposta comercial: capa, escopo, exclusões e responsabilidades, plano e critérios de aceite, investimento e mudanças, dados e suporte, encerramento e assinaturas, e o guia de adaptação](${P.preview})

*As oito páginas do modelo. As notas educativas comentam as cláusulas, e a última página traz o checklist de adaptação e os riscos que o modelo procura evitar.*

- [Abrir o modelo em PDF (8 páginas)](${P.pdf})
- [Baixar a versão editável (DOCX)](${P.docx})

Use o modelo como ponto de partida para montar a sua proposta, e não como um contrato pronto. Cada projeto tem suas particularidades e pode exigir acordos técnicos, comerciais e jurídicos diferentes, e o próprio documento recomenda uma revisão jurídica quando houver compromissos relevantes ou dados sensíveis.

## O primeiro freelance exige concessões, mas elas precisam ter limites

Se você está pensando em aceitar seu primeiro freelance, talvez precise fazer concessões, como oferecer um preço mais competitivo, escolher um projeto menor ou dedicar mais tempo à descoberta de requisitos. Essas decisões podem fazer sentido quando fazem parte de uma estratégia consciente de aprendizado e de posicionamento profissional. Só que fazer concessões não significa aceitar responsabilidades ilimitadas.

**Um preço menor não exige um escopo indefinido, e a vontade de ganhar experiência não dispensa a negociação de condições justas.**

Proteger seus interesses também não é agir contra o cliente. Uma negociação bem estruturada beneficia quem contrata, porque reduz ambiguidades e facilita o acompanhamento do projeto.

## Considerações finais

Meu primeiro freelance não foi uma experiência comercial especialmente bem-sucedida. O retorno financeiro foi modesto para o esforço e a responsabilidade que assumi, o projeto se estendeu muito além do previsto e cometi erros que hoje consigo enxergar com mais clareza. Ainda assim, enfrentei problemas que vão além de implementar funcionalidades, como negociação, planejamento, comunicação, mudanças de requisitos, decisões de arquitetura e transferência de responsabilidades. E aprendi que dominar uma tecnologia não significa estar preparado para conduzir um projeto de software.

Se pudesse deixar uma recomendação para quem está começando, seria esta:

**Não tenha medo de fazer concessões para ganhar experiência. Mas procure entender exatamente o que está concedendo, quais riscos está assumindo e onde estão os seus limites.**

Aprender a negociar também faz parte de se tornar um engenheiro de software mais completo.
`;
