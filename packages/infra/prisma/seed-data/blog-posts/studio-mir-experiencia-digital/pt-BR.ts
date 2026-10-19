import { FIGURE } from './figures';

export const content = `## Tudo começou com Devil May Cry

Sempre fui fã de *Devil May Cry*.

Para quem não conhece, é uma franquia de jogos da Capcom conhecida por seu combate frenético, personagens marcantes e uma identidade visual bastante particular. Quando a Netflix lançou uma adaptação animada, naturalmente fiquei interessado.

Depois de assistir à animação, a curiosidade me levou a pesquisar mais sobre quem estava por trás da produção.

Foi assim que cheguei ao **Studio Mir**, um estúdio sul-coreano de animação responsável por trabalhos como *The Legend of Korra*, *The Witcher: Nightmare of the Wolf* e *X-Men '97*.

Meu objetivo era simples: conhecer melhor o estúdio, descobrir outras produções e explorar seu portfólio.

Não estava procurando problemas técnicos. Tampouco pretendia avaliar o website.

Só queria conhecer o trabalho de uma empresa que havia despertado minha admiração.

Mas, ao acessar o site, algo me chamou a atenção.

Algumas imagens demoravam bastante para carregar. Outras pareciam não respeitar adequadamente suas proporções. A apresentação do portfólio, embora visualmente interessante, também me pareceu limitada.

Como desenvolvedor de software, minha reação inicial foi tentar entender o que estava acontecendo.

Seriam imagens grandes demais? Problemas de infraestrutura? Alguma decisão de implementação?

Entretanto, depois de alguns instantes, uma pergunta mais interessante começou a surgir.

**Quanto uma experiência digital ruim pode prejudicar a forma como percebemos uma empresa, mesmo quando seu trabalho é excepcional?**

## A primeira impressão também faz parte da experiência

Imagine descobrir um estúdio de animação depois de assistir a uma produção de que você gostou muito.

Você procura o nome da empresa, encontra seu website e acessa a página esperando conhecer outros trabalhos.

Mas, antes de encontrar qualquer conteúdo, precisa esperar.

E continuar esperando.

Foi algo semelhante ao que aconteceu quando visitei o site do Studio Mir.

Para entender melhor o comportamento, resolvi realizar uma investigação utilizando ferramentas de auditoria e gravações automatizadas do navegador.

Em uma das gravações realizadas em 18 de outubro de 2026, a partir do Brasil, a homepage permaneceu completamente branca por aproximadamente **14,3 segundos no desktop**. Em uma execução mobile, foram **7,9 segundos**.

Esses números não representam necessariamente a experiência de todos os visitantes. Foram observações pontuais, com cache vazio e sem limitação artificial de rede. Condições de conexão, localização e infraestrutura podem produzir resultados diferentes.

Ainda assim, as gravações documentam uma experiência bastante distante daquela que se espera ao acessar um portfólio visual.

![Gravação do carregamento da homepage do Studio Mir no desktop: a página permanece branca por vários segundos antes de exibir o conteúdo](${FIGURE.homeLoad})

*Gravação de 18/10/2026, realizada a partir do Brasil, em velocidade real. O GIF mostra um trecho da navegação original; o cronômetro indica o tempo decorrido desde o início do acesso.*

Existe uma diferença entre saber que uma página é lenta e experimentar essa lentidão.

Para quem desenvolve software, alguns segundos podem parecer apenas mais uma métrica.

Para quem está navegando, são segundos em que nada acontece.

Nenhum trabalho aparece. Nenhuma informação é apresentada. Nenhuma expectativa é atendida.

E o visitante não deveria precisar compreender os motivos técnicos para conseguir explorar o conteúdo que procurava.

## O paradoxo das imagens

Talvez o aspecto mais curioso dessa investigação seja que um dos maiores problemas encontrados envolve justamente as imagens.

Em um estúdio de animação, o conteúdo visual não é apenas um elemento decorativo. Ele é parte essencial daquilo que a empresa oferece.

As imagens apresentam personagens, estilos artísticos, produções e capacidades criativas. São elas que permitem ao visitante reconhecer a qualidade do trabalho.

Mas, quando esses recursos não são distribuídos adequadamente, podem acabar prejudicando a própria experiência que deveriam enriquecer.

Durante a auditoria, encontramos um exemplo significativo.

Uma imagem JPEG de aproximadamente **12,6 MB**, com resolução de 7952 × 5304 pixels, era utilizada em uma área visual de apenas 566 × 283 pixels.

Para colocar isso em perspectiva, estamos falando de uma imagem com mais de 42 milhões de pixels sendo utilizada em um espaço relativamente pequeno da interface.

Também encontramos miniaturas do portfólio com arquivos próximos de 4 MB cada.

Não se trata de defender imagens de baixa qualidade. Especialmente em um portfólio artístico, preservar a fidelidade visual é importante.

A questão é que qualidade e eficiência não precisam ser objetivos conflitantes.

Imagens podem ser redimensionadas, comprimidas e distribuídas em formatos adequados, considerando diferentes dispositivos e resoluções.

O navegador não precisa necessariamente baixar a mesma imagem gigantesca para apresentá-la em uma pequena área da tela.

![Homepage do Studio Mir com a área de 566 × 283 pixels destacada, ainda parcialmente carregada, onde é exibida a imagem original de 7952 × 5304 pixels e 12,6 MB](${FIGURE.oversizedImage})

*Exemplo observado na auditoria de 18/10/2026. A imagem original possuía 7952 × 5304 pixels e aproximadamente 12,6 MB, embora fosse exibida em uma região de 566 × 283 pixels.*

Esse problema ilustra algo maior.

Uma decisão aparentemente técnica, como a maneira de entregar uma imagem, pode influenciar diretamente o acesso das pessoas ao conteúdo de uma empresa.

E, quando o conteúdo é justamente aquilo que demonstra a qualidade do negócio, essa relação se torna ainda mais relevante.

## Um portfólio não é apenas uma galeria

Existe outro aspecto que considero importante.

Quando finalmente conseguimos visualizar os trabalhos do Studio Mir, encontramos um portfólio visualmente forte.

São produções reconhecidas, personagens familiares e projetos que ajudam a demonstrar a relevância do estúdio na indústria de animação.

A organização em grade funciona bem visualmente, e as imagens conseguem transmitir a diversidade dos trabalhos.

Mas um portfólio profissional precisa fazer mais do que apresentar belas imagens.

Ele também precisa ajudar as pessoas a compreender, descobrir e compartilhar o trabalho.

Durante a análise, encontramos 25 itens no portfólio. Os títulos eram apresentados ao passar o cursor do mouse sobre as imagens.

Em dispositivos móveis, nos quais essa interação não existe da mesma maneira, os títulos não ficavam disponíveis na grade.

Também observamos que os projetos não possuíam endereços individuais diretamente compartilháveis.

Imagine encontrar uma produção interessante e querer enviá-la a um colega.

Em vez de compartilhar um link específico daquele projeto, você precisa direcionar a pessoa ao portfólio e esperar que ela encontre o mesmo conteúdo.

Pode parecer um detalhe pequeno.

Mas é justamente por meio dessas interações que um portfólio deixa de ser apenas uma coleção de trabalhos e passa a funcionar como uma ferramenta de comunicação.

![Grade do portfólio do Studio Mir com miniaturas de produções como Devil May Cry, X-Men '97, The Witcher: Nightmare of the Wolf e Dota: Dragon's Blood](${FIGURE.portfolioGrid})

*O portfólio reúne produções reconhecidas internacionalmente e apresenta uma organização visual atraente.*

![Comparação lado a lado: no desktop, o título do projeto aparece sobre a miniatura ao passar o cursor; no mobile, a mesma miniatura é exibida sem título](${FIGURE.titlesDesktopVsMobile})

*Na versão desktop, os títulos aparecem ao passar o cursor sobre as imagens. A navegação mobile apresenta limitações nessa descoberta.*

Para uma empresa criativa, apresentar o trabalho é parte do processo de demonstrar competências.

Um potencial cliente pode querer entender a experiência do estúdio com determinado tipo de produção.

Um profissional interessado em trabalhar na empresa pode querer conhecer seus projetos anteriores.

Um fã pode simplesmente querer descobrir outras animações realizadas pela mesma equipe.

São públicos diferentes, com objetivos diferentes, mas todos dependem da capacidade do website de comunicar informação de maneira clara.

## O custo que não aparece no Lighthouse

Como parte da investigação, realizamos 18 auditorias com o Lighthouse, ferramenta utilizada para avaliar diferentes aspectos da qualidade de páginas web.

Os resultados de performance foram os seguintes:

| Página | Desktop | Mobile |
|---|---:|---:|
| Homepage | 32/100 | 33/100 |
| Portfólio | 64/100 | 54/100 |
| Projeto | 63/100 | 54/100 |

*Medianas de três execuções por ambiente, realizadas em 18/10/2026. Os testes utilizaram condições simuladas pelo Lighthouse. Houve carregamento incompleto em 15 das 18 execuções; portanto, esses resultados devem ser interpretados com cautela e não representam dados de usuários reais.*

Os números ajudam a compreender que existem oportunidades técnicas de melhoria.

Mas acredito que a reflexão mais importante não está nas notas.

O Lighthouse pode indicar problemas de carregamento, mas não consegue responder diretamente a perguntas como:

- Um visitante deixou de explorar o portfólio porque a experiência parecia lenta?
- Um potencial parceiro encontrou facilmente as produções relevantes para seu projeto?
- Um profissional interessado no estúdio conseguiu compreender suas competências?
- A apresentação digital reforçou a qualidade artística percebida nas animações?

Essas perguntas envolvem comportamento, expectativas, confiança e objetivos de negócio.

Para respondê-las de maneira conclusiva, precisaríamos de dados que não estão publicamente disponíveis, como análises de comportamento dos visitantes, pesquisas com usuários e informações comerciais da empresa.

Portanto, não seria correto afirmar que o Studio Mir perdeu clientes ou contratos por causa de seu website.

Mas podemos identificar possíveis pontos de fricção e refletir sobre como eles interferem na comunicação de valor.

**Uma experiência digital não precisa ser a causa de um prejuízo financeiro comprovado para merecer atenção.**

Ela também pode representar uma oportunidade de fortalecer a apresentação de uma marca, facilitar a descoberta de seus produtos e respeitar o tempo de seus visitantes.

## A solução não precisa começar com um redesign

Diante de problemas como esses, seria tentador propor uma reconstrução completa do website.

Uma interface moderna, novas animações, outra arquitetura, tecnologias mais recentes.

Mas será que isso resolveria o problema principal?

A investigação sugere que parte importante das dificuldades encontradas poderia ser abordada sem necessariamente modificar a identidade visual do site.

O carregamento das imagens poderia ser aprimorado por meio de formatos mais eficientes, diferentes resoluções e estratégias adequadas de carregamento sob demanda.

A entrega dos recursos poderia se beneficiar de uma melhor configuração de cache e conexões.

A navegação poderia oferecer títulos mais acessíveis e links específicos para os projetos.

São melhorias que partem de problemas concretos, não simplesmente do desejo de utilizar tecnologias mais novas.

E essa distinção importa.

Uma decisão de engenharia não deveria ser avaliada apenas pela elegância de sua implementação, mas também pelo problema que resolve e pelo valor que entrega.

O melhor caminho nem sempre é reconstruir tudo.

Às vezes, é fazer com que aquilo que já existe funcione melhor para as pessoas.

## Além do código

Essa experiência me fez pensar sobre uma mudança de perspectiva que considero importante na minha trajetória como engenheiro de software.

Ao longo da carreira, é natural dedicarmos muito tempo ao aprendizado de linguagens, frameworks, arquiteturas e boas práticas.

São conhecimentos fundamentais.

Mas existe uma dimensão do desenvolvimento de software que vai além da implementação.

Precisamos compreender por que estamos construindo determinada solução, quem será beneficiado por ela e quais resultados esperamos produzir.

No caso do Studio Mir, minha curiosidade começou com algumas imagens que demoravam para carregar.

A investigação revelou questões de performance, apresentação visual e organização do portfólio.

Mas a reflexão que permaneceu foi outra.

Estamos falando de um estúdio cujo trabalho é capaz de impressionar pessoas ao redor do mundo. Suas produções demonstram criatividade, talento e capacidade técnica.

Seu website é uma oportunidade de aproximar ainda mais as pessoas desse trabalho.

E, para isso, a experiência digital precisa ser tratada como parte da comunicação da empresa, não apenas como uma preocupação de quem escreve o código.

## Considerações finais

Quando entrei no site do Studio Mir, não esperava encontrar um assunto para escrever.

Queria apenas descobrir mais sobre os artistas e profissionais responsáveis por uma animação baseada em um dos meus jogos favoritos.

Acabei encontrando uma oportunidade de refletir sobre algo que considero cada vez mais relevante no desenvolvimento de software: a relação entre escolhas técnicas, experiência humana e valor de negócio.

O trabalho do Studio Mir continua sendo admirável, independentemente das limitações encontradas em seu website.

E talvez seja justamente por admirar esse trabalho que a experiência tenha me chamado tanto a atenção.

No fim, a pergunta que ficou não é apenas como tornar uma página mais rápida.

É como garantir que a tecnologia ajude uma empresa a comunicar a qualidade que ela já possui.

**Porque, às vezes, a melhor contribuição da engenharia de software não é criar algo novo, mas remover os obstáculos entre as pessoas e aquilo que elas vieram encontrar.**

---

### Sobre a investigação

Esta análise foi realizada com ferramentas de automação de navegador, gravação de tela e Lighthouse, utilizando páginas públicas do Studio Mir em 18 de outubro de 2026.

Foram realizadas 18 auditorias sintéticas, além de capturas de navegação, inventário de recursos e análise da estrutura do portfólio.

As observações refletem as condições e o período dos testes. Não foram obtidos dados de usuários reais (CrUX), e nenhuma conclusão sobre perdas financeiras ou comerciais foi estabelecida.

*Studio Mir, Devil May Cry e os demais nomes e obras mencionados pertencem aos respectivos titulares. Este artigo é uma análise independente e não possui vínculo com o estúdio.*
`;
