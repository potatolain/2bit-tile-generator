import React from 'react';
import './tiled-image.css';

import { TILE_PREVIEW_IDS } from '../constants/tile-constants';

// Renders an image in a tiled pattern, sizeXsize wide
// Props:
// - tileId: The id of the tile to render, looked up from constants
// - tileImages: Collection of images to use for the given ids
export default class TiledImage extends React.Component {
  render() {
    const allSrc = TILE_PREVIEW_IDS[this.props.tileId].map(id => this.props.tileImages[id]);
    return <div className="tile-preview-collection">
      {allSrc.map((src, i) => <img alt="" src={src} key={'preview-' + i}></img>)}
    </div>
  }
}