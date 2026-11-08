import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import PageLoader from './components/ui/PageLoader'
import StartupSplash from './components/ui/StartupSplash'
import { ToastProvider } from './context/ToastContext'

// Code splitting & Lazy Loading for all routes
const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'))
const IngredientSearch = lazy(() => import('./pages/IngredientSearch'))
const MyRecipes = lazy(() => import('./pages/MyRecipes'))
const Favorites = lazy(() => import('./pages/Favorites'))
const MealPlanner = lazy(() => import('./pages/MealPlanner'))
const ShoppingList = lazy(() => import('./pages/ShoppingList'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <ToastProvider>
      {/* Cool Startup Animation on initial load */}
      {showSplash && <StartupSplash onFinish={() => setShowSplash(false)} />}

      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="jelajah" element={<Explore />} />
              <Route path="resep/:id" element={<RecipeDetail />} />
              <Route path="cari-bahan" element={<IngredientSearch />} />
              <Route path="resep-saya" element={<MyRecipes />} />
              <Route path="favorit" element={<Favorites />} />
              <Route path="jadwal" element={<MealPlanner />} />
              <Route path="belanja" element={<ShoppingList />} />
              <Route path="profil" element={<Profile />} />
              <Route path="pengaturan" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
