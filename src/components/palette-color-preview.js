import React from 'react';
import './palette-color-preview.css';

// Given a hex color, create a component with that as the background color
// props: 
// - color: A hex color in rgba format -including alpha. Example: 0xff00ffff
export default class PaletteColorPreview extends React.Component {

  render() {
    return <div className="palette-color-preview" style={{backgroundColor: '#' + this.props.color}}></div>;
  }
}