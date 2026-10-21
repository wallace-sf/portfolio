import { FIGURE } from './figures';

export const content = `## Tudo começou com Devil May Cry

Oi, pessoal. Esta é a primeira postagem deste blog recém-criado. A ideia é compartilhar aqui experiências do meu dia a dia profissional, aquelas coisas que ficam na minha cabeça mas que eu não conto pra ninguém. Este blog vai ser o jeito de esses pensamentos e reflexões escaparem pro mundo.

Sempre fui fã de *Devil May Cry* e joguei os três primeiros jogos da franquia no PlayStation 2 (infelizmente não tive o PlayStation 3 nem os consoles seguintes pra jogar os outros). Para quem não conhece, é uma franquia da Capcom conhecida pelo combate frenético, pelos personagens marcantes e por uma identidade visual bem particular. Quando a Netflix lançou uma adaptação animada, fiquei interessado na hora, até porque já tinha assistido à animação da Madhouse, de 2007.

Depois de assistir, a curiosidade me levou a pesquisar quem estava por trás da produção. Foi assim que cheguei ao **Studio Mir**, um estúdio sul-coreano de animação responsável por trabalhos como *The Legend of Korra*, *The Witcher: Nightmare of the Wolf* e *X-Men '97*.

Meu objetivo era simples: conhecer melhor o estúdio e descobrir que outras animações de qualidade eles já tinham feito. Era bem possível que eu já tivesse assistido a alguma sem saber, e foi o que aconteceu: *The Legend of Korra* é deles. Eu não estava procurando problemas técnicos nem pretendia avaliar o site. Só queria conhecer o trabalho de uma empresa que tinha despertado minha admiração.

Mas, ao acessar o site, uma coisa me chamou a atenção, e por ser engenheiro de software não consegui mais focar no resto. Algumas imagens demoravam bastante para carregar, outras pareciam não respeitar as próprias proporções, e a apresentação do portfólio, embora visualmente interessante, me pareceu limitada.

Minha primeira reação foi tentar entender o que estava acontecendo. Seriam imagens grandes demais? Problemas de infraestrutura? Alguma decisão de implementação? Quando você entende do assunto, fica se questionando nos detalhes (um hábito bom ou ruim?). Depois de alguns instantes, porém, surgiu uma pergunta mais interessante:

**Quanto uma experiência digital ruim pode prejudicar a forma como percebemos uma empresa, mesmo quando seu trabalho é excepcional?**

## A primeira impressão também faz parte da experiência

Imagine descobrir um estúdio de animação depois de assistir a uma produção de que você gostou muito. Você procura o nome da empresa, encontra o site e entra esperando conhecer outros trabalhos. Mas, antes de ver qualquer conteúdo, precisa esperar, e continuar esperando. Foi mais ou menos isso que aconteceu quando visitei o site do Studio Mir.

Antes de investigar a fundo, dei uma olhada rápida nos sites de concorrentes do Studio Mir, como a Madhouse e a MAPPA. São dois estúdios de ponta, responsáveis por animações famosas como *Death Note*, *One Punch Man*, *Attack on Titan* e *Jujutsu Kaisen*. Os dois apresentavam seus trabalhos de forma consistente e organizada (embora eu tenha notado alguns problemas de desempenho no site da MAPPA), o que não encontrei no Studio Mir.

Para entender melhor o que acontecia, fiz uma investigação com ferramentas de auditoria e gravações automatizadas do navegador. Em uma das gravações, feita em 18 de outubro de 2026 a partir do Brasil, a homepage ficou completamente branca por cerca de **14,3 segundos no desktop**. Em uma execução mobile, foram **7,9 segundos**.

Esses números não representam necessariamente a experiência de todos os visitantes. Foram observações pontuais, com cache vazio e sem limitação artificial de rede, e outras condições de conexão, localização e infraestrutura podem dar resultados diferentes. Ainda assim, as gravações mostram uma experiência bem distante do que se espera de um portfólio visual.

![Gravação do carregamento da homepage do Studio Mir no desktop: a página permanece branca por vários segundos antes de exibir o conteúdo](${FIGURE.homeLoad})

*Gravação de 18/10/2026, realizada a partir do Brasil, em velocidade real. O GIF mostra um trecho da navegação original; o cronômetro indica o tempo decorrido desde o início do acesso.*

Existe uma diferença entre saber que uma página é lenta e passar por essa lentidão. Para quem desenvolve software, alguns segundos podem ser só mais uma métrica. Para quem está navegando, são segundos em que nada acontece: nenhum trabalho aparece e nenhuma informação é apresentada. E o visitante não deveria precisar entender os motivos técnicos para conseguir ver o conteúdo que veio procurar.

## O peso das imagens

Talvez o aspecto mais curioso da investigação seja que um dos maiores problemas envolve justamente as imagens. Em um estúdio de animação, o conteúdo visual é parte central do que a empresa oferece: são as imagens que apresentam personagens, estilos e produções, e é por elas que o visitante reconhece a qualidade do trabalho. Quando esses arquivos não são entregues de forma adequada, acabam atrapalhando a experiência que deveriam enriquecer.

O exemplo mais claro foi uma imagem JPEG de cerca de **12,6 MB**, com 7952 × 5304 pixels, usada em uma área de apenas 566 × 283 pixels. São mais de 42 milhões de pixels para preencher um espaço pequeno da interface. Também encontrei miniaturas do portfólio com arquivos de quase 4 MB cada.

![Homepage do Studio Mir com a área de 566 × 283 pixels destacada, ainda parcialmente carregada, onde é exibida a imagem original de 7952 × 5304 pixels e 12,6 MB](${FIGURE.oversizedImage})

*Exemplo observado na auditoria de 18/10/2026. A imagem original possuía 7952 × 5304 pixels e aproximadamente 12,6 MB, embora fosse exibida em uma região de 566 × 283 pixels.*

Em um portfólio artístico, preservar a fidelidade visual é importante, e ninguém está pedindo imagens de baixa qualidade. Qualidade e eficiência podem andar juntas: as imagens podem ser redimensionadas, comprimidas e entregues em formatos e resoluções adequados a cada dispositivo. O navegador não precisa baixar a mesma imagem gigante para mostrá-la em uma pequena área da tela.

Uma decisão aparentemente técnica, como a forma de entregar uma imagem, pode afetar diretamente o acesso das pessoas ao conteúdo de uma empresa. E, quando esse conteúdo é justamente o que demonstra a qualidade do negócio, o efeito é ainda maior.

## Um portfólio difícil de explorar e de compartilhar

Quando o portfólio finalmente aparece, ele é visualmente forte. São produções reconhecidas e personagens familiares que mostram a relevância do estúdio na indústria de animação, e a grade transmite bem a variedade dos trabalhos.

![Grade do portfólio do Studio Mir com miniaturas de produções como Devil May Cry, X-Men '97, The Witcher: Nightmare of the Wolf e Dota: Dragon's Blood](${FIGURE.portfolioGrid})

*O portfólio reúne produções reconhecidas internacionalmente em uma grade visualmente atraente.*

Só que um portfólio profissional também precisa ajudar as pessoas a entender, descobrir e compartilhar o trabalho. No site da MAPPA, por exemplo, as produções são organizadas por ano, da mais recente para a mais antiga, e isso, junto com uma boa apresentação artística, me deu vontade de ir passando ano a ano para conhecer tudo. Não senti isso no portfólio do Studio Mir.

O portfólio tinha 25 itens, e os títulos só apareciam ao passar o cursor sobre as imagens. Em celulares, onde essa interação não existe da mesma forma, os títulos não ficavam disponíveis na grade.

![Comparação lado a lado: no desktop, o título do projeto aparece sobre a miniatura ao passar o cursor; no mobile, a mesma miniatura é exibida sem título](${FIGURE.titlesDesktopVsMobile})

*No desktop, o título aparece ao passar o cursor sobre a imagem; no mobile, a mesma miniatura é exibida sem título.*

Os projetos também não tinham endereços próprios para compartilhar. Imagine encontrar uma produção interessante e querer mandar para um colega: em vez de um link daquele projeto, você precisa mandar o link do portfólio e torcer para a pessoa encontrar o mesmo conteúdo. Parece um detalhe, mas é por interações assim que um portfólio passa a funcionar como uma ferramenta de comunicação.

Para uma empresa criativa, apresentar o trabalho faz parte de demonstrar o que ela sabe fazer. Um potencial cliente pode querer entender a experiência do estúdio com determinado tipo de produção, alguém interessado em trabalhar lá pode querer conhecer os projetos anteriores, e um fã pode só querer descobrir outras animações feitas pela mesma equipe (meu caso). São públicos com objetivos diferentes, mas todos dependem de o site comunicar essas informações com clareza.

## O custo que não aparece no Lighthouse

Como parte da investigação, rodei 18 auditorias com o Lighthouse, ferramenta que avalia diferentes aspectos da qualidade de páginas web. Os resultados de performance foram estes:

| Página | Desktop | Mobile |
|---|---:|---:|
| Homepage | 32/100 | 33/100 |
| Portfólio | 64/100 | 54/100 |
| Projeto | 63/100 | 54/100 |

*Medianas de três execuções por ambiente, realizadas em 18/10/2026. Os testes utilizaram condições simuladas pelo Lighthouse. Houve carregamento incompleto em 15 das 18 execuções; portanto, esses resultados devem ser interpretados com cautela e não representam dados de usuários reais.*

Os números mostram que há oportunidades técnicas de melhoria, mas acho que a reflexão mais importante não está nas notas. O Lighthouse aponta problemas de carregamento, mas não responde a perguntas como:

- Um visitante deixou de explorar o portfólio porque a experiência parecia lenta?
- Um potencial parceiro encontrou facilmente as produções relevantes para seu projeto?
- Um profissional interessado no estúdio conseguiu compreender suas competências?
- A apresentação digital reforçou a qualidade artística percebida nas animações?

Essas perguntas envolvem comportamento, expectativas, confiança e objetivos de negócio. Para respondê-las com segurança, seriam necessários dados que não são públicos, como análises de comportamento dos visitantes, pesquisas com usuários e informações comerciais, coisas que só o estúdio tem. Por isso, não seria correto afirmar que o Studio Mir perdeu clientes ou contratos por causa do site.

O que dá para fazer é identificar possíveis pontos de fricção e pensar em como eles interferem na forma como o estúdio comunica seu valor. Uma experiência digital merece atenção mesmo sem um prejuízo financeiro comprovado, porque é uma chance de fortalecer a marca, facilitar a descoberta dos trabalhos e respeitar o tempo de quem visita.

## Melhorar sem refazer tudo

Diante de problemas assim, seria tentador propor reconstruir o site do zero, com uma interface moderna, novas animações, outra arquitetura e tecnologias mais recentes. Mas será que isso resolveria o problema principal?

A investigação sugere que boa parte das dificuldades poderia ser resolvida sem mexer na identidade visual do site. O carregamento das imagens melhoraria com formatos mais eficientes, várias resoluções e carregamento sob demanda. A entrega dos arquivos se beneficiaria de uma configuração melhor de cache e de conexões. E a navegação poderia ter títulos mais acessíveis e links próprios para cada projeto.

São melhorias que partem de problemas concretos, e não da vontade de usar tecnologias mais novas. Uma decisão de engenharia deveria ser avaliada pelo problema que resolve e pelo valor que entrega, além da elegância da implementação. Nem sempre o melhor caminho é reconstruir tudo; às vezes, é fazer o que já existe funcionar melhor para as pessoas.

## Além do código

Essa experiência me fez pensar numa mudança de perspectiva importante na minha trajetória como engenheiro de software. Ao longo da carreira, é natural dedicar muito tempo a linguagens, frameworks, arquiteturas e boas práticas, e esse conhecimento é fundamental. Mas desenvolver software também exige entender por que estamos construindo uma solução, quem vai se beneficiar dela e que resultados esperamos.

Isso tem tudo a ver com os meus últimos dois anos de carreira, quando parei de prestar tanta atenção em frameworks e tecnologias e passei a olhar mais para como otimizar a experiência dos produtos em que trabalho.

No caso do Studio Mir, a curiosidade começou com algumas imagens que demoravam para carregar, e a investigação revelou questões de performance, de apresentação visual e de organização do portfólio. Mas a reflexão que ficou foi outra. O trabalho desse estúdio impressiona pessoas no mundo inteiro, e o site é uma oportunidade de aproximar ainda mais as pessoas desse trabalho. Para isso, a experiência digital precisa ser tratada como parte da comunicação da empresa, e não só como preocupação de quem escreve o código.

## Considerações finais

Quando entrei no site do Studio Mir, não esperava encontrar um assunto para escrever. Só queria folhear as outras animações do estúdio. Acabei encontrando uma oportunidade de refletir sobre algo cada vez mais relevante para mim no desenvolvimento de software: a relação entre escolhas técnicas, experiência das pessoas e valor de negócio.

O trabalho do Studio Mir continua admirável, apesar das limitações do site, e talvez seja justamente por admirar esse trabalho que a experiência tenha me chamado tanto a atenção. No fim, a pergunta que ficou é como garantir que a tecnologia ajude uma empresa a comunicar a qualidade que ela já tem. Deixar a página mais rápida é só uma parte disso.

Às vezes, a melhor contribuição da engenharia de software é tirar do caminho o que separa as pessoas daquilo que elas vieram encontrar.

---

### Sobre a investigação

Fiz esta análise em 18 de outubro de 2026, em páginas públicas do Studio Mir, com ferramentas de automação de navegador, gravação de tela e Lighthouse. Foram 18 auditorias sintéticas, além de capturas de navegação, inventário de recursos e análise da estrutura do portfólio.

As observações refletem as condições e o período dos testes. Não obtive dados de usuários reais (CrUX) e não tirei nenhuma conclusão sobre perdas financeiras ou comerciais.

*Studio Mir, Devil May Cry e os demais nomes e obras mencionados pertencem aos respectivos titulares. Este artigo é uma análise independente e não possui vínculo com o estúdio.*

## Referências

- [Studio Mir](https://www.studiomir.co.kr/en/): site oficial do estúdio, analisado nesta investigação (em inglês).
- [Introdução ao Lighthouse](https://developer.chrome.com/docs/lighthouse/overview?hl=pt-br): o que a ferramenta mede e como executá-la.
- [Pontuação de desempenho do Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring?hl=pt-br): como as notas de 0 a 100 da tabela acima são calculadas.
- [Dimensionar as imagens corretamente](https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images?hl=pt-br): a auditoria que aponta imagens maiores do que a área em que são exibidas.
- [Veicular imagens em formatos modernos](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images?hl=pt-br): WebP e AVIF como alternativas mais leves ao JPEG.
- [Carregamento lento de imagens no navegador para a Web](https://web.dev/articles/browser-level-image-lazy-loading?hl=pt-br): carregar imagens sob demanda com o atributo \`loading\`.
- [Por que os dados de laboratório e de campo podem ser diferentes](https://web.dev/articles/lab-and-field-data-differences?hl=pt-br): por que auditorias sintéticas não substituem dados de usuários reais.
- [Visão geral do CrUX](https://developer.chrome.com/docs/crux?hl=pt-br): o Chrome UX Report, fonte pública de dados de campo citada na nota metodológica.
`;
