function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20);
}

export async function generateUniqueUsername(name: string) {
  const base = slugify(name);

  const random = Math.floor(Math.random() * 9000) + 1000;

  const username = `${base}${random}`;

  return username;
}
