/** @format */

export const TOY_EMOJIS = [
  "🎮", // video game
  "🧸", // teddy bear
  "🎨", // art supplies
  "🚗", // toy car
  "🎪", // circus tent (toy tent)
  "🎲", // game die
  "🧩", // puzzle piece
  "🪀", // yo-yo
  "🎯", // dart board
  "🎪", // toy tent
  "🪁", // kite
  "📚", // books
  "🎭", // theater masks
  "🎨", // art palette
  "🎪", // toy circus
];

export function getRandomToyEmoji(): string {
  const randomIndex = Math.floor(Math.random() * TOY_EMOJIS.length);
  return TOY_EMOJIS[randomIndex];
}
