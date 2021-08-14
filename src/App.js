import React from 'react';

// Shoelace components
import '@shoelace-style/shoelace/dist/themes/base.css';
import SlButton from '@shoelace-style/react/dist/button';
import SlSelect from '@shoelace-style/react/dist/select';
import SlMenuItem from '@shoelace-style/react/dist/menu-item';
import SlTooltip from '@shoelace-style/react/dist/tooltip';

// Services
import ImageGenerator from './services/image-generator';

// Custom components
import TileSetting from './components/tile-setting';

// Constants
import { TILE_NAMES, TILE_OPTIONS, AVAILABLE_TILE_TYPES, DEFAULT_TILE_TYPE } from './constants/tile-constants';
import { getPalette } from './constants/palette-constants';


/**
 * ADVANCED THINGS TO PLAY WITH
 * Weighted random, to make tiles look nicer: https://redstapler.co/javascript-weighted-random/ -- option 2 looks nice
 * For grass it'd be nice to limit to fewer lines and blades, and more triangles, for example
 * 
 * 
 * GENERAL TODO:
 * - Add more palettes (steal from the sprite generator? Try defaults built into nesst? Other?)
 * - Allow palette reordering?
 * - Pretty the codebase up so an employer wouldn't look at this and decide I have no idea what I'm doing (⩾﹏⩽)
 */

import './App.css';
// Huge app component that could probably be broken down well if I got smart with a Store for state
class App extends React.Component {

  // Initializer, mostly sets up initial state of the application
  constructor(props) {
    super(props);
    this.state = {
      tileType: DEFAULT_TILE_TYPE,
      tileProps: {},
      currentPaletteId: 0,
      palette: getPalette(0),
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

          // Enforce the step size in randomization
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

              {TILE_OPTIONS[this.state.tileType].map(setting => 
                <TileSetting 
                  setting={setting} 
                  state={this.state} 
                  tileTypeId={this.state.tileType} 
                  updateTileState={(a, b, c) => this.updateTileState(a, b, c)
                }></TileSetting>
              )}
            </div>
          </div>
        </section>
        <footer>
          <p>
            All images generated by this tool are free for use. (CC0) Tool available under the MIT license. (
            <a href="https://github.com/cppchriscpp/2bit-tile-generator" target="_blank">Source</a>)
          </p>

          <p>
            Heavily inspired by <a href="https://0x72.itch.io/2bitcharactergenerator" target="_blank">0x72's 2BitCharactersGenerator</a>
          </p>
          <p>Wanna see the other stuff I do? Check out <a href="https://cpprograms.net" target="_blank">cpprograms.net</a>.</p>
        </footer>
      </div>
    );
  }
}

export default App;