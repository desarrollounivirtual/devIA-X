
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  DollarSign,
  Tag
} from 'lucide-react';

const ProductsManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    description: '',
    category: ''
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      value: parseFloat(formData.value)
    };
    
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: "Producto actualizado",
        description: "Los datos del producto han sido actualizados correctamente.",
      });
    } else {
      addProduct(productData);
      toast({
        title: "Producto creado",
        description: "El nuevo producto ha sido creado correctamente.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      value: '',
      description: '',
      category: ''
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      value: product.value.toString(),
      description: product.description,
      category: product.category
    });
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (productId) => {
    deleteProduct(productId);
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente.",
    });
  };

  const handleExport = () => {
    toast({
      title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  const totalValue = products.reduce((sum, product) => sum + product.value, 0);
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <>
      <Helmet>
        <title>Gestión de Productos - Sistema de Gestión de Crédito</title>
        <meta name="description" content="Administra productos y servicios del sistema de gestión de crédito" />
      </Helmet>
      
      <Layout title="Gestión de Productos">
        <div className="space-y-6">
          {/* Header con acciones */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleExport} variant="outline" className="border-white/20 hover:bg-white/10">
                Exportar
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingProduct ? 'Modifica los datos del producto' : 'Completa la información del nuevo producto'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del Producto</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Ej: Crédito Personal"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="value">Valor del Producto</Label>
                        <Input
                          id="value"
                          type="number"
                          value={formData.value}
                          onChange={(e) => setFormData({...formData, value: e.target.value})}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="1000000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Ej: Personal, Vehicular"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Descripción del producto o servicio"
                        required
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">
                        {editingProduct ? 'Actualizar' : 'Crear'} Producto
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Productos</p>
                      <p className="text-3xl font-bold text-white">{products.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Categorías</p>
                      <p className="text-3xl font-bold text-white">{categories.length}</p>
                    </div>
                    <Tag className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Valor Total</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Lista de productos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Lista de Productos</CardTitle>
                <CardDescription className="text-gray-400">
                  Gestiona todos los productos y servicios disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Valor:</span>
                              <span className="text-lg font-bold text-green-400">
                                {formatCurrency(product.value)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Categoría:</span>
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {product.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="flex-1 border-white/20 hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No se encontraron productos
                    </h3>
                    <p className="text-gray-400">
                      {searchTerm 
                        ? 'Intenta ajustar el término de búsqueda'
                        : 'Comienza creando tu primer producto'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    </>
  );
};

export default ProductsManagement;
