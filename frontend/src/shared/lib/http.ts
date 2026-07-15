export async function fetcher(url: string) {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}
