import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ImageSelector from '@/components/ImageSelector';
import Editor from '@/components/Editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const AdminBlog = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    publish_date: '',
    read_time: '',
    tags: '',
    image_url: '',
    published: false,
    show_ads: false,
  });

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
    if (error) console.error(error);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      ...formData,
      tags: String(formData.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      read_time: parseInt(formData.read_time, 10) || null,
      published: formData.published === true,
      show_ads: formData.show_ads === true,
      user_id: user.id,
    };

    let error;
    if (editingPost) {
      ({ error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', editingPost.id));
    } else {
      ({ error } = await supabase.from('blog_posts').insert([postData]));
    }

    if (error) {
      toast({
        title: 'Error saving post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: `Post ${editingPost ? 'Updated' : 'Added'}`,
        description: `Blog post has been ${editingPost ? 'updated' : 'added'} successfully.`,
      });
      resetForm();
      fetchPosts();
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : String(post.tags || ''),
      published: !!post.published,
      show_ads: !!post.show_ads,
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (error) {
      toast({
        title: 'Error deleting post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Post Deleted',
        description: 'Blog post has been deleted successfully.',
      });
      fetchPosts();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      publish_date: '',
      read_time: '',
      tags: '',
      image_url: '',
      published: false,
      show_ads: false,
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleImageSelect = (imageUrl) => {
    setFormData({ ...formData, image_url: imageUrl });
    setShowImageSelector(false);
  };

  const handleContentChange = (e) => {
    // This handles both textarea and the Editor component
    const value = e.target ? e.target.value : e;
    setFormData({ ...formData, content: value });
  };

  return (
    <div className="pt-16">
      <Helmet>
        <title>Manage Blog - Admin Panel</title>
        <meta name="description" content="Manage blog posts and content." />
      </Helmet>

      <ImageSelector
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link
            to="/admin"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Admin Panel
          </Link>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Manage Blog Posts</h1>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus size={20} className="mr-2" /> Add New Post
            </Button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPost ? 'Edit Post' : 'Add New Post'}
                </h2>
                <Button onClick={resetForm} variant="outline" size="sm">
                  <X size={16} />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="publish_date">Publish Date *</Label>
                    <Input
                      id="publish_date"
                      type="date"
                      value={formData.publish_date}
                      onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="read_time">Read Time (minutes)</Label>
                    <Input
                      id="read_time"
                      type="number"
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" variant="outline" onClick={() => setShowImageSelector(true)}>
                      <ImageIcon size={16} className="mr-2" /> Select
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <Label>Content *</Label>
                  <Editor value={formData.content} onChange={handleContentChange} />
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="published"
                      className="h-4 w-4"
                      checked={formData.published === true}
                      onCheckedChange={(v) =>
                        setFormData((prev) => ({ ...prev, published: v === true }))
                      }
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show_ads"
                      className="h-4 w-4"
                      checked={formData.show_ads === true}
                      onCheckedChange={(v) =>
                        setFormData((prev) => ({ ...prev, show_ads: v === true }))
                      }
                    />
                    <Label htmlFor="show_ads">Show Ad</Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Save size={20} className="mr-2" />
                  {editingPost ? 'Update Post' : 'Add Post'}
                </Button>
              </form>
            </motion.div>
          )}

          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{post.title}</h3>
                    <p className="text-purple-400 mb-2">
                      By {post.author} on {post.publish_date}
                    </p>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.published
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.show_ads && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Ad Enabled
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(post)} variant="outline" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-300">{post.excerpt}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBlog;