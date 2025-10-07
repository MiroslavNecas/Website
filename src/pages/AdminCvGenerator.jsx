import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Printer, Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const CVContent = React.forwardRef(({ data }, ref) => {
  if (!data) return null;

  const { about, contacts, jobs, certificates } = data;

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
    <div ref={ref} className="p-8 bg-white text-gray-800 font-sans text-sm">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{about.name}</h1>
        <p className="text-xl text-purple-700">{about.title}</p>
      </header>

      {/* Contact Info */}
      <section className="flex justify-center items-center gap-x-6 gap-y-2 flex-wrap mb-8 text-xs border-y-2 border-gray-200 py-3">
        {contacts.email && <div className="flex items-center gap-2"><Mail size={12} /><span>{contacts.email}</span></div>}
        {contacts.phone && <div className="flex items-center gap-2"><Phone size={12} /><span>{contacts.phone}</span></div>}
        {contacts.location && <div className="flex items-center gap-2"><MapPin size={12} /><span>{contacts.location}</span></div>}
        {contacts.social_links?.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} /><span>{contacts.social_links.linkedin.replace('https://www.linkedin.com/in/', '')}</span></div>}
        {contacts.social_links?.github && <div className="flex items-center gap-2"><Github size={12} /><span>{contacts.social_links.github.replace('https://github.com/', '')}</span></div>}
      </section>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-bold border-b-2 border-purple-600 pb-1 mb-3 text-purple-800">PROFESSIONAL SUMMARY</h2>
        <p className="leading-relaxed">{about.long_description}</p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-lg font-bold border-b-2 border-purple-600 pb-1 mb-3 text-purple-800">WORK EXPERIENCE</h2>
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{job.title}</h3>
                <p className="text-xs font-medium text-gray-600">{formatDate(job.start_date)} - {formatDate(job.end_date)}</p>
              </div>
              <p className="text-sm font-semibold text-purple-700">{job.company} | {job.location}</p>
              <p className="mt-2 text-xs leading-normal">{job.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Certificates */}
      <section className="mb-8">
        <h2 className="text-lg font-bold border-b-2 border-purple-600 pb-1 mb-3 text-purple-800">CERTIFICATIONS</h2>
        <div className="space-y-4">
          {certificates.map(cert => (
            <div key={cert.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{cert.title}</h3>
                <p className="text-xs font-medium text-gray-600">{formatCertDate(cert.issue_date)}</p>
              </div>
              <p className="text-sm font-semibold text-purple-700">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-lg font-bold border-b-2 border-purple-600 pb-1 mb-3 text-purple-800">SKILLS</h2>
        <div className="flex flex-wrap gap-2">
          {about.skills.map(skill => (
            <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
});

const AdminCvGenerator = () => {
  const [cvData, setCvData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [aboutRes, contactsRes, jobsRes, certificatesRes] = await Promise.all([
          supabase.from('about').select('*').single(),
          supabase.from('contacts').select('*').single(),
          supabase.from('jobs').select('*').order('position', { ascending: true }),
          supabase.from('certificates').select('*').order('position', { ascending: true }),
        ]);

        if (aboutRes.error) throw aboutRes.error;
        if (contactsRes.error) throw contactsRes.error;
        if (jobsRes.error) throw jobsRes.error;
        if (certificatesRes.error) throw certificatesRes.error;

        setCvData({
          about: aboutRes.data,
          contacts: contactsRes.data,
          jobs: jobsRes.data,
          certificates: certificatesRes.data,
        });
      } catch (error) {
        toast({ title: 'Error fetching CV data', description: error.message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `CV-Miroslav-Necas`,
  });

  return (
    <div className="p-8 text-white">
      <Helmet>
        <title>CV Generator - Admin Panel</title>
      </Helmet>
      <Link to="/admin/dashboard" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8">
        <ArrowLeft size={20} className="mr-2" /> Back to Admin Dashboard
      </Link>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CV Generator</h1>
        <Button onClick={handlePrint} disabled={isLoading || !cvData} className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <CVContent ref={componentRef} data={cvData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCvGenerator;