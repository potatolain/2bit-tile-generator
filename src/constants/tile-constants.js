export const AVAILABLE_TILE_TYPES = [
    'block',
    'brick',
    'bridge', 
    'plant', // Aka "bush"
    'grass', 
    'hole',
    'ladder',
    'lava', 
    'rock', 
    'sand',
    'water',
  ];

  export const DEFAULT_TILE_TYPE = 'block';

  export const TILE_BACKGROUND_COLORS = {
    grass: 3,
    water: 2,
    lava: 3,
    rock: 3, 
    brick: 2,
    hole: 0,
    plant: 3,
    block: 3,
    sand: 0,
    bridge: 0,
    ladder: 0
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
    sand: 'Sand',
    bridge: 'Bridge',
    ladder: 'Ladder'
  }

  export const TILE_PREVIEW_IDS = {
    grass: [ 
      'grass', 'grass', 'grass', 
      'grass', 'grass', 'grass', 
      'grass', 'grass', 'grass',
    ],
    water: [
      'water', 'water', 'water',
      'water', 'water', 'water',
      'water', 'water', 'water',
    ],
    lava: [
      'sand', 'lava', 'lava',
      'sand', 'lava', 'lava',
      'sand', 'lava', 'lava',
    ],
    block: [
      'block', 'block', 'block',
      'block', 'grass', 'grass',
      'block', 'grass', 'grass',
    ],
    brick: [
      'brick', 'brick', 'brick',
      'brick', 'brick', 'brick',
      'grass', 'grass', 'grass', 
    ],
    rock: [
      'rock', 'rock', 'rock',
      'rock', 'rock', 'rock',
      'rock', 'rock', 'rock',
    ],
    hole: [
      'grass', 'grass', 'grass',
      'grass', 'hole', 'grass',
      'grass', 'grass', 'grass',
    ],
    plant: [
      'grass', 'grass', 'grass',
      'grass', 'plant', 'grass',
      'grass', 'grass', 'grass',
    ],
    sand: [
      'sand', 'sand', 'sand',
      'sand', 'sand', 'sand',
      'sand', 'sand', 'sand',
    ],
    bridge: [
      'water', 'water', 'water',
      'bridge', 'bridge', 'bridge',
      'water', 'water', 'water',
    ],
    'ladder': [
      'rock', 'ladder', 'rock',
      'rock', 'ladder', 'rock',
      'grass', 'grass', 'grass'
    ]
  }
  
  export const TILE_OPTIONS = {
    grass: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Green'},
      {name: 'Short Blades', min: 0, max: 10, type: 'range', defaultValue: 1},
      {name: 'Tall Blades', min: 0, max: 10, type: 'range', defaultValue: 0},
      {name: 'Triangles', min: 0, max: 8, type: 'range', defaultValue: 4}
    ],
    water: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Blue'},
      {name: 'Lines', min: 2, max: 4, type: 'range'},
      // Couldn't quite get what I wanted out of this - the areas kind of need to be relative to the lines, and 
      // that's a bit more complex than I'd hoped.
      {name: 'Deeper Areas', min: 0, max: 3, type: 'range', disabled: true, defaultValue: 0}
    ],
    lava: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Red'},
      {name: 'Frequency', min: 15, max: 25, type: 'range' },
      {name: 'Offset', min: 0, max: 15, type: 'range'},
      {name: 'Wave Width', min: 4, max: 8, type: 'range'}
    ],
    rock: [
      {name: 'Palette', type: 'palette', defaultValue: 'Gameboy'},
      {name: 'Rock Size', min: 3, max: 7, type: 'range'},
      {name: 'Rock Color', type: 'color', defaultValue: 2},
      {name: 'Rock Highlight Color', type: 'color', defaultValue: 3}
    ],
    brick: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Red'},
      {name: 'Brick Width', min: 5, max: 12, type: 'range'},
      {name: 'Brick Height', min: 2, max: 12, type: 'range'},
      {name: 'Brick Color', type: 'color', defaultValue: 2}
    ],
    block: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Red'},
      {name: 'Height', min: 2, max: 8, type: 'range'}
    ],
    hole: [
      {name: 'Palette', type: 'palette', defaultValue: 'Gameboy'},
      {name: 'Hole Size', min: 6, max: 14, type: 'range', step: 2},
      {name: 'Fuzz Area', min: 1, max: 2, type: 'range', defaultValue: 1}
    ],
    plant: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Green'},
      {name: 'Bush Size', min: 3, max: 6, type: 'range'},
      {name: 'Bush Color', type: 'color', defaultValue: 2},
      {name: 'Freckle Color', type: 'color', defaultValue: 1},
      {name: 'Freckle Count', min: 2, max: 8, type: 'range'},
      {name: 'Freckle Size', min: 1, max: 2, type: 'range', defaultValue: 1}
    ],
    sand: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Yellow'},
      {name: 'Frequency', min: 15, max: 75, type: 'range' },
      {name: 'Offset', min: 0, max: 15, type: 'range'},
      {name: 'Wave Width', min: 3, max: 12, type: 'range'}
    ],
    bridge: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Red'},
      {name: 'Board Width', min: 3, max: 9, type: 'range', step: 2, defaultValue: 7},
      {name: 'Border Width', min: 0, max: 2, type: 'range', defaultValue: 1},
      {name: 'Board Color', type: 'color', defaultValue: 1},
      {name: 'Separator Color', type: 'color', defaultValue: 0},
    ],
    ladder: [
      {name: 'Palette', type: 'palette', defaultValue: 'NES Default Blue'},
      {name: 'Step Width', min: 3, max: 9, type: 'range', step: 2, defaultValue: 3},
      {name: 'Border Width', min: 0, max: 2, type: 'range', defaultValue: 1},
      {name: 'Step Color', type: 'color', defaultValue: 3},
      {name: 'Separator Color', type: 'color', defaultValue: 1},
    ]

  };
  
  export const IMAGE_WIDTH = 16;
  export const IMAGE_HEIGHT = 16;