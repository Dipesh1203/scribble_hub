export const generateRoomID = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz";

  function getRandomPart(length: number) {
    let part = "";
    for (let i = 0; i < length; i++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return part;
  }

  // Google Meet-style format: xxx-xxxx-xxx
  const part1 = getRandomPart(3);
  const part2 = getRandomPart(4);
  const part3 = getRandomPart(3);

  return `${part1}-${part2}-${part3}`;
};
