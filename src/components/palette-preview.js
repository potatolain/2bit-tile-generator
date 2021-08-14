import React from 'react';
import './palette-preview.css';

import PaletteColorPreview from './palette-color-preview';

export default class PalettePreview extends React.Component {

  render() {
    return <div className="palette-preview">
      {this.props.palette.map(a => <PaletteColorPreview key={'prev-' + a} color={a.toString(16).padStart(8, '0')}></PaletteColorPreview>)}
    </div>;
  }
}