import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ImageSelector from '@/components/ImageSelector';

const AdminAbout = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '', title: '', description: '', long_description: '', skills: '', education: '', location: '', image_url: ''
  });
  const [aboutId, setAboutId] = useState(null);
  const [showImageSelector, setShowImageSelector] = useState(false);

  const fetchAboutData = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('about')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setFormData({
        name: data.name || '',
        title: data.title || '',
        description: data.description || '',
        long_description: data.long_description || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        education: data.education || '',
        location: data.location || '',
        image_url: data.image_url || ''
      });
      setAboutId(data.id);
    } else if (error) {
      toast({ title: "Error fetching data", description: error.message, variant: "destructive" });
    }
  }, [user]);

  useEffect(() => {
    if(user) {
      fetchAboutData();
    }
  }, [user, fetchAboutData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to update information.", variant: "destructive" });
      return;
    }

    const aboutData = {
      name: formData.name,
      title: formData.title,
      description: formData.description,
      long_description: formData.long_description,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      education: formData.education,
      location: formData.location,
      image_url: formData.image_url,
      user_id: user.id
    };

    let error;

    if (aboutId) {
      const { error: updateError } = await supabase
        .from('about')
        .update(aboutData)
        .eq('id', aboutId);
      error = updateError;
    } else {
      const { data, error: insertError } = await supabase
        .from('about')
        .insert(aboutData)
        .select()
        .single();
      error = insertError;
      if(data) {
        setAboutId(data.id);
      }
    }

    if (error) {
      toast({ title: "Error updating about info", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "About Information Updated", description: "Your personal information has been updated successfully." });
      fetchAboutData();
    }
  };

  const handleImageSelect = (imageUrl) => {
    setFormData({ ...formData, image_url: imageUrl });
    setShowImageSelector(false);
  };

  return (
    <div className="pt-16">
      <Helmet>
        <title>Manage About - Admin Panel</title>
        <meta name="description" content="Manage personal information and about section." />
      </Helmet>

      <ImageSelector
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/admin" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8">
            <ArrowLeft size={20} className="mr-2" />
            Back to Admin Panel
          </Link>

          <h1 className="text-4xl font-bold text-white mb-8">Manage About Information</h1>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Professional Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Education</label>
                  <input type="text" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Profile Image URL</label>
                <div className="flex gap-2">
                  <input type="url" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://example.com/profile-image.jpg" />
                  <Button type="button" variant="outline" onClick={() => setShowImageSelector(true)}><ImageIcon size={16} className="mr-2" /> Select</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Short Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Detailed Description *</label>
                <textarea value={formData.long_description} onChange={(e) => setFormData({...formData, long_description: e.target.value})} rows={6} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Skills (comma-separated) *</label>
                <textarea value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} rows={3} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Save size={20} className="mr-2" />
                Save Changes
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAbout;