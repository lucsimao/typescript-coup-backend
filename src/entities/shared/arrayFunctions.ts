export const fisherYatesShuffleArray = <T>(input: T[]) => {
  const result = [...input];
  let i = result.length;
  while (--i > 0) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [result[randomIndex], result[i]] = [result[i], result[randomIndex]];
  }

  return result;
};
