import { Embedder } from "../src/lib/embedder.js";
import { Store } from "../src/lib/store.js";

async function main() {
  const query = process.argv[2] || "how to optimize images";
  console.log(`\n🔎 Searching for: "${query}"\n`);

  const embedder = Embedder.getInstance();
  const store = new Store();

  // 1. Embed
  console.log("Vectorizing query...");
  const vector = await embedder.embed(query);

  // 2. Search
  console.log("Querying LanceDB...");
  const results = await store.search(vector, 3);

  // 3. Display
  console.log("\nTop Results:");
  results.forEach((r, i) => {
    console.log(`\n${i + 1}. [${r.id}] (${r.category}) - Distance: ${r.distance?.toFixed(4)}`);
    console.log(`   ${r.description}`);
  });
}

main().catch(console.error);
