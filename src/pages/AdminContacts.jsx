import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const AdminContacts = () => {
      const { user } = useAuth();
      const [formData, setFormData] = useState({
        email: '', phone: '', location: '', social_links: [], copyright_year: 2025
      });
      const [contactId, setContactId] = useState(null);

      useEffect(() => {
        const fetchContacts = async () => {
          if (!user) return;
          const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (data) {
            setFormData({
              email: data.email || '',
              phone: data.phone || '',
              location: data.location || '',
              social_links: data.social_links || [],
              copyright_year: data.copyright_year || 2025,
            });
            setContactId(data.id);
          }
        };
        fetchContacts();
      }, [user]);

      const handleSocialChange = (index, field, value) => {
        const newSocials = [...formData.social_links];
        newSocials[index][field] = value;
        setFormData({ ...formData, social_links: newSocials });
      };

      const addSocial = () => {
        setFormData({ ...formData, social_links: [...formData.social_links, { name: '', url: '' }] });
      };

      const removeSocial = (index) => {
        const newSocials = formData.social_links.filter((_, i) => i !== index);
        setFormData({ ...formData, social_links: newSocials });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const contactData = { ...formData, user_id: user.id };

        let error;
        if (contactId) {
          ({ error } = await supabase
            .from('contacts')
            .update(contactData)
            .eq('id', contactId));
        } else {
          const { data, error: insertError } = await supabase
            .from('contacts')
            .insert(contactData)
            .select()
            .single();
          error = insertError;
          if (data) {
            setContactId(data.id);
          }
        }

        if (error) {
          toast({ title: "Error saving contacts", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Contact Information Saved", description: "Your contact information has been saved successfully." });
        }
      };

      return (
        <div className="pt-16">
          <Helmet>
            <title>Manage Contacts - Admin Panel</title>
            <meta name="description" content="Manage contact information and social links." />
          </Helmet>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Link to="/admin" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8">
                <ArrowLeft size={20} className="mr-2" /> Back to Admin Panel
              </Link>

              <h1 className="text-4xl font-bold text-white mb-8">Manage Contact Information</h1>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-white mb-2">Email Address *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" required /></div>
                    <div><label className="block text-sm font-medium text-white mb-2">Phone Number</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                    <div><label className="block text-sm font-medium text-white mb-2">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                    <div><label className="block text-sm font-medium text-white mb-2">Copyright Year</label><input type="number" value={formData.copyright_year} onChange={(e) => setFormData({...formData, copyright_year: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Social Media Links</h3>
                      <Button type="button" onClick={addSocial} variant="outline" size="sm"><Plus size={16} className="mr-2" /> Add Social</Button>
                    </div>
                    <div className="space-y-4">
                      {formData.social_links.map((social, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <input type="text" value={social.name} onChange={(e) => handleSocialChange(index, 'name', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Name (e.g., GitHub)" />
                          <input type="url" value={social.url} onChange={(e) => handleSocialChange(index, 'url', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://github.com/username" />
                          <Button type="button" onClick={() => removeSocial(index)} variant="outline" size="icon" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white flex-shrink-0"><Trash2 size={16} /></Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Save size={20} className="mr-2" /> Save Changes
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      );
    };

    export default AdminContacts;