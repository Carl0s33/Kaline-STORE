import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { useToast } from "@/components/ui/use-toast";
    import { motion, AnimatePresence } from 'framer-motion';
    import { ChevronLeft, CreditCard, Landmark, QrCode, MapPin, Edit2, PlusCircle, Trash2, CheckCircle } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext';

    const CheckoutPage = () => {
      const { user } = useAuth();
      const navigate = useNavigate();
      const { toast } = useToast();

      const [cartItems, setCartItems] = useState([]);
      const [subtotal, setSubtotal] = useState(0);
      const [shippingCost, setShippingCost] = useState(15.00); // Mock shipping
      const [total, setTotal] = useState(0);

      const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
      
      // Address State
      const [addresses, setAddresses] = useState([
        { id: '1', street: 'Rua das Flores, 123', city: 'Cidade Exemplo', state: 'EX', zip: '12345-678', country: 'Brasil', isDefault: true },
        { id: '2', street: 'Avenida Principal, 456', city: 'Outra Cidade', state: 'OC', zip: '98765-432', country: 'Brasil', isDefault: false },
      ]);
      const [selectedAddressId, setSelectedAddressId] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '');
      const [showAddAddressForm, setShowAddAddressForm] = useState(false);
      const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'Brasil' });

      // Payment State
      const [paymentMethod, setPaymentMethod] = useState('creditCard');
      const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });

      useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(storedCart);

        const currentSubtotal = storedCart.reduce((sum, item) => {
          const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
          return sum + (price * item.quantity);
        }, 0);
        setSubtotal(currentSubtotal);
      }, []);

      useEffect(() => {
        setTotal(subtotal + shippingCost);
      }, [subtotal, shippingCost]);

      const handleNextStep = () => {
        if (currentStep === 1 && !selectedAddressId) {
          toast({ title: "Endereço Necessário", description: "Por favor, selecione ou adicione um endereço de entrega.", variant: "destructive", duration: 3000 });
          return;
        }
        if (currentStep === 2) {
          // Basic payment validation (very simplified)
          if (paymentMethod === 'creditCard' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) {
            toast({ title: "Dados do Cartão Incompletos", description: "Preencha todos os campos do cartão.", variant: "destructive", duration: 3000 });
            return;
          }
        }
        setCurrentStep(prev => prev + 1);
      };
      const handlePrevStep = () => setCurrentStep(prev => prev - 1);

      const handleAddAddress = (e) => {
        e.preventDefault();
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) {
          toast({ title: "Endereço Incompleto", description: "Preencha todos os campos do novo endereço.", variant: "destructive", duration: 2000 });
          return;
        }
        const newAddr = { ...newAddress, id: Date.now().toString(), isDefault: addresses.length === 0 };
        setAddresses([...addresses, newAddr]);
        setSelectedAddressId(newAddr.id);
        setNewAddress({ street: '', city: '', state: '', zip: '', country: 'Brasil' });
        setShowAddAddressForm(false);
        toast({ title: "Endereço Adicionado!", duration: 1500 });
      };

      const handleRemoveAddress = (addressId) => {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
        if (selectedAddressId === addressId) {
          setSelectedAddressId(addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '');
        }
        toast({ title: "Endereço Removido", variant: "destructive", duration: 1500 });
      };
      
      const handleCardInputChange = (e) => {
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

      const handlePlaceOrder = () => {
        // Simulate order placement
        localStorage.removeItem('cart'); // Clear cart
        window.dispatchEvent(new CustomEvent('cartUpdated')); // Notify other components
        toast({
          title: "Pedido Realizado com Sucesso!",
          description: "Você receberá atualizações por e-mail.",
          className: "bg-green-500 text-white dark:bg-green-600",
          icon: <CheckCircle className="h-5 w-5 text-white" />,
          duration: 5000
        });
        navigate('/profile/orders'); // Redirect to order history or a success page
      };

      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

      const steps = ["Endereço", "Pagamento", "Revisão"];

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8"
        >
          <div className="flex items-center mb-6 sm:mb-8">
            {currentStep > 1 && (
              <Button variant="ghost" size="icon" onClick={handlePrevStep} className="mr-2 text-brand-primary-kaline hover:bg-brand-primary-kaline/10">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline">Finalizar Compra</h1>
          </div>

          {/* Progress Bar */}
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

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Address */}
              <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="address-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <Card className="bg-brand-card-kaline dark:bg-card">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl text-brand-text-kaline">Endereço de Entrega</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} aria-label="Selecione o endereço de entrega">
                        {addresses.map(addr => (
                          <Label key={addr.id} htmlFor={`addr-${addr.id}`} className={`flex items-start p-3 border rounded-md cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-brand-primary-kaline ring-2 ring-brand-primary-kaline bg-brand-primary-kaline/5' : 'border-input hover:border-brand-primary-kaline/50'}`}>
                            <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="mt-1 mr-3 border-brand-primary-kaline text-brand-primary-kaline focus:ring-brand-primary-kaline" />
                            <div className="flex-1">
                              <p className="font-medium text-sm sm:text-base text-brand-text-kaline">{addr.street}</p>
                              <p className="text-xs sm:text-sm text-brand-text-muted-kaline">{addr.city}, {addr.state} - {addr.zip}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveAddress(addr.id); }} className="text-destructive hover:text-destructive/80 h-7 w-7 sm:h-8 sm:w-8 ml-2">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </Label>
                        ))}
                      </RadioGroup>
                      <Button variant="outline" onClick={() => setShowAddAddressForm(!showAddAddressForm)} className="w-full text-brand-primary-kaline border-brand-primary-kaline/50 hover:bg-brand-primary-kaline/10 text-sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> {showAddAddressForm ? 'Cancelar Novo Endereço' : 'Adicionar Novo Endereço'}
                      </Button>
                      {showAddAddressForm && (
                        <form onSubmit={handleAddAddress} className="space-y-3 pt-3 border-t border-border">
                          <Input placeholder="Rua, Número, Bairro" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="text-sm" />
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Cidade" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="text-sm" />
                            <Input placeholder="Estado (UF)" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="text-sm" />
                          </div>
                          <Input placeholder="CEP" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="text-sm" />
                          <Button type="submit" className="w-full btn-primary-kaline text-sm">Salvar Endereço</Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div key="payment-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <Card className="bg-brand-card-kaline dark:bg-card">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl text-brand-text-kaline">Forma de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3" aria-label="Selecione a forma de pagamento">
                        {[
                          { value: 'creditCard', label: 'Cartão de Crédito', icon: CreditCard },
                          { value: 'boleto', label: 'Boleto Bancário', icon: Landmark },
                          { value: 'pix', label: 'PIX', icon: QrCode },
                        ].map(method => (
                          <Label key={method.value} htmlFor={`payment-${method.value}`} className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${paymentMethod === method.value ? 'border-brand-primary-kaline ring-2 ring-brand-primary-kaline bg-brand-primary-kaline/5' : 'border-input hover:border-brand-primary-kaline/50'}`}>
                            <RadioGroupItem value={method.value} id={`payment-${method.value}`} className="mr-3 border-brand-primary-kaline text-brand-primary-kaline focus:ring-brand-primary-kaline" />
                            <method.icon className="h-5 w-5 mr-2 text-brand-text-muted-kaline" />
                            <span className="text-sm sm:text-base text-brand-text-kaline">{method.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                      {paymentMethod === 'creditCard' && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-border">
                          <Input name="number" placeholder="Número do Cartão (0000 0000 0000 0000)" value={cardDetails.number} onChange={handleCardInputChange} className="text-sm" />
                          <Input name="name" placeholder="Nome no Cartão" value={cardDetails.name} onChange={handleCardInputChange} className="text-sm" />
                          <div className="grid grid-cols-2 gap-3">
                            <Input name="expiry" placeholder="Validade (MM/AA)" value={cardDetails.expiry} onChange={handleCardInputChange} className="text-sm" />
                            <Input name="cvv" placeholder="CVV" value={cardDetails.cvv} onChange={handleCardInputChange} className="text-sm" />
                          </div>
                        </div>
                      )}
                      {paymentMethod === 'boleto' && <p className="mt-4 text-sm text-brand-text-muted-kaline">O boleto será gerado após a finalização do pedido.</p>}
                      {paymentMethod === 'pix' && <p className="mt-4 text-sm text-brand-text-muted-kaline">O QR Code para pagamento PIX será exibido após a finalização.</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div key="review-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <Card className="bg-brand-card-kaline dark:bg-card">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl text-brand-text-kaline">Revisar Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-brand-card-kaline dark:bg-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl text-brand-text-kaline">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
                </CardContent>
                <CardFooter>
                  {currentStep < 3 ? (
                    <Button onClick={handleNextStep} className="w-full btn-primary-kaline text-sm sm:text-base">
                      {currentStep === 1 ? 'Continuar para Pagamento' : 'Revisar Pedido'}
                    </Button>
                  ) : (
                    <Button onClick={handlePlaceOrder} className="w-full btn-primary-kaline bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                      Finalizar Pedido e Pagar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </motion.div>
      );
    };

    export default CheckoutPage;