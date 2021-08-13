import Jimp from 'jimp/es';

import { TILE_BACKGROUND_COLORS } from '../tile-constants';

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
 * 
 * Jimp doesn't have any primitive drawing ability, and I can't find a library to do it. Maybe I'll make one by myself, but until
 * such a time, things are done manually here. (and very, very clumsily)
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
          case 'hole':
            ImageGenerator.drawHole(image, tileOpt, palette);
            break;
          case 'plant':
            ImageGenerator.drawPlant(image, tileOpt, palette);
            break;
          case 'rock':
            ImageGenerator.drawRock(image, tileOpt, palette);
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
      while (x !== originX && y !== originY) {
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
      } else if (x === (image.bitmap.height - y - 1)) {
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

  static drawHole(image, tileOpt, palette) {
    const borderWidth = Math.floor((image.bitmap.width / 2) - (tileOpt['Hole Size'] / 2));
    const fuzzWidth = tileOpt['Fuzz Area'];

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      if (
        (x < borderWidth || x > (image.bitmap.width - 1 - borderWidth)) ||
        (y < borderWidth || y > (image.bitmap.height - 1 - borderWidth))
      ) {
        
        if (
          (x >= (borderWidth - fuzzWidth) && x < borderWidth && (y > borderWidth && y < (image.bitmap.height - 1 - borderWidth))) ||
          (x >= (borderWidth + tileOpt['Hole Size']) && x < (borderWidth + tileOpt['Hole Size'] + fuzzWidth) && (y > borderWidth && y < (image.bitmap.height -1 - borderWidth))) ||
          
          (y >= (borderWidth - fuzzWidth) && y < borderWidth && (x > borderWidth && x < (image.bitmap.width - 1 - borderWidth))) ||
          (y >= (borderWidth + tileOpt['Hole Size']) && y < (borderWidth + tileOpt['Hole Size'] + fuzzWidth) && (x > borderWidth && x < (image.bitmap.width -1 - borderWidth)))
        ) {
          // Bail some of the time to make it "fuzzy"
          if (Math.random() > 0.35) { return; }
        }
        image.setPixelColor(palette[2], x, y);
      }
    });

  }

  // NOTE: I really don't like the results of this, it needs a rewrite. Maybe someone can use it, but it feels lackluster at best. 
  // I'm not sure what else I can really do procedurally, or even non-procedurally. PRs welcome, with either code or even a 16x16 image
  // and some notes on how we could tweak it. 
  static drawPlant(image, tileOpt, palette) {

    // Draw that circle
    const r = tileOpt['Bush Size'];
    const x = 8, y = 10 - Math.floor(tileOpt['Bush Size'] / 2);
    
    let angle, x1, y1;
    for (var i = 0; i < 360; i++) {
      angle = i;
      x1 = r * Math.cos(angle * Math.PI / 180);
      y1 = r * Math.sin(angle * Math.PI / 180);

      image.setPixelColor(palette[0], Math.round(x + x1), Math.round(y + y1));
    }

    // terribly simple color filling algorithm
    for (var imgY = 0; imgY < image.bitmap.height; imgY++) {
      let hitLeft = false, hitMid = false, hitRight = false, colorCount = 0;
      for (var imgX = 0; imgX < image.bitmap.width; imgX++) {
        if (image.getPixelColor(imgX, imgY) === palette[0]) {
          colorCount++;
          if (!hitLeft) {
            hitLeft = true;
          } else if (hitMid) {
            hitRight = true;
          }
        } else {
          if (hitLeft && image.getPixelColor(imgX, imgY) === palette[3]) {
            hitMid = true;
          }
          if (hitMid && !hitRight && colorCount < 5) { // Must be on the inside of the circle
            image.setPixelColor(palette[tileOpt['Bush Color']], imgX, imgY);
          }
        }
      }
    }

    // Draw small shadow
    for (let shadowX = x - Math.floor(r/2)+1; shadowX < x + r+1; shadowX++) {
      image.setPixelColor(palette[0], shadowX, y + r + 1);
      if (shadowX < x + r) {
        image.setPixelColor(palette[0], shadowX, y + r);
      }
    }

    // Pick a few random spots to draw berries/freckles/whatever
    let freckleCount = 0;
    for (var i = 0; i < 100; i++) { // Limit # of tries to make, just in case 
      if (freckleCount >= tileOpt['Freckle Count']) {
        break;
      }

      const fx = Math.floor(Math.random() * (image.bitmap.width)),
        fy = Math.floor(Math.random() * image.bitmap.height);

      if (image.getPixelColor(fx,fy) === palette[tileOpt['Bush Color']]) {
        freckleCount++;
        image.setPixelColor(palette[tileOpt['Freckle Color']], fx, fy);

        if (tileOpt['Freckle Size'] > 1) {
          [[fx-1, fy], [fx+1,fy], [fx, fy-1], [fx, fy+1]].forEach(coords => {
            const fxx = coords[0], fyy = coords[1];
            if (image.getPixelColor(fxx, fyy) === palette[tileOpt['Bush Color']]) {
              image.setPixelColor(palette[tileOpt['Freckle Color']], fxx, fyy);
            }
          });
        }
      }
    }
  }

  static drawRock(image, tileOpt, palette) {

    const r = tileOpt['Rock Size'];
    const x = 8, y = image.bitmap.height - (tileOpt['Rock Size'] - 2);
    let angle, x1, y1;
    for (var i = 0; i < 360; i++) {
      angle = i;
      x1 = r * Math.cos(angle * Math.PI / 180);
      y1 = r * Math.sin(angle * Math.PI / 180);

      image.setPixelColor(palette[0], Math.round(x + x1), Math.round(y + y1));
    }

    // terribly simple color filling algorithm
    for (var imgY = 0; imgY < image.bitmap.height; imgY++) {
      let hitLeft = false, hitMid = false, hitRight = false, colorCount = 0;
      for (var imgX = 0; imgX < image.bitmap.width; imgX++) {
        if (image.getPixelColor(imgX, imgY) === palette[0]) {
          colorCount++;
          if (!hitLeft) {
            hitLeft = true;
          } else if (hitMid) {
            hitRight = true;
          }
        } else {
          if (hitLeft && image.getPixelColor(imgX, imgY) === palette[3]) {
            hitMid = true;
          }
          if (hitMid && !hitRight && colorCount < 5) { // Must be on the inside of the circle
            if ((imgX - imgY) < r - Math.floor(r/1.2)) {
              image.setPixelColor(palette[tileOpt['Rock Color']], imgX, imgY);
            } else {
              image.setPixelColor(palette[tileOpt['Rock Highlight Color']], imgX, imgY);
            }
          }
        }
      }
    }
  }

}