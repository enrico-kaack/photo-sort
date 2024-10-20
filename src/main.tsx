import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './views/Home.tsx'
import { ImagesContextProvider } from './context/images_context.tsx'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import ReviewPage from './views/Review.tsx'
import SavePage from './views/Save.tsx'
import Impressum from './views/Impressum.tsx'

const router = createHashRouter([
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
  },
  {
    path: '/impressum',
    element: <Impressum />,
  }

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImagesContextProvider>
      <RouterProvider router={router} />
    </ImagesContextProvider>
  </StrictMode>,
)
