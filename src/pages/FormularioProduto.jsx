import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Botao } from '@/components/ui/botao';
import { Entrada } from '@/components/ui/entrada';
import { Label } from '@/components/ui/rotulo';
import { AreaTexto } from '@/components/ui/area-texto'; 

// ========================================
// PÁGINA DE FORMULÁRIO DE PRODUTO
// Onde você tenta vender seu produto
// (ou editar, se for o caso)
// ========================================
const FormularioProdutoPage = () => {
  // ===== HOOKS E PARÂMETROS =====
  // (a parte chata que todo mundo ignora)
  
  // Pega o ID do produto da URL (se tiver)
  const { produtoId } = useParams();
  
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  
  // Funções para manipular produtos (adicionar, atualizar, etc)
  const { addProduto, updateProduto, getProdutoById } = useProdutos();
  
  // Hook para mostrar notificações (aqueles popups chatos, mas úteis)
  const { notificar } = useNotificacao();

  // ===== ESTADOS =====
  // (a parte que faz o React ser React)
  
  // Se tiver um ID na URL, é edição. Se não, é criação de produto novo
  // Simples assim, sem firula
  const isEditing = Boolean(produtoId);
  
  // Aqui guarda tudo que o usuário digitar
  // Se sumir, chora (mas não esquece de fazer backup antes)
  const [formData, setFormData] = useState({
    name: '',           // Nome do produto (obrigatório, senão vira 'Sem Nome')
    description: '',     // Descrição do produto (aqui pode colocar até poesia)
    price: '',           // Preço (o motivo do seu sucesso ou fracasso)
    image: '',           // URL da imagem (sem imagem, vende não)
    category: '',        // Categoria (pra organizar a bagunça)
    sizes: '',           // Tamanhos (separados por vírgula, ex: P,M,G,GG)
    colors: '',          // Cores (separadas por vírgula, ex: Vermelho,Azul,Verde)
  });
  
  // Estado de carregamento (aquela rodinha que gira)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== USE EFFECT =====
  // (o terror dos devs iniciantes)
  // Se mexer aqui, reza pra não quebrar nada
  useEffect(() => {
    // Se estiver editando um produto existente
    if (isEditing && produtoId) {
      // Pega o produto pelo ID (se existir)
      const produtoToEdit = getProdutoById(produtoId);
      
      // Se encontrou o produto, preenche o formulário
      if (produtoToEdit) {
        setFormData({
          name: produtoToEdit.name || '',  // Nome do produto (ou string vazia se não tiver)
          description: produtoToEdit.description || '',  // Descrição (ou string vazia)
          price: produtoToEdit.price ? 
            produtoToEdit.price.replace('R$ ', '').replace(',', '.') : '',  // Formata o preço
          image: produtoToEdit.image || '',  // URL da imagem (ou string vazia)
          category: produtoToEdit.category || '',  // Categoria (ou string vazia)
          sizes: produtoToEdit.sizes ? produtoToEdit.sizes.join(', ') : '',  // Tamanhos separados por vírgula
          colors: produtoToEdit.colors ? produtoToEdit.colors.join(', ') : '',  // Cores separadas por vírgula
        });
      } else {
        // Se não encontrou o produto, mostra mensagem de erro e redireciona
        notificar({ 
          title: "Opa, deu ruim!", 
          description: "Produto não encontrado. Vamos te levar de volta pra lista.", 
          variant: "destructive" 
        });
        navigate('/vendedor/produtos');
      }
    } else {
      // Caso esteja criando um novo produto, verifica se existe imagem temporária no localStorage
      const tempImage = localStorage.getItem('temp_product_image');
      if (tempImage && tempImage.startsWith('data:image')) {
        setFormData(prev => ({ ...prev, image: tempImage }));
      }
    }

    // Limpa a imagem temporária quando o componente for desmontado
    return () => {
      // Só limpa se estiver salvando o produto, caso contrário mantém para evitar perda
      if (formData.name && formData.price) {
        localStorage.removeItem('temp_product_image');
      }
    };
  }, [isEditing, produtoId, getProdutoById, navigate, notificar]);

  // toda vez que o usuário digitar algo
  // essa função é chamada e salva no estado
  // simples, mas se errar, fudeu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // quando o usuário clicar em salvar
  // essa função quebra o galho
  // se der erro, boa sorte achando o problema
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // validação básica pra não deixar o usuário fazer merda
    // se faltar nome, preço ou categoria, nem tenta
    if (!formData.name || !formData.price || !formData.category) {
        notificar({ title: "Campos Obrigatórios", description: "Nome, preço e categoria são obrigatórios.", variant: "destructive", duration: 3000 });
        setIsSubmitting(false);
        return;
    }
    
    // tenta converter o preço pra número
    // se não for número, já era
    const priceAsNumber = parseFloat(formData.price);
    if (isNaN(priceAsNumber) || priceAsNumber <= 0) {
         notificar({ title: "Preço Inválido", description: "Por favor, insira um preço válido.", variant: "destructive", duration: 3000 });
         setIsSubmitting(false);
         return;
    }

    // monta o objeto do produto com os dados do form
    // se faltar algo, já era
    const produtoData = {
      ...formData,
      price: `R$ ${priceAsNumber.toFixed(2).replace('.', ',')}`,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
    };

    // decide se vai atualizar ou adicionar
    // se der erro, boa sorte achando o problema
    let result;
    if (isEditing) {
      result = await updateProduto(produtoId, produtoData);
    } else {
      result = await addProduto(produtoData);
    }
    
    setIsSubmitting(false);
    // se deu certo, comemora
    // se não, chora e tenta de novo
    if (result && result.success) {
      // limpa a bagunça que ficou no localStorage
      // senão fica uma zona
      localStorage.removeItem('temp_product_image');
      navigate('/seller/produtos');
      
      // avisa o usuário que deu certo
      // porque né, feedback é tudo
      notificar({
        title: isEditing ? "Produto atualizado!" : "Produto adicionado!",
        description: `${formData.name} foi ${isEditing ? 'atualizado' : 'adicionado'} com sucesso.`,
        duration: 3000,
        className: "bg-green-500 text-white"
      });
    } else {
      // se deu erro, já era
      // o contexto já avisou o usuário
      // Poderia adicionar lógica adicional aqui se necessário, como não limpar o formulário
      console.error("Erro ao salvar o produto:", result?.error);
    } 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-8"
    >
      {/* cabeçalho bonitinho com botão de voltar */}
      {/* se clicar errado, volta pra página anterior */}
      <div className="flex items-center mb-6 sm:mb-8">
        <Botao variant="ghost" size="icon" onClick={() => navigate('/seller/produtos')} className="mr-2 text-brand-primary-kaline hover:bg-brand-primary-kaline/10">
          <ChevronLeft className="h-6 w-6" />
        </Botao>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline">
          {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h1>
      </div>

      {/* aqui é onde a mágica acontece */}
      {/* ou desanda, depende do dia */}
      <Cartao className="bg-brand-card-kaline dark:bg-card shadow-xl">
        <CabecalhoCartao className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* título do formulário */}
          {/* se não souber o que é, tá no lugar errado */}
          <div className="flex-1">
            <TituloCartao className="text-xl text-brand-text-kaline flex items-center">
              {isEditing ? <Save className="mr-2 h-5 w-5" /> : <PackagePlus className="mr-2 h-5 w-5" />}
              Detalhes do Produto
            </TituloCartao>
            {formData.name && (
              <p className="text-sm text-brand-text-muted-kaline mt-1">
                {isEditing ? 'Editando:' : 'Novo produto:'} <span className="font-medium">{formData.name}</span>
              </p>
            )}
          </div>
          {/* preview da imagem */}
          {/* se não carregar, azar */}
          {formData.image && (
            <div className="relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <img 
                src={formData.image} 
                alt={formData.name || "Imagem do produto"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Erro ao carregar imagem no cabeçalho');
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48cGF0aCBkPSJNODQgMTI3TDY0IDEwN0w0NCAxMjciIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTUyIDY0TDEzMiA0NEwxMTIgNjQiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTI4IDEyOEwxMDAgMTAwTDcyIDEyOCIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNTAiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSI2Ii8+PC9zdmc+';
                  
                  // Tenta recuperar do localStorage se estiver disponível
                  const savedImage = localStorage.getItem('temp_product_image');
                  if (savedImage && savedImage.startsWith('data:image')) {
                    setTimeout(() => {
                      e.target.src = savedImage;
                      // Atualiza o estado também
                      setFormData(prev => ({ ...prev, image: savedImage }));
                    }, 100);
                  }
                }}
              />
            </div>
          )}
        </CabecalhoCartao>
        {/* aqui é onde o usuário vai encher o saco */}
        {/* digitando coisas erradas e reclamando depois */}
        <form onSubmit={handleSubmit}>
          {/* campos do formulário */}
          {/* se faltar algum, já era */}
          <ConteudoCartao className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-brand-text-kaline">Nome do Produto*</Label>
              <Entrada id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Vestido Floral Moderno" required className="mt-1 bg-background dark:bg-input"/>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-brand-text-kaline">Descrição</Label>
              <AreaTexto id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Detalhes sobre o produto..." rows={4} className="mt-1 bg-background dark:bg-input"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="price" className="text-sm font-medium text-brand-text-kaline">Preço (R$)*</Label>
                <Entrada id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Ex: 199.90" required className="mt-1 bg-background dark:bg-input"/>
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-brand-text-kaline">Categoria*</Label>
                <Entrada id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Ex: Vestidos, Acessórios" required className="mt-1 bg-background dark:bg-input"/>
              </div>
            </div>
            <div>
  <Label htmlFor="image" className="text-sm font-medium text-brand-text-kaline">Imagem do Produto</Label>
  {/* upload de imagem */}
  {/* se o usuário mandar um arquivo de 50MB, já era */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
    <div>
      <div className="mb-2 p-2 border border-dashed border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800">
        <p className="text-xs text-gray-500 mb-1">A imagem será associada a: <strong className="text-brand-primary-kaline">{formData.name || 'Nome do Produto'}</strong></p>
        <Entrada
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              // Verifica o tamanho do arquivo (limita a 5MB)
              if (file.size > 5 * 1024 * 1024) {
                notificar({
                  title: "Arquivo muito grande",
                  description: "A imagem deve ter no máximo 5MB. Por favor, escolha uma imagem menor.",
                  variant: "destructive",
                  duration: 5000
                });
                return;
              }
              
              const reader = new FileReader();
              reader.onloadend = () => {
                try {
                  // Garante que a imagem seja salva em base64
                  const base64Data = reader.result;
                  
                  // Garante que seja base64 válido
                  if (base64Data && base64Data.startsWith('data:image')) {
                    // Atualiza o estado com a imagem em base64
                    setFormData(prev => {
                      const updated = { ...prev, image: base64Data };
                      
                      // Armazena temporariamente no localStorage para evitar perda
                      localStorage.setItem('temp_product_image', base64Data);
                      
                      return updated;
                    });
                    
                    notificar({
                      title: "Imagem associada ao produto",
                      description: `A imagem foi carregada com sucesso e será associada a "${formData.name || 'este produto'}" em todas as visualizações.`,
                      duration: 3000
                    });
                  } else {
                    throw new Error('Formato de imagem inválido');
                  }
                } catch (error) {
                  console.error('Erro ao processar imagem:', error);
                  notificar({
                    title: "Ops!",
                    description: "Não é você, sou eu ;(",
                    description: "Formato de imagem inválido ou corrompido. Tente novamente.",
                    variant: "destructive",
                    duration: 3000
                  });
                }
              };
              reader.onerror = () => {
                notificar({
                  title: "Ops!",
                  description: "Não é você, sou eu ;(",
                  variant: "destructive",
                  duration: 3000
                });
              };
              reader.readAsDataURL(file);
            }
          }}
          className="bg-background dark:bg-input"
        />
        <p className="text-xs text-brand-text-muted-kaline mt-1">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
      </div>
    </div>
    <div className="flex items-center justify-center border border-dashed border-input rounded-md p-2 h-32 bg-gray-50 dark:bg-gray-800">
      {formData.image ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={formData.image}
            alt="Prévia da Imagem"
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              console.error('Erro ao carregar imagem de prévia');
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48cGF0aCBkPSJNODQgMTI3TDY0IDEwN0w0NCAxMjciIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTUyIDY0TDEzMiA0NEwxMTIgNjQiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTI4IDEyOEwxMDAgMTAwTDcyIDEyOCIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNTAiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSI2Ii8+PC9zdmc+';
            }}
          />
        </div>
      ) : (
        <div className="text-center text-brand-text-muted-kaline text-sm">
          <p>Prévia da imagem</p>
          <p className="text-xs">Nenhuma imagem selecionada</p>
        </div>
      )}
    </div>
  </div>
</div>
            <div>
              {/* se o usuário não souber o que é vírgula, já era */}
              <Label htmlFor="sizes" className="text-sm font-medium text-brand-text-kaline">Tamanhos (separados por vírgula)</Label>
              <Entrada id="sizes" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="Ex: P, M, G, GG" className="mt-1 bg-background dark:bg-input"/>
            </div>
            <div>
              {/* cores em português, por favor */}
              {/* se não souber o nome da cor, chuta um nome criativo */}
              <Label htmlFor="colors" className="text-sm font-medium text-brand-text-kaline">Cores (separadas por vírgula)</Label>
              <Entrada id="colors" name="colors" value={formData.colors} onChange={handleChange} placeholder="Ex: Rosa Floral, Azul Céu, Preto" className="mt-1 bg-background dark:bg-input"/>
            </div>
          </ConteudoCartao>
          {/* botão de salvar */}
          {/* se der erro, o usuário vai clicar mil vezes */}
          <RodapeCartao>
            {/* botão que fica desabilitado enquanto carrega */}
            {/* mas o usuário vai clicar mesmo assim */}
            <Botao type="submit" className="w-full btn-primary-kaline text-sm sm:text-base" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? 'Salvando Alterações...' : 'Adicionando Produto...') : (isEditing ? 'Salvar Alterações' : 'Adicionar Produto')}
            </Botao>
          </RodapeCartao>
        </form>
      </Cartao>
    </motion.div>
  );
};

export default FormularioProdutoPage;