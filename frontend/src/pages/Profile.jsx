import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Save, X, Loader, Link as LinkIcon, Twitter, Linkedin, Github, Globe } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('bms_user') || 'null');
  const isOwnProfile = currentUser?.id === userId;

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
          setFormData({
            display_name: profileData.display_name || '',
            bio: profileData.bio || '',
            website: profileData.website || '',
            twitter: profileData.twitter || '',
            linkedin: profileData.linkedin || '',
            github: profileData.github || '',
          });
        } else {
          setProfile({ user_id: userId, display_name: currentUser?.email || 'Author' });
        }

        const postsResponse = await fetch(`http://localhost:5000/api/posts?author_id=${userId}`);
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setUserPosts(Array.isArray(postsData) ? postsData : []);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('bms_token');
      if (!token) throw new Error('You must be logged in to update profile');

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-8 h-8 text-accent" />
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-12 px-4"
    >
      <motion.div variants={itemVariants}>
        <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-accent mb-12 transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </Link>
      </motion.div>

      {/* Profile Header */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-12">
        <div className="card-panel p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <img
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.display_name || 'author'}&backgroundColor=transparent`}
                alt={profile?.display_name}
                className="w-24 h-24 rounded-full border-3 border-accent bg-surface-secondary"
              />
              <div>
                <h1 className="font-display text-4xl md:text-5xl text-text-main mb-2">
                  {profile?.display_name || currentUser?.email?.split('@')[0]}
                </h1>
                <p className="text-text-muted text-lg font-light">{userPosts.length} articles published</p>
              </div>
            </div>

            {isOwnProfile && !isEditing && (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </motion.button>
            )}
          </div>

          {/* Bio Section */}
          {!isEditing ? (
            <>
              {profile?.bio && (
                <motion.div variants={itemVariants} className="border-t border-border pt-8">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-text-subtle mb-4">About</h2>
                  <p className="text-text-main text-lg leading-relaxed font-light">{profile.bio}</p>
                </motion.div>
              )}

              {/* Social Links */}
              {(profile?.website || profile?.twitter || profile?.linkedin || profile?.github) && (
                <motion.div variants={itemVariants} className="border-t border-border pt-8">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-text-subtle mb-4">Connect</h2>
                  <div className="flex flex-wrap gap-4">
                    {profile?.website && (
                      <motion.a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-secondary text-accent hover:bg-accent hover:text-surface transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </motion.a>
                    )}
                    {profile?.twitter && (
                      <motion.a
                        href={`https://twitter.com/${profile.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-secondary text-accent hover:bg-accent hover:text-surface transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </motion.a>
                    )}
                    {profile?.linkedin && (
                      <motion.a
                        href={`https://linkedin.com/in/${profile.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-secondary text-accent hover:bg-accent hover:text-surface transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </motion.a>
                    )}
                    {profile?.github && (
                      <motion.a
                        href={`https://github.com/${profile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-secondary text-accent hover:bg-accent hover:text-surface transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            /* Edit Form */
            <motion.div variants={itemVariants} className="border-t border-border pt-8 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-subtle block mb-2">Display Name</label>
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  className="input-base w-full py-3 px-4"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-subtle block mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  maxLength={500}
                  className="input-base w-full py-3 px-4 min-h-[120px] resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-text-subtle text-xs mt-2">{formData.bio.length}/500</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-subtle block mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="input-base w-full py-3 px-4"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-subtle block mb-2">Twitter</label>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="input-base w-full py-3 px-4"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-subtle block mb-2">LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="input-base w-full py-3 px-4"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-subtle block mb-2">GitHub</label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="input-base w-full py-3 px-4"
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary py-3 px-6 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="btn-primary py-3 px-8 flex items-center gap-2 font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSaving ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                        <Loader className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Articles Section */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-main mb-8">
          {userPosts.length > 0 ? `${userPosts.length} Articles` : 'No articles yet'}
        </h2>
        
        <div className="space-y-6">
          {userPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card-panel p-6 md:p-8 hover:shadow-medium transition-all group cursor-pointer"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <Link to={`/posts/${post.id}`} className="block">
                <h3 className="text-xl md:text-2xl font-semibold text-text-main group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-text-muted mb-4 line-clamp-2">
                  {post.description || post.content.substring(0, 150)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    {post.category && (
                      <span className="px-3 py-1.5 rounded-full bg-surface-secondary text-accent text-xs font-semibold">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <p className="text-text-subtle text-sm">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
