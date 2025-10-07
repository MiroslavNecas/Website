import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, DollarSign, ClipboardCheck, Settings } from 'lucide-react';

const AdminMonetization = () => {
  const adCodeSnippet = `import React from 'react';
// This is where you would paste your ad network's script or component.
// For example, using Google AdSense:
// import { AdSense } from '@ctrl/react-adsense';

const AdBanner = () => {
  return (
    <div className="my-12 text-center">
      {/* 
        Replace this with your ad component.
        Make sure to install any required packages.
        Example for Google AdSense:
        <AdSense
          client="ca-pub-your-client-id"
          slot="your-slot-id"
          style={{ display: 'block' }}
          layout="in-article"
          format="fluid"
        />
      */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <p className="font-semibold text-white">Your Ad Will Appear Here</p>
      </div>
    </div>
  );
};

export default AdBanner;
`;

  return (
    <div className="pt-16">
      <Helmet>
        <title>Monetization Guide - Admin Panel</title>
        <meta name="description" content="Guide to setting up ads on your blog." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Link to="/admin" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8">
            <ArrowLeft size={20} className="mr-2" />
            Back to Admin Panel
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Monetization Setup</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Follow these steps to start showing ads on your blog posts.
            </p>
          </div>

          <div className="space-y-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600/20 p-3 rounded-full mr-4 border border-purple-500/30">
                  <DollarSign className="h-6 w-6 text-purple-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">Step 1: Choose an Ad Network</h2>
              </div>
              <p className="text-gray-300">
                First, you need to sign up for an ad network. A popular choice is <a href="https://www.google.com/adsense/start/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google AdSense</a>, but there are many others. Follow their instructions to create an account and get approved.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600/20 p-3 rounded-full mr-4 border border-purple-500/30">
                  <ClipboardCheck className="h-6 w-6 text-purple-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">Step 2: Get Your Ad Code</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Once your account is approved, the ad network will provide you with a code snippet. This snippet is what displays the ads on your site. It might be HTML, JavaScript, or a React component if you use a specific library.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600/20 p-3 rounded-full mr-4 border border-purple-500/30">
                  <Settings className="h-6 w-6 text-purple-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">Step 3: Implement the Code</h2>
              </div>
              <p className="text-gray-300 mb-4">
                You need to replace the placeholder ad banner with your actual ad code. Open the file <code className="bg-white/10 text-purple-300 px-2 py-1 rounded-md text-sm">src/components/AdBanner.jsx</code> in your project and replace its content with the code below, customized with your ad snippet.
              </p>
              <pre className="bg-black/50 p-4 rounded-lg border border-white/20 overflow-x-auto">
                <code className="text-sm text-white/80">{adCodeSnippet}</code>
              </pre>
              <p className="text-gray-400 mt-4 text-sm">
                After updating the file, ads will automatically appear on any blog post where you've checked the "Show Ad" box.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMonetization;