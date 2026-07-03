import type { Category, HuntItem } from "./types";

export const ITEMS: HuntItem[] = [
  // Nature
  { id: "heart-leaf", item: "A leaf shaped like a heart", category: "nature", bonus: true },
  { id: "round-stone", item: "A perfectly round stone", category: "nature" },
  { id: "letter-twig", item: "A twig that looks like a letter of the alphabet", category: "nature", bonus: true },
  { id: "clover", item: "A piece of clover (bonus points for 4 leaves!)", category: "nature", bonus: true },
  { id: "dandelion", item: 'A dandelion (either yellow or a white "puffball")', category: "nature" },
  { id: "pinecone", item: "A pinecone", category: "nature" },
  { id: "fallen-bark", item: "A piece of tree bark that has fallen on the ground", category: "nature" },
  { id: "long-grass", item: "A blade of grass longer than your thumb", category: "nature" },
  { id: "feather", item: "A feather", category: "nature", bonus: true },
  { id: "skipping-stone", item: "A smooth skipping stone", category: "nature" },
  { id: "maple-seed", item: 'A maple tree seed (a "helicopter")', category: "nature", bonus: true },
  { id: "shell", item: "An empty snail or beetle shell", category: "nature" },
  { id: "multicolor-rock", item: "A rock with more than one color in it", category: "nature", bonus: true },
  { id: "moss", item: "A patch of green moss", category: "nature" },
  { id: "crunchy-leaves", item: "A handful of dry, crunchy leaves", category: "nature" },
  { id: "big-stick", item: "A stick longer than your arm", category: "nature" },
  { id: "wildflower", item: "A piece of wild clover or a tiny wildflower", category: "nature" },
  { id: "animal-rock", item: "A rock that looks like an animal", category: "nature", bonus: true },
  { id: "seed-pod", item: "A seed pod or acorn cap", category: "nature" },
  { id: "sand-cup", item: "A small amount of sand or loose dirt in a cup", category: "nature" },

  // Around the outside of the house
  { id: "garden-hose", item: "A garden hose", category: "outside" },
  { id: "flowerpot", item: "A flowerpot (with or without a plant)", category: "outside" },
  { id: "doormat", item: "A doormat", category: "outside" },
  { id: "patio-chair", item: "A patio chair or lawn chair", category: "outside" },
  { id: "bike", item: "A bicycle or scooter", category: "outside" },
  { id: "watering-can", item: "A watering can", category: "outside" },
  { id: "clothespin", item: "A clothespin", category: "outside" },
  { id: "porch-light", item: "A porch light", category: "outside" },
  { id: "brick", item: "A brick", category: "outside" },
  { id: "outdoor-toy", item: "An outdoor toy (like a sidewalk chalk piece or a ball)", category: "outside" },
  { id: "puddle", item: "A puddle or a wet spot from the hose", category: "outside" },
  { id: "spiderweb", item: "A spiderweb (just look, don't touch!)", category: "outside", bonus: true },
  { id: "mailbox", item: "A mailbox", category: "outside" },
  { id: "something-wood", item: "Something made of wood (like a fence or deck)", category: "outside" },

  // Near the windows & porch
  { id: "window-screen", item: "A window screen", category: "windows" },
  { id: "thermometer", item: "A thermometer (indoor or outdoor)", category: "windows" },
  { id: "keys", item: "A set of keys", category: "windows" },
  { id: "sunglasses", item: "Sunglasses", category: "windows" },
  { id: "sun-hat", item: "A sun hat or baseball cap", category: "windows" },

  // Inside the house
  { id: "coin", item: "A coin", category: "inside" },
  { id: "blue-book", item: "A book with a blue cover", category: "inside" },
  { id: "colorful-sock", item: "A colorful sock", category: "inside" },
  { id: "plastic-cup", item: "A plastic cup", category: "inside" },
  { id: "fridge-magnet", item: "A refrigerator magnet", category: "inside" },
  { id: "junk-mail", item: "A piece of junk mail", category: "inside" },
  { id: "toy-wheels", item: "A toy with wheels", category: "inside" },
  { id: "tv-remote", item: "A television remote", category: "inside" },
  { id: "tube", item: "A tissue or paper towel roll tube", category: "inside" },
  { id: "laced-shoe", item: "A shoe with laces", category: "inside" },
];

export const ITEMS_BY_ID: Record<string, HuntItem> = Object.fromEntries(
  ITEMS.map((it) => [it.id, it]),
);

export const TOTAL_ITEMS = ITEMS.length;

export const CATEGORY_ORDER: Category[] = ["nature", "outside", "windows", "inside"];

export const CATEGORY_LABELS: Record<Category, string> = {
  nature: "Nature",
  outside: "Around the House",
  windows: "Windows & Porch",
  inside: "Inside the House",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  nature: "🌿",
  outside: "🏡",
  windows: "🪟",
  inside: "🛋️",
};

/** Returns a new array with the items shuffled (Fisher-Yates). */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
