import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './views/Home.tsx'
import { ImagesContextProvider } from './context/images_context.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReviewPage from './views/Review.tsx'
import SavePage from './views/Save.tsx'



const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/review',
    element: <ReviewPage />,
  },
  {
    path: '/save',
    element: <SavePage />,

  }

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImagesContextProvider>
      <RouterProvider router={router} />
    </ImagesContextProvider>
  </StrictMode>,
)
