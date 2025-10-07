import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Save, Edit, Image as ImageIcon, X } from 'lucide-react';
import ImageSelector from '@/components/ImageSelector';

const JobForm = ({ job, onSave, onCancel, onImageSelect, onFormDataChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ ...job, [name]: value });
  };

  const handleTechChange = (e) => {
    const technologies = e.target.value.split(',').map(tech => tech.trim()).filter(Boolean);
    onFormDataChange({ ...job, technologies });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(job);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" value={job.title} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" value={job.company} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={job.location} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="website">Company Website</Label>
          <Input id="website" name="website" value={job.website} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" name="start_date" type="month" value={job.start_date} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="end_date">End Date (leave blank for 'Present')</Label>
          <Input id="end_date" name="end_date" type="month" value={job.end_date} onChange={handleInputChange} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={job.description} onChange={handleInputChange} required />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="technologies">Technologies (comma-separated)</Label>
          <Input id="technologies" name="technologies" value={job.technologies.join(', ')} onChange={handleTechChange} />
        </div>
        <div className="md:col-span-2">
          <Label>Company Image</Label>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-24 h-24 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
              {job.image_url ? (
                <img src={job.image_url} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-400" />
              )}
            </div>
            <Button type="button" variant="outline" onClick={onImageSelect}>
              Select Image
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          <Save className="mr-2 h-4 w-4" /> Save Job
        </Button>
      </div>
    </form>
  );
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const { toast } = useToast();

  const emptyJob = {
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    technologies: [],
    website: '',
    image_url: '',
    position: 0,
  };

  const fetchJobs = useCallback(async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('position', { ascending: true });
    if (error) {
      toast({ title: 'Error fetching jobs', description: error.message, variant: 'destructive' });
    } else {
      setJobs(data);
    }
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleOpenModal = (job = null) => {
    setEditingJob(job ? { ...job } : { ...emptyJob, position: jobs.length });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = async (jobData) => {
    const { id, ...updateData } = jobData;
    let error;

    if (id) {
      ({ error } = await supabase.from('jobs').update(updateData).eq('id', id));
    } else {
      ({ error } = await supabase.from('jobs').insert(updateData));
    }

    if (error) {
      toast({ title: `Error saving job`, description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Job ${id ? 'updated' : 'added'} successfully.` });
      handleCloseModal();
      fetchJobs();
    }
  };

  const handleDeleteJob = async (id) => {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting job', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Job deleted successfully.' });
      fetchJobs();
    }
  };

  const handlePositionChange = (id, position) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, position: parseInt(position, 10) || 0 } : job));
  };

  const handleSaveOrder = async () => {
    const updates = jobs.map(({ id, position }) => ({ id, position }));
    const { error } = await supabase.from('jobs').upsert(updates);

    if (error) {
      toast({ title: 'Error saving order', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Job order saved successfully.' });
      fetchJobs();
    }
  };

  const handleImageSelect = (imageUrl) => {
    setEditingJob(prev => ({ ...prev, image_url: imageUrl }));
    setIsImageSelectorOpen(false);
  };

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Job Experience</h1>
        <Button onClick={() => handleOpenModal()} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Job
        </Button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Job Order</h2>
          <Button onClick={handleSaveOrder} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> Save Order
          </Button>
        </div>
        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div key={job.id} layout className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={job.position}
                  onChange={(e) => handlePositionChange(job.id, e.target.value)}
                  className="w-20 p-2 text-center bg-gray-700 border-gray-600"
                />
                <div>
                  <p className="font-bold">{job.title}</p>
                  <p className="text-sm text-gray-400">{job.company}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleOpenModal(job)} variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => handleDeleteJob(job.id)} variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{editingJob?.id ? 'Edit Job' : 'Add New Job'}</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseModal}><X /></Button>
              </div>
              <div className="p-6 overflow-y-auto">
                <JobForm
                  job={editingJob}
                  onSave={handleSaveJob}
                  onCancel={handleCloseModal}
                  onImageSelect={() => setIsImageSelectorOpen(true)}
                  onFormDataChange={setEditingJob}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageSelector
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
};

export default AdminJobs;