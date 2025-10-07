import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, User, Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ROLES = ['admin', 'blog-editor', 'none'];

const RoleSelector = ({ value, onChange, disabled }) => {
  const formatRole = (r) => r.charAt(0).toUpperCase() + r.slice(1).replace('-', ' ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
          {formatRole(value)}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-800 border-white/20 text-white">
        {ROLES.map(r => (
          <DropdownMenuItem key={r} onSelect={() => onChange(r)} className="focus:bg-purple-600/50">
            {formatRole(r)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserForm = ({ user, onSave, onCancel, isSaving }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'none');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      onSave({ userId: user.id, role });
    } else {
      const redirectTo = `${window.location.origin}/set-password`;
      onSave({ email, role, redirectTo });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" required disabled={!!user} />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <RoleSelector value={role} onChange={setRole} disabled={isSaving} />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={16} className="mr-2" />}
          {user ? 'Save Changes' : 'Invite User'}
        </Button>
      </div>
    </form>
  );
};

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: JSON.stringify({ action: 'list-users' }),
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      setUsers(data.users);
    } catch (error) {
      toast({ title: "Error fetching users", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveUser = async (payload) => {
    setIsSaving(true);
    const action = editingUser ? 'update-role' : 'invite';
    const successMessage = editingUser ? 'User role updated!' : 'Invitation sent!';

    try {
      const { error: functionError, data } = await supabase.functions.invoke('user-management', {
        body: JSON.stringify({ action, payload }),
      });

      if (functionError) throw functionError;
      if (data.error) throw new Error(data.error);

      toast({ title: "Success", description: successMessage });
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      toast({ title: `Error ${action === 'invite' ? 'inviting' : 'updating'} user`, description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
        const { error: functionError, data } = await supabase.functions.invoke('user-management', {
            body: JSON.stringify({ action: 'delete-user', payload: { userId } }),
        });

        if (functionError) throw functionError;
        if (data.error) throw new Error(data.error);

        toast({ title: "Success", description: "User has been deleted." });
        fetchUsers();
    } catch (error) {
        toast({ title: "Error deleting user", description: error.message, variant: "destructive" });
    }
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-600/20 text-purple-300 border border-purple-600/30';
      case 'blog-editor':
        return 'bg-blue-600/20 text-blue-300 border border-blue-600/30';
      default:
        return 'bg-gray-600/20 text-gray-300 border border-gray-600/30';
    }
  };

  return (
    <div className="pt-16">
      <Helmet>
        <title>Manage Users - Admin Panel</title>
        <meta name="description" content="Manage admin users and permissions." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Link to="/admin/dashboard" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8">
            <ArrowLeft size={20} className="mr-2" /> Back to Admin Dashboard
          </Link>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Manage Users</h1>
            <Button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus size={20} className="mr-2" /> Add New User
            </Button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="space-y-2 p-4">
              {isLoading ? (
                <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
                      <div>
                        <p className="font-semibold text-white">{user.email}</p>
                        <p className="text-sm text-gray-400">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleClass(user.role)}`}>
                        {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('-', ' ')) : 'No Role'}
                      </span>
                      <Button onClick={() => handleOpenModal(user)} variant="outline" size="sm"><Edit size={14} /></Button>
                      <Button onClick={() => handleDeleteUser(user.id)} variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white" disabled={user.id === currentUser.id}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{editingUser ? 'Edit User' : 'Invite New User'}</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseModal}><X /></Button>
              </div>
              <div className="p-6">
                <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCloseModal} isSaving={isSaving} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;