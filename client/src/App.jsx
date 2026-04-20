import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Header from './components/Header/Header.jsx';
import AdminBar from './components/AdminBar/AdminBar.jsx';
import CreatePost from './components/CreatePost/CreatePost.jsx';
import Feed from './components/Feed/Feed.jsx';
import LoginModal from './components/LoginModal/LoginModal.jsx';
import ImageLightbox from './components/ImageLightbox/ImageLightbox.jsx';

function AppContent() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const handleImageClick = useCallback((images, index) => {
    setLightbox({ images, currentIndex: index });
  }, []);

  const handlePostCreated = useCallback((post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  return (
    <>
      <Header onLoginClick={() => setShowLogin(true)} />
      <AdminBar />
      {isAdmin && <CreatePost onPostCreated={handlePostCreated} />}
      <Feed posts={posts} setPosts={setPosts} onImageClick={handleImageClick} />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          currentIndex={lightbox.currentIndex}
          onClose={() => setLightbox(null)}
          onNavigate={(i) =>
            setLightbox((prev) => ({ ...prev, currentIndex: i }))
          }
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
