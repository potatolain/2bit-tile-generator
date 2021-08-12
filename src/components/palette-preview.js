import React from 'react';

export default class PalettePreview extends React.Component {

  propTypes = {
    palette: React.propTypes.string
  }

  render() {
    return <div className="palette-preview" style={{backgroundColor: '#' + this.props.palette}}></div>;
  }
}