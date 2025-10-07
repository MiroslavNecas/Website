import React, { useState, useEffect, useCallback } from 'react';
    import { Link } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import { X, Check } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const ImageSelector = ({ isOpen, onClose, onSelect }) => {
      const { user } = useAuth();
      const [images, setImages] = useState([]);
      const [selectedImage, setSelectedImage] = useState(null);

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
      }, [user]);

      useEffect(() => {
        if (isOpen) {
          fetchImages();
        }
      }, [isOpen, fetchImages]);

      const handleSelect = () => {
        if (selectedImage) {
          onSelect(selectedImage.url);
        }
      };

      if (!isOpen) return null;

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Select an Image</h2>
                <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
              </div>
              <div className="p-4 flex-grow overflow-y-auto">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.name}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage?.url === image.url ? 'border-purple-500' : 'border-transparent'}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                      {selectedImage?.url === image.url && (
                        <div className="absolute inset-0 bg-purple-500/50 flex items-center justify-center">
                          <Check className="text-white h-8 w-8" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {images.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-400">No images found in your library.</p>
                    <Link to="/admin/images" className="text-purple-400 hover:underline mt-2 inline-block">Go to Image Library to upload</Link>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/10 flex justify-end gap-4">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSelect} disabled={!selectedImage} className="bg-gradient-to-r from-purple-600 to-blue-600">Select Image</Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    };

    export default ImageSelector;