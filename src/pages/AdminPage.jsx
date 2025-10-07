import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import { Lock, User, LogOut } from 'lucide-react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const AdminPage = () => {
      const [credentials, setCredentials] = useState({ email: '', password: '' });
      const { user, signIn, signOut } = useAuth();
      const navigate = useNavigate();

      useEffect(() => {
        if (user) {
          navigate('/admin/dashboard');
        }
      }, [user, navigate]);

      const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await signIn(credentials.email, credentials.password);
        if (!error) {
          toast({
            title: "Login Successful",
            description: "Welcome to the admin panel!",
          });
          navigate('/admin/dashboard');
        }
      };

      const handleLogout = async () => {
        await signOut();
        toast({
          title: "Logged Out",
          description: "You have been logged out successfully.",
        });
        navigate('/admin');
      };

      if (user) {
        return (
          <div className="pt-16">
            <Helmet>
              <title>Admin Panel - Miroslav Necas</title>
              <meta name="description" content="Admin panel for managing website content." />
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Admin Panel
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                  Manage your website content and settings
                </p>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Dashboard', description: 'Overview of website statistics', link: '/admin/dashboard', icon: '📊' },
                  { title: 'About Me', description: 'Edit personal information', link: '/admin/about', icon: '👤' },
                  { title: 'Jobs & Experience', description: 'Manage work history', link: '/admin/jobs', icon: '💼' },
                  { title: 'Blog Posts', description: 'Create and manage blog content', link: '/admin/blog', icon: '📝' },
                  { title: 'Contact Info', description: 'Update contact information', link: '/admin/contacts', icon: '📞' },
                  { title: 'Image Library', description: 'Upload and manage images', link: '/admin/images', icon: '🖼️' },
                  { title: 'User Management', description: 'Manage admin users', link: '/admin/users', icon: '👥' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.link}
                      className="block bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <Helmet>
            <title>Admin Login - Miroslav Necas</title>
            <meta name="description" content="Admin login page for website management." />
          </Helmet>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 w-full max-w-md"
          >
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-gray-300">Enter your credentials to access the admin panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Login
              </Button>
            </form>
          </motion.div>
        </div>
      );
    };

    export default AdminPage;