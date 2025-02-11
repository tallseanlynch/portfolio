import sharp from 'sharp';

const folder = '../public/rome/'
const image = 'ground-inverse';
const fileFormat = 'jpg';
const args = {
    quality: 10, 
    compressionLevel: 10
}

sharp(`${folder}${image}.${fileFormat}`)
  .jpeg(args) // zlib compression level, 0 (fastest, largest) to 9 (slowest, smallest)
  .toFile(`${folder}${image}-compressed.${fileFormat}`, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });