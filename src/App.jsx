import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { Helmet } from 'react-helmet';
    import { Toaster } from '@/components/ui/toaster';
    import Navbar from '@/components/Navbar';
    import Footer from '@/components/Footer';
    import HomePage from '@/pages/HomePage';
    import AboutPage from '@/pages/AboutPage';
    import JobsPage from '@/pages/JobsPage';
    import BlogPage from '@/pages/BlogPage';
    import BlogPostPage from '@/pages/BlogPostPage';
    import AdminPage from '@/pages/AdminPage';
    import AdminDashboard from '@/pages/AdminDashboard';
    import AdminJobs from '@/pages/AdminJobs';
    import AdminCertificates from '@/pages/AdminCertificates';
    import AdminCvGenerator from '@/pages/AdminCvGenerator';
    import AdminBlog from '@/pages/AdminBlog';
    import AdminAbout from '@/pages/AdminAbout';
    import AdminContacts from '@/pages/AdminContacts';
    import AdminUsers from '@/pages/AdminUsers';
    import AdminImages from '@/pages/AdminImages';
    import AdminMonetization from '@/pages/AdminMonetization';
    import SetPasswordPage from '@/pages/SetPasswordPage';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const PrivateRoute = ({ children }) => {
      const { user, loading } = useAuth();
      if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="text-white">Loading...</div></div>;
      return user ? children : <Navigate to="/admin" />;
    };

    function App() {
      return (
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
            <Helmet>
              <title>Miroslav Necas - IT Professional</title>
              <meta name="description" content="Personal and professional portfolio of Miroslav Necas, IT professional with 3 years of experience." />
            </Helmet>
            
            <Navbar />
            
            <main className="min-h-screen pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/set-password" element={<SetPasswordPage />} />
                <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/jobs" element={<PrivateRoute><AdminJobs /></PrivateRoute>} />
                <Route path="/admin/certificates" element={<PrivateRoute><AdminCertificates /></PrivateRoute>} />
                <Route path="/admin/cv-generator" element={<PrivateRoute><AdminCvGenerator /></PrivateRoute>} />
                <Route path="/admin/blog" element={<PrivateRoute><AdminBlog /></PrivateRoute>} />
                <Route path="/admin/about" element={<PrivateRoute><AdminAbout /></PrivateRoute>} />
                <Route path="/admin/contacts" element={<PrivateRoute><AdminContacts /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
                <Route path="/admin/images" element={<PrivateRoute><AdminImages /></PrivateRoute>} />
                <Route path="/admin/monetization" element={<PrivateRoute><AdminMonetization /></PrivateRoute>} />
              </Routes>
            </main>
            
            <Footer />
            <Toaster />
          </div>
        </Router>
      );
    }

    export default App;