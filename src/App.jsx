import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Post from './pages/Post';
import ArmyPage from './pages/ArmyPage';
import NavyPage from './pages/NavyPage';
import AirForcePage from './pages/AirForcePage';
import Search from './pages/Search';

/**
 * App — Root component with HashRouter for GitHub Pages compatibility.
 * Routes:
 *   /           → Home (post listing)
 *   /blog/:slug → Individual blog post
 *   /army       → Indian Army page
 *   /navy       → Indian Navy page
 *   /airforce   → Indian Air Force page
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog/:slug" element={<Post />} />
          <Route path="army" element={<ArmyPage />} />
          <Route path="navy" element={<NavyPage />} />
          <Route path="airforce" element={<AirForcePage />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
