const loaderManifest = import.meta.glob("/**/Build/*.loader.js");

const metaManifest = import.meta.glob("/**/meta.json", {
  eager: true,
  query: "?url",
  import: "default",
});

const usedSlugs = new Set();

function slugify(value) {
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[^0-9a-zA-Z\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function uniqueSlug(source) {
  let base = slugify(source);
  if (!base) base = "game";
  let slug = base;
  let counter = 1;
  while (usedSlugs.has(slug)) {
    counter += 1;
    slug = `${base}-${counter}`;
  }
  usedSlugs.add(slug);
  return slug;
}

function toTitleCase(value) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeParts(path) {
  const parts = path.split("/").filter(Boolean);
  if (parts[0]?.toLowerCase() === "public") {
    parts.shift();
  }
  return parts;
}

const loaderByFolder = {};
for (const path of Object.keys(loaderManifest)) {
  const parts = normalizeParts(path);
  if (parts.length < 3) continue;
  if (parts[1]?.toLowerCase() !== "build") continue;
  const folder = parts[0];
  const fileName = parts.at(-1);
  const base = fileName?.replace(/\.loader\.js$/, "");
  if (base) {
    loaderByFolder[folder] = base;
  }
}

const metaByFolder = {};

if (typeof window !== "undefined") {
  const metaEntries = await Promise.all(
    Object.entries(metaManifest).map(async ([path, url]) => {
      const parts = normalizeParts(path);
      if (parts.length !== 2) return null;
      const folder = parts[0];
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data || typeof data !== "object") return null;
        return [folder, data];
      } catch {
        return null;
      }
    })
  );

  for (const entry of metaEntries) {
    if (!entry) continue;
    const [folder, meta] = entry;
    metaByFolder[folder] = meta;
  }
}

const gamesWithAliases = [];

const folders = Object.keys(loaderByFolder).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);

for (const folder of folders) {
  const meta = metaByFolder[folder] ?? {};
  const preferredSlugSource =
    typeof meta.slug === "string" && meta.slug.trim().length ? meta.slug.trim() : folder;
  const slug = uniqueSlug(preferredSlugSource);

  const baseName = loaderByFolder[folder];
  if (!baseName) {
    continue;
  }

  const title =
    typeof meta.title === "string" && meta.title.trim().length
      ? meta.title.trim()
      : folder;

  const displayName =
    typeof meta.displayName === "string" && meta.displayName.trim().length
      ? meta.displayName.trim()
      : toTitleCase(title);

  const description =
    typeof meta.description === "string" && meta.description.trim().length
      ? meta.description.trim()
      : "";

  const order = Number.isFinite(meta.order) ? meta.order : null;
  const aliasSet = new Set(
    Array.isArray(meta.aliases)
      ? meta.aliases.filter((alias) => typeof alias === "string" && alias.trim().length)
      : []
  );

  aliasSet.add(folder);
  aliasSet.add(preferredSlugSource);

  const aliases = Array.from(aliasSet)
    .map((alias) => alias.trim())
    .filter(Boolean)
    .flatMap((alias) => {
      const slugged = slugify(alias);
      return slugged && slugged !== alias ? [alias, slugged] : [alias];
    })
    .filter((alias, index, arr) => alias !== slug && arr.indexOf(alias) === index);

  gamesWithAliases.push({
    slug,
    folder,
    title,
    displayName,
    description,
    baseName,
    order,
    aliases,
  });
}

gamesWithAliases.sort((a, b) => {
  const orderA = Number.isFinite(a.order) ? a.order : Number.POSITIVE_INFINITY;
  const orderB = Number.isFinite(b.order) ? b.order : Number.POSITIVE_INFINITY;
  if (orderA !== orderB) return orderA - orderB;
  return a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" });
});

const canonicalGames = gamesWithAliases.map(({ aliases, order, ...rest }) => ({
  ...rest,
}));

const gameBySlug = {};
const canonicalBySlug = Object.fromEntries(canonicalGames.map((game) => [game.slug, game]));

for (const entry of gamesWithAliases) {
  const game = canonicalBySlug[entry.slug];
  gameBySlug[entry.slug] = game;
  for (const alias of entry.aliases) {
    if (!gameBySlug[alias]) {
      gameBySlug[alias] = game;
    }
  }
}

const LEGACY_SLUGS = {
  game1: "unity-game-1",
  game2: "unity-game-2",
  game3: "unity-game-3",
};

for (const [alias, targetSlug] of Object.entries(LEGACY_SLUGS)) {
  if (gameBySlug[alias]) continue;
  const target = gameBySlug[targetSlug];
  if (target) {
    gameBySlug[alias] = target;
  }
}

export { canonicalGames as games, gameBySlug };
