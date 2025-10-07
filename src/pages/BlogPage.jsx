import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, ArrowRight, ChevronDown, Search } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [sortBy, setSortBy] = useState('publish_date_desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags, author')
        .eq('published', true);

      if (data) {
        const uniqueTags = [...new Set(data.flatMap(post => post.tags || []))];
        const uniqueAuthors = [...new Set(data.map(post => post.author).filter(Boolean))];
        setAllTags(uniqueTags);
        setAllAuthors(uniqueAuthors);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true);

      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }
      if (selectedAuthor) {
        query = query.eq('author', selectedAuthor);
      }
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
      }

      if (sortBy === 'publish_date_desc') {
        query = query.order('publish_date', { ascending: false });
      } else if (sortBy === 'read_time_asc') {
        query = query.order('read_time', { ascending: true, nullsFirst: false });
      } else if (sortBy === 'read_time_desc') {
        query = query.order('read_time', { ascending: false, nullsFirst: false });
      }
      
      const { data, error } = await query;
      
      if (data) {
        setPosts(data);
      }
    };
    fetchPosts();
  }, [selectedTag, selectedAuthor, sortBy, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleResetFilters = () => {
    setSelectedTag('');
    setSelectedAuthor('');
    setSortBy('publish_date_desc');
    setSearchTerm('');
  };

  const getSortByLabel = (value) => {
    switch (value) {
      case 'read_time_asc': return 'Read Time (Shortest)';
      case 'read_time_desc': return 'Read Time (Longest)';
      default: return 'Newest';
    }
  };

  return (
    <div className="pt-16">
      <Helmet>
        <title>Blog - Miroslav Necas</title>
        <meta name="description" content="Personal blog of Miroslav Necas covering web development, technology insights, and professional experiences." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Personal Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Thoughts, insights, and experiences from my journey in technology
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center mb-12 bg-white/5 p-4 rounded-xl border border-white/10"
        >
          <div className="relative w-full md:w-auto md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white/10 border-white/20"
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  {selectedTag || 'All Tags'} <ChevronDown size={16} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={selectedTag} onValueChange={setSelectedTag}>
                  <DropdownMenuRadioItem value="">All Tags</DropdownMenuRadioItem>
                  {allTags.map(tag => <DropdownMenuRadioItem key={tag} value={tag}>{tag}</DropdownMenuRadioItem>)}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  {selectedAuthor || 'All Authors'} <ChevronDown size={16} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={selectedAuthor} onValueChange={setSelectedAuthor}>
                  <DropdownMenuRadioItem value="">All Authors</DropdownMenuRadioItem>
                  {allAuthors.map(author => <DropdownMenuRadioItem key={author} value={author}>{author}</DropdownMenuRadioItem>)}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  Sort by: {getSortByLabel(sortBy)} <ChevronDown size={16} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="publish_date_desc">Newest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="read_time_asc">Read Time (Shortest)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="read_time_desc">Read Time (Longest)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" onClick={handleResetFilters} className="text-purple-400 hover:text-purple-300">Reset</Button>
          </div>
        </motion.div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No blog posts match your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="block group">
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all duration-300 h-full flex flex-col"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 overflow-hidden">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <img alt={`Blog post about ${post.title}`} src="https://images.unsplash.com/photo-1560510368-611be7ca72cd" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.publish_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.read_time} min</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-300 mb-4 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(post.tags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs border border-purple-600/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="inline-flex items-center text-purple-400 group-hover:text-purple-300 transition-colors font-medium mt-auto">
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;