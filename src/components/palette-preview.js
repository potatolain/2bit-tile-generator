import React from 'react';

export default class PalettePreview extends React.Component {
  render() {
    return <div className="palette-preview" style={{backgroundColor: '#' + this.props.palette}}></div>;
  }
}