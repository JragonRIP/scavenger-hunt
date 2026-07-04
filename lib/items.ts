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

  // Small Details & Nature Finds
  { id: "sparkling-rock", item: "A rock that sparkles in the sun", category: "nature" },
  { id: "v-shaped-stick", item: "A V-shaped stick (like a slingshot)", category: "nature" },
  { id: "dried-root", item: "A piece of dried root", category: "nature" },
  { id: "footprint-dirt", item: "A patch of dirt shaped like a footprint", category: "nature" },
  { id: "holey-leaf", item: "A leaf that has tiny holes eaten through it by bugs", category: "nature" },
  { id: "dandelion-leaf", item: "A dandelion leaf (the jagged, toothy kind)", category: "nature" },
  { id: "acorn", item: "An acorn (or a different type of tree nut)", category: "nature" },
  { id: "white-rock", item: "A white rock", category: "nature" },
  { id: "green-leaf", item: "A leaf that is still completely green", category: "nature" },
  { id: "dried-mud", item: "A piece of dried-up mud", category: "nature" },
  { id: "straight-stick", item: "A stick that is perfectly straight", category: "nature" },
  { id: "wet-leaf", item: "A wet leaf", category: "nature" },
  { id: "wide-grass", item: "A blade of grass that is wider than a pinky finger", category: "nature" },
  {
    id: "bird-nest",
    item: "An empty bird's nest (look up in the branches, don't disturb it!)",
    category: "nature",
    bonus: true,
  },
  { id: "flat-rock", item: "A rock that is completely flat on one side", category: "nature" },
  {
    id: "berry-cluster",
    item: "A cluster of berries on a bush (remind them: do not eat!)",
    category: "nature",
    bonus: true,
  },
  { id: "pine-needles", item: "A piece of pine needle cluster", category: "nature" },
  {
    id: "clover-bees",
    item: "A patch of clover where bees are busy working (observe from a safe distance)",
    category: "nature",
    bonus: true,
  },
  { id: "sky-puddle", item: "A puddle reflecting the sky", category: "nature" },
  { id: "funny-shadow", item: "A shadow that looks like something funny", category: "nature", bonus: true },

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

  // Around the Garage, Shed, & Yard Gear
  { id: "gardening-glove", item: "A gardening glove", category: "outside" },
  { id: "plant-marker", item: "A plastic plant marker or tag", category: "outside" },
  { id: "soil-bag", item: "A bag of soil or mulch", category: "outside" },
  { id: "rake-or-shovel", item: "A rake or a shovel", category: "outside" },
  { id: "extension-cord", item: "An outdoor extension cord", category: "outside" },
  { id: "bungee-rope", item: "A bungee cord or piece of rope", category: "outside" },
  { id: "bucket", item: "A bucket (empty or full)", category: "outside" },
  { id: "padlock", item: "A padlock or hitch lock", category: "outside" },
  { id: "tire", item: "A tire (on a wheelbarrow, lawnmower, or car)", category: "outside" },
  { id: "flashlight", item: "A flashlight", category: "outside" },
  { id: "sports-net", item: "A sports net (like a basketball hoop or soccer net)", category: "outside" },
  { id: "grill-tool", item: "A grill scraper or barbecue tongs", category: "outside" },
  { id: "bird-feeder", item: "A bird feeder or birdbath", category: "outside" },
  { id: "scrap-wood", item: "A piece of scrap wood", category: "outside" },
  { id: "tarp", item: "A tarp", category: "outside" },

  // Near the windows & porch
  { id: "window-screen", item: "A window screen", category: "windows" },
  { id: "thermometer", item: "A thermometer (indoor or outdoor)", category: "windows" },
  { id: "keys", item: "A set of keys", category: "windows" },
  { id: "sunglasses", item: "Sunglasses", category: "windows" },
  { id: "sun-hat", item: "A sun hat or baseball cap", category: "windows" },

  // Exterior Architecture & Fixtures
  { id: "doorbell", item: "A doorbell", category: "windows" },
  { id: "downspout", item: "A downspout or gutter pipe", category: "windows" },
  { id: "outlet-cover", item: "An outdoor electrical outlet cover", category: "windows" },
  { id: "window-sill", item: "A window sill", category: "windows" },
  { id: "gate-latch", item: "A padlock or latch on a gate", category: "windows" },
  { id: "garage-button", item: "A garage door button or sensor", category: "windows" },
  { id: "vent-grate", item: "A ventilation grate", category: "windows" },
  { id: "metal-hinge", item: "A metal hinge", category: "windows" },

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

  // Quick Indoor Bonus Targets
  { id: "text-mug", item: "A coffee mug with text on it", category: "inside", bonus: true },
  { id: "bookmark", item: "A bookmark", category: "inside", bonus: true },
  { id: "fuzzy-soft", item: "Something that feels fuzzy or soft", category: "inside", bonus: true },
  { id: "aluminum-foil", item: "A piece of aluminum foil", category: "inside", bonus: true },
  { id: "dice", item: "A dice from a board game", category: "inside", bonus: true },
  { id: "purple-crayon", item: "A purple crayon or marker", category: "inside", bonus: true },
  { id: "throw-pillow", item: "A throw pillow", category: "inside", bonus: true },
  { id: "cardboard-box", item: "An empty cardboard box", category: "inside", bonus: true },
];

export const ITEMS_BY_ID: Record<string, HuntItem> = Object.fromEntries(
  ITEMS.map((it) => [it.id, it]),
);

export const TOTAL_ITEMS = ITEMS.length;

export const CATEGORY_ORDER: Category[] = ["nature", "outside", "windows", "inside"];

export const CATEGORY_LABELS: Record<Category, string> = {
  nature: "Small Details & Nature Finds",
  outside: "Around the Garage, Shed, & Yard Gear",
  windows: "Exterior Architecture & Fixtures",
  inside: "Quick Indoor Bonus Targets",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  nature: "🐜",
  outside: "🛠️",
  windows: "🚪",
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
