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

export const getPalette = (idOrName) => {
    if (typeof idOrName === 'string') {
        return paletteData[idOrName];
    } else {
        return paletteData[availablePalettes[idOrName]];
    }
}