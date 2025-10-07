import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Save, Edit, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import ImageSelector from '@/components/ImageSelector';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CertificateForm = ({ certificate, onSave, onCancel, onImageSelect, onFormDataChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ ...certificate, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(certificate);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Certificate Title</Label>
          <Input id="title" name="title" value={certificate.title} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="issuer">Issuer</Label>
          <Input id="issuer" name="issuer" value={certificate.issuer} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="issue_date">Issue Date</Label>
          <Input id="issue_date" name="issue_date" type="date" value={certificate.issue_date} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="credential_url">Credential URL</Label>
          <Input id="credential_url" name="credential_url" value={certificate.credential_url} onChange={handleInputChange} />
        </div>
        <div className="md:col-span-2">
          <Label>Certificate Image</Label>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
              {certificate.image_url ? (
                <img src={certificate.image_url} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-400" />
              )}
            </div>
            <Button type="button" variant="outline" onClick={onImageSelect}>
              Select Image
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          <Save className="mr-2 h-4 w-4" /> Save Certificate
        </Button>
      </div>
    </form>
  );
};

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const emptyCertificate = {
    title: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
    image_url: '',
    position: 0,
  };

  const fetchCertificates = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', user.id)
      .order('position', { ascending: true });
    if (error) {
      toast({ title: 'Error fetching certificates', description: error.message, variant: 'destructive' });
    } else {
      setCertificates(data);
    }
  }, [toast, user]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleOpenModal = (cert = null) => {
    setEditingCertificate(cert ? { ...cert } : { ...emptyCertificate, position: certificates.length });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCertificate(null);
  };

  const handleSaveCertificate = async (certData) => {
    if (!user) {
        toast({ title: 'Authentication Error', description: 'You must be logged in to save a certificate.', variant: 'destructive' });
        return;
    }
    const { id, ...updateData } = certData;
    let error;

    if (id) {
      ({ error } = await supabase.from('certificates').update(updateData).eq('id', id));
    } else {
      ({ error } = await supabase.from('certificates').insert({ ...updateData, user_id: user.id }));
    }

    if (error) {
      toast({ title: `Error saving certificate`, description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Certificate ${id ? 'updated' : 'added'} successfully.` });
      handleCloseModal();
      fetchCertificates();
    }
  };

  const handleDeleteCertificate = async (id) => {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting certificate', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Certificate deleted successfully.' });
      fetchCertificates();
    }
  };

  const handlePositionChange = (id, position) => {
    setCertificates(certificates.map(cert => cert.id === id ? { ...cert, position: parseInt(position, 10) || 0 } : cert));
  };

  const handleSaveOrder = async () => {
    const updates = certificates.map(({ id, position }) => ({ id, position }));
    const { error } = await supabase.from('certificates').upsert(updates);

    if (error) {
      toast({ title: 'Error saving order', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Certificate order saved successfully.' });
      fetchCertificates();
    }
  };

  const handleImageSelect = (imageUrl) => {
    setEditingCertificate(prev => ({ ...prev, image_url: imageUrl }));
    setIsImageSelectorOpen(false);
  };

  return (
    <div className="p-8 text-white">
      <Link to="/admin/dashboard" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8">
        <ArrowLeft size={20} className="mr-2" /> Back to Admin Dashboard
      </Link>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Certificates</h1>
        <Button onClick={() => handleOpenModal()} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Certificate
        </Button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Certificate Order</h2>
          <Button onClick={handleSaveOrder} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> Save Order
          </Button>
        </div>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <motion.div key={cert.id} layout className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={cert.position}
                  onChange={(e) => handlePositionChange(cert.id, e.target.value)}
                  className="w-20 p-2 text-center bg-gray-700 border-gray-600"
                />
                <div>
                  <p className="font-bold">{cert.title}</p>
                  <p className="text-sm text-gray-400">{cert.issuer}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleOpenModal(cert)} variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => handleDeleteCertificate(cert.id)} variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
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
              className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{editingCertificate?.id ? 'Edit Certificate' : 'Add New Certificate'}</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseModal}><X /></Button>
              </div>
              <div className="p-6 overflow-y-auto">
                <CertificateForm
                  certificate={editingCertificate}
                  onSave={handleSaveCertificate}
                  onCancel={handleCloseModal}
                  onImageSelect={() => setIsImageSelectorOpen(true)}
                  onFormDataChange={setEditingCertificate}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageSelector
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
};

export default AdminCertificates;