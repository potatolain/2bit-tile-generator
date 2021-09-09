import SlButton from '@shoelace-style/react/dist/button';
import SlDialog from '@shoelace-style/react/dist/dialog';
import SlTooltip from '@shoelace-style/react/dist/tooltip';
import React from 'react';

import ImageGenerator from '../services/image-generator';

import './map-preview-button.css';

// Renders a preview map with the given images. simulates a simple game map
// Props:
// - tileImages: Collection of images to use for the given ids
export default class MapPreviewButton extends React.Component {

  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
    this.state = {mapImage: null};
  }

  async showDialog() {
    const img = await ImageGenerator.generateMapPreview(this.props.tileImages);
    this.setState({mapImage: img});
    // This should always be set - I used the ? to avoid issues with some hacky test code I wrote
    this.imageRef?.current?.show();
  }


  render() {
    return <span>
      <SlTooltip content="Show a preview image using all of the tiles">
        <SlButton onClick={() => this.showDialog()}>Preview as map</SlButton>
      </SlTooltip>
      <SlDialog label="Map Preview" ref={this.imageRef} className="map-preview-dialog">
        <img alt="Map Preview" src={this.state.mapImage}></img>
      </SlDialog>
    </span>;
    
  }
}