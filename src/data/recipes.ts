import { Recipe } from '../types';

export const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Ovo de Chocolate ao Leite',
    category: 'Clássico',
    image: 'https://images.unsplash.com/photo-1619634290736-6d5772c7de00?w=600',
    icon: '🍫',
    description: 'O clássico que nunca falha. Chocolate ao leite temperado com perfeição para uma casca brilhante e crocante.',
    yield: '1 ovo de 200g',
    difficulty: 'Fácil',
    time: '45 min + 2h geladeira',
    validity: '30 dias',
    ingredients: [
      { item: 'Chocolate ao leite nobre', amount: '200g' },
      { item: 'Forma para ovo', amount: '1 unidade' }
    ],
    instructions: [
      'Pique o chocolate em pedaços pequenos e uniformes.',
      'Derreta 2/3 do chocolate em banho-maria ou micro-ondas.',
      'Adicione o restante do chocolate e mexa até atingir 28-29°C (temperagem).',
      'Pincele a forma, leve à geladeira por 5 min. Repita para a segunda camada.',
      'Deixe na geladeira até a forma ficar opaca e desenforme.'
    ],
    tip: 'Use chocolate nobre para garantir o sabor e a textura profissional.',
    cost: 12.50,
    suggestedPrice: 35.00,
    profitMargin: 64
  },
  {
    id: '2',
    name: 'Ovo Meio Amargo Premium',
    category: 'Clássico',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600',
    icon: '🌑',
    description: 'Para paladares refinados, um chocolate 50% cacau com intensidade e brilho incomparáveis.',
    yield: '1 ovo de 200g',
    difficulty: 'Fácil',
    time: '45 min + 2h geladeira',
    validity: '30 dias',
    ingredients: [
      { item: 'Chocolate meio amargo 50%', amount: '200g' }
    ],
    instructions: [
      'Derreta o chocolate até 45°C.',
      'Faça a temperagem no mármore ou por adição até 31°C.',
      'Aplique na forma em duas camadas finas.',
      'Leve à geladeira até cristalizar totalmente.'
    ],
    tip: 'A temperatura de trabalho do meio amargo é levemente superior ao leite.',
    cost: 14.00,
    suggestedPrice: 40.00,
    profitMargin: 65
  },
  {
    id: '3',
    name: 'Ovo Branco com Granulado',
    category: 'Clássico',
    image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=600',
    icon: '⚪',
    description: 'Doçura equilibrada com o toque divertido dos granulados coloridos na casca.',
    yield: '1 ovo de 200g',
    difficulty: 'Fácil',
    time: '50 min + 2h geladeira',
    validity: '20 dias',
    ingredients: [
      { item: 'Chocolate branco nobre', amount: '200g' },
      { item: 'Granulado colorido', amount: '30g' }
    ],
    instructions: [
      'Derreta o chocolate branco com cuidado (queima fácil).',
      'Tempere até 27-28°C.',
      'Misture metade do granulado no chocolate antes de moldar.',
      'Aplique na forma e finalize com o restante do granulado na borda.'
    ],
    tip: 'O chocolate branco é mais sensível ao calor, use potência média no micro-ondas.',
    cost: 15.00,
    suggestedPrice: 42.00,
    profitMargin: 64
  },
  {
    id: '4',
    name: 'Ovo Trufado Belga',
    category: 'Clássico',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600',
    icon: '💎',
    description: 'Luxo em forma de chocolate. Casca recheada com ganache sedosa de chocolate belga.',
    yield: '1 ovo de 250g',
    difficulty: 'Médio',
    time: '1h 30min + 4h geladeira',
    validity: '10 dias',
    ingredients: [
      { item: 'Chocolate ao leite belga', amount: '200g' },
      { item: 'Creme de leite', amount: '50g' },
      { item: 'Glucose de milho', amount: '5g' }
    ],
    instructions: [
      'Faça as cascas finas e deixe cristalizar.',
      'Prepare a trufa derretendo chocolate com creme de leite e glucose.',
      'Espalhe a trufa dentro da casca já firme.',
      'Cubra com uma fina camada de chocolate para selar o recheio.'
    ],
    tip: 'A glucose ajuda a manter a trufa macia por mais tempo.',
    cost: 22.00,
    suggestedPrice: 65.00,
    profitMargin: 66
  },
  {
    id: '5',
    name: 'Ovo de Colher Brigadeiro',
    category: 'Clássico',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600',
    icon: '🥄',
    description: 'O campeão de vendas. Recheio generoso de brigadeiro gourmet ponto de colher.',
    yield: '1 ovo de 300g',
    difficulty: 'Fácil',
    time: '1h + 3h geladeira',
    validity: '5 dias',
    ingredients: [
      { item: 'Leite condensado', amount: '1 lata' },
      { item: 'Creme de leite', amount: '100g' },
      { item: 'Cacau em pó 50%', amount: '30g' },
      { item: 'Chocolate ao leite para casca', amount: '150g' }
    ],
    instructions: [
      'Cozinhe o brigadeiro até o ponto de "moises" leve (não muito firme).',
      'Deixe esfriar totalmente fora da geladeira.',
      'Prepare a casca de chocolate.',
      'Recheie a casca e decore com granulados ou brigadeiros enrolados.'
    ],
    tip: 'Use granulado tipo "split" para um visual muito mais profissional.',
    cost: 18.00,
    suggestedPrice: 55.00,
    profitMargin: 67
  },
  {
    id: '6',
    name: 'Ovo Nutella e Avelãs',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600',
    icon: '🌰',
    description: 'A combinação perfeita de avelãs torradas crocantes e a cremosidade da Nutella original.',
    yield: '1 ovo de 250g',
    difficulty: 'Médio',
    time: '1h + 2h geladeira',
    validity: '15 dias',
    ingredients: [
      { item: 'Nutella', amount: '100g' },
      { item: 'Avelãs torradas e picadas', amount: '40g' },
      { item: 'Chocolate ao leite', amount: '150g' }
    ],
    instructions: [
      'Prepare a casca de chocolate ao leite.',
      'Misture as avelãs picadas na Nutella.',
      'Aplique o recheio na casca e sele com mais chocolate.',
      'Decore o topo com avelãs inteiras.'
    ],
    tip: 'Toste as avelãs levemente no forno antes de usar para realçar o sabor.',
    cost: 25.00,
    suggestedPrice: 85.00,
    profitMargin: 70
  },
  {
    id: '7',
    name: 'Ovo de Colher Prestígio',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1590080876351-941f369806db?w=600',
    icon: '🥥',
    description: 'Beijinho cremoso com coco em flocos, coberto por uma camada de chocolate meio amargo.',
    yield: '1 ovo de 300g',
    difficulty: 'Fácil',
    time: '1h + 2h geladeira',
    validity: '5 dias',
    ingredients: [
      { item: 'Leite condensado', amount: '1 lata' },
      { item: 'Coco ralado em flocos', amount: '50g' },
      { item: 'Leite de coco', amount: '50ml' },
      { item: 'Chocolate meio amargo', amount: '150g' }
    ],
    instructions: [
      'Leve ao fogo o leite condensado, coco e leite de coco até engrossar.',
      'Prepare a casca de chocolate meio amargo.',
      'Recheie generosamente quando o creme estiver frio.',
      'Finalize com coco em flocos por cima.'
    ],
    tip: 'O leite de coco deixa o recheio muito mais úmido e saboroso.',
    cost: 16.00,
    suggestedPrice: 58.00,
    profitMargin: 72
  },
  {
    id: '8',
    name: 'Ovo Trufado de Maracujá',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600',
    icon: '🟡',
    description: 'O azedinho do maracujá contrastando com a doçura do chocolate branco.',
    yield: '1 ovo de 250g',
    difficulty: 'Médio',
    time: '1h 30min + 4h geladeira',
    validity: '7 dias',
    ingredients: [
      { item: 'Chocolate branco', amount: '200g' },
      { item: 'Suco concentrado de maracujá', amount: '40ml' },
      { item: 'Creme de leite', amount: '40g' }
    ],
    instructions: [
      'Prepare a ganache de maracujá misturando o suco ao chocolate branco derretido com creme de leite.',
      'Prepare as cascas de chocolate branco.',
      'Recheie as cascas e sele com chocolate.',
      'Decore com sementes de maracujá secas para um toque rústico.'
    ],
    tip: 'Use suco da fruta natural reduzido no fogo para um sabor mais intenso.',
    cost: 19.00,
    suggestedPrice: 62.00,
    profitMargin: 69
  },
  {
    id: '9',
    name: 'Ovo Brigadeiro de Pistache',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=600',
    icon: '🟢',
    description: 'A sofisticação do pistache em um brigadeiro aveludado dentro de uma casca de chocolate branco.',
    yield: '1 ovo de 250g',
    difficulty: 'Avançado',
    time: '2h + 4h geladeira',
    validity: '7 dias',
    ingredients: [
      { item: 'Pasta de pistache pura', amount: '20g' },
      { item: 'Pistache triturado', amount: '30g' },
      { item: 'Leite condensado', amount: '1 lata' },
      { item: 'Chocolate branco nobre', amount: '150g' }
    ],
    instructions: [
      'Cozinhe o brigadeiro branco e adicione a pasta de pistache ao final.',
      'Prepare a casca de chocolate branco com pedacinhos de pistache.',
      'Recheie e decore com pistaches inteiros.',
      'Embale em papel celofane transparente para mostrar a cor verde vibrante.'
    ],
    tip: 'Pistaches iranianos têm a cor verde mais intensa para decoração.',
    cost: 35.00,
    suggestedPrice: 110.00,
    profitMargin: 68
  },
  {
    id: '10',
    name: 'Ovo de Colher Oreo',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600',
    icon: '🍪',
    description: 'Creme tipo cheesecake com pedaços crocantes de biscoito Oreo.',
    yield: '1 ovo de 300g',
    difficulty: 'Fácil',
    time: '1h + 2h geladeira',
    validity: '5 dias',
    ingredients: [
      { item: 'Biscoito Oreo', amount: '1 pacote' },
      { item: 'Cream cheese', amount: '100g' },
      { item: 'Chocolate branco', amount: '200g' }
    ],
    instructions: [
      'Misture o recheio do biscoito com cream cheese e chocolate branco derretido.',
      'Adicione os biscoitos quebrados grosseiramente.',
      'Recheie a casca de chocolate branco.',
      'Decore com mini Oreos no topo.'
    ],
    tip: 'Mantenha os biscoitos em pedaços maiores para garantir a crocância.',
    cost: 20.00,
    suggestedPrice: 68.00,
    profitMargin: 70
  },
  {
    id: '11',
    name: 'Ovo Trufado de Limão Siciliano',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1504473089979-b1c4993efd1b?w=600',
    icon: '🍋',
    description: 'Refrescância pura. Ganache de limão siciliano com raspas frescas.',
    yield: '1 ovo de 250g',
    difficulty: 'Médio',
    time: '1h 30min + 3h geladeira',
    validity: '7 dias',
    ingredients: [
      { item: 'Limão siciliano (suco e raspas)', amount: '1 unidade' },
      { item: 'Chocolate branco', amount: '200g' },
      { item: 'Creme de leite', amount: '50g' }
    ],
    instructions: [
      'Prepare a ganache com o suco e raspas do limão.',
      'Deixe a ganache descansar por 6 horas antes de rechear.',
      'Prepare a casca de chocolate branco.',
      'Recheie e sele.'
    ],
    tip: 'Não use a parte branca da casca do limão para não amargar.',
    cost: 18.00,
    suggestedPrice: 60.00,
    profitMargin: 70
  },
  {
    id: '12',
    name: 'Ovo Caramelo Salgado',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600',
    icon: '🧂',
    description: 'O equilíbrio perfeito entre o doce do caramelo e o toque de flor de sal.',
    yield: '1 ovo de 250g',
    difficulty: 'Avançado',
    time: '2h + 4h geladeira',
    validity: '15 dias',
    ingredients: [
      { item: 'Açúcar refinado', amount: '150g' },
      { item: 'Creme de leite fresco', amount: '100ml' },
      { item: 'Manteiga com sal', amount: '30g' },
      { item: 'Flor de sal', amount: '1 pitada' },
      { item: 'Chocolate ao leite', amount: '150g' }
    ],
    instructions: [
      'Faça um caramelo seco com o açúcar.',
      'Adicione o creme de leite aquecido e a manteiga.',
      'Finalize com a flor de sal e deixe esfriar.',
      'Recheie a casca de chocolate ao leite.'
    ],
    tip: 'O caramelo deve estar em temperatura ambiente para não derreter a casca.',
    cost: 15.00,
    suggestedPrice: 75.00,
    profitMargin: 80
  },
  {
    id: '13',
    name: 'Ovo de Colher Churros',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1590080876351-941f369806db?w=600',
    icon: '🥨',
    description: 'Doce de leite cremoso com canela e açúcar, lembrando o clássico churros.',
    yield: '1 ovo de 300g',
    difficulty: 'Fácil',
    time: '1h + 2h geladeira',
    validity: '5 dias',
    ingredients: [
      { item: 'Doce de leite firme', amount: '200g' },
      { item: 'Canela em pó', amount: '5g' },
      { item: 'Açúcar cristal', amount: '10g' },
      { item: 'Chocolate branco', amount: '150g' }
    ],
    instructions: [
      'Misture canela no chocolate branco para a casca.',
      'Recheie com o doce de leite.',
      'Polvilhe açúcar e canela por cima.',
      'Decore com mini churros se desejar.'
    ],
    tip: 'Cozinhe a lata de leite condensado na pressão para o melhor doce de leite.',
    cost: 14.00,
    suggestedPrice: 52.00,
    profitMargin: 73
  },
  {
    id: '14',
    name: 'Ovo Vulcão de Chocolate',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=600',
    icon: '🌋',
    description: 'Uma explosão de sabor com recheio líquido que escorre ao cortar.',
    yield: '1 ovo de 200g',
    difficulty: 'Avançado',
    time: '2h + 6h geladeira',
    validity: '3 dias',
    ingredients: [
      { item: 'Cacau em pó', amount: '20g' },
      { item: 'Leite', amount: '100ml' },
      { item: 'Amido de milho', amount: '5g' },
      { item: 'Chocolate ao leite', amount: '200g' }
    ],
    instructions: [
      'Prepare um creme leve de chocolate que não endureça totalmente.',
      'Coloque o recheio no centro do ovo.',
      'Sele com uma tampa de chocolate temperado.',
      'Mantenha refrigerado até o consumo.'
    ],
    tip: 'O segredo é a proporção de líquidos para manter a fluidez.',
    cost: 16.00,
    suggestedPrice: 55.00,
    profitMargin: 71
  },
  {
    id: '15',
    name: 'Ovo Mesclado',
    category: 'Clássico',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600',
    icon: '🌓',
    description: 'O melhor dos dois mundos: chocolate branco e ao leite em um desenho artístico.',
    yield: '1 ovo de 200g',
    difficulty: 'Médio',
    time: '1h + 2h geladeira',
    validity: '30 dias',
    ingredients: [
      { item: 'Chocolate branco', amount: '100g' },
      { item: 'Chocolate ao leite', amount: '100g' }
    ],
    instructions: [
      'Tempere os dois chocolates separadamente.',
      'Faça riscos com o chocolate branco na forma.',
      'Cubra com o chocolate ao leite.',
      'O resultado é uma casca marmorizada única.'
    ],
    tip: 'Use um pincel fino para fazer desenhos mais detalhados.',
    cost: 14.00,
    suggestedPrice: 45.00,
    profitMargin: 69
  },
  {
    id: '16',
    name: 'Ovo Infantil Confetes',
    category: 'Infantil',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600',
    icon: '🌈',
    description: 'A alegria das crianças. Muito colorido e chocolate ao leite de alta qualidade.',
    yield: '1 ovo de 150g',
    difficulty: 'Fácil',
    time: '45 min + 1h geladeira',
    validity: '30 dias',
    ingredients: [
      { item: 'Chocolate ao leite', amount: '120g' },
      { item: 'Confetes coloridos', amount: '30g' }
    ],
    instructions: [
      'Prepare a casca de chocolate ao leite.',
      'Coloque os confetes dentro do ovo antes de fechar.',
      'Pode também colar alguns confetes na casca com chocolate derretido.'
    ],
    tip: 'Use embalagens temáticas de personagens para atrair mais as crianças.',
    cost: 10.00,
    suggestedPrice: 32.00,
    profitMargin: 68
  },
  {
    id: '17',
    name: 'Ovo Unicórnio',
    category: 'Infantil',
    image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=600',
    icon: '🦄',
    description: 'Mágico e colorido. Chocolate branco tingido em tons pastéis com chifre dourado.',
    yield: '1 ovo de 200g',
    difficulty: 'Avançado',
    time: '2h + 3h geladeira',
    validity: '15 dias',
    ingredients: [
      { item: 'Chocolate branco', amount: '200g' },
      { item: 'Corante lipossolúvel (rosa, azul)', amount: 'gotas' },
      { item: 'Pasta americana para detalhes', amount: '20g' }
    ],
    instructions: [
      'Tinja o chocolate branco em cores diferentes.',
      'Faça camadas coloridas na forma.',
      'Modele o chifre e orelhas com pasta americana.',
      'Pinte o chifre com pó dourado comestível.'
    ],
    tip: 'Use apenas corantes próprios para chocolate (lipossolúveis).',
    cost: 22.00,
    suggestedPrice: 75.00,
    profitMargin: 70
  },
  {
    id: '18',
    name: 'Ovo de Colher Ninho com Morango',
    category: 'Infantil',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600',
    icon: '🍓',
    description: 'O queridinho de todas as idades. Leite Ninho cremoso com morangos frescos.',
    yield: '1 ovo de 300g',
    difficulty: 'Fácil',
    time: '1h + 2h geladeira',
    validity: '2 dias (devido ao morango fresco)',
    ingredients: [
      { item: 'Leite Ninho', amount: '50g' },
      { item: 'Leite condensado', amount: '1 lata' },
      { item: 'Morangos frescos', amount: '5 unidades' },
      { item: 'Chocolate ao leite', amount: '150g' }
    ],
    instructions: [
      'Faça um brigadeiro de Ninho.',
      'Recheie a casca intercalando creme e morangos picados.',
      'Finalize com um morango inteiro e polvilhe Ninho.'
    ],
    tip: 'Seque bem os morangos após lavar para não soltar água no recheio.',
    cost: 20.00,
    suggestedPrice: 65.00,
    profitMargin: 69
  },
  {
    id: '19',
    name: 'Ovo com Surpresa',
    category: 'Infantil',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=600',
    icon: '🎁',
    description: 'Ovo de chocolate ao leite que esconde um brinquedo especial em seu interior.',
    yield: '1 ovo de 200g',
    difficulty: 'Fácil',
    time: '1h + 2h geladeira',
    validity: '30 dias',
    ingredients: [
      { item: 'Chocolate ao leite', amount: '200g' },
      { item: 'Brinquedo pequeno certificado', amount: '1 unidade' }
    ],
    instructions: [
      'Prepare as duas metades do ovo.',
      'Higienize o brinquedo e embale em plástico filme.',
      'Coloque o brinquedo dentro e feche o ovo com chocolate derretido.'
    ],
    tip: 'Certifique-se de que o brinquedo é seguro para a idade da criança.',
    cost: 15.00,
    suggestedPrice: 48.00,
    profitMargin: 68
  },
  {
    id: '20',
    name: 'Ovo Amendoim Crocante',
    category: 'Infantil',
    image: 'https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=600',
    icon: '🥜',
    description: 'Chocolate ao leite com pedaços de amendoim torrado, estilo "Dadinho".',
    yield: '1 ovo de 200g',
    difficulty: 'Fácil',
    time: '1h + 2h geladeira',
    validity: '30 dias',
    ingredients: [
      { item: 'Amendoim torrado e moído', amount: '50g' },
      { item: 'Chocolate ao leite', amount: '150g' }
    ],
    instructions: [
      'Misture o amendoim no chocolate temperado.',
      'Molde as cascas normalmente.',
      'O amendoim dará uma textura crocante deliciosa.'
    ],
    tip: 'Pode adicionar um pouco de pasta de amendoim ao chocolate para mais sabor.',
    cost: 12.00,
    suggestedPrice: 38.00,
    profitMargin: 68
  },
  {
    id: '21',
    name: 'Ovo Diet 70% Cacau',
    category: 'Diet',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600',
    icon: '🖤',
    description: 'Sabor intenso sem açúcar. Ideal para diabéticos ou dietas restritivas.',
    yield: '1 ovo de 200g',
    difficulty: 'Médio',
    time: '1h + 3h geladeira',
    validity: '30 dias',
    ingredients: [
      { item: 'Chocolate 70% cacau zero açúcar', amount: '200g' }
    ],
    instructions: [
      'Derreta o chocolate diet com atenção redobrada à temperatura.',
      'Tempere conforme indicação do fabricante (geralmente 28°C).',
      'Molde as cascas e leve à geladeira.'
    ],
    tip: 'Chocolates diet costumam ser mais viscosos, trabalhe rápido.',
    cost: 28.00,
    suggestedPrice: 75.00,
    profitMargin: 62
  },
  {
    id: '22',
    name: 'Ovo Zero Açúcar Coco',
    category: 'Diet',
    image: 'https://images.unsplash.com/photo-1590080876351-941f369806db?w=600',
    icon: '🌴',
    description: 'Casca diet recheada com cocada cremosa feita com adoçante culinário.',
    yield: '1 ovo de 200g',
    difficulty: 'Médio',
    time: '1h 30min + 3h geladeira',
    validity: '7 dias',
    ingredients: [
      { item: 'Chocolate ao leite diet', amount: '150g' },
      { item: 'Coco ralado sem açúcar', amount: '40g' },
      { item: 'Leite de coco light', amount: '50ml' },
      { item: 'Adoçante xilitol', amount: '20g' }
    ],
    instructions: [
      'Cozinhe o coco com leite de coco e xilitol até dar ponto.',
      'Prepare a casca de chocolate diet.',
      'Recheie e feche.'
    ],
    tip: 'O xilitol é o melhor adoçante para não deixar retrogosto amargo.',
    cost: 25.00,
    suggestedPrice: 72.00,
    profitMargin: 65
  },
  {
    id: '23',
    name: 'Ovo Vegano Amargo com Nibs',
    category: 'Diet',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600',
    icon: '🌿',
    description: 'Livre de produtos de origem animal. Chocolate amargo com nibs de cacau para crocância.',
    yield: '1 ovo de 200g',
    difficulty: 'Fácil',
    time: '1h + 2h geladeira',
    validity: '45 dias',
    ingredients: [
      { item: 'Chocolate amargo vegano', amount: '180g' },
      { item: 'Nibs de cacau', amount: '20g' }
    ],
    instructions: [
      'Tempere o chocolate amargo.',
      'Misture os nibs de cacau.',
      'Molde as cascas.',
      'Embale em papel kraft para um visual natural.'
    ],
    tip: 'Verifique se o chocolate não contém traços de leite na embalagem.',
    cost: 22.00,
    suggestedPrice: 65.00,
    profitMargin: 66
  },
  {
    id: '24',
    name: 'Ovo Sem Lactose Leite Vegetal',
    category: 'Diet',
    image: 'https://images.unsplash.com/photo-1619634290736-6d5772c7de00?w=600',
    icon: '🥛',
    description: 'Sabor de chocolate ao leite tradicional, mas feito com leite de arroz ou coco.',
    yield: '1 ovo de 200g',
    difficulty: 'Médio',
    time: '1h + 2h geladeira',
    validity: '30 dias',
    ingredients: [
      { item: 'Chocolate ao leite sem lactose', amount: '200g' }
    ],
    instructions: [
      'Trabalhe a temperagem com cuidado, pois a gordura vegetal reage diferente.',
      'Molde as cascas em camadas finas.',
      'Desenforme assim que a forma opacar.'
    ],
    tip: 'Ideal para alérgicos à proteína do leite de vaca (APLV).',
    cost: 24.00,
    suggestedPrice: 68.00,
    profitMargin: 64
  },
  {
    id: '25',
    name: 'Ovo de Colher Fit Amendoim',
    category: 'Diet',
    image: 'https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=600',
    icon: '💪',
    description: 'Para quem não quer sair da dieta. Recheio de pasta de amendoim integral e whey protein.',
    yield: '1 ovo de 300g',
    difficulty: 'Fácil',
    time: '1h + 2h geladeira',
    validity: '10 dias',
    ingredients: [
      { item: 'Chocolate 70% cacau', amount: '150g' },
      { item: 'Pasta de amendoim integral', amount: '100g' },
      { item: 'Whey protein de chocolate', amount: '30g' }
    ],
    instructions: [
      'Misture a pasta de amendoim com o whey até ficar homogêneo.',
      'Prepare a casca de chocolate 70%.',
      'Recheie e decore com amendoins inteiros.'
    ],
    tip: 'Adicione um pouco de água ou leite vegetal se o recheio ficar muito firme.',
    cost: 26.00,
    suggestedPrice: 78.00,
    profitMargin: 66
  }
];
