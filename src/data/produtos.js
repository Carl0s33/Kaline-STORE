// LOG DE CURADORIA (2025-06-03 14:14):
// - O catálogo de produtos foi atualizado para incluir produtos de marcas famosas.
// - O produto com id '3' (Saia Longa Godê Amaro) continua sendo o destaque principal.
// Esta decisão reflete a curadoria atual do vendedor.

// Função utilitária para converter URLs para base64 (usado apenas durante a inicialização)
async function urlToBase64(url) {
  try {
    // Se já for base64, retorna a própria string
    if (url && url.startsWith('data:image')) {
      return url;
    }
    
    // Se não for uma URL válida, retorna uma imagem padrão
    if (!url || !url.startsWith('http')) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48cGF0aCBkPSJNODQgMTI3TDY0IDEwN0w0NCAxMjciIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2klLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTUyIDY0TDEzMiA0NEwxMTIgNjQiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2klLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTI4IDEyOEwxMDAgMTAwTDcyIDEyOCIgc3Ryb2klPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2klLWxpbmVqb2luPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNTAiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2klLXdpZHRoPSI2Ii8+PC9zdmc+';
    }
    
    // Fetch da imagem e conversão para base64
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao converter URL para base64:', error);
    return '/placeholder.jpg';
  }
};

// Inicialização dos produtos com URLs
const produtos = [
  {
    "id": "3",
    "name": "Saia Longa Godê em Viscose",
    "price": "R$ 219,90",
    "category": "Saias",
    "image": "https://images.tcdn.com.br/img/img_prod/413300/saia_gode_holly_sb28836_terracota_119017_1_19105192fa87b0f2a840c0e285f66fad.jpg",
    "description": "Saia longa com corte godê em viscose leve, cintura alta e zíper invisível nas costas. Caimento fluido para looks elegantes do dia à noite.",
    "rating": 4.8,
    "reviews": 145,
    "sizes": [
      "P",
      "M",
      "G",
      "GG"
    ],
    "colors": [
      "Terracota"
    ],
    "details": [
      "Modelagem godê",
      "Cintura alta",
      "Fechamento por zíper invisível",
      "Material premium",
      "Caimento fluido"
    ],
    "inStock": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-06-03T14:14:00Z"
  },
  {
    "id": "4",
    "name": "Tênis Casual Branco Classic",
    "price": "R$ 389,90",
    "category": "Calçados",
    "image": "https://img.ltwebstatic.com/images3_spmp/2024/10/23/35/172968692664981f8046e6b356840e19d69e2d28dc_thumbnail_900x.jpg",
    "description": "Tênis casual em couro branco com entressola amortecida. Conforto e estilo para o dia a dia ou passeios de fim de semana.",
    "rating": 4.9,
    "reviews": 325,
    "sizes": [
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    "colors": [
      "Branco"
    ],
    "details": [
      "Cabedal em couro",
      "Entressola com amortecimento Nike Air",
      "Solado de borracha",
      "Perfurações na parte frontal para ventilação"
    ],
    "inStock": true,
    "createdAt": "2025-02-10T09:45:00Z",
    "updatedAt": "2025-06-01T11:30:00Z"
  },
  {
    "id": "2",
    "name": "Calça Jeans Skinny Stretch",
    "price": "R$ 239,90",
    "category": "Calças",
    "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    "description": "Calça jeans skinny com elastano, lavagem média e acabamento levemente desgastado. Valoriza a silhueta sem perder o conforto.",
    "rating": 4.7,
    "reviews": 287,
    "sizes": [
      "38",
      "40",
      "42",
      "44",
      "46",
      "48"
    ],
    "colors": [
      "Azul Médio",
      "Azul Escuro",
      "Preto"
    ],
    "details": [
      "Modelagem reta",
      "Fechamento por botões",
      "Cinco bolsos",
      "100% algodão",
      "Lavagem média"
    ],
    "inStock": true,
    "createdAt": "2025-03-05T14:20:00Z",
    "updatedAt": "2025-05-28T16:40:00Z"
  },
  {
    "id": "6",
    "name": "Camiseta Básica DryFit",
    "price": "R$ 79,90",
    "category": "Camisetas",
    "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    "description": "Camiseta em tecido DryFit que absorve o suor e mantém o corpo seco. Ideal para treinos ou composições casuais.",
    "rating": 4.5,
    "reviews": 210,
    "sizes": [
      "PP",
      "P",
      "M",
      "G",
      "GG",
      "XG"
    ],
    "colors": [
      "Branco",
      "Preto",
      "Vermelho",
      "Azul"
    ],
    "details": [
      "100% algodão",
      "Gola redonda",
      "Corte regular",
      "Tecido macio"
    ],
    "inStock": true,
    "createdAt": "2025-01-25T10:15:00Z",
    "updatedAt": "2025-05-30T09:20:00Z"
  },
  {
    "id": "1",
    "name": "Blusa Feminina Manga Bufante",
    "price": "R$ 129,90",
    "category": "Camisetas",
    "image": "https://images.tcdn.com.br/img/img_prod/1147112/camiseta_feminina_branca_lisa_100_algodao_317_2_818b8de642e217db7261e0125c75628a.jpg",
    "description": "Blusa feminina com mangas bufantes e tecido leve. Perfeita para combinar com jeans ou saias em ocasiões diversas.",
    "rating": 4.8,
    "reviews": 176,
    "sizes": [
      "P",
      "M",
      "G",
      "GG"
    ],
    "colors": [
      "Estampado"
    ],
    "details": [
      "Estampa exclusiva",
      "Modelagem midi",
      "Mangas bufantes",
      "Decote em V",
      "Fechamento por botões frontais"
    ],
    "inStock": true,
    "createdAt": "2025-04-10T11:30:00Z",
    "updatedAt": "2025-06-02T13:45:00Z"
  },
 
  {
    "id": "8",
    "name": "Bolsa Transversal Matelassê Couro",
    "price": "R$ 499,90",
    "category": "Bolsas",
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
    "description": "Bolsa transversal em couro matelassê com alça ajustável e ferragens douradas. Elegância atemporal para completar o look.",
    "rating": 4.9,
    "reviews": 98,
    "sizes": [
      "Único"
    ],
    "colors": [
      "Preto",
      "Bege",
      "Vermelho"
    ],
    "details": [
      "Couro matelassê",
      "Fecho duplo",
      "Alça ajustável",
      "Interior com bolso",
      "Ferragens douradas"
    ],
    "inStock": true,
    "createdAt": "2025-03-15T16:40:00Z",
    "updatedAt": "2025-05-25T15:20:00Z"
  },
  {
    "id": "9",
    "name": "Smartwatch Fitness Pro",
    "price": "R$ 1.299,00",
    "category": "Acessórios",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    "description": "Smartwatch com monitoramento de saúde, GPS integrado e resistência à água. Seu parceiro ideal para atividades físicas.",
    "rating": 4.8,
    "reviews": 245,
    "sizes": [
      "41mm",
      "45mm"
    ],
    "colors": [
      "Preto",
      "Prata",
      "Vermelho"
    ],
    "details": [
      "Tela Retina Always-On",
      "Monitoramento de ECG",
      "Sensor de oxigênio no sangue",
      "Detecção de quedas",
      "Resistente à água"
    ],
    "inStock": true,
    "createdAt": "2025-02-20T09:30:00Z",
    "updatedAt": "2025-05-29T14:15:00Z"
  },
  {
    "id": "10",
    "name": "Jaqueta Jeans Oversized Vintage",
    "price": "R$ 259,90",
    "category": "Jaquetas",
    "image": "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "description": "Jaqueta jeans oversized com lavagem vintage e detalhes desfiados. Aposta certeira para um visual urbano descolado.",
    "rating": 4.6,
    "reviews": 134,
    "sizes": [
      "P",
      "M",
      "G",
      "GG"
    ],
    "colors": [
      "Jeans Claro"
    ],
    "details": [
      "Modelagem oversized",
      "Fechamento por botões",
      "Bolsos frontais",
      "Acabamento desfiado",
      "100% algodão"
    ],
    "inStock": true,
    "createdAt": "2025-01-30T13:25:00Z",
    "updatedAt": "2025-05-27T10:40:00Z"
  }
];

// Função para processar produtos com imagens em base64
async function inicializarProdutosComImagensBase64() {
  // Cria uma cópia profunda dos produtos
  const produtosWithBase64 = JSON.parse(JSON.stringify(produtos));
  
  // Converte todas as imagens para base64
  for (let i = 0; i < produtosWithBase64.length; i++) {
    if (produtosWithBase64[i].image) {
      produtosWithBase64[i].image = await urlToBase64(produtosWithBase64[i].image);
    }
  }
  
  return produtosWithBase64;
};

export { inicializarProdutosComImagensBase64 };
export default produtos;
