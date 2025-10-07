import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, KeyRound } from 'lucide-react';

const SetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // This event is not the one for invites, but good to be aware of.
        // The main logic will be handled via the URL hash.
      }
    });

    // Check for tokens in URL hash on component mount
    const hash = window.location.hash;
    if (!hash.includes('access_token')) {
      setMessage('Waiting for invitation token...');
    } else {
      setMessage('Invitation token detected. Please set your password.');
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Password Set Successfully!',
        description: 'You can now log in to the admin dashboard.',
      });
      
      // Log the user out so they have to log in with their new password
      await supabase.auth.signOut();
      
      navigate('/admin');

    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error setting password',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <Helmet>
        <title>Set Your Password - Miroslav Necas</title>
        <meta name="description" content="Set your password to access the admin panel." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl"
      >
        <div className="text-center">
          <div className="inline-block bg-purple-600/20 p-4 rounded-full border border-purple-500/30 mb-4">
            <KeyRound className="h-8 w-8 text-purple-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">Set Your Password</h1>
          <p className="text-gray-400 mt-2">Welcome! Create a secure password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {message && !error && <p className="text-blue-400 text-sm text-center">{message}</p>}

          <div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Set Password & Continue'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SetPasswordPage;