import Jimp from 'jimp/es';

import { TILE_NAMES, TILE_OPTIONS, TILE_BACKGROUND_COLORS, AVAILABLE_TILE_TYPES } from '../tile-contants';

// Because js treats % as a remainder instead of modulus... because, sigh, programming languages were a mistake.
function modulus(a, b) {
  return ((a % b ) + b) % b;
}

// Helper to find a random position within the image
function getRandomImageCoords(image) {
  let x = Math.floor(Math.random() * image.bitmap.width);
  let y = Math.floor(Math.random() * image.bitmap.height);

  return {x, y};
}


/**
 * Image generation logic. Used to generate all of the various images using Jimp.
 * Define available image types in the constants in ../tile-constants
 */
export default class ImageGenerator {
  // Really just a home for static methods for now. Don't even construct it.

  static generateImage(tileType, tileOpt, palette) {
    // Jimp isn't super promise friendly - technically it works but it's pretty sketchy at times. Wrap this instead.
    return new Promise((resolve, reject) =>{
      new Jimp(16, 16, palette[TILE_BACKGROUND_COLORS[tileType]], (err, image) =>{
        if (err) { reject(err); }

        // Big, kind of ugly switch statement for each of our available tile types, determining how to draw each one.
        switch (tileType) {
          case 'grass': 
            ImageGenerator.drawGrass(image, tileOpt, palette);
            break;
          case 'water':
            ImageGenerator.drawWater(image, tileOpt, palette);
            break;
          case 'brick':
            ImageGenerator.drawBrick(image, tileOpt, palette);
            break;
          case 'block':
            ImageGenerator.drawBlock(image, tileOpt, palette);
            break;
          default: 
            console.warn('Unimplemented tile type given!', tileType, 'blank image ahoy');
        }

        image.getBase64Async('image/png').then(resolve, reject);
      });


    });
  }

  static drawGrass(image, tileOpt, palette) {
    for (let i = 0; i < tileOpt['Short Blades']; i++) {
      const {x, y} = getRandomImageCoords(image);
      image.setPixelColor(palette[2], x, y);
    }
    for (let i = 0; i < tileOpt['Tall Blades']; i++) {
      const {x, y} = getRandomImageCoords(image);
      image.setPixelColor(palette[2], x, y);
      image.setPixelColor(palette[2], x, y === 0 ? (image.bitmap.height - 1) : y-1);
    }

    for (let i = 0; i < tileOpt['Triangles']; i++) {
      const {x, y} = getRandomImageCoords(image);

      image.setPixelColor(palette[2], x > 0 ? x-1 : (image.bitmap.width - 1), y);
      image.setPixelColor(palette[2], x < (image.bitmap.width - 1) ? x+1 : 0, y);
      image.setPixelColor(palette[2], x, y > 0 ? y-1 : (image.bitmap.height - 1));
    }
  }

  static drawWater(image, tileOpt, palette) {
    for (let i = 0; i < tileOpt['Deeper Areas']; i++) {
      const {x: originX, y: originY} = getRandomImageCoords(image);
      const depthR = Math.floor(Math.random() * 4) + 3;

      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const dx = originX - x;
        const dy = originY - y;
        if (dx*dx + dy*dy <= (depthR*depthR)) {
          image.setPixelColor(palette[1], x, y);
        }
      });
    }
    for (let i = 0; i < tileOpt['Lines']; i++) {
      const {x: originX, y: originY} = getRandomImageCoords(image);
      const xDiff = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
      const yDiff = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
      let x = originX, y = originY;
      image.setPixelColor(palette[3], x, y);
      x = modulus(x + xDiff, image.bitmap.width);
      y = modulus(y + yDiff, image.bitmap.height);
      while (x != originX && y != originY) {
        image.setPixelColor(palette[3], x, y);
        if (Math.random() > 0.3) {
          x = modulus(x + xDiff, image.bitmap.width);
        }
        if (Math.random() > 0.3) {
          y = modulus(y + yDiff, image.bitmap.height);
        }

      }
      image.setPixelColor(palette[3], x, y);
    }

  }

  static drawBrick(image, tileOpt, palette) {
    const row1Lines = [];
    const row2Lines = [];
    for (var i = 0; i < image.bitmap.width; i++) {
      if (modulus(i+1, tileOpt['Brick Width'] + 1) === 0) {
        row1Lines.push(i);
      } else if (modulus(i + 1 + Math.floor(tileOpt['Brick Width'] / 2), tileOpt['Brick Width'] + 1) === 0) {
        row2Lines.push(i);
      }
    }

    // Fill with bg color to start
    let rowNum = 0;
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      image.setPixelColor(palette[tileOpt['Brick Color']], x, y);

      if (y % (tileOpt['Brick Height'] + 1) === 0) {
        image.setPixelColor(palette[0], x, y);
        if (x === 0) { ++rowNum; }
      }

      if (rowNum % 2 === 0) {
        if (row1Lines.indexOf(x) !== -1) {
          image.setPixelColor(palette[0], x, y);
        }
      } else {
        if (row2Lines.indexOf(x) !== -1) {
          image.setPixelColor(palette[0], x, y);
        }
      }
    });

  }

  static drawBlock(image, tileOpt, palette) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      const tileSize = (10 - tileOpt['Height']) * 2;

      image.setPixelColor(x > (image.bitmap.height - y - 1) ? palette[1] : palette[3], x, y);

      
      if (x === y) {
        image.setPixelColor(palette[2], x, y);
      } else if (x == (image.bitmap.height - y - 1)) {
        image.setPixelColor(palette[1], x, y);
      }
      const h = ((image.bitmap.height / 2) - (tileSize / 2));
      
      if (x > h && x < (h + tileSize - 1)) {
        if (y > h && y < (h + tileSize - 1)) {
          image.setPixelColor(palette[2], x, y);
        }
      }
    });
  }
}