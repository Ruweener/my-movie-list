import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './pages/home.jsx'
import About from './pages/about.jsx';
import CreateReview from './pages/createReview.jsx';
import ViewReviews from './pages/viewReviews.jsx';
import Watchlist from './pages/watchlist.jsx';
import Login from './pages/login.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <App /> } />
          <Route path='/about' element={ <About /> } />
          <Route path='/login' element={ <Login /> } />
          <Route
            path='/reviews/create/:id/:title'
            element={
              <ProtectedRoute>
                <CreateReview />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reviews'
            element={
              <ProtectedRoute>
                <ViewReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path='/watchlist'
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
