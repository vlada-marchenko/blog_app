export async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `An error occurred while fetching the data: ${res.statusText}`,
    );
  }
  return res.json();
}
