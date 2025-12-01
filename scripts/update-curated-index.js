import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const curatedDir = path.join(__dirname, '../public/curated');
const outputFile = path.join(curatedDir, 'index.json');

// Ensure curated directory exists
if (!fs.existsSync(curatedDir)) {
  console.error(`Directory not found: ${curatedDir}`);
  process.exit(1);
}

const files = fs
  .readdirSync(curatedDir)
  .filter((f) => f.endsWith('.json') && f !== 'index.json');

const index = {};

files.forEach((file) => {
  const topicId = file.replace('.json', '');
  try {
    const content = JSON.parse(
      fs.readFileSync(path.join(curatedDir, file), 'utf-8'),
    );

    const easy = content.easy?.length || 0;
    const medium = content.medium?.length || 0;
    const hard = content.hard?.length || 0;

    if (easy + medium + hard > 0) {
      index[topicId] = { easy, medium, hard };
    }
  } catch (e) {
    console.error(`Error parsing ${file}:`, e);
  }
});

fs.writeFileSync(outputFile, JSON.stringify(index, null, 2));
console.log(`Updated ${outputFile} with ${Object.keys(index).length} topics.`);
