import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/SE_challengeLogo.svg";
import { games } from "../data/games";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const linkBase =
    "px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-800";
  const active = "text-green-700 font-semibold";
  const inactive = "text-gray-400";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-zinc-950/70 backdrop-blur shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        {/* Brand */}
        <NavLink to="/" className="text-2xl font-extrabold tracking-wide text-green-700">
          <span className="inline-flex items-center gap-2">
            <img
              src={Logo}
              alt="Science & Engineering Challenge logo"
              className="h-15 w-15 object-contain mt-2.5"
              loading="lazy"
              decoding="async"
            />
            <span>SEC Games</span>
          </span>
        </NavLink>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          type="button"
        >
          {/* Hamburger icon */}
          <span className="flex flex-col items-center justify-center" aria-hidden="true">
            <span className="block w-6 h-0.5 bg-white rounded mb-1"></span>
            <span className="block w-6 h-0.5 bg-white rounded mb-1"></span>
            <span className="block w-6 h-0.5 bg-white rounded"></span>
          </span>
        </button>

        {/* Links: horizontal on md+, collapsible on mobile */}
        <div
          id="mobile-menu"
          className={`
            ${open ? "flex" : "hidden"} 
            absolute left-0 right-0 top-16 md:static md:flex
            flex-col md:flex-row
            bg-zinc-950/90 md:bg-transparent
            gap-2 md:gap-4
            px-4 py-3 md:p-0
            border-b md:border-0
          `}
        >
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            Home
          </NavLink>
          {games.map((game) => (
            <NavLink
              key={game.slug}
              to={`/game/${game.slug}`}
              className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
              onClick={() => setOpen(false)}
            >
              {game.displayName}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
