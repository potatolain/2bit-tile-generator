import React from 'react';
import './tiled-image.css';

import { TILE_PREVIEW_IDS } from '../constants/tile-constants';

// Renders an image in a tiled pattern, sizeXsize wide
// Props:
// - 
// - src: The image src to use. (can be base64, or whatever)
// - size: The number of images to tile together. A value of 3 would render a 3x3 grid.
export default class TiledImage extends React.Component {
  render() {
    const allSrc = TILE_PREVIEW_IDS[this.props.tileId].map(id => this.props.tileImages[id]);
    return <div className="tile-preview-collection">
      {allSrc.map((src, i) => <img alt="" src={src} key={'preview-' + i}></img>)}
    </div>
  }
}