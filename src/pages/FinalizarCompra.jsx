import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Botao } from '@/components/ui/botao';
import { Entrada } from '@/components/ui/entrada';
import { Label } from '@/components/ui/rotulo';
import { GrupoRadio, ItemGrupoRadio } from '@/components/ui/grupo-radio';
import { Cartao, ConteudoCartao, CabecalhoCartao, TituloCartao, RodapeCartao } from '@/components/ui/cartao-ui';
import { useNotificacao } from "@/components/ui/useNotificacao";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CreditCard, Landmark, QrCode, MapPin, Edit2, PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/ContextoAutenticacao';

// ==============================
// PÁGINA DE FINALIZAÇÃO
// ONDE O USUÁRIO DESISTE NO MEIO E A GENTE CHORA
// (mas finge que não liga)
// ==============================
const CheckoutPage = () => {
  const navigate = useNavigate();
  // Pega o usuário logado (ou não, vai que ele deu f5 no meio do caminho)
  const { user } = useAuth(); // Se não tiver usuário, já era
  const { notificar } = useNotificacao();

  // ===== ESTADOS =====
  // (a parte chata que todo componente React tem)
  
  // Itens do carrinho (que provavelmente vão pro limbo)
  const [cartItems, setCartItems] = useState([]);
  
  // Valor que dói no bolso (antes do frete)
  const [subtotal, setSubtotal] = useState(0);
  
  // Frete fixo porque somos preguiçosos pra calcular de verdade
  // (e também porque ninguém gosta de surpresas no checkout)
  const [shippingCost, setShippingCost] = useState(15.00);
  
  // Total = subtotal + frete (uau, que matemática avançada!)
  const [total, setTotal] = useState(0);

  // ===== CONTROLE DE PASSOS =====
  // (igual aqueles tutoriais que a gente nunca termina)
  // 1: Onde você mora (ou mente que mora)
  // 2: Como vai pagar (ou não vai, quem sabe)
  // 3: Hora do arrependimento (ops, revisão)
  const [currentStep, setCurrentStep] = useState(1);
  
  // ===== ENDEREÇOS =====
  // Lista de endereços (ou a desculpa que você dá pro motoboy quando atrasa)
  const [addresses, setAddresses] = useState([
    { 
      id: '1', 
      street: 'Rua das Flores, 123', 
      city: 'Cidade Exemplo', 
      state: 'EX', 
      zip: '12345-678', 
      country: 'Brasil', 
      isDefault: true 
    },
    { 
      id: '2', 
      street: 'Avenida Principal, 456', 
      city: 'Outra Cidade', 
      state: 'OC', 
      zip: '98765-432', 
      country: 'Brasil', 
      isDefault: false 
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'Brasil' });

  // ===== PAGAMENTO =====
  // Parte chata onde a gente finge que valida cartão
  // (mas aceitamos até cartão de crédito de banco imobiliário)
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  
  // Dados do cartão (que a gente jura que não vai vender no mercado negro)
  const [cardDetails, setCardDetails] = useState({ 
    number: '',  // Número do cartão (ou do cartão da mãe)
    name: '',    // Nome no cartão (ou qualquer um que você inventar)
    expiry: '',  // Validade (quando o cartão vira abóbora)
    cvv: ''      // Os 3 números mágicos atrás do cartão
  });

  // Quando o componente nasce, a gente tenta pegar o carrinho salvo
  // (ou finge que tenta, porque quem garante que vai ter algo lá?)
  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(carrinhoSalvo);

    // Fazendo contas de matemática avançada (multiplicação básica)
    const totalParcial = carrinhoSalvo.reduce((soma, item) => {
      const preco = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
      return soma + (preco * item.quantity);
    }, 0);
    
    setSubtotal(totalParcial); // Atualiza o subtotal (e o choro no coração)
  }, []);

  // Atualiza o total quando o subtotal ou frete mudarem
  // (matemágica pura aqui, nada de truques)
  useEffect(() => {
    setTotal(subtotal + shippingCost);
  }, [subtotal, shippingCost]);

  // valida o formulário
// se tiver algo errado, já era
const validateForm = () => {
    if (currentStep === 1 && !selectedAddressId) {
      notificar({ title: "Endereço Necessário", description: "Por favor, selecione ou adicione um endereço de entrega.", variant: "destructive", duration: 3000 });
      return;
    }
    if (currentStep === 2) {
      // Basic payment validation (very simplified)
      if (paymentMethod === 'creditCard' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) {
        notificar({ title: "Dados do Cartão Incompletos", description: "Preencha todos os campos do cartão.", variant: "destructive", duration: 3000 });
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => setCurrentStep(prev => prev - 1);

  // Função que adiciona um novo endereço
  // (ou tenta, pelo menos)
  const handleAddAddress = (e) => {
    e.preventDefault(); // Impece o formulário de dar refresh na página
    
    // Verifica se o usuário preencheu tudo direito (duvido)
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) {
      notificar({ 
        title: "Ei, falta coisa aí!", 
        description: "Preencha todos os campos, por favorzinho. A gente implora.", 
        variant: "destructive", 
        duration: 2000 
      });
      return; // Tchau, falou
    }
    const newAddr = { ...newAddress, id: Date.now().toString(), isDefault: addresses.length === 0 };
    setAddresses([...addresses, newAddr]);
    setSelectedAddressId(newAddr.id);
    setNewAddress({ street: '', city: '', state: '', zip: '', country: 'Brasil' });
    setShowAddAddressForm(false);
    notificar({ title: "Endereço Adicionado!", duration: 1500 });
  };

  const handleRemoveAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    if (selectedAddressId === addressId) {
      setSelectedAddressId(addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '');
    }
    notificar({ title: "Endereço Removido", variant: "destructive", duration: 1500 });
  };
  
  const handleCardEntradaChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').slice(0,5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0,3);
    }
    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
  };

  // Função que finaliza o pedido (ou tenta)
  const handleSubmitOrder = () => {
    // Limpa o carrinho (adeus, produtos queridos)
    localStorage.removeItem('cart');
    // Avisa pra todo mundo que o carrinho mudou (leia-se: foi pro saco)
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    notificar({
      title: "Pedido Realizado com Sucesso!",
      description: "Você receberá atualizações por e-mail.",
      className: "bg-green-500 text-white dark:bg-green-600",
      icon: <CheckCircle className="h-5 w-5 text-white" />,
      duration: 5000
    });
    navigate('/profile/orders'); 
  };

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

  const steps = ["Endereço", "Pagamento", "Revisão"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="div-container div-espacada"
    >
      <div className="flex items-center mb-6 sm:mb-8">
        {currentStep > 1 && (
          <Botao variant="ghost" size="icon" onClick={handlePrevStep} className="mr-2 text-brand-primary-kaline hover:bg-brand-primary-kaline/10">
            <ChevronLeft className="h-6 w-6" />
          </Botao>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline">Finalizar Compra</h1>
      </div>

     
      <div className="mb-8">
        <div className="flex justify-between mb-1">
          {steps.map((step, index) => (
            <span key={step} className={`text-xs sm:text-sm ${index + 1 <= currentStep ? 'text-brand-primary-kaline font-semibold' : 'text-brand-text-muted-kaline'}`}>
              {step}
            </span>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div 
            className="bg-brand-primary-kaline h-2 rounded-full"
            initial={{ width: "0%"}}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="div-espacada">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="address-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <Cartao className="div-destaque div-arredondada div-sombra">
                  <Cartao.Header>
                    <Cartao.Title className="text-xl sm:text-2xl text-brand-text-kaline">Endereço de Entrega</Cartao.Title>
                  </Cartao.Header>
                  <Cartao.Content className="space-y-4">
                    <GrupoRadio value={selectedAddressId} onValueChange={setSelectedAddressId} aria-label="Selecione o endereço de entrega">
                      {addresses.map(addr => (
                        <Label key={addr.id} htmlFor={`addr-${addr.id}`} className={`flex items-start p-3 border rounded-md cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-brand-primary-kaline ring-2 ring-brand-primary-kaline bg-brand-primary-kaline/5' : 'border-input hover:border-brand-primary-kaline/50'}`}>
                          <ItemGrupoRadio value={addr.id} id={`addr-${addr.id}`} className="mt-1 mr-3 border-brand-primary-kaline text-brand-primary-kaline focus:ring-brand-primary-kaline" />
                          <div className="flex-1">
                            <p className="font-medium text-sm sm:text-base text-brand-text-kaline">{addr.street}</p>
                            <p className="text-xs sm:text-sm text-brand-text-muted-kaline">{addr.city}, {addr.state} - {addr.zip}</p>
                          </div>
                          <Botao variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveAddress(addr.id); }} className="text-destructive hover:text-destructive/80 h-7 w-7 sm:h-8 sm:w-8 ml-2">
                            <Trash2 className="h-4 w-4" />
                          </Botao>
                        </Label>
                      ))}
                    </GrupoRadio>
                    <Botao variant="outline" onClick={() => setShowAddAddressForm(!showAddAddressForm)} className="w-full text-brand-primary-kaline border-brand-primary-kaline/50 hover:bg-brand-primary-kaline/10 text-sm">
                      <PlusCircle className="mr-2 h-4 w-4" /> {showAddAddressForm ? 'Cancelar Novo Endereço' : 'Adicionar Novo Endereço'}
                    </Botao>
                    {showAddAddressForm && (
                      <form onSubmit={handleAddAddress} className="space-y-3 pt-3 border-t border-border">
                        <Entrada placeholder="Rua, Número, Bairro" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="text-sm" />
                        <div className="grid grid-cols-2 gap-3">
                          <Entrada placeholder="Cidade" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="text-sm" />
                          <Entrada placeholder="Estado (UF)" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="text-sm" />
                        </div>
                        <Entrada placeholder="CEP" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="text-sm" />
                        <Botao type="submit" className="w-full btn-primary-kaline text-sm">Salvar Endereço</Botao>
                      </form>
                    )}
                  </Cartao.Content>
                </Cartao>
              </motion.div>
            )}

            
            {currentStep === 2 && (
              <motion.div key="payment-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <Cartao className="div-destaque div-arredondada div-sombra">
                  <Cartao.Header>
                    <Cartao.Title className="text-xl sm:text-2xl text-brand-text-kaline">Forma de Pagamento</Cartao.Title>
                  </Cartao.Header>
                  <Cartao.Content>
                    <GrupoRadio value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3" aria-label="Selecione a forma de pagamento">
                      {[
                        { value: 'creditCard', label: 'Cartão de Crédito', icon: CreditCard },
                        { value: 'boleto', label: 'Boleto Bancário', icon: Landmark },
                        { value: 'pix', label: 'PIX', icon: QrCode },
                      ].map(method => (
                        <Label key={method.value} htmlFor={`payment-${method.value}`} className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${paymentMethod === method.value ? 'border-brand-primary-kaline ring-2 ring-brand-primary-kaline bg-brand-primary-kaline/5' : 'border-input hover:border-brand-primary-kaline/50'}`}>
                          <ItemGrupoRadio value={method.value} id={`payment-${method.value}`} className="mr-3 border-brand-primary-kaline text-brand-primary-kaline focus:ring-brand-primary-kaline" />
                          <method.icon className="h-5 w-5 mr-2 text-brand-text-muted-kaline" />
                          <span className="text-sm sm:text-base text-brand-text-kaline">{method.label}</span>
                        </Label>
                      ))}
                    </GrupoRadio>
                    {paymentMethod === 'creditCard' && (
                      <div className="mt-4 space-y-3 pt-3 border-t border-border">
                        <Entrada name="number" placeholder="Número do Cartão (0000 0000 0000 0000)" value={cardDetails.number} onChange={handleCardEntradaChange} className="text-sm" />
                        <Entrada name="name" placeholder="Nome no Cartão" value={cardDetails.name} onChange={handleCardEntradaChange} className="text-sm" />
                        <div className="grid grid-cols-2 gap-3">
                          <Entrada name="expiry" placeholder="Validade (MM/AA)" value={cardDetails.expiry} onChange={handleCardEntradaChange} className="text-sm" />
                          <Entrada name="cvv" placeholder="CVV" value={cardDetails.cvv} onChange={handleCardEntradaChange} className="text-sm" />
                        </div>
                      </div>
                    )}
                    {paymentMethod === 'boleto' && <p className="mt-4 text-sm text-brand-text-muted-kaline">O boleto será gerado após a finalização do pedido.</p>}
                    {paymentMethod === 'pix' && <p className="mt-4 text-sm text-brand-text-muted-kaline">O QR Code para pagamento PIX será exibido após a finalização.</p>}
                  </Cartao.Content>
                </Cartao>
              </motion.div>
            )}

            
            {currentStep === 3 && (
              <motion.div key="review-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <Cartao className="div-destaque div-arredondada div-sombra">
                  <Cartao.Header>
                    <Cartao.Title className="text-xl sm:text-2xl text-brand-text-kaline">Revisar Pedido</Cartao.Title>
                  </Cartao.Header>
                  <Cartao.Content className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1 text-brand-text-kaline">Itens do Pedido:</h3>
                      {cartItems.map(item => (
                        <div key={item.id + item.size + item.color} className="flex justify-between items-center text-sm py-1 border-b border-border/50 last:border-b-0">
                          <span className="text-brand-text-muted-kaline">{item.name} (x{item.quantity})</span>
                          <span className="text-brand-text-kaline">R$ {(parseFloat(item.price.replace('R$ ', '').replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                      ))}
                    </div>
                    {selectedAddress && (
                      <div>
                        <h3 className="font-semibold mb-1 text-brand-text-kaline">Endereço de Entrega:</h3>
                        <p className="text-sm text-brand-text-muted-kaline">{selectedAddress.street}, {selectedAddress.city} - {selectedAddress.state}, {selectedAddress.zip}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold mb-1 text-brand-text-kaline">Forma de Pagamento:</h3>
                      <p className="text-sm text-brand-text-muted-kaline">
                        {paymentMethod === 'creditCard' && `Cartão de Crédito final ${cardDetails.number.slice(-4)}`}
                        {paymentMethod === 'boleto' && 'Boleto Bancário'}
                        {paymentMethod === 'pix' && 'PIX'}
                      </p>
                    </div>
                  </Cartao.Content>
                </Cartao>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          
          <div className="lg:col-span-1">
            <Cartao className="sticky top-24 div-destaque div-arredondada div-sombra shadow-lg">
              <Cartao.Header>
                <Cartao.Title className="text-xl sm:text-2xl text-brand-text-kaline">Resumo do Pedido</Cartao.Title>
              </Cartao.Header>
              <Cartao.Content className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-muted-kaline">Subtotal:</span>
                  <span className="text-brand-text-kaline">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-muted-kaline">Frete:</span>
                  <span className="text-brand-text-kaline">R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between font-semibold text-base sm:text-lg pt-2 border-t border-border">
                  <span className="text-brand-text-kaline">Total:</span>
                  <span className="text-brand-primary-kaline">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </Cartao.Content>
              <Cartao.Footer>
                {currentStep < 3 ? (
                  <Botao onClick={handleNextStep} className="w-full btn-primary-kaline text-sm sm:text-base">
                    {currentStep === 1 ? 'Continuar para Pagamento' : 'Revisar Pedido'}
                  </Botao>
                ) : (
                  <Botao onClick={handlePlaceOrder} className="w-full btn-primary-kaline bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                    Finalizar Pedido e Pagar
                  </Botao>
                )}
              </Cartao.Footer>
            </Cartao>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;