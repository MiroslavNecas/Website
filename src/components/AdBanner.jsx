import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

const AdBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="my-12"
    >
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
        <Megaphone className="mx-auto h-8 w-8 text-purple-400 mb-4" />
        <p className="font-semibold text-white mb-2">Advertisement</p>
        <p className="text-sm text-gray-400">
          This is a placeholder for your ad. You can replace this component with your ad network's code snippet.
        </p>
      </div>
    </motion.div>
  );
};

export default AdBanner;