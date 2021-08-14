import React from 'react';
import './tile-setting.css';

import SlRadio from '@shoelace-style/react/dist/radio';
import SlRadioGroup from '@shoelace-style/react/dist/radio-group';
import SlRange from '@shoelace-style/react/dist/range';
import SlSelect from '@shoelace-style/react/dist/select';
import SlMenuItem from '@shoelace-style/react/dist/menu-item';

import { availablePalettes, getPalette } from '../constants/palette-constants';

import PaletteColorPreview from './palette-color-preview';
import PalettePreview from './palette-preview';

// Given a setting property (such as those defined in tile-constants)
export default class TileSetting extends React.Component {
  setting = null;
  state = null;
  tileTypeId = null;
  updateTileState = () => {};
  constructor(props) {
    super(props);
    this.state = props.state;
    this.reloadFromProps(props);
  }

  // Make sure this component always refreshes when props change.
  // NOTE: We would be far better served by a redux pattern here, but that's more effort than I'd care
  // to put in at this stage. At some point we might want to migrate to something better.
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.reloadFromProps(nextProps);
    this.setState(nextProps.state);
  }

  reloadFromProps(props) {
    this.setting = props.setting;
    this.tileTypeId = props.tileTypeId;
    this.updateTileState = (a, b, c) => {
        props.updateTileState(a, b, c);
    };
  }

  render() {
    const setting = this.setting;

    if (setting.disabled || setting === null) { return <span key={"disabled-setting-" + setting.type + setting.name}></span>; }
    switch (setting.type) {
      case 'range':
        // This could probably be a component of its
        return <div className="tile-option" key={"range-" + setting.type + setting.name}>
            <SlRange key={this.tileTypeId + setting.name} 
              min={setting.min} 
              max={setting.max} 
              step={setting.step || 1} 
              label={setting.name} 
              value={this.state.tileProps[this.tileTypeId][setting.name]} 
              onSlChange={e => this.updateTileState(this.tileTypeId, setting.name, e.target.value)}>
            </SlRange>
            <div className="below-range">
              <small className="left">{setting.min}</small>
              <small className="mid">Current: {this.state.tileProps[this.tileTypeId][setting.name]}</small>
              <small className="right">{setting.max}</small>
            </div>
          </div>;
      case 'color':
        return <div className="tile-option" key={"palette-" + setting.type + setting.name}>
          <SlRadioGroup label={setting.name}>
            {[0, 1, 2, 3].map(n => {
              return <SlRadio 
                  value={n} 
                  checked={this.state.tileProps[this.tileTypeId][setting.name] === n ? true : false} 
                  key={"palette-color" + setting.type + setting.name + '-' + n} 
                  onSlChange={e => e.target.checked ? this.updateTileState(this.tileTypeId, setting.name, n) : null}
                >
                  Color {n+1} 
                  <PaletteColorPreview color={this.state.palette[n].toString(16).padStart(8, '0')}></PaletteColorPreview>
                </SlRadio>
            })}
          </SlRadioGroup>
        </div>
      case 'palette':
        return <div className="tile-option" key={'palette-' + setting.type + setting.name}>
          <SlSelect 
            label="Palette Color" 
            value={this.state.tileProps[this.tileTypeId][setting.name]}
            onSlChange={e => this.updateTileState(this.tileTypeId, setting.name, e.target.value)}>
              {availablePalettes.map(a => <SlMenuItem key={a} value={a}>{a} <PalettePreview palette={getPalette(a)}></PalettePreview></SlMenuItem>)}
          </SlSelect>
        </div>
      default:
        console.error(`Unknown tile option type "${setting.type}" found!`, setting);
        return <span></span>;
    }

  }
}