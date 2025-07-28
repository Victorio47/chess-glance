let cachedGMs: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchGMs = async (): Promise<any> => {
  // Check cache fir  st
  const now = Date.now();
  if (cachedGMs && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Using cached GMs data');
    return cachedGMs;
  }

  console.log('Fetching fresh GMs data from API');
  const res = await fetch('https://api.chess.com/pub/titled/GM');
  if (!res.ok) {
    throw new Error(`Ошибка загрузки гроссмейстеров: ${res.status}`);
  }
  
  const data = await res.json();
  
  // Cache the result
  cachedGMs = data;
  cacheTimestamp = now;
  
  return data;
};

export { fetchGMs };
export default fetchGMs; 