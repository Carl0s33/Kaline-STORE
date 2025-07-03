import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProdutos } from '@/contexts/ContextoProduto';
import { Botao } from '@/components/ui/botao';
import { GrupoRadio, ItemGrupoRadio } from '@/components/ui/grupo-radio';
import { Label } from '@/components/ui/rotulo';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, CheckCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificacao } from "@/components/ui/useNotificacao";
import LoadingSpinner from '@/components/SpinnerCarregamento';
import CartaoProduto from '@/components/CartaoProduto';

// página de detalhes do produto
// se o produto não carregar, já era
const ProductDetailPage = () => {
  // pega o id do produto da URL
  // se não tiver, já era
  const { productId } = useParams();
  const { getProductById, produtos } = useProdutos();
  const { notificar } = useNotificacao();

  // estado do produto
  // começa como null e só deus sabe quando vai carregar
  const [product, setProduct] = useState(null);
  // estados pra controlar o que o usuário selecionou
  // se não selecionar, o botão fica triste
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  // quantidade começa em 1
  // porque ninguém quer comprar 0 produtos, né?
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [productImages, setProductImages] = useState([]);

  // quando o componente carrega, busca o produto
  // se der erro, já era
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const fetchedProduct = await getProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setProductImages(getProductImages(fetchedProduct));
      }
      setIsLoading(false);
    };
    fetchProduct();
  }, [productId, getProductById]);

  const getProductImages = (product) => {
    const images = [];
    if (product?.image) images.push(product.image);
    if (product?.image2) images.push(product.image2);
    if (product?.image3) images.push(product.image3);
    if (product?.image4) images.push(product.image4);
    return images;
  };

  // função que adiciona o produto ao carrinho
  // se faltar algo, o usuário fica puto
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      notificar('Por favor, selecione tamanho e cor.', 'erro');
      return;
    }
    notificar('Produto adicionado ao carrinho!', 'sucesso');
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    setIsImageLoaded(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
    setIsImageLoaded(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
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
