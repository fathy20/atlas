const ABSOLUTE_URL_REGEX = /^(?:[a-z]+:)?\/\//i;

const normalizeBase = (base: string) => {
  let normalized = base || "/";
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (!normalized.endsWith("/")) normalized = `${normalized}/`;
  return normalized;
};

const withBase = (path: string) => {
  const base = normalizeBase(import.meta.env.BASE_URL || "/");
  const cleanedPath = path.replace(/^\/+/, "");

  if (base === "/") return `/${cleanedPath}`;
  if (path.startsWith(base)) return path;

  return `${base}${cleanedPath}`;
};

export const resolveMediaUrl = (value?: string | null, fallback = "placeholder.svg") => {
  const input = value?.trim() || "";

  if (!input) return withBase(fallback);

  if (ABSOLUTE_URL_REGEX.test(input) || input.startsWith("data:") || input.startsWith("blob:")) {
    return input;
  }

  return withBase(input);
};
