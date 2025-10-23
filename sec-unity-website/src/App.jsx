import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed navbar at very top */}
      <NavBar />

      {/* Pages handle their own top padding under the fixed navbar */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:slug" element={<GamePage />} />
          <Route
            path="*"
            element={
              <div className="container mx-auto p-6">
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                  <h2 className="text-2xl font-bold text-red-700">Page not found</h2>
                  <p className="text-red-700/80 mt-2">Use the navbar to navigate.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
