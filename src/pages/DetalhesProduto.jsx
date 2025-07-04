// imports obrigatorios que todo mundo copia e cola
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // pra navegar e pegar parametros
import { useProdutos } from '@/contexts/ContextoProduto'; // contexto dos produtos
import { Botao } from '@/components/ui/botao'; // botao generico
import { GrupoRadio, ItemGrupoRadio } from '@/components/ui/grupo-radio'; // botoes de opcao
import { Label } from '@/components/ui/rotulo'; // rotulo bonitinho
// icones do lucide que todo mundo usa
import { ChevronLeft, ChevronRight, ShoppingCart, Star, CheckCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // animacoes inuteis
import { useNotificacao } from "@/components/ui/useNotificacao"; // notificacoes bonitas
import LoadingSpinner from '@/components/SpinnerCarregamento'; // spinner de loading
import CartaoProduto from '@/components/CartaoProduto'; // card do produto

// ==============================
// PAGINA DE DETALHES DO PRODUTO
// ==============================
// mostra os detalhes de um produto
// se nao carregar, azar o seu
const ProductDetailPage = () => {
  // pega o id do produto da URL
  // se nao tiver, ferrou
  // #404 #paginaNaoEncontrada
  const { productId } = useParams();
  const { getProductById, produtos } = useProdutos();
  const { notificar } = useNotificacao();

  // estado do produto
  // comeca como null e so deus sabe quando vai carregar
  // #loadingInfinito #vaiSaber
  const [product, setProduct] = useState(null);
  // estados pra controlar o que o usuario selecionou
  // se nao selecionar, o botao fica triste
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  // quantidade comeca em 1
  // porque ninguem quer comprar 0 produtos, ne?

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [productImages, setProductImages] = useState([]);

  // quando o componente carrega, busca o produto
  // se der erro, ja era
 
  // efeito que roda quando o id do produto muda
  // ou quando o getProductById muda (spoiler: nunca muda)
  useEffect(() => {
    // funcao assincrona que busca o produto
    // se der erro, foda-se
    const fetchProduct = async () => {
      setIsLoading(true); // ativa o loading
      const fetchedProduct = await getProductById(productId); // busca o produto
      if (fetchedProduct) {
        // se achou o produto, atualiza o estado
        setProduct(fetchedProduct);
        // pega as imagens do produto
        // que as vezes nao existem
        setProductImages(getProductImages(fetchedProduct));
      }
      // desativa o loading, independente de ter dado certo ou nao

      setIsLoading(false);
    };
    // chama a funcao
    // sem try/catch porque somos corajosos
    fetchProduct();
  }, [productId, getProductById]); // depende do id do produto e da funcao getProductById

  // pega todas as imagens do produto
  // se tiver, claro
  const getProductImages = (product) => {
    const images = []; // array vazio
    // adiciona cada imagem que existir
    // optional chaining pra nao dar erro
    if (product?.image) images.push(product.image);
    if (product?.image2) images.push(product.image2);
    if (product?.image3) images.push(product.image3);
    if (product?.image4) images.push(product.image4);
    // retorna o array de imagens
    // pode voltar vazio, mas quem liga?
    return images;
  };

  // funcao que adiciona o produto ao carrinho
  // se faltar algo, o usuario fica puto
  const handleAddToCart = () => {
    // verifica se o usuario selecionou tamanho e cor
    // se nao selecionou, mostra um erro
    if (!selectedSize || !selectedColor) {
      notificar('Por favor, selecione tamanho e cor.', 'erro');
      return; // sai da funcao
    }
    // se chegou aqui, é porque ta tudo certo
    // mostra mensagem de sucesso
    // (mas nao adiciona de verdade no carrinho, claro)
    notificar('Produto adicionado ao carrinho!', 'sucesso');
  };

  // funcao que é chamada quando a imagem termina de carregar
  // so pra mostrar que ta carregado mesmo
  const handleImageLoad = () => {
    setIsImageLoaded(true); // imagem carregou
  };

  // vai pra proxima imagem
  // se chegar no fim, volta pro comeco
  const nextImage = () => {
    // pega o indice atual, soma 1 e faz modulo pelo tamanho do array
    // isso faz voltar pro comeco quando chegar no fim
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    // reseta o estado de carregamento
    setIsImageLoaded(false);
  };

  // vai pra imagem anterior
  // se estiver na primeira, vai pra ultima
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      // se for o primeiro, vai pro ultimo
      // senao, vai pro anterior
      prev === 0 ? productImages.length - 1 : prev - 1
    );
    // reseta o estado de carregamento
    setIsImageLoaded(false);
  };

  // se estiver carregando, mostra o spinner
  // porque o usuario adora esperar
  if (isLoading) {
    return <LoadingSpinner />; // spinner bonitinho
  }

  if (!product) {
    return <div className="text-center text-red-500">Produto não encontrado.</div>;
  }

  return (
    <div className="div-container div-espacada">
      <div className="div-espacada">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagens do Produto */}
          <div className="relative">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIndex}
                src={productImages[currentImageIndex]}
                alt={`Imagem ${currentImageIndex + 1}`}
                className="w-full h-auto rounded-2xl object-cover shadow"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: isImageLoaded ? 1 : 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onLoad={handleImageLoad}
              />
            </AnimatePresence>

            {/* Navegação de imagens */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-0 p-2 bg-white rounded-full shadow -translate-y-1/2"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-0 p-2 bg-white rounded-full shadow -translate-y-1/2"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Detalhes do Produto */}
          <div className="div-espacada">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl text-green-600 font-semibold">R$ {Number(product.price)?.toFixed(2)}</p>

            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" />
              <span>{product.rating ?? '4.5'}</span>
              <span className="text-sm text-gray-500">(200 avaliações)</span>
            </div>

            {/* Tamanhos */}
            <div>
              <Label>Tamanho</Label>
              <GrupoRadio
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex gap-2 mt-1"
              >
                {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  product.sizes.map((size) => (
                    <ItemGrupoRadio key={size} value={size}>
                      {size}
                    </ItemGrupoRadio>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Sem tamanhos disponíveis</span>
                )}
              </GrupoRadio>
            </div>

            {/* Cores */}
            <div>
              <Label>Cor</Label>
              <GrupoRadio
                value={selectedColor}
                onValueChange={setSelectedColor}
                className="flex gap-2 mt-1"
              >
                {['Preto', 'Branco', 'Azul'].map((color) => (
                  <ItemGrupoRadio key={color} value={color}>
                    {color}
                  </ItemGrupoRadio>
                ))}
              </GrupoRadio>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-4">
              <Botao onClick={handleAddToCart}>
                <ShoppingCart className="mr-2" size={18} />
                Adicionar ao carrinho
              </Botao>
              <button onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={isFavorite ? 'text-red-500' : 'text-gray-400'} />
              </button>
            </div>

            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>

        {/* Produtos relacionados */}
        <div className="div-espacada">
          <h2 className="text-2xl font-semibold mb-4">Produtos Relacionados</h2>
          <div className="div-espacada">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {produtos.slice(0, 4).map((produtoRelacionado) => (
                <CartaoProduto key={produtoRelacionado.id} product={produtoRelacionado} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
