import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../lib/supabaseClient'

export const UserFormDialog = ({ isOpen, onOpenChange, editingUser, addUser, updateUser }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cedula: '',
    phone: '',
    group: ''
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        password: editingUser.password,
        cedula: editingUser.cedula,
        phone: editingUser.phone,
        group: editingUser.group || ''
      });
    } else {
      resetFormFields();
    }
  }, [editingUser, isOpen]);

  const resetFormFields = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      cedula: '',
      phone: '',
      group: ''
    });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (editingUser) {
    updateUser(editingUser.id, formData);
    toast({
      title: "Usuario actualizado",
      description: "Los datos del usuario han sido actualizados correctamente.",
    });
  } else {
    const { data, error } = await supabase.from('usuarios').insert([formData]);

    if (error) {
      toast({
        title: "Error al crear usuario",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Usuario creado",
      description: "El nuevo usuario ha sido creado correctamente.",
    });
  }

  handleClose();
};

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingUser ? 'Modifica los datos del usuario' : 'Completa la información del nuevo usuario'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10 text-white" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula/NIT</Label>
              <Input id="cedula" value={formData.cedula} onChange={(e) => setFormData({...formData, cedula: e.target.value})} className="bg-white/5 border-white/10 text-white" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10 text-white" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-white/5 border-white/10 text-white" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-white/5 border-white/10 text-white" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group">Grupo</Label>
            <Input id="group" value={formData.group} onChange={(e) => setFormData({...formData, group: e.target.value})} className="bg-white/5 border-white/10 text-white" placeholder="Ej: Clientes Premium, VIP, etc." />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="text-white border-white/20 hover:bg-white/10">Cancelar</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">{editingUser ? 'Actualizar' : 'Crear'} Usuario</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};