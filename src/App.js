import React from 'react';

// Shoelace components
import '@shoelace-style/shoelace/dist/themes/base.css';
import SlButton from '@shoelace-style/react/dist/button';
import SlSelect from '@shoelace-style/react/dist/select';
import SlMenuItem from '@shoelace-style/react/dist/menu-item';
import SlRange from '@shoelace-style/react/dist/range';
import SlTooltip from '@shoelace-style/react/dist/tooltip';
import SlRadio from '@shoelace-style/react/dist/radio';
import SlRadioGroup from '@shoelace-style/react/dist/radio-group';

// Services
import ImageGenerator from './services/image-generator';

// Custom components
import PalettePreview from './components/palette-preview';

// Constants
import { TILE_NAMES, TILE_OPTIONS, AVAILABLE_TILE_TYPES } from './tile-constants';

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
// Huge app component that could probably be broken down well if I got smart with a Store for state
class App extends React.Component {

  // Initializer, mostly sets up initial state of the application
  constructor(props) {
    super(props);
    this.state = {
      tileType: 'hole',
      tileProps: {},
      palette: [0x000000ff, 0x444444ff, 0xaaaaaaff, 0xffffffff],
      imageWidth: 16,
      imageHeight: 16,
      // Transparent 1px gif so we don't show a broken image
      currentTileImg: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    }

    // NOTE: This logic is almost-duplicated in the reRandomize method
    AVAILABLE_TILE_TYPES.forEach(t => {
      // Seriously, it's a constructor. The react docs do this. Calm down.
      // eslint-disable-next-line
      this.state.tileProps[t] = {};
      TILE_OPTIONS[t].forEach(opt => {
        if (opt.defaultValue !== undefined) {
          // eslint-disable-next-line
          this.state.tileProps[t][opt.name] = opt.defaultValue;
        } else if (opt.min !== undefined && opt.max !== undefined) {
          let val = Math.floor(Math.random() * (opt.max - opt.min +1)) + opt.min;

          // Enforce the step sizein randomization
          if (opt.step) { 
            val -= (val % opt.step); 
          }
          // es-lint-disable-next-line: Once again, see above snark
          this.state.tileProps[t][opt.name] = val;
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
            let val = Math.floor(Math.random() * (opt.max - opt.min + 1)) + opt.min;

            // Enforce the step sizein randomization
            if (opt.step) { 
              val -= (val % opt.step); 
            }

            newState.tileProps[t][opt.name] = val;
          }
        }
      });
    });
    this.setState(newState, this.reloadImage);
  };

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
  async getCurrentTileImage() {
    return await ImageGenerator.generateImage(this.state.tileType, this.state.tileProps[this.state.tileType], this.state.palette);
  }

  // Rebuild the image shown on the page from available settings.
  async reloadImage() {
    this.setState({currentTileImg: await this.getCurrentTileImage()});
  }

  // Helper function to do exactly what it says. Regenerates the image too.
  updateTileType(event) {
    this.setState({tileType: event.target.value}, this.reloadImage);
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
    }, this.reloadImage);
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
