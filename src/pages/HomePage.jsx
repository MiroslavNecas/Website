import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { ArrowRight, Code, Database, Server, Cpu } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';

    const HomePage = () => {
      const [aboutData, setAboutData] = useState({
        name: 'Miroslav Necas',
        title: 'IT Professional',
        description: 'Passionate IT professional with 3 years of experience in modern web technologies, database management, and system architecture.',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript']
      });

      useEffect(() => {
        const fetchAboutData = async () => {
          const { data, error } = await supabase
            .from('about')
            .select('*')
            .single();
          
          if (data) {
            setAboutData(data);
          }
        };
        fetchAboutData();
      }, []);

      return ( 
        <div className="pt-16">
          <Helmet>
            <title>Home - Miroslav Necas</title>
            <meta name="description" content="Welcome to Miroslav Necas' personal and professional portfolio. IT professional with 3 years of experience." />
          </Helmet>

          <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.02%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  {aboutData.name}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  {aboutData.description}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {aboutData.skills.slice(0, 6).map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/about"
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Learn More About Me
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    View My Experience
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-4">What I Do</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Specializing in modern web development and system architecture
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: Code, title: 'Frontend Development', description: 'Creating responsive and interactive user interfaces with modern frameworks' },
                  { icon: Server, title: 'Backend Systems', description: 'Building scalable server-side applications and APIs' },
                  { icon: Cpu, title: 'Performance', description: 'Optimizing applications for speed and scalability' },
                  { icon: Database, title: 'Database Design', description: 'Designing efficient database schemas and optimizing queries' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <feature.icon className="w-12 h-12 text-purple-400 mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    };

    export default HomePage;