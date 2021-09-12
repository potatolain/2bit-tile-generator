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

    // Disabled, this didn't end up looking good, tries to fill in deeper areas in a circle around a random point
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

    // Draw lines starting from a random spot on the image
    for (let i = 0; i < tileOpt['Lines']; i++) {
      // Start position
      const {x: originX, y: originY} = getRandomImageCoords(image);
      // Determine which direction this line is facing, left/right and up/down
      const xDiff = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
      const yDiff = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
      let x = originX, y = originY;
      // Set that first pixel manually
      image.setPixelColor(palette[3], x, y);
      x = modulus(x + xDiff, image.bitmap.width);
      y = modulus(y + yDiff, image.bitmap.height);
      
      // Repeat this process until we've gone across the full width of the image
      while (x !== originX && y !== originY) {
        image.setPixelColor(palette[3], x, y);

        // Pick whether to shift by x, y, neither or both. (It eventually works out)
        if (Math.random() > 0.3) {
          // Modulus loops us back over to 0 when we hit the full width
          x = modulus(x + xDiff, image.bitmap.width);
        }
        if (Math.random() > 0.3) {
          y = modulus(y + yDiff, image.bitmap.height);
        }

      }
      // Set the last pixel that was set up in the while loop
      image.setPixelColor(palette[3], x, y);
    }

  }

  static drawBrick(image, tileOpt, palette) {
    const row1Lines = [];
    const row2Lines = [];
    // Find where in each row to put the column lines - we have 2 sets, offset by brick width to provide some variation.
    for (var i = 0; i < image.bitmap.width; i++) {
      if (modulus(i+1, tileOpt['Brick Width'] + 1) === 0) {
        row1Lines.push(i);
      } else if (modulus(i + 1 + Math.floor(tileOpt['Brick Width'] / 2), tileOpt['Brick Width'] + 1) === 0) {
        row2Lines.push(i);
      }
    }

    let rowNum = 0;
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      // Fill with bg color to start
      image.setPixelColor(palette[tileOpt['Brick Color']], x, y);

      // Color brick with border color if this is a border between bricks
      if (y % (tileOpt['Brick Height'] + 1) === 0) {
        image.setPixelColor(palette[0], x, y);

        // If this is the first pixel in this row, up the row number, so we can decide which column to use
        if (x === 0) { ++rowNum; }
      }

      // If this matches the X for an active column, draw that too
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

      // Draw a diagonal line across the image, with darker color on the bottom half to show shading
      image.setPixelColor(x > (image.bitmap.height - y - 1) ? palette[1] : palette[3], x, y);

      
      // Draw a line across both diagonals, to show where the edges are
      // NOTE: This also hides some messiness that might be made with the diagonal line above
      if (x === y) {
        image.setPixelColor(palette[2], x, y);
      } else if (x === (image.bitmap.height - y - 1)) {
        image.setPixelColor(palette[1], x, y);
      }

      // This is used to determine the "height" of the block, which is really the square in the middle, and how big it is
      const h = ((image.bitmap.height / 2) - (tileSize / 2));
      
      // Draw the variable-sized square in the middle
      if (x > h && x < (h + tileSize - 1)) {
        if (y > h && y < (h + tileSize - 1)) {
          image.setPixelColor(palette[2], x, y);
        }
      }
    });
  }

  static drawHole(image, tileOpt, palette) {
    const borderWidth = Math.floor((image.bitmap.width / 2) - (tileOpt['Hole Size'] / 2));
    // Determine how much space to randomly fill with either bg or hole color
    const fuzzWidth = tileOpt['Fuzz Area']; 

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      // The image currently has a background color that we want, so now we find what parts need to be recolored to black for the hole
      
      // Test to make sure we're within he borders of the whole
      if (
        (x < borderWidth || x > (image.bitmap.width - 1 - borderWidth)) ||
        (y < borderWidth || y > (image.bitmap.height - 1 - borderWidth))
      ) {
        
        // Determine whether we are in the "fuzzy" area on the outside of the hole
        if (
          (x >= (borderWidth - fuzzWidth) && x < borderWidth && (y > borderWidth && y < (image.bitmap.height - 1 - borderWidth))) ||
          (x >= (borderWidth + tileOpt['Hole Size']) && x < (borderWidth + tileOpt['Hole Size'] + fuzzWidth) && (y > borderWidth && y < (image.bitmap.height -1 - borderWidth))) ||
          
          (y >= (borderWidth - fuzzWidth) && y < borderWidth && (x > borderWidth && x < (image.bitmap.width - 1 - borderWidth))) ||
          (y >= (borderWidth + tileOpt['Hole Size']) && y < (borderWidth + tileOpt['Hole Size'] + fuzzWidth) && (x > borderWidth && x < (image.bitmap.width -1 - borderWidth)))
        ) {
          // We're in the fuzzy area, so bail based on rng, causing this pixel to stay as the background color
          if (Math.random() > 0.35) { return; }
        }
        // If you get here, set the background color to black, the hole color.
        image.setPixelColor(palette[2], x, y);
      }
    });

  }

  static drawPlant(image, tileOpt, palette) {

    // Draw a circle around the outside
    const r = tileOpt['Bush Size'];
    const x = 8, y = 10 - Math.floor(tileOpt['Bush Size'] / 2);
    
    let angle, x1, y1;
    for (var i = 0; i < 360; i++) {
      angle = i;
      x1 = r * Math.cos(angle * Math.PI / 180);
      y1 = r * Math.sin(angle * Math.PI / 180);

      image.setPixelColor(palette[0], Math.round(x + x1), Math.round(y + y1));
    }

    // Loop over the whole image, row by row,
    for (var imgY = 0; imgY < image.bitmap.height; imgY++) {
      // Track whether, in this row, we have hit the first border, a pixel of filling, and the right border.
      let hitLeft = false, hitMid = false, hitRight = false, colorCount = 0;
      // Loop over each pixel
      for (var imgX = 0; imgX < image.bitmap.width; imgX++) {
        // Check the pixel color, see if it matches the border color (always [0])
        if (image.getPixelColor(imgX, imgY) === palette[0]) {
          colorCount++;
          if (!hitLeft) { // If we haven't seen this before, this is the lefthand side
            hitLeft = true;
          } else if (hitMid) { // If we have seen this before, and we also have seen middle pixels, this is the end of the bush on this row
            hitRight = true;
          }
        } else { // Not a border color
          if (hitLeft && image.getPixelColor(imgX, imgY) === palette[3]) { // If this is filled with background right now, mark it as middle
            hitMid = true;
          }
          if (hitMid && !hitRight && colorCount < 5) { // Based on the variables we set above, if we are in the middle of the image, set the color
            image.setPixelColor(palette[tileOpt['Bush Color']], imgX, imgY);
          }
        }
      }
    }

    // Draw small shadow near the foot of the plant
    for (let shadowX = x - Math.floor(r/2)+1; shadowX < x + r+1; shadowX++) {
      image.setPixelColor(palette[0], shadowX, y + r + 1);
      if (shadowX < x + r) {
        image.setPixelColor(palette[0], shadowX, y + r);
      }
    }

    // Pick a few random spots to draw berries/freckles/whatever
    let freckleCount = 0;
    // Limit # of tries to make, to prevent infinite loop
    for (var i = 0; i < 100; i++) {

      // If we've hit the number of freckles we're supposed to, bail out
      if (freckleCount >= tileOpt['Freckle Count']) {
        break;
      }

      // Find a random spot in the image
      const fx = Math.floor(Math.random() * (image.bitmap.width)),
        fy = Math.floor(Math.random() * image.bitmap.height);

      // Make sure it's not already a freckle
      if (image.getPixelColor(fx,fy) === palette[tileOpt['Bush Color']]) {
        freckleCount++;
        // Set this pixel
        image.setPixelColor(palette[tileOpt['Freckle Color']], fx, fy);

        // If it's larger than 1, also fill 1px to the top/left/right/bottom
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

    // We use a quirk of the image library that clamps pixel locations to the inside to make a rock-like shape, 
    // however this forces us to put it at the bottom of the image. Make a copy of the image we can do this on, 
    // which we will later blit onto the original image.
    const rockImg = await Jimp.read(image);

    // Draw a standard circle outline based on the width of the rock
    const r = tileOpt['Rock Size'];

    // Purposely place this towards the bottom of the available space in the image.
    const x = 8, y = rockImg.bitmap.height - (tileOpt['Rock Size'] - 2);
    let angle, x1, y1;
    for (var i = 0; i < 360; i++) {
      angle = i;
      x1 = r * Math.cos(angle * Math.PI / 180);
      y1 = r * Math.sin(angle * Math.PI / 180);

      rockImg.setPixelColor(palette[0], Math.round(x + x1), Math.round(y + y1));
    }

    // terribly simple color filling algorithm - look at "drawPlant" to understand this. 
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

    // okay, the image is done, but not really centered, and in a separate image. 
    // Center and blit it back onto our original to finish.
    await image.blit(rockImg, 0, -1 - Math.floor((image.bitmap.height / 2) - (tileOpt['Rock Size'])));
  }

  static async drawLava(image, tileOpt, palette) {
    // We use Sin calculation to get a "wavy" sort of look for the lava
    const frequency = (tileOpt['Frequency'] / 100),
      offset = tileOpt['Offset'],
      waveWidth = tileOpt['Wave Width'];

    // Loop over each row
    for (let y = 0; y < image.bitmap.width; y++) {
      // Find where the first wave should start on this row
      let x = Math.sin((frequency * (Math.abs(y-offset) % image.bitmap.width)) ) * Math.floor(image.bitmap.height / 3);


      // Increase X by the wave width repeatedly, and mark them with magic pink so we can use this to change colors later
      while (x < image.bitmap.width) {
        // Set a dummy color that we will replace later (magic pink)
        image.setPixelColor(0xff00ffff, x, y);
        x += waveWidth;
      }

      // Loop over every x position, incrementing the palette color each time we hit a magic pink-marked pixel from above
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
    // We use Sin calculation to get sand waves here. The logic is very similar to drawLava, check that for documentation.
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
      // Draw a simple bridge pattern, filling colors accordingly
      if (x % (tileOpt['Board Width']+1) === 0 || y < tileOpt['Border Width'] || y > (image.bitmap.width - tileOpt['Border Width'] - 1)) {
        image.setPixelColor(palette[tileOpt['Separator Color']], x, y);
      } else {
        image.setPixelColor(palette[tileOpt['Board Color']], x, y);
      }
    })
  }

  static async drawLadder(image, tileOpt, palette) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      // Draw a simple ladder pattern, filling colors accordingly.
      if (y % (tileOpt['Step Width']+1) === 0 || x < tileOpt['Border Width'] || x > (image.bitmap.width - tileOpt['Border Width'] - 1)) {
        image.setPixelColor(palette[tileOpt['Separator Color']], x, y);
      } else {
        image.setPixelColor(palette[tileOpt['Step Color']], x, y);
      }
    })
  }

  static async drawStairs(image, tileOpt, palette) {
    // Loop over the whole image
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      // Determine how tall the stairs are at this x coordinate
      let stepHeight = Math.floor((x-1) / tileOpt['Step Width']) * tileOpt['Step Height'];

      // If this is a step,
      if (
        // This is on a step border on the x axis (horizontal)
        x % (tileOpt['Step Width']+1) === 0 || 
        // This is on a step border on the y axis (vertical)
        y < tileOpt['Border Width'] +  stepHeight || 
        // This is taller than the step height at this y coordinate
        y > (image.bitmap.width - tileOpt['Border Width'] - 1)
      ) {
        image.setPixelColor(palette[tileOpt['Separator Color']], x, y);
      } else {
        image.setPixelColor(palette[tileOpt['Step Color']], x, y);
      }
    })
  }


  // Helper function, recreates a jimp image, give the base64 representation we use elsewhere.
  static async imageFromBase64(thisB64) {
    thisB64 = thisB64.substr(thisB64.indexOf(',')+1);
    return await Jimp.read(Buffer.from(thisB64, 'base64'));
  }

  // Generate all images, and stitch them together into one tilemap image
  static generateFullSet(imageState) {
    return new Promise((resolve, reject) =>{
      // Make an image as big as all of our tiles, plus one "blank" tile to start
      new Jimp(IMAGE_WIDTH * (AVAILABLE_TILE_TYPES.length+1), IMAGE_HEIGHT, 0xffffffff, (err, image) =>{
        if (err) { reject(err); }

        // Force back into async context
        (async () => {

          // Loop over each available image type
          for (let i = 0; i < AVAILABLE_TILE_TYPES.length; i++ ) {
            // Grab the image we have in storage
            let thisImg = await this.imageFromBase64(imageState[AVAILABLE_TILE_TYPES[i]]);
            // Slap it on the image at the right position.
            await image.blit(thisImg, (i+1)*IMAGE_WIDTH, 0);
          }


          return image.getBase64Async('image/png');
        })().then(resolve, reject);

      });


    });
  }

  // Draw an image made up of the tiles we created, based on a built-in example map
  static generateMapPreview(imageState) {
    const width = Math.sqrt(TILE_PREVIEW_MAP.length);
    return new Promise((resolve, reject) =>{
      // Dealing with Jimp's weird promise quirks (again)
      new Jimp(IMAGE_WIDTH * width, IMAGE_HEIGHT * width, 0xffffffff, (err, image) =>{
        if (err) { reject(err); }

        // Force back into async context
        (async () => {

          // Build up a lookup table of jimp-usable images from tile name, since we should use all of em
          let tileImages = {};
          let drawState = {};
          for (let i = 0; i < AVAILABLE_TILE_TYPES.length; i++) {
            let thisB64 = imageState[AVAILABLE_TILE_TYPES[i]];
            thisB64 = thisB64.substr(thisB64.indexOf(',')+1);
            tileImages[AVAILABLE_TILE_TYPES[i]] = await this.imageFromBase64(imageState[AVAILABLE_TILE_TYPES[i]]);
            drawState[AVAILABLE_TILE_TYPES[i]] = false;
          }

          // Loop over the given map
          for (var x = 0; x < width; x++) {
            for (var y = 0; y < width; y++) {
              // Draw the given tile at its position.
              const pos = y*width + x;
              image.blit(tileImages[TILE_PREVIEW_MAP[pos]], x * IMAGE_WIDTH, y * IMAGE_HEIGHT);

              // Track which tiles have been drawn, so we can print a warning if we miss one
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

  // This outputs a pattern table usable with the ENS directly, or NES art tools like nesst/nexxt
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
      
      // This is kind of gross and confusing. It's basically forcing this: https://wiki.nesdev.com/w/index.php?title=PPU_pattern_tables
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
    
    // Build up a new array - we just supply a full 4kb pattern table to make this simple for ourselves.
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