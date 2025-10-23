import { useParams } from "react-router-dom";
import { gameBySlug } from "../data/games";

export default function GamePage() {
  const { slug } = useParams();
  const game = slug ? gameBySlug[slug] : undefined;
  const embedSrc = game
    ? `/unity-embed.html?${new URLSearchParams({
        folder: game.folder,
        name: game.baseName,
      }).toString()}`
    : null;

  return (
    <div className="pt-16 min-h-[calc(100vh)] bg-gradient-to-br from-black/90 to-green-700">
      <div className="container mx-auto px-6 py-8">
        {!game ? (
          <div className="p-6 bg-white rounded-xl border shadow">
            <h2 className="text-2xl font-bold">Game Not Found</h2>
            <p className="text-gray-600 mt-2">Please choose a game from the navbar.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-neutral-200 mb-4">{game.displayName}</h2>
            <div className="aspect-video w-full border-4 border-zinc-700 rounded-xl shadow-xl overflow-hidden bg-white">
              {/* Generic embed page so each game auto-fits without editing its index.html */}
              <iframe src={embedSrc} title={game.displayName} className="w-full h-full border-0" allowFullScreen />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Tip: Unity WebGL builds work best in modern browsers (Chrome, Edge, Firefox, Safari).
            </p>
          </>
        )}
      </div>
    </div>
  );
}
