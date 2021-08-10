export const AVAILABLE_TILE_TYPES = [
    'grass', 
    'water', 
    // Unimplemented tile types (so far!) 
    // 'lava', 
    'block',
    // 'rock', 
    'brick', 
    // 'hole',
    // 'plant'
  ];
  export const TILE_BACKGROUND_COLORS = {
    grass: 3,
    water: 2,
    lava: 3,
    rock: 3, 
    brick: 2,
    hole: 0,
    plant: 3,
    block: 3
  };
  
  export const TILE_NAMES = {
    grass: 'Grass',
    water: 'Water',
    lava: 'Lava',
    block: 'Block / Tile',
    brick: 'Brick Wall',
    rock: 'Rock',
    hole: 'Hole / Gap',
    plant: 'Bush',
  }
  
  export const TILE_OPTIONS = {
    grass: [
      {name: 'Short Blades', min: 0, max: 10, type: 'range'},
      {name: 'Tall Blades', min: 0, max: 10, type: 'range'},
      {name: 'Triangles', min: 0, max: 8, type: 'range'}
    ],
    water: [
      {name: 'Lines', min: 2, max: 4, type: 'range'},
      // Couldn't quite get what I wanted out of this - the areas kind of need to be relative to the lines, and 
      // that's a bit more complex than I'd hoped.
      {name: 'Deeper Areas', min: 0, max: 3, type: 'range', disabled: true, defaultValue: 0}
    ],
    lava: [],
    rock: [],
    brick: [
      {name: 'Brick Width', min: 5, max: 12, type: 'range'},
      {name: 'Brick Height', min: 2, max: 12, type: 'range'},
      {name: 'Brick Color', type: 'palette', defaultValue: 2}
    ],
    block: [
      // {name: 'Color', type: 'palette', defaultValue: 2}
      {name: 'Height', min: 2, max: 8, type: 'range'}
    ],
    hole: [],
    plant: []
  }
  