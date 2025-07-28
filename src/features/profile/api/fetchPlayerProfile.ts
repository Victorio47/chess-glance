const fetchPlayerProfile = async (username: string): Promise<any> => {
  const res = await fetch(`https://api.chess.com/pub/player/${username}`);
  if (!res.ok) {
    throw new Error(`Ошибка загрузки профиля игрока: ${res.status}`);
  }
  return res.json();
};

export { fetchPlayerProfile };
export default fetchPlayerProfile; 