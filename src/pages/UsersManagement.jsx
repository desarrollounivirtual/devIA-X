import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  UserCheck,
  UserX,
  Mail,
  Phone
} from 'lucide-react';
import { UserFormDialog } from '@/components/users/UserFormDialog';
import { supabase } from '@/lib/supabaseClient'; // 👈 Asegúrate de tener esta importación

const UsersManagement = () => {
  const { addUser, updateUser, deleteUser } = useData(); // no obtenemos clientes del context
  const { toast } = useToast();
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // 🔧 Cargar clientes desde Supabase
  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase.from('clientes').select('*');
      if (error) {
        console.error('Error al cargar clientes:', error.message);
      } else {
        setClientes(data);
      }
    };

    fetchClientes();
  }, []);

  const filteredUsers = clientes.filter(user => {
    const matchesSearch =
      (user?.nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.correo_electronico || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.grupo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.cedula || '').includes(searchTerm);

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const openNewUserDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const openEditUserDialog = (user) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    setClientes(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente.",
    });
  };

  const handleExport = () => {
    toast({
      title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>Gestión de Usuarios - Sistema de Gestión de Crédito</title>
        <meta name="description" content="Administra usuarios del sistema de gestión de crédito y cartera" />
      </Helmet>

      <Layout title="Gestión de Usuarios">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="client">Clientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleExport} variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                Exportar
              </Button>
              <Button onClick={openNewUserDialog} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Usuarios</p>
                      <p className="text-3xl font-bold text-white">{clientes.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Administradores</p>
                      <p className="text-3xl font-bold text-white">{clientes.filter(u => u.role === 'admin').length}</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Clientes</p>
                      <p className="text-3xl font-bold text-white">{clientes.filter(u => u.role === 'client').length}</p>
                    </div>
                    <UserX className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Lista de Usuarios</CardTitle>
                <CardDescription className="text-gray-400">Gestiona todos los usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-400">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{user.nombre_completo}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />{user.correo_electronico}
                            </span>
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />{user.telefono}
                            </span>
                            <span>Cédula: {user.cedula}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="px-2 py-1 rounded-full text-xs font-medium status-pending">
                              {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                            </span>
                            {user.grupo && (
                              <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-300">
                                {user.grupo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditUserDialog(user)} className="border-white/20 hover:bg-white/10 text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)} className="border-red-500/20 hover:bg-red-500/10 text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No se encontraron usuarios</h3>
                      <p className="text-gray-400">{searchTerm || filterRole !== 'all' ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza creando tu primer usuario'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <UserFormDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingUser={editingUser}
          addUser={addUser}
          updateUser={updateUser}
        />
      </Layout>
    </>
  );
};

export default UsersManagement;
