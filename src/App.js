import '@shoelace-style/shoelace/dist/themes/base.css';

import SlButton from '@shoelace-style/react/dist/button';
import SlSelect from '@shoelace-style/react/dist/select';
import SlMenuItem from '@shoelace-style/react/dist/menu-item';
import SlRange from '@shoelace-style/react/dist/range';
import SlTooltip from '@shoelace-style/react/dist/tooltip';
import SlRadio from '@shoelace-style/react/dist/radio';
import SlRadioGroup from '@shoelace-style/react/dist/radio-group';

import Jimp from 'jimp/es';

/**
 * ADVANCED THINGS TO PLAY WITH
 * Weighted random, to make tiles look nicer: https://redstapler.co/javascript-weighted-random/ -- option 2 looks nice
 * For grass it'd be nice to limit to fewer lines and blades, and more triangles, for example
 * 
 * 
 * GENERAL TODO:
 * - Implement everything that's not grass
 * - Add more palettes (steal from the sprite generator? Try defaults built into nesst? Other?)
 * - Allow palette swapping?
 * - Pretty the codebase up so an employer wouldn't look at this and decide I have no idea what I'm doing (⩾﹏⩽)
 * - Add reference to this: https://0x72.itch.io/2bitcharactergenerator
 * - Add reference to license on the page
 * - Add ref to my site. 
 * - Any other shoutout type things?
 * 
 * BUGS: 
 * - Random seems to never give the max value - did I mess something up?
 */

import './App.css';
import React from 'react';
import PalettePreview from './components/palette-preview';

const AVAILABLE_TILE_TYPES = [
  'grass', 
  'water', 
  // Unimplemented tile types (so far!) 
  // 'lava', 
  'block',
  // 'rock', 
  'brick', 
  // 'hole',
  // 'plant'
];
const TILE_BACKGROUND_COLORS = {
  grass: 3,
  water: 2,
  lava: 3,
  rock: 3, 
  brick: 2,
  hole: 0,
  plant: 3,
  block: 3
};

const TILE_NAMES = {
  grass: 'Grass',
  water: 'Water',
  lava: 'Lava',
  block: 'Block / Tile',
  brick: 'Brick Wall',
  rock: 'Rock',
  hole: 'Hole / Gap',
  plant: 'Bush',
}

const TILE_OPTIONS = {
  grass: [
    {name: 'Short Blades', min: 0, max: 10, type: 'range'},
    {name: 'Tall Blades', min: 0, max: 10, type: 'range'},
    {name: 'Triangles', min: 0, max: 8, type: 'range'}
  ],
  water: [
    {name: 'Lines', min: 2, max: 4, type: 'range'},
    // Couldn't quite get what I wanted out of this - the areas kind of need to be relative to the lines, and 
    // that's a bit more complex than I'd hoped.
    {name: 'Deeper Areas', min: 0, max: 3, type: 'range', disabled: true, defaultValue: 0}
  ],
  lava: [],
  rock: [],
  brick: [
    {name: 'Brick Width', min: 5, max: 12, type: 'range'},
    {name: 'Brick Height', min: 2, max: 12, type: 'range'},
    {name: 'Brick Color', type: 'palette', defaultValue: 2}
  ],
  block: [
    // {name: 'Color', type: 'palette', defaultValue: 2}
    {name: 'Height', min: 2, max: 8, type: 'range'}
  ],
  hole: [],
  plant: []
}

// Because js treats % as a remainder instead of modulus... because, sigh, programming languages were a mistake.
function modulus(a, b) {
  return ((a % b ) + b) % b;
}

// Huge app component that could probably be broken down well if I got smart with a Store for state
class App extends React.Component {

  // Initializer, mostly sets up initial state of the application
  constructor(props) {
    super(props);
    this.state = {
      tileType: 'brick',
      tileProps: {},
      palette: [0x000000ff, 0x444444ff, 0xaaaaaaff, 0xffffffff],
      imageWidth: 16,
      imageHeight: 16,
      // Transparent 1px gif so we don't show a broken image
      currentTileImg: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    }

    // NOTE: This logic is almost-duplicated in the reRandomize method
    AVAILABLE_TILE_TYPES.forEach(t => {
      this.state.tileProps[t] = {};
      TILE_OPTIONS[t].forEach(opt => {
        if (opt.defaultValue !== undefined) {
          this.state.tileProps[t][opt.name] = opt.defaultValue;
        } else if (opt.min !== undefined && opt.max !== undefined) {
          this.state.tileProps[t][opt.name] = Math.floor(Math.random() * (opt.max - opt.min)) + opt.min;
        }
      });
    });
  }

  // Generate the image as soon as this is rendered (else we'll call setState too early)
  componentDidMount() {
    this.reloadImage();
  }

  // NOTE: This logic is almost-duplicated in the constructor, with defaults and without the disabled check.
  reRandomize() {
    let newState = {tileProps: {...this.state.tileProps}};
    AVAILABLE_TILE_TYPES.forEach(t => {
      newState.tileProps[t] = {...this.state.tileProps[t]};
      TILE_OPTIONS[t].forEach(opt => {
        if (!opt.disabled) {
          if (opt.min !== undefined && opt.max !== undefined) {
            newState.tileProps[t][opt.name] = Math.floor(Math.random() * (opt.max - opt.min)) + opt.min;
          }
        }
      });
    });
    this.setState(newState);
    this.reloadImage();
  };

  // Helper to find a random position within the image
  getRandomImageCoords() {
    let x = Math.floor(Math.random() * this.state.imageWidth);
    let y = Math.floor(Math.random() * this.state.imageHeight);

    return {x, y};
  }

  // Kind of big method that pops out components for each of the tile options we have available.
  // This might be a good candidate for the type of thing to break out/apart
  getTileOptions(type) {
    return TILE_OPTIONS[type].map(setting => {
      if (setting.disabled) { return <span key={"disabled-setting-" + setting.type + setting.name}></span>; }
      switch (setting.type) {
        case 'range':
          // This could probably be a component of its
          return <div className="tile-option" key={"range-" + setting.type + setting.name}>
              <SlRange key={type + setting.name} 
                min={setting.min} 
                max={setting.max} 
                step={setting.step || 1} 
                label={setting.name} 
                value={this.state.tileProps[type][setting.name]} 
                onSlChange={e => this.updateTileState(type, setting.name, e.target.value)}>
              </SlRange>
              <div className="below-range">
                <small className="left">{setting.min}</small>
                <small className="mid">{this.state.tileProps[type][setting.name]}</small>
                <small className="right">{setting.max}</small>
              </div>
            </div>;
        case 'palette':
          return <div className="tile-option" key={"palette-" + setting.type + setting.name}>
            <SlRadioGroup label={setting.name}>
              {[0, 1, 2, 3].map(n => {
                return <SlRadio 
                    value={n} 
                    checked={this.state.tileProps[type][setting.name] === n ? true : false} 
                    key={"palette-color" + setting.type + setting.name + '-' + n} 
                    onSlChange={e => e.target.checked ? this.updateTileState(type, setting.name, n) : null}
                  >
                    Color {n+1} 
                    <PalettePreview palette={this.state.palette[n].toString(16).padStart(8, '0')}></PalettePreview>
                  </SlRadio>
              })}
            </SlRadioGroup>
          </div>
        default:
          console.error(`Unknown tile option type "${setting.type}" found!`, setting);
          return <span></span>;
      }
    });
  }

  // Use jimp to redraw the image based on current state. This could probably live in a service that
  // updates the store. I'd make it a component, but the image needs to remain the same in all places.
  getCurrentTileImage() {

    // Jimp isn't super promise friendly - technically it works but it's pretty sketchy at times. Wrap this instead.
    return new Promise((resolve, reject) =>{
      new Jimp(16, 16, this.state.palette[TILE_BACKGROUND_COLORS[this.state.tileType]], (err, image) =>{
        if (err) { reject(err); }

        const tileOpt = this.state.tileProps[this.state.tileType];
        // Big, kind of ugly switch statement for each of our available tile types, determining how to draw each one.
        switch (this.state.tileType) {
          case 'grass': 
            for (let i = 0; i < tileOpt['Short Blades']; i++) {
              const {x, y} = this.getRandomImageCoords();
              image.setPixelColor(this.state.palette[2], x, y);
            }
            for (let i = 0; i < tileOpt['Tall Blades']; i++) {
              const {x, y} = this.getRandomImageCoords();
              image.setPixelColor(this.state.palette[2], x, y);
              image.setPixelColor(this.state.palette[2], x, y === 0 ? (this.state.imageHeight - 1) : y-1);
            }

            for (let i = 0; i < tileOpt['Triangles']; i++) {
              const {x, y} = this.getRandomImageCoords();

              image.setPixelColor(this.state.palette[2], x > 0 ? x-1 : (this.state.imageWidth - 1), y);
              image.setPixelColor(this.state.palette[2], x < (this.state.imageWidth - 1) ? x+1 : 0, y);
              image.setPixelColor(this.state.palette[2], x, y > 0 ? y-1 : (this.state.imageHeight - 1));
            }

          case 'water':
            for (let i = 0; i < tileOpt['Deeper Areas']; i++) {
              const {x: originX, y: originY} = this.getRandomImageCoords();
              const depthR = Math.floor(Math.random() * 4) + 3;

              image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                const dx = originX - x;
                const dy = originY - y;
                if (dx*dx + dy*dy <= (depthR*depthR)) {
                  image.setPixelColor(this.state.palette[1], x, y);
                }
              });
            }
            for (let i = 0; i < tileOpt['Lines']; i++) {
              const {x: originX, y: originY} = this.getRandomImageCoords();
              const xDiff = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
              const yDiff = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
              let x = originX, y = originY;
              image.setPixelColor(this.state.palette[3], x, y);
              x = modulus(x + xDiff, this.state.imageWidth);
              y = modulus(y + yDiff, this.state.imageHeight);
              while (x != originX && y != originY) {
                image.setPixelColor(this.state.palette[3], x, y);
                if (Math.random() > 0.3) {
                  x = modulus(x + xDiff, this.state.imageWidth);
                }
                if (Math.random() > 0.3) {
                  y = modulus(y + yDiff, this.state.imageHeight);
                }

              }
              image.setPixelColor(this.state.palette[3], x, y);
            }
            break;
          case 'brick':
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
              image.setPixelColor(this.state.palette[tileOpt['Brick Color']], x, y);

              if (y % (tileOpt['Brick Height'] + 1) === 0) {
                image.setPixelColor(this.state.palette[0], x, y);
                if (x === 0) { ++rowNum; }
              }

              if (rowNum % 2 === 0) {
                if (row1Lines.indexOf(x) !== -1) {
                  image.setPixelColor(this.state.palette[0], x, y);
                }
              } else {
                if (row2Lines.indexOf(x) !== -1) {
                  image.setPixelColor(this.state.palette[0], x, y);
                }
              }
            });
            break;
          case 'block':
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
              const tileSize = (10 - tileOpt['Height']) * 2;

              image.setPixelColor(x > (image.bitmap.height - y - 1) ? this.state.palette[1] : this.state.palette[3], x, y);

              
              if (x === y) {
                image.setPixelColor(this.state.palette[2], x, y);
              } else if (x == (image.bitmap.height - y - 1)) {
                image.setPixelColor(this.state.palette[1], x, y);
              }
              const h = ((image.bitmap.height / 2) - (tileSize / 2));
              
              if (x > h && x < (h + tileSize - 1)) {
                if (y > h && y < (h + tileSize - 1)) {
                  image.setPixelColor(this.state.palette[2], x, y);
                }
              }
            });
            break;
          default: 
            console.warn('Unimplemented tile type given!', this.state.tileType, 'blank image ahoy');
        }

        image.getBase64Async('image/png').then(resolve, reject);
      });


    });
  }

  // Rebuild the image shown on the page from available settings.
  async reloadImage() {
    this.setState({currentTileImg: await this.getCurrentTileImage()});
  }

  // Helper function to do exactly what it says. Regenerates the image too.
  updateTileType(event) {
    this.setState({tileType: event.target.value});
    this.reloadImage();
  }

  // Helper to update state values from the various "components" (things that should be components) that we support.
  updateTileState(typeName, name, value) {
    // Test to make sure the value changed to avoid infinite loops from radio buttons triggering this repeatedly
    if (this.state.tileProps[typeName][name] === value) { 
      return;
    }

    // React will stomp any nested objects when you use this, so we have to bring in the old state
    this.setState({
      tileProps: {
        ...this.state.tileProps,
        [typeName]: {
          ...this.state.tileProps[typeName],
          [name]: value
        }
      }
    });
    this.reloadImage();
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>2Bit Tile Generator</h1>
        </header>
        <section>
          <p>
          </p>

          {/* This could probably be a component */}
          <div className="control-bar">
            <SlTooltip content="Randomize the settings for all tiles.">
              <SlButton onClick={() => this.reRandomize()}>Randomize Settings</SlButton>
            </SlTooltip>
            <SlTooltip content="Regenerate tile image with the current settings">
              <SlButton onClick={() => this.reloadImage()}>Regenerate</SlButton>
            </SlTooltip>
          </div>

          <div className="configurator">
            <div className="left">
              <h3>Tile Preview</h3>

              <h4>Single</h4>
              <img className="tile-preview" alt="Tile Preview" src={this.state.currentTileImg}></img>
              <h4>Tiled</h4>
              {/* This could also probably be a component */}
              <div className="tile-preview-collection">
                {[...Array(9).keys()].map(a => <img alt={"tile" + a} src={this.state.currentTileImg} key={"preview-" + a}></img>)}
              </div>
              <div className="dl-bar">
                <SlButton href={this.state.currentTileImg} download={this.state.tileType + '.png'}>Download</SlButton>
              </div>
            </div>
            <div className="right">
              <h3>Tile Configuration</h3>
              <div className = "tile-option">
                <SlSelect label="Tile Type" value={this.state.tileType} onSlChange={e => this.updateTileType(e)}>
                  {AVAILABLE_TILE_TYPES.map(a => <SlMenuItem key={a} value={a}>{TILE_NAMES[a]}</SlMenuItem>)}
                </SlSelect>
              </div>

              {this.getTileOptions(this.state.tileType)}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;