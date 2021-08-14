import React from 'react';
import './palette-preview.css';

import PaletteColorPreview from './palette-color-preview';

// Given an array of colors in rgba hex numeral format, draw the palette as dom elements.
// Props:
// - palette: An array of colors, in hex format, including alpha. eg 0xff00ffff
export default class PalettePreview extends React.Component {
  render() {
    return <div className="palette-preview">
      {this.props.palette.map(a => <PaletteColorPreview key={'prev-' + a} color={a.toString(16).padStart(8, '0')}></PaletteColorPreview>)}
    </div>;
  }
}