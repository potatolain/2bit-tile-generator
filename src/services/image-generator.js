import Jimp from 'jimp/es';
import { paletteData } from '../constants/palette-constants';

import { TILE_BACKGROUND_COLORS, IMAGE_WIDTH, IMAGE_HEIGHT, AVAILABLE_TILE_TYPES, TILE_PREVIEW_MAP } from '../constants/tile-constants';

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
      new Jimp(IMAGE_WIDTH, IMAGE_HEIGHT, palette[TILE_BACKGROUND_COLORS[tileType]], async (err, image) =>{
        if (err) { reject(err); }

        // Big, kind of ugly switch statement for each of our available tile types, determining how to draw each one.
        switch (tileType) {
          case 'grass': 
          await ImageGenerator.drawGrass(image, tileOpt, palette);
            break;
          case 'water':
            await ImageGenerator.drawWater(image, tileOpt, palette);
            break;
          case 'brick':
            await ImageGenerator.drawBrick(image, tileOpt, palette);
            break;
          case 'tile':
          case 'block':
            await ImageGenerator.drawBlock(image, tileOpt, palette);
            break;
          case 'hole':
            await ImageGenerator.drawHole(image, tileOpt, palette);
            break;
          case 'plant':
            await ImageGenerator.drawPlant(image, tileOpt, palette);
            break;
          case 'rock':
            await ImageGenerator.drawRock(image, tileOpt, palette);
            break;
          case 'lava':
            await ImageGenerator.drawLava(image, tileOpt, palette);
            break;
          case 'sand':
            await ImageGenerator.drawSand(image, tileOpt, palette);
            break;
          case 'bridge':
            await ImageGenerator.drawBridge(image, tileOpt, palette);
            break;
          case 'ladder':
            await ImageGenerator.drawLadder(image, tileOpt, palette);
            break;
          case 'stairs':
            await ImageGenerator.drawStairs(image, tileOpt, palette);
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

  static async drawRock(image, tileOpt, palette) {

    // Create a copy for us to play with, so we can mess with location
    const rockImg = await Jimp.read(image);

    const r = tileOpt['Rock Size'];
    const x = 8, y = rockImg.bitmap.height - (tileOpt['Rock Size'] - 2);
    let angle, x1, y1;
    for (var i = 0; i < 360; i++) {
      angle = i;
      x1 = r * Math.cos(angle * Math.PI / 180);
      y1 = r * Math.sin(angle * Math.PI / 180);

      rockImg.setPixelColor(palette[0], Math.round(x + x1), Math.round(y + y1));
    }

    // terribly simple color filling algorithm
    for (var imgY = 0; imgY < rockImg.bitmap.height; imgY++) {
      let hitLeft = false, hitMid = false, hitRight = false, colorCount = 0;
      for (var imgX = 0; imgX < rockImg.bitmap.width; imgX++) {
        if (rockImg.getPixelColor(imgX, imgY) === palette[0]) {
          colorCount++;
          if (!hitLeft) {
            hitLeft = true;
          } else if (hitMid) {
            hitRight = true;
          }
        } else {
          if (hitLeft && rockImg.getPixelColor(imgX, imgY) === palette[3]) {
            hitMid = true;
          }
          if (hitMid && !hitRight && colorCount < 5) { // Must be on the inside of the circle
            if ((imgX - imgY) < r - Math.floor(r/1.2)) {
              rockImg.setPixelColor(palette[tileOpt['Rock Color']], imgX, imgY);
            } else {
              rockImg.setPixelColor(palette[tileOpt['Rock Highlight Color']], imgX, imgY);
            }
          }
        }
      }
    }

    // okay, the image is done, but not really centered how we'd like. Blit the image onto itself?
    await image.blit(rockImg, 0, -1 - Math.floor((image.bitmap.height / 2) - (tileOpt['Rock Size'])));
  }

  static async drawLava(image, tileOpt, palette) {
    const frequency = (tileOpt['Frequency'] / 100),
      offset = tileOpt['Offset'],
      waveWidth = tileOpt['Wave Width'];
    for (let y = 0; y < image.bitmap.width; y++) {
      let x = Math.sin((frequency * (Math.abs(y-offset) % image.bitmap.width)) ) * Math.floor(image.bitmap.height / 3);


      while (x < image.bitmap.width) {
        // Set a dummy color to replace
        image.setPixelColor(0xff00ffff, x, y);
        x += waveWidth;
      }

      // Repeat iterating over the whole thing, swapping colors
      let currColor = 1;
      for (x = 0; x < image.bitmap.width; x++) {
        if (image.getPixelColor(x, y) === 0xff00ffff) {
          currColor = 1+((currColor + 1) % 3);
        }
        image.setPixelColor(palette[currColor], x, y);
      }
    }
  }

  static async drawSand(image, tileOpt, palette) {
    const frequency = (tileOpt['Frequency'] / 100),
      offset = tileOpt['Offset'],
      waveWidth = tileOpt['Wave Width'];
    for (let y = 0; y < image.bitmap.width; y++) {
      let x = Math.sin((frequency * (Math.abs(y-offset) % image.bitmap.width)) ) * Math.floor(image.bitmap.height / 3);


      while (x < image.bitmap.width) {
        // Set a dummy color to replace
        image.setPixelColor(0xff00ffff, x, y);
        x += waveWidth;
      }

      // Repeat iterating over the whole thing, swapping colors
      let currColor = 2;
      for (x = 0; x < image.bitmap.width; x++) {
        if (image.getPixelColor(x, y) === 0xff00ffff) {
          currColor = 2+((currColor + 1) % 2);
        }
        image.setPixelColor(palette[currColor], x, y);
      }
    }
  }

  static async drawBridge(image, tileOpt, palette) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      if (x % (tileOpt['Board Width']+1) === 0 || y < tileOpt['Border Width'] || y > (image.bitmap.width - tileOpt['Border Width'] - 1)) {
        image.setPixelColor(palette[tileOpt['Separator Color']], x, y);
      } else {
        image.setPixelColor(palette[tileOpt['Board Color']], x, y);
      }
    })
  }

  static async drawLadder(image, tileOpt, palette) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      if (y % (tileOpt['Step Width']+1) === 0 || x < tileOpt['Border Width'] || x > (image.bitmap.width - tileOpt['Border Width'] - 1)) {
        image.setPixelColor(palette[tileOpt['Separator Color']], x, y);
      } else {
        image.setPixelColor(palette[tileOpt['Step Color']], x, y);
      }
    })
  }

  static async drawStairs(image, tileOpt, palette) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      let stepHeight = Math.floor((x-1) / tileOpt['Step Width']) * tileOpt['Step Height'];
      if (
        x % (tileOpt['Step Width']+1) === 0 || 
        y < tileOpt['Border Width'] +  stepHeight || 
        y > (image.bitmap.width - tileOpt['Border Width'] - 1)
      ) {
        image.setPixelColor(palette[tileOpt['Separator Color']], x, y);
      } else {
        image.setPixelColor(palette[tileOpt['Step Color']], x, y);
      }
    })
  }


  static async imageFromBase64(thisB64) {
    thisB64 = thisB64.substr(thisB64.indexOf(',')+1);
    return await Jimp.read(Buffer.from(thisB64, 'base64'));
  }

  static generateFullSet(imageState) {
    return new Promise((resolve, reject) =>{
      new Jimp(IMAGE_WIDTH * (AVAILABLE_TILE_TYPES.length+1), IMAGE_HEIGHT, 0xffffffff, (err, image) =>{
        if (err) { reject(err); }

        // Force back into async context
        (async () => {

          // Loop over each available image type
          for (let i = 0; i < AVAILABLE_TILE_TYPES.length; i++ ) {
            let thisImg = await this.imageFromBase64(imageState[AVAILABLE_TILE_TYPES[i]]);
            await image.blit(thisImg, (i+1)*IMAGE_WIDTH, 0);
          }


          return image.getBase64Async('image/png');
        })().then(resolve, reject);

      });


    });
  }

  static generateMapPreview(imageState) {
    const width = Math.sqrt(TILE_PREVIEW_MAP.length);
    return new Promise((resolve, reject) =>{
      // Dealing with Jimp's weird promise quirks (again)
      new Jimp(IMAGE_WIDTH * width, IMAGE_HEIGHT * width, 0xffffffff, (err, image) =>{
        if (err) { reject(err); }

        // Force back into async context
        (async () => {

          // Build up the LUT of actual images, since we should use all of em
          let tileImages = {};
          let drawState = {};
          for (let i = 0; i < AVAILABLE_TILE_TYPES.length; i++) {
            let thisB64 = imageState[AVAILABLE_TILE_TYPES[i]];
            thisB64 = thisB64.substr(thisB64.indexOf(',')+1);
            tileImages[AVAILABLE_TILE_TYPES[i]] = await this.imageFromBase64(imageState[AVAILABLE_TILE_TYPES[i]]);
            drawState[AVAILABLE_TILE_TYPES[i]] = false;
          }

          for (var x = 0; x < width; x++) {
            for (var y = 0; y < width; y++) {
              const pos = y*width + x;
              image.blit(tileImages[TILE_PREVIEW_MAP[pos]], x * IMAGE_WIDTH, y * IMAGE_HEIGHT);
              drawState[TILE_PREVIEW_MAP[pos]] = true;
            }
          }

          // Check which tiles were not drawn, print a warning.
          const notDrawn = AVAILABLE_TILE_TYPES.filter(a => !drawState[a]);
          if (notDrawn.length > 0) {
            console.warn('Some tiles were not included in the preview!', notDrawn.join(', '));
          }

          return image.getBase64Async('image/png');
        })().then(resolve, reject);

      });

    });

  }

  static async generateNesPatternTables(imageState, tileProps, organizeIntoBlocks) {
    let ppuData = [
    ];

    // Loop over every tile, and convert it to NES binary format
    for (var i = 0; i < AVAILABLE_TILE_TYPES.length; i++) {
      const tileType = AVAILABLE_TILE_TYPES[i],
        tile = await this.imageFromBase64(imageState[tileType]),
        tileColorData = new Array(tile.bitmap.width * tile.bitmap.height),
        paletteColors = paletteData[tileProps[tileType].Palette];

      // Loop over all pixels in this tile, and grab the color
      tile.scan(0, 0, tile.bitmap.width, tile.bitmap.height, (x, y) => {
        const color = tile.getPixelColor(x, y);
        // Then drop the 2-bit value of the color into our array, for later use.
        tileColorData[x + (y * tile.bitmap.width)] = paletteColors.indexOf(color);
      });

      // Separate out the two bit values we care about for each pixel, allowing us to build bitplanes
      let bits0 = tileColorData.map (x => x & 0x01),
        bits1 = tileColorData.map(x => (x & 0x02) >> 1);
      
      // This is exceedingly gross and poorly documented. It's basically forcing this: https://wiki.nesdev.com/w/index.php?title=PPU_pattern_tables
      // Build up two bitplanes for each tile, then, pixel-by-pixel, build them up and reassemble.

      // First build up multiple bitplanes, a left and a right for each 8x8 pixel tile in this thing. tl, tr, bl, br
      let thisTileBp1a = [], thisTileBp2a = [], thisTileBp1b = [], thisTileBp2b = [],
        thisTileBp3a = [], thisTileBp3b = [], thisTileBp4a = [], thisTileBp4b = [];
      
      // Loop over each of the 4 bitplanes (this feels weird because it is)
      for (let bitplaneNum = 0; bitplaneNum < 4; bitplaneNum++) {

        // Loop over each row in this tile/bitplane
        for (let j = 0; j < 8; j++) {

          // In our first pass, add a 0 to all planes, so we can do math to them
          if (bitplaneNum === 0) {
            thisTileBp1a.push(0);
            thisTileBp2a.push(0);
            thisTileBp3a.push(0);
            thisTileBp4a.push(0);
            thisTileBp1b.push(0);
            thisTileBp2b.push(0);
            thisTileBp3b.push(0);
            thisTileBp4b.push(0);
          }

          // Loop over every pixel in the row, assembling each pixel into its left and right bit
          for (let k = 0; k < 8; k++) {
            if (bitplaneNum === 0) {
              thisTileBp1a[j] += bits0[(j * tile.bitmap.width) + k] << (7 - k);
              thisTileBp1b[j] += bits1[(j * tile.bitmap.width) + k] << (7 - k);
            } else if (bitplaneNum === 1) {
              thisTileBp2a[j] += bits0[(j * tile.bitmap.width) + k + 8] << (7 - k);
              thisTileBp2b[j] += bits1[(j * tile.bitmap.width) + k + 8] << (7 - k);
            } else if (bitplaneNum === 2) {
              thisTileBp3a[j] += bits0[(j * tile.bitmap.width) + k + 128] << (7 - k);
              thisTileBp3b[j] += bits1[(j * tile.bitmap.width) + k + 128] << (7 - k);
            } else {
              thisTileBp4a[j] += bits0[(j * tile.bitmap.width) + k + 128 + 8] << (7 - k);
              thisTileBp4b[j] += bits1[(j * tile.bitmap.width) + k + 128 + 8] << (7 - k);
            }
          }
        }
      }

      // Add each bitplane to the tile, in the correct order. 
      // At this point, we just put all the tiles in order, so you'll get top left, top right, bottom left, bottom right all in a row
      ppuData = [
        ...ppuData,
        ...thisTileBp1a,
        ...thisTileBp1b,
        ...thisTileBp2a,
        ...thisTileBp2b,
        ...thisTileBp3a,
        ...thisTileBp3b,
        ...thisTileBp4a,
        ...thisTileBp4b
      ];
    }
    
    // Prepend a blank tile, with nothing in it - 64 bytes (4 16 byte 8px tiles)
    ppuData = [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      ...ppuData
    ]

    // The data is currently in a linear format, where each (16 byte) block is in sequence
    // not pretty, but easy to work with in some games. If the user wants that, sweet!
    if (!organizeIntoBlocks) {
      return new Uint8Array(ppuData);
    }

    // Okay, we have a little work to do to organize it. NES chr files are 16 by 16, 8px tiles, where each tile 
    // takes up 16 bytes. We have to break up by tile. Note we have to add the extra tile from above into the count.
    
    // Build up a new array - just make it the full size of a pattern table on the NES for ease of use
    let organizedArray = new Array(4096).fill(0);
    // loop over all tiles (including our blank one)
    for (let i = 0; i < AVAILABLE_TILE_TYPES.length+1; i++) {

      // Determine where this tile will fall in our organized map - 2 8x8 tiles on one row, two 8x8 tiles on the next.
      const x = i % 8,
        y = Math.floor(i / 8),
        // Get our position within this new map
        position = (16/*tile size (bytes)*/ * 16/*row width, in nes tiles*/ * 2/*rows per metatile*/ * y) + (16 * x * 2),
        // Find the position in the original array
        originalPosition = (i * 4) * 16;

      // Copy the top 32 bytes (2 tiles) into their new home
      for (let j = 0; j < 32; j++) {
        organizedArray[position+j] = ppuData[originalPosition+j];
      }
      // Copy the bottom 32 bytes into their new home as well)
      for (let j = 0; j < 32; j++) {
        organizedArray[position + (16/* tile size (bytes)*/ * 16 /*row width*/) + j] = ppuData[originalPosition + j + 32];
      }
    }

    // Okay, we're finally done!
    return new Uint8Array(organizedArray);

  }
}