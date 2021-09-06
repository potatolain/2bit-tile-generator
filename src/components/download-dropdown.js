import SlDropdown from '@shoelace-style/react/dist/dropdown';
import SlMenuItem from '@shoelace-style/react/dist/menu-item';
import SlButton from '@shoelace-style/react/dist/button';
import SlMenu from '@shoelace-style/react/dist/menu';
import React from 'react';

import ImageGenerator from '../services/image-generator';

import { nesPaletteData } from '../constants/palette-constants';

const decoder = new TextDecoder('utf8');

// Renders a dropdown with options to downloda all images
// Props:
// - tileImages: Collection of images to use for the given ids
// - tileProps: Collection of properties around tiles, used to get palette
export default class MapPreviewButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  forceDownload(data, name) {
    // Force a download, the new old-fashioned way
    let a = document.createElement("a");
    a.href = data; 
    a.download = name;
    a.click();
  }

  async downloadAll() {
    const img = await ImageGenerator.generateFullSet(this.props.tileImages);
    this.forceDownload(img, 'Tileset.png');
  }

  async downloadBin(organizeIntoBlocks) {
    const img = await ImageGenerator.generateNesPatternTables(this.props.tileImages, this.props.tileProps, organizeIntoBlocks);
    const b64data = 'data:application/octet-stream;base64,' + Buffer.from(img).toString('base64');
    this.forceDownload(b64data, '2bit-tile-generator.chr');
  }

  async downloadPalette() {
    let data = new Uint8Array([
      ...nesPaletteData['NES Default Blue'], 
      ...nesPaletteData['NES Default Red'], 
      ...nesPaletteData['NES Default Green'], 
      ...nesPaletteData['NES Default Yellow']
    ]);
    // To base64 url string
    const b64data = 'data:application/octet-stream;base64,' + Buffer.from(data).toString('base64');
    this.forceDownload(b64data, '2bit-tile-generator.pal');
  }

  render() {
    return <div style={{'display': 'inline-block'}}>
      <SlDropdown>
        <SlButton caret slot="trigger">Download</SlButton>
        <SlMenu>
          <SlMenuItem title="Download a single png file with all tiles" onClick={() => this.downloadAll()}>Download Tile Strip (.png)</SlMenuItem>
          <SlMenuItem title="Download NES binary data, with tile data organized linearly (for games, nesst, etc)" onClick={() => this.downloadBin(false)}>Download linear binary format (.chr)</SlMenuItem>
          <SlMenuItem title="Download NES binary data, with all tiles organized visually into 16x16 tiles (for games, nesst, etc)" onClick={() => this.downloadBin(true)}>Download organized binary format (.chr)</SlMenuItem>
          <SlMenuItem title="Download Default NES Palette file (games, nesst, etc)" onClick={() => this.downloadPalette()}>Download binary palette (.pal)</SlMenuItem>
        </SlMenu>
      </SlDropdown>
    </div>;
    
  }
}