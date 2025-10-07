import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AdBanner from '@/components/AdBanner';

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-purple-400 hover:text-purple-300">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <Helmet>
        <title>{post.title} - Miroslav Necas</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(post.publish_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.read_time} min</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {post.image_url && (
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none 
            prose-strong:text-white 
            prose-em:text-purple-300 
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/20 prose-pre:rounded-lg prose-pre:p-4
            prose-code:text-purple-300 prose-code:before:content-[''] prose-code:after:content-[''] prose-code:bg-white/10 prose-code:rounded prose-code:p-1
            prose-pre>code:bg-transparent prose-pre>code:p-0
          ">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {post.show_ads && <AdBanner />}
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPostPage;