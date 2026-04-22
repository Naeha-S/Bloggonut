import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Trending } from './pages/Trending';
import { Bookmarks } from './pages/Bookmarks';
import { PostDetail } from './pages/PostDetail';
import { TopicPage } from './pages/TopicPage';
import { Auth } from './pages/Auth';
import { CreatePost } from './pages/CreatePost';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/topics/:topic" element={<TopicPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/write" element={<CreatePost />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
