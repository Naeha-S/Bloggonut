import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { CreatePost } from './pages/CreatePost';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/write" element={<CreatePost />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
