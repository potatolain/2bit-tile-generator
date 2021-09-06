export const availablePalettes = [
    'Gameboy',
    'NES Default Red',
    'NES Default Blue',
    'NES Default Green',
    'NES Default Yellow'
];

export const paletteData = {
    // NOTE: These colors are exact matches that gbtd understands. Don't change just to make pretty!
    // (or at least make a separate palette)
    'Gameboy': [0x000000ff, 0x808080ff, 0xc0c0c0ff, 0xffffffff],
    'NES Default Blue': [0x000000ff, 0x00008fff, 0x4488ffff, 0x99ccffff],
    'NES Default Red': [0x000000ff, 0x550000ff, 0x993300ff, 0xdd6644ff],
    'NES Default Green': [0x000000ff, 0x113300ff, 0x336600ff, 0x77bb00ff],
    'NES Default Yellow': [0x000000ff, 0x666600ff, 0xbbaa00ff, 0xeedd88ff]
}

// Used to build up an actual NES palette, for download
export const nesPaletteData = {
    'Gameboy': [0x0f, 0x00, 0x10, 0x30],
    'NES Default Blue': [0x0f, 0x01, 0x21, 0x31],
    'NES Default Red': [0x0f, 0x06, 0x16, 0x26],
    'NES Default Green': [0x0f, 0x09, 0x19, 0x29],
    'NES Default Yellow': [0x0f, 0x08, 0x18, 0x28]
}

export const getPalette = (idOrName) => {
    if (typeof idOrName === 'string') {
        return paletteData[idOrName];
    } else {
        return paletteData[availablePalettes[idOrName]];
    }
}