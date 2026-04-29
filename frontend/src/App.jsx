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
import { EditPost } from './pages/EditPost';
// import { Profile } from './pages/Profile';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          {/* <Route path="/profile/:userId" element={<Profile />} /> */}
          <Route path="/topics/:topic" element={<TopicPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/write" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
