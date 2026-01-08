import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';

const SOURCE_DIR = "/Users/marckremers/Library/CloudStorage/GoogleDrive-marckremers.com@gmail.com/My Drive/2025:2026 Work/USM David Michon/Assets/SIT WITH THAT - HI RES";
const OUTPUT_DIR = "./public/images";
const MAX_DIMENSION = 2048;

async function processImages() {
  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Get all image files
  const files = await readdir(SOURCE_DIR);
  const imageFiles = files.filter(f =>
    /\.(tif|tiff|jpg|jpeg|png)$/i.test(f)
  );

  console.log(`Found ${imageFiles.length} images to process\n`);

  for (const file of imageFiles) {
    const inputPath = join(SOURCE_DIR, file);
    const outputName = basename(file, extname(file))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '.jpg';
    const outputPath = join(OUTPUT_DIR, outputName);

    console.log(`Processing: ${file}`);
    console.log(`  → ${outputName}`);

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      console.log(`  Original: ${metadata.width}x${metadata.height}, ${metadata.space || 'unknown'} color space`);

      // Resize maintaining aspect ratio, convert to sRGB, compress
      await image
        .resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toColorspace('srgb')
        .jpeg({
          quality: 85,
          progressive: true
        })
        .toFile(outputPath);

      const outputMeta = await sharp(outputPath).metadata();
      console.log(`  Output: ${outputMeta.width}x${outputMeta.height}, sRGB`);
      console.log(`  ✓ Done\n`);

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}\n`);
    }
  }

  console.log('All images processed!');
}

processImages().catch(console.error);
