import React, { useState, useEffect } from 'react';
    import { useNavigate, useParams, Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea'; 
    import { useProducts } from '@/contexts/ProductContext';
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from 'framer-motion';
    import { ChevronLeft, PackagePlus, Save } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

    const ProductFormPage = () => {
      const { productId } = useParams();
      const navigate = useNavigate();
      const { addProduct, updateProduct, getProductById } = useProducts();
      const { toast } = useToast();

      const isEditing = Boolean(productId);
      const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '', // URL for the image
        category: '',
        sizes: '', // comma-separated string
        colors: '', // comma-separated string
      });
      const [isSubmitting, setIsSubmitting] = useState(false);

      useEffect(() => {
        if (isEditing && productId) {
          const productToEdit = getProductById(productId);
          if (productToEdit) {
            setFormData({
              name: productToEdit.name || '',
              description: productToEdit.description || '',
              price: productToEdit.price ? productToEdit.price.replace('R$ ', '').replace(',', '.') : '',
              image: productToEdit.image || '',
              category: productToEdit.category || '',
              sizes: productToEdit.sizes ? productToEdit.sizes.join(', ') : '',
              colors: productToEdit.colors ? productToEdit.colors.join(', ') : '',
            });
          } else {
            toast({ title: "Erro", description: "Produto não encontrado para edição.", variant: "destructive" });
            navigate('/seller/products');
          }
        }
      }, [isEditing, productId, getProductById, navigate, toast]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.name || !formData.price || !formData.category) {
            toast({ title: "Campos Obrigatórios", description: "Nome, preço e categoria são obrigatórios.", variant: "destructive", duration: 3000 });
            setIsSubmitting(false);
            return;
        }
        
        const priceAsNumber = parseFloat(formData.price);
        if (isNaN(priceAsNumber) || priceAsNumber <= 0) {
             toast({ title: "Preço Inválido", description: "Por favor, insira um preço válido.", variant: "destructive", duration: 3000 });
             setIsSubmitting(false);
             return;
        }

        const productData = {
          ...formData,
          price: `R$ ${priceAsNumber.toFixed(2).replace('.', ',')}`,
          sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
          colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
        };

        if (isEditing) {
          updateProduct(productId, productData);
        } else {
          addProduct(productData);
        }
        
        setIsSubmitting(false);
        navigate('/seller/products'); 
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-8"
        >
          <div className="flex items-center mb-6 sm:mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/seller/products')} className="mr-2 text-brand-primary-kaline hover:bg-brand-primary-kaline/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline">
              {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h1>
          </div>

          <Card className="bg-brand-card-kaline dark:bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-brand-text-kaline flex items-center">
                {isEditing ? <Save className="mr-2 h-5 w-5" /> : <PackagePlus className="mr-2 h-5 w-5" />}
                Detalhes do Produto
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-brand-text-kaline">Nome do Produto*</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Vestido Floral Moderno" required className="mt-1 bg-background dark:bg-input"/>
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-brand-text-kaline">Descrição</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Detalhes sobre o produto..." rows={4} className="mt-1 bg-background dark:bg-input"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-brand-text-kaline">Preço (R$)*</Label>
                    <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Ex: 199.90" required className="mt-1 bg-background dark:bg-input"/>
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-brand-text-kaline">Categoria*</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Ex: Vestidos, Acessórios" required className="mt-1 bg-background dark:bg-input"/>
                  </div>
                </div>
                <div>
                  <Label htmlFor="image" className="text-sm font-medium text-brand-text-kaline">URL da Imagem</Label>
                  <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" className="mt-1 bg-background dark:bg-input"/>
                </div>
                <div>
                  <Label htmlFor="sizes" className="text-sm font-medium text-brand-text-kaline">Tamanhos (separados por vírgula)</Label>
                  <Input id="sizes" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="Ex: P, M, G, GG" className="mt-1 bg-background dark:bg-input"/>
                </div>
                <div>
                  <Label htmlFor="colors" className="text-sm font-medium text-brand-text-kaline">Cores (separadas por vírgula)</Label>
                  <Input id="colors" name="colors" value={formData.colors} onChange={handleChange} placeholder="Ex: Rosa Floral, Azul Céu, Preto" className="mt-1 bg-background dark:bg-input"/>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full btn-primary-kaline text-sm sm:text-base" disabled={isSubmitting}>
                  {isSubmitting ? (isEditing ? 'Salvando Alterações...' : 'Adicionando Produto...') : (isEditing ? 'Salvar Alterações' : 'Adicionar Produto')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      );
    };

    export default ProductFormPage;