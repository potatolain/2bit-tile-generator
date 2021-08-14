import React from 'react';
import './tiled-image.css';

// Renders an image in a tiled pattern, sizeXsize wide
// Props:
// - src: The image src to use. (can be base64, or whatever)
// - size: The number of images to tile together. A value of 3 would render a 3x3 grid.
export default class TiledImage extends React.Component {

  render() {
    return <div className="tile-preview-collection">
    {[...Array(this.props.size * this.props.size).keys()].map(a => <img alt={"tile" + a} src={this.props.src} key={"preview-" + a}></img>)}
  </div>;
  }
}