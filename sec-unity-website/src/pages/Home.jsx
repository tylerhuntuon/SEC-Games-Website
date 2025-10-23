import { Link } from "react-router-dom";
import { games } from "../data/games";

export default function Home() {
  return (
    <div className="pt-16 min-h-[calc(100vh)] bg-gradient-to-br from-black/90 to-green-700">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-neutral-300">
          Welcome to the Science & Engineering Challenge Games
        </h1>
        <p className="mt-3 text-lg text-neutral-300 max-w-2xl">
          Explore interactive Unity games that bring STEM concepts to life.
          Select a game from the navigation bar to get started.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {games.length === 0 ? (
            <div className="card p-5 bg-white/30">
              <h3 className="text-xl text-neutral-100 font-semibold">Games coming soon</h3>
              <p className="text-sm text-white mt-1">Add a Unity build folder inside <code>public/</code> to list it here.</p>
            </div>
          ) : (
            games.map((game) => (
              <Link key={game.slug} to={`/game/${game.slug}`} className="card p-5 bg-white/30 hover:bg-white/40 transition">
                <h3 className="text-xl text-neutral-100 font-semibold">{game.displayName}</h3>
                <p className="text-sm text-white mt-1">
                  {game.description || `Play ${game.displayName}`}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
