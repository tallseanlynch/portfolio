import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const folder = '../public/rome/'
const distFolder = '../public/rome-dist/'
// const image = 'arch-50-compressed-gray';
const fileFormat = 'png';
const args = {
    quality: 10,
    compressionLevel: 9,
    palette: true,
    adaptiveFiltering: true
}

// Convert the URL to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory of the current file
const __dirname = path.dirname(__filename);

// Path to your directory
const directoryPath = path.join(__dirname, folder);

try {
  const files = fs.readdirSync(directoryPath);
//  console.log(files);

  files.forEach((image) => {
    if(image.indexOf(fileFormat > -1)) {
      const inputImage = `${folder}${image.replace('.png','')}.${fileFormat}`;
      const distImage = `${distFolder}${image.replace('.png','')}.${fileFormat}`      
      // console.log(inputImage)
      // console.log(distImage)
  
      sharp(inputImage)
      .png(args)
      // .jpeg(args) // zlib compression level, 0 (fastest, largest) to 9 (slowest, smallest)
      .toFile(distImage, (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log(info);
        }
      });  
    }
  })

} catch (err) {
  console.error(`Failed to read directory: ${err}`);
}