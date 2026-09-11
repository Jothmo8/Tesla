import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = './assets/images';
const files = fs.readdirSync(dir);

async function convert() {
  for (const file of files) {
    if (file.endsWith('.avif')) {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, file.replace('.avif', '.jpg'));
      await sharp(inputPath).jpeg().toFile(outputPath);
      console.log(`Converted ${file} to JPG`);
    }
  }
}

convert().catch(console.error);
