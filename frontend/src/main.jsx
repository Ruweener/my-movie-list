import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './pages/home.jsx'
import About from './pages/about.jsx';
import CreateReview from './pages/createReview.jsx';
import ViewReviews from './pages/viewReviews.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <App /> } />
        <Route path='/about' element={ <About /> } />
        <Route path='/reviews/create/:id/:title' element={ <CreateReview /> } />'
        <Route path='/reviews' element={ <ViewReviews /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
