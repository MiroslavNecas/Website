import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, MapPin, ExternalLink, Building, Award } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const ExperiencePage = () => {
  const [jobs, setJobs] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchExperience = async () => {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('position', { ascending: true });

      if (jobsData) setJobs(jobsData);

      const { data: certsData, error: certsError } = await supabase
        .from('certificates')
        .select('*')
        .order('position', { ascending: true });
      
      if (certsData) setCertificates(certsData);
    };
    fetchExperience();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Present') return 'Present';
    const [year, month] = dateString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };
  
  const formatCertDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="pt-16">
      <Helmet>
        <title>Experience - Miroslav Necas</title>
        <meta name="description" content="Professional experience and career history of Miroslav Necas, IT professional." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional Experience
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            My journey through the IT industry and the experiences that shaped my career
          </p>
        </motion.div>

        <div className="space-y-12">
          {jobs.map((job, index) => {
            const isCurrent = job.end_date === 'Present' || !job.end_date;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 overflow-hidden">
                    {job.image_url ? (
                      <img src={job.image_url} alt={`${job.company} workplace`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
                        <Building className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-8 border transition-all duration-300 ${isCurrent ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-white/10'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                        <h4 className="text-lg text-purple-400 mb-2">{job.company}</h4>
                      </div>
                      {job.website && (
                        <a href={job.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(job.start_date)} - {formatDate(job.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {job.description}
                    </p>

                    <div>
                      <h5 className="text-sm font-semibold text-white mb-3">Technologies Used</h5>
                      <div className="flex flex-wrap gap-2">
                        {job.technologies && job.technologies.map(tech => (
                          <span key={tech} className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {certificates.length > 0 && (
          <div className="mt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Certifications
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                My commitment to continuous learning and professional development
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 h-full flex flex-col">
                    <div className="flex-grow">
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-gray-800">
                        {cert.image_url ? (
                          <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Award className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                      <p className="text-purple-400 mb-2">{cert.issuer}</p>
                      <p className="text-sm text-gray-400 mb-4">Issued: {formatCertDate(cert.issue_date)}</p>
                    </div>
                    {cert.credential_url && (
                      <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-purple-300 hover:text-white transition-colors mt-auto">
                        View Credential <ExternalLink size={16} className="ml-2" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;