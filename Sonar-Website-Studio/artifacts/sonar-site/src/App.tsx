import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import { Analytics } from '@vercel/analytics/react';

const queryClient = new QueryClient();
const pageMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'SONAR — como os cães percebem os sons',
    description: 'Uma exploração cuidadosa da audição canina, da familiaridade e das muitas maneiras de responder aos sons.',
  },
  '/sons': {
    title: 'Sons e reações caninas — SONAR',
    description: 'Conheça quatro categorias de estímulos sonoros e possíveis respostas, sem presumir que todos os cães reagem da mesma forma.',
  },
  '/audicao': {
    title: 'Entendendo a audição canina — SONAR',
    description: 'Um guia introdutório sobre percepção sonora, frequência, intensidade, contexto e observação responsável do comportamento canino.',
  },
  '/laboratorio': {
    title: 'Laboratório de frequências — SONAR',
    description: 'Explore ondas sonoras com controles de frequência, duração e nível de saída, em uma experiência educativa e segura.',
  },
  '/quiz': {
    title: 'Quiz de escuta — SONAR',
    description: 'Um quiz breve sobre audição canina, frequência e contexto.',
  },
  '/ia': {
    title: 'SONAR IA — Assistente de inteligência artificial',
    description: 'Converse com a IA do SONAR sobre audição canina, percepção sonora e contexto.',
  },
};
const themes = [
  { num: '01', title: 'Familiaridade', text: 'O que muda quando uma voz já faz parte do cotidiano?', href: '/sons' },
  { num: '02', title: 'Frequência e intensidade', text: 'Explore visualmente uma onda e entenda seus parâmetros.', href: '/laboratorio' },
  { num: '03', title: 'Contexto e experiência', text: 'Um mesmo estímulo pode ganhar sentidos diferentes.', href: '/audicao' },
];
const sounds = [
  { title: 'Voz familiar', tag: 'Relação e reconhecimento', category: 'Vozes', stimulus: 'Uma pessoa conhecida chama o cão em tom habitual, sem elevar a voz.', responses: 'Pode orientar as orelhas, olhar na direção da pessoa, aproximar-se ou não demonstrar mudança visível.', reading: 'Familiaridade, contexto e estado de atenção podem influenciar a resposta. A ausência de reação aparente não prova ausência de percepção.' },
  { title: 'Voz desconhecida', tag: 'Novidade', category: 'Vozes', stimulus: 'Uma voz que o cão não costuma ouvir, apresentada em intensidade confortável.', responses: 'Pode haver orientação, investigação, afastamento ou nenhuma resposta perceptível.', reading: 'Novidade não significa necessariamente ameaça. A experiência anterior e o ambiente ajudam a compor o significado daquele som.' },
  { title: 'Sons agudos ou inesperados', tag: 'Frequência e surpresa', category: 'Agudos', stimulus: 'Um som breve, mais agudo ou inesperado, sempre em volume seguro e sem sustos provocados.', responses: 'Alguns cães podem interromper o que fazem ou orientar as orelhas; outros podem se afastar ou seguir tranquilos.', reading: 'Frequência e início súbito são aspectos distintos. Não se deve usar sons intensos para provocar reações ou concluir que um cão está com medo.' },
  { title: 'Sons graves ou contínuos', tag: 'Duração e ambiente', category: 'Graves', stimulus: 'Um ruído grave e estável, como um ventilador distante, em situação cotidiana.', responses: 'A resposta pode variar entre habituar-se, buscar outra área, permanecer atento ou não ser evidente.', reading: 'Duração, vibração, distância e associação com eventos anteriores podem importar tanto quanto o tom percebido.' },
];

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const links = [{ href: '/', text: 'Início' }, { href: '/sons', text: 'Os sons' }, { href: '/audicao', text: 'A audição' }, { href: '/laboratorio', text: 'Laboratório' }, { href: '/quiz', text: 'Quiz' }, { href: '/ia', text: 'IA' }];
  return <header className="header"><div className="wrap nav"><Link href="/" className="brand" aria-label="SONAR, página inicial"><span className="brand-mark" aria-hidden="true" />SONAR</Link><button className="menu-toggle" aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(!open)}>{open ? 'Fechar' : 'Menu'}</button><nav className={`nav-links${open ? ' open' : ''}`} aria-label="Navegação principal">{links.map(link => <Link key={link.href} href={link.href} aria-current={location === link.href ? 'page' : undefined} onClick={() => setOpen(false)}>{link.text}</Link>)}</nav></div></header>;
}
function Footer() { return <footer className="footer"><div className="wrap footer-inner"><span>SONAR — escuta, contexto, cuidado.</span><span>Conteúdo educativo · sem substituir orientação profissional</span></div></footer>; }
function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(.hero)'));
    if (!sections.length) return;
    sections.forEach(section => section.classList.add('scroll-reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return null;
}
function Shell({ children }: { children: ReactNode }) { return <div className="site-shell"><Header /><main><ScrollReveal />{children}</main><Footer /></div>; }
function NotFoundPage() { return <Shell><section className="not-found-page"><div className="wrap"><span className="eyebrow">SONAR / 404</span><h1>Este caminho<br/><em>não está aqui.</em></h1><p>A página que você procura não está disponível. Continue explorando os conteúdos sobre sons e audição canina.</p><div className="not-found-links"><Link className="action-link" href="/sons">Explore os sons <span aria-hidden="true">↗</span></Link><Link className="action-link" href="/">Volte ao início <span aria-hidden="true">↗</span></Link></div></div></section></Shell>; }
function RouteMeta() {
  const [location] = useLocation();
  useEffect(() => {
    const metadata = pageMetadata[location] ?? {
      title: 'Página não encontrada — SONAR',
      description: 'A página solicitada não foi encontrada. Explore o conteúdo educativo da SONAR sobre audição canina.',
    };
    document.documentElement.lang = 'pt-BR';
    document.title = metadata.title;
    for (const [selector, content] of [
      ['meta[name="description"]', metadata.description],
      ['meta[property="og:title"]', metadata.title],
      ['meta[property="og:description"]', metadata.description],
      ['meta[name="twitter:title"]', metadata.title],
      ['meta[name="twitter:description"]', metadata.description],
    ]) {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        const [attribute, value] = selector.match(/\[(.+?)="(.+?)"\]/)!.slice(1);
        tag = document.createElement('meta');
        tag.setAttribute(attribute.replace(/^name$/, 'name').replace(/^property$/, 'property'), value);
        document.head.appendChild(tag);
      }
      tag.content = content;
    }
  }, [location]);
  return null;
}
function Home() { return <Shell><section className="hero"><div className="hero-photo" role="img" aria-label="Ilustração editorial: retrato de um cão atento em luz baixa"/><div className="wrap"><div className="hero-copy"><span className="eyebrow">Um estudo sobre escuta e convivência</span><h1>O mundo<br/>soa <span>diferente.</span></h1><p>Como um cão percebe os sons ao redor? Uma investigação cuidadosa sobre audição, familiaridade e as muitas maneiras de responder.</p><Link className="action-link" href="/sons">Explore os sons <span aria-hidden="true">↗</span></Link></div><span className="hero-index">01 — ESCUTA ATENTA</span></div></section><section className="intro-section"><div className="wrap intro-grid"><div><span className="eyebrow">Ponto de partida</span><h2>Ouvir é mais do que <em>captar um som.</em></h2></div><div className="intro-text"><p>Um som acontece em um corpo, em um lugar e em uma história. A resposta de um cão pode depender do que ele já conhece, do que acontece ao redor e de como se sente naquele momento.</p><p>SONAR reúne referências educativas e perguntas de observação. Não procura uma reação certa — procura olhar com mais atenção.</p><Link className="action-link" href="/audicao">Entenda a audição <span aria-hidden="true">↗</span></Link></div></div></section><section className="themes"><div className="wrap"><div className="section-heading"><div><span className="eyebrow">Três caminhos de investigação</span><h2>Uma escuta em camadas</h2></div><p>Comece por qualquer tema.</p></div>{themes.map(item => <Link className="theme-row" key={item.num} href={item.href}><span className="theme-num">{item.num}</span><h3>{item.title}</h3><p>{item.text}</p><span className="theme-arrow" aria-hidden="true">↗</span></Link>)}</div></section><section className="quote-band"><div className="wrap"><span className="eyebrow">Uma nota de método</span><blockquote>“Observar com cuidado também é aceitar que nem toda resposta cabe numa explicação simples.”</blockquote></div></section></Shell>; }
function Sons() {
  const [filter, setFilter] = useState('Todos');
  const [expanded, setExpanded] = useState<string[]>([]);
  const filters = ['Todos', 'Vozes', 'Agudos', 'Graves'];
  const visibleSounds = sounds.filter(item => filter === 'Todos' || item.category === filter);
  function toggleDiscovery(title: string) {
    setExpanded(current => current.includes(title) ? current.filter(item => item !== title) : [...current, title]);
  }
  return <Shell><section className="page-hero"><div className="wrap"><span className="eyebrow">01 / O repertório sonoro</span><h1>Quatro formas<br/>de <em>escutar.</em></h1><p>Exemplos para orientar a observação — não para prever o comportamento de um cão. As respostas abaixo são possibilidades ilustrativas, não resultados de experimento.</p><span className="page-count">01—04 · CATEGORIAS</span></div></section><section className="content-section"><div className="wrap"><div className="filter-toolbar"><span className="eyebrow">Filtrar por característica</span><div className="filter-row" aria-label="Filtrar categorias de som">{filters.map(option => <button className="filter-btn" key={option} data-testid={`filter-sounds-${option.toLowerCase()}`} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}</div></div><div className="sound-list" aria-live="polite">{visibleSounds.map(item => { const isOpen = expanded.includes(item.title); return <article className="sound-item" key={item.title} data-testid={`sound-category-${item.category.toLowerCase()}`}><span className="sound-num">{String(sounds.indexOf(item) + 1).padStart(2, '0')}</span><div className="sound-main"><h2>{item.title}</h2><span className="tag">{item.tag}</span></div><div className="sound-details"><div><h3>Estímulo ilustrativo</h3><p>{item.stimulus}</p></div><div><h3>Respostas possíveis</h3><p>{item.responses}</p></div><div className="sound-reading"><h3>Leitura cautelosa</h3><p>{item.reading}</p></div></div><div className="discovery-wrap"><button className="discovery-toggle" aria-expanded={isOpen} aria-controls={`discovery-${item.category}`} data-testid={`toggle-discovery-${item.category.toLowerCase()}`} onClick={() => toggleDiscovery(item.title)}>{isOpen ? 'Recolher descoberta' : 'Uma descoberta sobre este som'}<span aria-hidden="true">{isOpen ? '−' : '+'}</span></button>{isOpen && <div className="discovery-content" id={`discovery-${item.category}`}><p>{item.category === 'Vozes' ? 'A voz não é reconhecida apenas por uma palavra: timbre, ritmo e entonação também compõem suas características. Mesmo assim, reconhecer uma voz não determina como o cão responderá naquele momento.' : item.category === 'Agudos' ? 'Altura sonora e volume são propriedades diferentes. Um som agudo pode ser suave; o cuidado deve considerar também intensidade, duração e a possibilidade de o animal se afastar.' : 'Sons graves podem ser percebidos como vibrações no ambiente, além do que se escuta. A distância e os materiais entre a fonte e o cão modificam o estímulo que chega.'}</p></div>}</div></article>; })}</div>{visibleSounds.length === 0 && <div className="empty-library">Nenhuma categoria corresponde a este filtro.</div>}<div className="caution-note"><strong>Conhecimento estabelecido, possibilidades ilustrativas.</strong> Cães percebem sons e podem responder de modos diversos. As descrições desta página são exemplos para reflexão; não representam dados coletados nem permitem diagnosticar estados emocionais. Priorize sempre o bem-estar e interrompa qualquer situação que cause desconforto.</div></div></section></Shell>;
}
const sections = [{ id: 'perceber', title: 'Perceber não é interpretar' }, { id: 'frequencia', title: 'Frequência e intensidade' }, { id: 'contexto', title: 'Contexto, familiaridade e experiência' }, { id: 'observar', title: 'Observar sem concluir depressa' }];
function Audicao() {
 const [expanded, setExpanded] = useState<string[]>([]);
 const discoveries = [
   { id: 'limites', label: 'Por que não existe uma resposta única?', text: 'O comportamento é influenciado por fatores que não são visíveis em um único gesto: experiência, estado físico, ambiente e possibilidade de escolha. Por isso, uma reação isolada não permite concluir com segurança o que o cão sentiu.' },
   { id: 'medicao', label: 'O que muda uma medição auditiva?', text: 'Distância, ruído de fundo, método utilizado e condições do animal interferem nos limiares medidos. Valores publicados são resultados de condições específicas, e não uma previsão individual.' },
 ];
 function toggle(id: string) { setExpanded(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); }
 return <Shell><section className="page-hero"><div className="wrap"><span className="eyebrow">03 / Guia de escuta</span><h1>Uma audição<br/>em <em>contexto.</em></h1><p>Um guia introdutório para pensar sobre como os cães percebem sons — e por que uma reação observada nunca conta a história inteira.</p></div></section><section className="wrap article-layout"><article className="article"><section id="perceber"><h2>Perceber não é interpretar</h2><p>A audição é um dos sentidos pelos quais cães recebem informações sobre o ambiente. Mas perceber um estímulo e atribuir a ele um significado são coisas diferentes. O comportamento que vemos não oferece, sozinho, uma tradução inequívoca do que o animal ouviu ou sentiu.</p><p>Um cão que vira a cabeça pode estar orientando a atenção. Um cão que permanece imóvel pode estar descansando, acompanhando o entorno ou simplesmente não apresentar um sinal fácil de perceber. A observação precisa considerar o conjunto, não um gesto isolado.</p><div className="discovery-list">{discoveries.slice(0, 1).map(item => <div className="discovery-card" key={item.id}><button className="discovery-toggle" aria-expanded={expanded.includes(item.id)} aria-controls={`article-discovery-${item.id}`} onClick={() => toggle(item.id)}>{item.label}<span aria-hidden="true">{expanded.includes(item.id) ? '−' : '+'}</span></button>{expanded.includes(item.id) && <div className="discovery-content" id={`article-discovery-${item.id}`}><p>{item.text}</p></div>}</div>)}</div></section><section id="frequencia"><h2>Frequência e intensidade</h2><p><strong>Frequência</strong> descreve quantas oscilações ocorrem por segundo e se relaciona à percepção de sons mais graves ou mais agudos. <strong>Intensidade</strong> está ligada à amplitude do som e à sensação de volume. São dimensões diferentes: um som agudo não é necessariamente alto, e um som grave não é necessariamente suave.</p><p>Cães podem perceber frequências que não são audíveis para humanos, embora a faixa percebida varie entre indivíduos e condições. A distância da fonte, o ambiente e a duração também alteram o que chega ao animal. Pesquisas e materiais veterinários destacam que métodos e condições de medição influenciam os limites relatados. Não é adequado usar sons fortes ou súbitos para testar uma reação.</p><div className="article-callout">Um som não existe sozinho: ele chega de algum lugar, em determinada intensidade e dentro de uma situação.</div><div className="discovery-list">{discoveries.slice(1).map(item => <div className="discovery-card" key={item.id}><button className="discovery-toggle" aria-expanded={expanded.includes(item.id)} aria-controls={`article-discovery-${item.id}`} onClick={() => toggle(item.id)}>{item.label}<span aria-hidden="true">{expanded.includes(item.id) ? '−' : '+'}</span></button>{expanded.includes(item.id) && <div className="discovery-content" id={`article-discovery-${item.id}`}><p>{item.text}</p></div>}</div>)}</div></section><section id="contexto"><h2>Contexto, familiaridade e experiência</h2><p>Uma voz conhecida pode estar associada a interações recorrentes; uma voz pouco familiar pode ser novidade. Nenhuma dessas características determina uma resposta única. Aprendizagem, experiências anteriores, estado físico, ambiente e possibilidade de se afastar podem influenciar o comportamento.</p><p>O ruído de um aparelho, por exemplo, pode ser familiar para um cão e novo para outro. A mesma fonte sonora também pode ganhar outro sentido quando aparece junto de uma rotina, de uma pessoa ou de um evento. Por isso, falar em uma reação “típica” sem contexto pode simplificar demais.</p></section><section id="observar"><h2>Observar sem concluir depressa</h2><p>Uma observação cuidadosa registra o que aconteceu antes, durante e depois do som, sem transformar impressão em certeza. Descreva o comportamento visível com palavras concretas e considere a possibilidade de não haver mudança perceptível.</p><ul><li>O cão podia se afastar ou escolher outro espaço?</li><li>O estímulo era familiar? Como isso foi determinado?</li><li>Havia outros sons, pessoas ou acontecimentos no ambiente?</li><li>A resposta persistiu, mudou ou não foi claramente observada?</li></ul><p>Se houver sinais de desconforto, interrompa a exposição e permita que o cão se afaste. Dúvidas sobre audição, comportamento ou bem-estar devem ser conversadas com profissionais qualificados.</p><div className="caution-note"><strong>Limite deste guia.</strong> O conteúdo é educativo e não oferece diagnóstico, protocolo de teste ou aconselhamento veterinário individual.</div></section><section id="referencias" className="references"><h2>Leituras de referência</h2><p>Para aprofundar os limites das medições auditivas e a interpretação de faixas de frequência:</p><ul><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10892234/" target="_blank" rel="noopener noreferrer">Guérineau et al. (2024), “Determining Hearing Thresholds in Dogs Using the Staircase Method”, <em>Veterinary Sciences</em>.</a></li><li><a href="https://www.lsu.edu/vetmed/deafness/hearingrange.php" target="_blank" rel="noopener noreferrer">Louisiana State University School of Veterinary Medicine, “How Well Do Dogs and Other Animals Hear?”</a></li></ul></section></article><aside className="article-aside"><h3>Neste guia</h3>{sections.map(s => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}<a href="#referencias">Leituras de referência</a></aside></section></Shell>;
}

const quizQuestions = [
  { question: 'O que a frequência de uma onda sonora descreve?', options: ['Quantas oscilações acontecem por segundo', 'A distância entre o cão e a fonte sonora', 'O tempo total durante o qual o som é reproduzido', 'A quantidade de pessoas que conseguem ouvir o som'], answer: 0, explanation: 'A frequência é medida em hertz (Hz) e corresponde ao número de oscilações por segundo. Ela se relaciona à percepção de sons graves e agudos.' },
  { question: 'Qual afirmação diferencia corretamente frequência e intensidade?', options: ['Frequência é volume; intensidade é duração', 'Frequência se relaciona a grave/agudo; intensidade, ao nível do som', 'As duas palavras significam exatamente a mesma coisa', 'A frequência só existe em sons produzidos por animais'], answer: 1, explanation: 'São propriedades diferentes: frequência está relacionada à altura sonora, enquanto intensidade se relaciona à amplitude e ao nível sonoro.' },
  { question: 'Um som agudo é necessariamente alto e incômodo?', options: ['Sim, todo som agudo é alto', 'Sim, mas apenas para cães', 'Não; um som agudo também pode ser suave', 'Não; sons agudos não podem ser percebidos por cães'], answer: 2, explanation: 'Altura e intensidade não são equivalentes. Um som agudo pode ter baixo nível sonoro, e a experiência também depende do contexto e do indivíduo.' },
  { question: 'Por que não é correto concluir que um cão está com medo só porque virou a cabeça?', options: ['Porque cães nunca viram a cabeça ao ouvir sons', 'Porque esse gesto pode ter várias explicações e precisa de contexto', 'Porque apenas o movimento da cauda indica medo', 'Porque todo gesto é uma resposta consciente'], answer: 1, explanation: 'Um comportamento isolado não permite identificar com certeza uma emoção ou intenção. É preciso considerar o conjunto de sinais e a situação.' },
  { question: 'Qual fator pode alterar o som que chega até o cão?', options: ['Somente a cor do objeto que produz o som', 'A distância, os obstáculos e as características do ambiente', 'Apenas o nome dado ao som por uma pessoa', 'A quantidade de palavras nesta pergunta'], answer: 1, explanation: 'Distância, materiais, obstáculos e acústica do ambiente podem modificar o estímulo que chega ao animal.' },
  { question: 'O que significa dizer que uma resposta comportamental varia entre indivíduos?', options: ['Todos os cães reagem da mesma forma em condições iguais', 'A raça determina sozinha qualquer reação', 'Cães diferentes podem responder de modos diferentes ao mesmo estímulo', 'O comportamento não pode ser observado com cuidado'], answer: 2, explanation: 'Experiências anteriores, estado físico, ambiente e diferenças individuais podem contribuir para respostas distintas.' },
  { question: 'Qual registro é mais útil numa observação responsável?', options: ['“O cão ficou com raiva” sem descrever o que ocorreu', 'Uma conclusão definitiva baseada em um único gesto', 'Uma descrição concreta do que aconteceu antes, durante e depois do som', 'Apenas a opinião de quem assistiu'], answer: 2, explanation: 'Descrever ações observáveis e o contexto separa o registro da interpretação e evita transformar uma hipótese em certeza.' },
  { question: 'Se um cão demonstra sinais de desconforto durante uma exposição sonora, o que fazer?', options: ['Aumentar o volume para confirmar a reação', 'Repetir o estímulo sem pausa', 'Impedir que o cão saia do local', 'Interromper a exposição e permitir que se afaste'], answer: 3, explanation: 'O bem-estar deve vir primeiro. Interrompa a situação e permita que o animal se afaste; não use sons para provocar ou testar reações.' },
  { question: 'Qual afirmação sobre a audição canina é mais cuidadosa?', options: ['Todos os cães têm exatamente os mesmos limites auditivos', 'A faixa percebida pode variar e depende também das condições de medição', 'Todo som que uma pessoa não ouve é seguro para cães', 'Um comportamento isolado mede com precisão a audição'], answer: 1, explanation: 'Os limites relatados variam conforme indivíduo, método e condições. Sons inaudíveis para humanos não devem ser presumidos seguros.' },
  { question: 'Ao comparar a reação do mesmo cão a dois sons, qual abordagem é melhor?', options: ['Mudar várias condições ao mesmo tempo e concluir a causa', 'Usar sons muito fortes para obter uma resposta evidente', 'Registrar as condições, evitar desconforto e reconhecer os limites da comparação', 'Considerar que a primeira reação explica todas as seguintes'], answer: 2, explanation: 'Uma comparação responsável registra o contexto, evita estímulos prejudiciais e não atribui causalidade além do que os dados permitem.' },
];
function Quiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = quizQuestions[questionIndex];
  function selectAnswer(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.answer) setScore(value => value + 1);
  }
  function nextQuestion() {
    if (questionIndex === quizQuestions.length - 1) setFinished(true);
    else { setQuestionIndex(value => value + 1); setSelected(null); }
  }
  function retry() { setQuestionIndex(0); setSelected(null); setScore(0); setFinished(false); }
  return <Shell><section className="page-hero"><div className="wrap"><span className="eyebrow">04 / Checagem de escuta</span><h1>O que ficou<br/><em>no ouvido?</em></h1><p>Dez perguntas para aprofundar frequência, intensidade, contexto e observação responsável. Cada resposta inclui uma explicação.</p></div></section><section className="wrap quiz-section"><div className="quiz-panel" aria-live="polite">{finished ? <div className="quiz-result"><span className="eyebrow">Quiz concluído</span><p className="quiz-score">{score}<span> / {quizQuestions.length}</span></p><h2>{score === quizQuestions.length ? 'Uma escuta atenta.' : score >= 2 ? 'Uma boa base para continuar.' : 'Toda escuta começa com uma pergunta.'}</h2><p>Você acertou {score} de {quizQuestions.length}. O essencial é lembrar que contexto e cuidado acompanham qualquer interpretação.</p><button className="solid-button" onClick={retry} data-testid="button-quiz-retry">Tentar novamente <span aria-hidden="true">↺</span></button></div> : <><div className="quiz-meta"><span className="eyebrow">Pergunta {String(questionIndex + 1).padStart(2, '0')} de {quizQuestions.length}</span><span className="quiz-running-score">Pontuação <strong>{score}</strong></span></div><div className="quiz-progress" role="progressbar" aria-label="Progresso do quiz" aria-valuemin={1} aria-valuemax={quizQuestions.length} aria-valuenow={questionIndex + 1}><span style={{ width: `${((questionIndex + 1) / quizQuestions.length) * 100}%` }} /></div><h2 className="quiz-question">{question.question}</h2><div className="quiz-options">{question.options.map((option, index) => { const isSelected = selected === index; const isCorrect = selected !== null && index === question.answer; const isIncorrect = isSelected && index !== question.answer; return <button className={`quiz-option${isCorrect ? ' correct' : ''}${isIncorrect ? ' incorrect' : ''}`} key={option} onClick={() => selectAnswer(index)} disabled={selected !== null} aria-pressed={isSelected} data-testid={`button-quiz-answer-${index}`}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{isCorrect && <span className="feedback-label">Correta</span>}{isIncorrect && <span className="feedback-label">Não é essa</span>}</button>; })}</div>{selected !== null && <div className={`quiz-feedback ${selected === question.answer ? 'feedback-correct' : 'feedback-incorrect'}`}><p><strong>{selected === question.answer ? 'Isso mesmo.' : 'Ainda não.'}</strong> {question.explanation}</p><button className="action-link" onClick={nextQuestion}>{questionIndex === quizQuestions.length - 1 ? 'Ver resultado' : 'Próxima pergunta'} <span aria-hidden="true">↗</span></button></div>}</>}</div></section></Shell>;
}

function FrequencyLab() {
  const [frequency, setFrequency] = useState(440);
  const [duration, setDuration] = useState(3);
  const [volume, setVolume] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [audioMessage, setAudioMessage] = useState('Pronto para explorar. O áudio só começa quando você pressionar reproduzir.');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<{ context: AudioContext; oscillator: OscillatorNode; gain: GainNode } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let frame = 0;
    let phase = 0;
    let animation = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = () => {
      const width = canvas.clientWidth || 640;
      const height = canvas.clientHeight || 180;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.strokeStyle = 'rgba(231,190,121,.14)'; context.lineWidth = 1;
      for (let x = 0; x <= width; x += 40) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 0; y <= height; y += 30) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      context.beginPath(); context.strokeStyle = '#e7be79'; context.lineWidth = 2;
      const cycles = 1 + (frequency / 2000) * 8;
      const amplitude = 12 + volume * 1.1;
      for (let x = 0; x <= width; x++) {
        const y = height / 2 + Math.sin((x / width) * Math.PI * 2 * cycles + phase) * amplitude;
        if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
      if (!reduced) { phase += playing ? 0.09 : 0.018; animation = window.requestAnimationFrame(draw); }
      frame++;
    };
    draw();
    return () => { window.cancelAnimationFrame(animation); void frame; };
  }, [frequency, volume, playing]);

  function stopTone(message = 'Reprodução interrompida.') {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    const audio = audioRef.current;
    if (audio) {
      try { audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.015); audio.oscillator.stop(audio.context.currentTime + 0.06); } catch { /* already stopped */ }
      audioRef.current = null;
      window.setTimeout(() => { void audio.context.close().catch(() => undefined); }, 100);
    }
    setPlaying(false);
    setAudioMessage(message);
  }

  async function playTone() {
    stopTone('Preparando o áudio…');
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) throw new Error('Este navegador não oferece suporte à Web Audio API.');
      const context = new AudioContextClass();
      await context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(Math.min(volume / 100, 0.08), context.currentTime);
      oscillator.connect(gain); gain.connect(context.destination);
      audioRef.current = { context, oscillator, gain };
      oscillator.onended = () => {
        if (audioRef.current?.oscillator === oscillator) {
          audioRef.current = null; setPlaying(false); setAudioMessage('Reprodução concluída. Faça uma pausa antes de iniciar outro som.'); void context.close().catch(() => undefined);
        }
      };
      oscillator.start(); setPlaying(true);
      setAudioMessage(`Tom de ${frequency} Hz em nível de saída baixo, por até ${duration} segundos.`);
      timeoutRef.current = setTimeout(() => stopTone('Reprodução concluída. Faça uma pausa antes de iniciar outro som.'), duration * 1000);
    } catch (error) {
      setPlaying(false);
      setAudioMessage(error instanceof Error ? error.message : 'Não foi possível iniciar o áudio neste navegador.');
    }
  }

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const audio = audioRef.current;
    if (audio) { try { audio.oscillator.stop(); } catch { /* already stopped */ } void audio.context.close().catch(() => undefined); }
  }, []);

  return <Shell><section className="page-hero"><div className="wrap"><span className="eyebrow">02 / Experiência interativa</span><h1>Laboratório<br/>de <em>frequências.</em></h1><p>Explore a relação entre frequência e forma de onda. A reprodução é opcional, limitada e destinada à exploração educativa — não é um teste de audição.</p></div></section><section className="wrap lab-section"><div className="lab-heading"><div><span className="eyebrow">Sinal visualizado</span><h2>Uma onda, alguns parâmetros.</h2></div><span className="lab-live"><span className={playing ? 'live-dot active' : 'live-dot'} />{playing ? 'Áudio ativo' : 'Em espera'}</span></div><div className="wave-frame"><canvas ref={canvasRef} aria-label={`Visualização ilustrativa de uma onda de ${frequency} hertz`} role="img"/><div className="wave-caption"><span>0 ms</span><span>Visualização ilustrativa · não representa uma medição acústica</span><span>{frequency} Hz</span></div></div><div className="lab-controls"><div className="lab-control"><label htmlFor="frequency-range">Frequência <strong>{frequency} Hz</strong></label><input id="frequency-range" type="range" min="80" max="2000" step="10" value={frequency} onChange={event => setFrequency(Number(event.target.value))} disabled={playing}/><div className="range-labels"><span>80 Hz · grave</span><span>2.000 Hz · agudo</span></div></div><div className="lab-control"><label htmlFor="duration-range">Duração <strong>{duration} s</strong></label><input id="duration-range" type="range" min="1" max="5" step="1" value={duration} onChange={event => setDuration(Number(event.target.value))} disabled={playing}/><div className="range-labels"><span>1 segundo</span><span>5 segundos</span></div></div><div className="lab-control"><label htmlFor="volume-range">Nível de saída <strong>{volume}%</strong></label><input id="volume-range" type="range" min="0" max="8" step="1" value={volume} onChange={event => setVolume(Number(event.target.value))} disabled={playing}/><div className="range-labels"><span>Silencioso</span><span>Limite do laboratório: 8%</span></div></div></div><div className="lab-actions"><button className="solid-button" onClick={playing ? () => stopTone() : () => void playTone()}>{playing ? 'Parar reprodução' : 'Reproduzir tom'} <span aria-hidden="true">{playing ? '■' : '↗'}</span></button><p role="status" aria-live="polite">{audioMessage}</p></div><div className="caution-note"><strong>Segurança em primeiro lugar.</strong> A percepção de volume depende também do aparelho, dos fones e do ambiente; o limite do controle não garante um nível acústico seguro em todos os dispositivos. Comece com volume baixo, não use fones em volume alto e não reproduza tons para testar, provocar ou avaliar a audição de cães. Se um animal estiver por perto, prefira explorar apenas a visualização.</div></section></Shell>;
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };
function IAChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unavailable, setUnavailable] = useState(false);
  const [unavailableMessage, setUnavailableMessage] = useState('');
  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    const request = { messages: nextMessages };
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setError('');
    setUnavailable(false);
    setUnavailableMessage('');
    setLoading(true);
    try {
      const response = await fetch('/api/sonar/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify(request),
      });
      if (response.status === 503) {
        const errorBody = await response.json().catch(() => null) as { error?: unknown } | null;
        setUnavailable(true);
        setUnavailableMessage(typeof errorBody?.error === 'string' ? errorBody.error : 'A IA do SONAR está indisponível no momento.');
        setMessages(nextMessages);
        return;
      }
      if (!response.ok) throw new Error(`A solicitação falhou (HTTP ${response.status}).`);
      if (!response.body) throw new Error('A resposta em fluxo não está disponível neste navegador.');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let completed = false;
      const appendEvent = (raw: string) => {
        const data = raw.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
        if (!data) return;
        let payload: { content?: string; done?: boolean; error?: string };
        try { payload = JSON.parse(data); } catch { return; }
        if (payload.error) throw new Error(payload.error);
        if (payload.content) setMessages(current => current.map((message, index) => index === current.length - 1 ? { ...message, content: message.content + payload.content } : message));
        if (payload.done) completed = true;
      };
      while (!completed) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';
        events.forEach(appendEvent);
      }
      buffer += decoder.decode();
      if (buffer.trim()) appendEvent(buffer);
      if (!completed) throw new Error('A conexão foi encerrada antes da conclusão da resposta.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível conectar à IA do SONAR.');
      setMessages(current => current[current.length - 1]?.content ? current : current.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }
  const reachedLimit = messages.length >= 12;
  return <Shell><section className="page-hero"><div className="wrap"><span className="eyebrow">05 / Inteligência artificial</span><h1>SONAR<br/><em>IA.</em></h1><p>Um assistente conversacional para explorar audição canina, percepção sonora e contexto com respostas claras e cuidadosas.</p></div></section><section className="wrap insight-section"><div className="insight-heading"><div><span className="eyebrow">Assistente conversacional</span><h2>Como posso ajudar?</h2></div><p>Respostas educativas sobre os temas do SONAR. A IA não substitui orientação veterinária nem oferece diagnóstico.</p></div><div className="chat-log" aria-live="polite" aria-relevant="additions text">{messages.length === 0 && <div className="chat-welcome"><span className="brand-mark" aria-hidden="true"/><p>Olá! Sou a IA do SONAR.</p><span>Pergunte sobre sons, frequência, intensidade ou comportamento.</span><div className="chat-suggestions"><button type="button" onClick={() => setInput('Qual é a diferença entre frequência e intensidade?')}>Frequência × intensidade</button><button type="button" onClick={() => setInput('Como observar a reação de um cão sem tirar conclusões precipitadas?')}>Como observar com cuidado</button><button type="button" onClick={() => setInput('Por que cães diferentes podem reagir de formas diferentes ao mesmo som?')}>Diferenças entre cães</button></div></div>}{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${index}-${message.role}`} data-testid={`message-${message.role}-${index}`}><span className="chat-role">{message.role === 'user' ? 'Você' : 'SONAR IA'}</span><p>{message.content || (loading && index === messages.length - 1 ? 'Preparando a resposta…' : '')}</p></div>)}{loading && <div className="stream-state" role="status"><span className="loading-line"/><span>A IA está respondendo</span></div>}{unavailable && <div className="chat-alert" role="alert"><strong>Assistente indisponível.</strong> {unavailableMessage}</div>}{error && <div className="chat-alert" role="alert"><strong>Não foi possível concluir a conversa.</strong> {error}<button className="text-button" onClick={() => setError('')}>Dispensar</button></div>}</div><form className="chat-form" onSubmit={submitMessage}><label className="sr-only" htmlFor="ia-prompt">Sua pergunta para a IA do SONAR</label><textarea id="ia-prompt" data-testid="input-ia-prompt" value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Envie uma mensagem para a IA…" rows={2} maxLength={2000} disabled={loading || reachedLimit} required/><button className="solid-button" type="submit" disabled={loading || reachedLimit || !input.trim()} data-testid="button-ia-send">{loading ? 'Respondendo…' : 'Enviar pergunta'} <span aria-hidden="true">↗</span></button><span className="form-note">{reachedLimit ? 'Limite de 12 mensagens atingido.' : `${input.length}/2000 · máximo de 12 mensagens por conversa`}</span></form></section></Shell>;
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/sons" component={Sons} /><Route path="/audicao" component={Audicao} /><Route path="/laboratorio" component={FrequencyLab} /><Route path="/quiz" component={Quiz} /><Route path="/ia" component={IAChat} /><Route component={NotFoundPage} /></Switch></RoutedErrorBoundary>; }
 function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RouteMeta /><Router /></WouterRouter><Toaster /></TooltipProvider><Analytics /></QueryClientProvider>; }
export default App;
