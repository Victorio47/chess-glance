const fetchGMs = async (): Promise<any> => {
  const res = await fetch('https://api.chess.com/pub/titled/GM');
  if (!res.ok) {
    throw new Error(`Ошибка загрузки гроссмейстеров: ${res.status}`);
  }
  return res.json();
};

export { fetchGMs };
export default fetchGMs; 