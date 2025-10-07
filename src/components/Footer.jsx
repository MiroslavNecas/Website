import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Mail, Phone, MapPin, Github, Linkedin, Globe } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';

    const iconMap = {
      github: Github,
      linkedin: Linkedin,
      default: Globe,
    };

    const Footer = () => {
      const [contacts, setContacts] = useState(null);

      useEffect(() => {
        const fetchContacts = async () => {
          const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .single();
          
          if (data) {
            setContacts(data);
          }
        };
        fetchContacts();

        const channel = supabase.channel('public:contacts')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
            setContacts(payload.new);
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }, []);

      if (!contacts) {
        return null;
      }

      return (
        <footer className="bg-black/40 backdrop-blur-md border-t border-gray-800 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Get In Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail size={18} />
                    <span>{contacts.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Phone size={18} />
                    <span>{contacts.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MapPin size={18} />
                    <span>{contacts.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
                <div className="flex space-x-4">
                  {contacts.social_links && contacts.social_links.map(social => {
                    const Icon = iconMap[social.name.toLowerCase()] || iconMap.default;
                    return (
                      <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors">
                        <Icon size={24} />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/about" className="block text-gray-300 hover:text-purple-400 transition-colors">About Me</Link>
                  <Link to="/jobs" className="block text-gray-300 hover:text-purple-400 transition-colors">Experience</Link>
                  <Link to="/blog" className="block text-gray-300 hover:text-purple-400 transition-colors">Blog</Link>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© {contacts.copyright_year || '2025'} Miroslav Necas. All rights reserved.</p>
              <Link to="/admin" className="text-xs text-gray-500 hover:text-gray-400 transition-colors mt-2 sm:mt-0">Admin</Link>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;