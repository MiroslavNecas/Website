import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);
  useEffect(() => {
    const fetchAboutData = async () => {
      const {
        data,
        error
      } = await supabase.from('about').select('*').single();
      if (data) {
        setAboutData(data);
      }
    };
    fetchAboutData();
  }, []);
  if (!aboutData) {
    return <div className="pt-16 min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }
  return <div className="pt-16">
          <Helmet>
            <title>About - Miroslav Necas</title>
            <meta name="description" content="Learn more about Miroslav Necas, IT professional with 3 years of experience in web development and system architecture." />
          </Helmet>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 overflow-hidden">
                  {aboutData.image_url ? <img src={aboutData.image_url} alt={aboutData.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                      <img alt="Professional headshot of Miroslav Necas" src="https://horizons-cdn.hostinger.com/0fcb86b4-6707-44e3-9ece-da5c6745087f/cat_november_2010-1a-WMM2M.jpg" />
                    </div>}
                </div>
              </div>

              <div>
                <motion.div initial={{
            opacity: 0,
            x: 30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }}>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    About {aboutData.name}
                  </h1>
                  <h2 className="text-xl text-purple-400 mb-6">{aboutData.title}</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {aboutData.long_description}
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Education</h3>
                      <p className="text-gray-300">{aboutData.education}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                      <p className="text-gray-300">{aboutData.location}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="mt-20">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Technical Skills</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {aboutData.skills.map((skill, index) => <motion.div key={skill} initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <span className="text-white font-medium">{skill}</span>
                  </motion.div>)}
              </div>
            </motion.div>
          </div>
        </div>;
};
export default AboutPage;