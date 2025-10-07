import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Briefcase, PenSquare, UserCircle, Mail, Users, Image, DollarSign, LogOut, Award, FileText } from 'lucide-react';
import WelcomeMessage from '@/components/WelcomeMessage';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const { signOut, role } = useAuth();
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin');
  };

  const allAdminLinks = [
    { to: '/admin/about', icon: UserCircle, title: 'Update About Me', description: 'Edit your personal information.', roles: ['admin'] },
    { to: '/admin/jobs', icon: Briefcase, title: 'Manage Jobs', description: 'Add, edit, or remove job experiences.', roles: ['admin'] },
    { to: '/admin/certificates', icon: Award, title: 'Manage Certificates', description: 'Add and organize your certifications.', roles: ['admin'] },
    { to: '/admin/blog', icon: PenSquare, title: 'Manage Blog', description: 'Create and manage your blog posts.', roles: ['admin', 'blog-editor'] },
    { to: '/admin/contacts', icon: Mail, title: 'Update Contacts', description: 'Manage contact and social media links.', roles: ['admin'] },
    { to: '/admin/users', icon: Users, title: 'Manage Users', description: 'View and manage user accounts.', roles: ['admin'] },
    { to: '/admin/images', icon: Image, title: 'Manage Images', description: 'Upload and organize your images.', roles: ['admin', 'blog-editor'] },
    { to: '/admin/monetization', icon: DollarSign, title: 'Monetization', description: 'Set up ads for your blog.', roles: ['admin'] },
    { to: '/admin/cv-generator', icon: FileText, title: 'CV Generator', description: 'Create a CV from your profile data.', roles: ['admin'] },
  ];

  const accessibleLinks = allAdminLinks.filter(link => link.roles.includes(role));

  return (
    <div className="pt-16">
      <Helmet>
        <title>Admin Dashboard - Miroslav Necas</title>
        <meta name="description" content="Admin dashboard for managing the portfolio content." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-start mb-8">
          <WelcomeMessage />
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {accessibleLinks.map((link) => (
            <motion.div key={link.to} variants={cardVariants}>
              <Link to={link.to} className="block h-full">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-600/20 p-3 rounded-full mr-4 border border-purple-500/30">
                      <link.icon className="h-6 w-6 text-purple-300" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{link.title}</h2>
                  </div>
                  <p className="text-gray-400 flex-grow">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;