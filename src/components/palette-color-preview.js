import React from 'react';
import './palette-color-preview.css';

export default class PaletteColorPreview extends React.Component {

  render() {
    return <div className="palette-color-preview" style={{backgroundColor: '#' + this.props.color}}></div>;
  }
}