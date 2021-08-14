export const availablePalettes = [
    'Gameboy'
];

export const paletteData = {
    'Gameboy': [0x000000ff, 0x444444ff, 0xaaaaaaff, 0xffffffff]
}

export const getPalette = (idOrName) => {
    if (typeof idOrName === 'string') {
        return paletteData[idOrName];
    } else {
        return paletteData[availablePalettes[idOrName]];
    }
}