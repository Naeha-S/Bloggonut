export const TOPICS = [
  {
    label: 'Technology',
    slug: 'technology',
    description: 'Systems, performance, APIs, and future-facing web work.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Design',
    slug: 'design',
    description: 'Typography, motion, accessibility, and editorial layouts.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Development',
    slug: 'development',
    description: 'React, tooling, testing, and long-lived codebases.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'AI',
    slug: 'ai',
    description: 'Models, prompting, product thinking, and practical automation.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Startup',
    slug: 'startup',
    description: 'Founders, launch habits, landing pages, and momentum.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
  },
  {
    label: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Routines, focus, creative practice, and sustainable work.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200',
  },
];

const TOPIC_LOOKUP = TOPICS.reduce((accumulator, topic) => {
  accumulator[topic.slug] = topic;
  return accumulator;
}, {});

export const topicSlug = (value) => (value || '').toString().trim().toLowerCase().replace(/\s+/g, '-');

export const topicLabel = (value = '') => {
  const slug = topicSlug(value);
  return TOPIC_LOOKUP[slug]?.label || value;
};

export const getTopic = (value = '') => TOPIC_LOOKUP[topicSlug(value)] || null;

export const getTopicTitle = (value = '') => getTopic(value)?.label || topicLabel(value);
