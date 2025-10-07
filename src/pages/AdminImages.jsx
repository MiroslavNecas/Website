import React, { useState, useEffect, useCallback } from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import { ArrowLeft, Upload, Trash2, Copy } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const AdminImages = () => {
      const { user } = useAuth();
      const [images, setImages] = useState([]);
      const [uploading, setUploading] = useState(false);

      const fetchImages = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase.storage.from('images').list(user.id, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

        if (data) {
          const imageUrls = data.map(file => {
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(`${user.id}/${file.name}`);
            return { name: file.name, url: publicUrl };
          });
          setImages(imageUrls);
        }
        if (error) {
          toast({ title: "Error fetching images", description: error.message, variant: "destructive" });
        }
      }, [user, toast]);

      useEffect(() => {
        fetchImages();
      }, [fetchImages]);

      const handleUpload = async (event) => {
        try {
          setUploading(true);
          if (!event.target.files || event.target.files.length === 0) {
            throw new Error('You must select an image to upload.');
          }

          const file = event.target.files[0];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          toast({ title: "Image Uploaded", description: "Your image has been uploaded successfully." });
          fetchImages();
        } catch (error) {
          toast({ title: "Upload Error", description: error.message, variant: "destructive" });
        } finally {
          setUploading(false);
        }
      };

      const handleDelete = async (imageName) => {
        const imagePath = `${user.id}/${imageName}`;
        const { error } = await supabase.storage.from('images').remove([imagePath]);

        if (error) {
          toast({ title: "Error deleting image", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Image Deleted", description: "The image has been deleted successfully." });
          fetchImages();
        }
      };

      const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        toast({ title: "URL Copied!", description: "Image URL copied to clipboard." });
      };

      return (
        <div className="pt-16">
          <Helmet>
            <title>Manage Images - Admin Panel</title>
            <meta name="description" content="Upload and manage images for your website." />
          </Helmet>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Link to="/admin" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8">
                <ArrowLeft size={20} className="mr-2" />
                Back to Admin Panel
              </Link>

              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Image Library</h1>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <label htmlFor="image-upload">
                    <Upload size={20} className="mr-2" /> {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                </Button>
                <input id="image-upload" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {images.map((image, index) => (
                  <motion.div
                    key={image.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative aspect-square bg-white/5 rounded-xl overflow-hidden border border-white/10"
                  >
                    <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => copyToClipboard(image.url)} variant="outline" size="icon" className="h-8 w-8 bg-black/50 border-none text-white hover:bg-white/20">
                          <Copy size={14} />
                        </Button>
                        <Button onClick={() => handleDelete(image.name)} variant="outline" size="icon" className="h-8 w-8 bg-black/50 border-none text-red-400 hover:bg-red-400/50 hover:text-white">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <p className="text-xs text-white truncate">{image.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              {images.length === 0 && (
                <div className="text-center py-16 bg-white/5 rounded-xl border border-dashed border-white/20">
                  <h3 className="text-xl font-semibold text-white">No Images Found</h3>
                  <p className="text-gray-400 mt-2">Upload your first image to get started.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      );
    };

    export default AdminImages;