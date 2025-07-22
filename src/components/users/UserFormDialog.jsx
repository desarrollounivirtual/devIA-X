import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../lib/supabaseClient';

export const UserFormDialog = ({ isOpen, onOpenChange, editingUser, addUser, updateUser }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    cedula: '',
    correo_electronico: '',
    telefono: '',
    grupo: ''
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        nombre_completo: editingUser.nombre_completo,
        cedula: editingUser.cedula,
        correo_electronico: editingUser.correo_electronico,
        telefono: editingUser.telefono,
        grupo: editingUser.grupo || ''
      });
    } else {
      resetFormFields();
    }
  }, [editingUser, isOpen]);

  const resetFormFields = () => {
  setFormData({
    nombre_completo: '',
    correo_electronico: '',
    cedula: '',
    telefono: '',
    grupo: ''
  });
};


  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const clienteData = {
    nombre_completo: formData.nombre_completo,
    correo_electronico: formData.correo_electronico,
    telefono: formData.telefono,
    cedula: formData.cedula,
    grupo: formData.grupo
  };

  try {
    if (editingUser) {
      await updateUser(editingUser.id, clienteData);
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente han sido actualizados correctamente.",
      });
    } else {
      const { data, error } = await supabase.from('clientes').insert([clienteData]);

      if (error) {
        toast({
          title: "Error al crear cliente",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Cliente creado",
        description: "El nuevo cliente ha sido creado correctamente.",
      });

      // Opcional: si quieres agregarlo a una lista en tiempo real
      if (addUser) {
        addUser(data[0]);
      }
    }

    // Limpiar formulario y cerrar modal si todo salió bien
    resetFormFields();
    handleClose();

  } catch (err) {
    toast({
      title: "Error inesperado",
      description: err.message || "Algo salió mal.",
      variant: "destructive"
    });
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingUser ? 'Modifica los datos del cliente' : 'Completa la información del nuevo cliente'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_completo">Nombre Completo</Label>
              <Input id="nombre_completo" value={formData.nombre_completo} onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})} className="bg-white/5 border-white/10 text-white" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula/NIT</Label>
              <Input id="cedula" value={formData.cedula} onChange={(e) => setFormData({...formData, cedula: e.target.value})} className="bg-white/5 border-white/10 text-white" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="correo_electronico">Correo Electrónico</Label>
              <Input id="correo_electronico" type="email" value={formData.correo_electronico} onChange={(e) => setFormData({...formData, correo_electronico: e.target.value})} className="bg-white/5 border-white/10 text-white" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grupo">Grupo</Label>
            <Input id="grupo" value={formData.grupo} onChange={(e) => setFormData({...formData, grupo: e.target.value})} className="bg-white/5 border-white/10 text-white" placeholder="Ej: Premium, Regular, etc." />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="text-white border-white/20 hover:bg-white/10">Cancelar</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">{editingUser ? 'Actualizar' : 'Crear'} Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
