# What is this?

This is a quick-and-dirty react app put together to generate some simple tiles for retro-styled games. I honestly
didn't follow a lot of best practices here, and didn't do much of any code separation. (At least not yet). The main
goal was to get something working, not to make something for others to extend. (Though you're of course welcome to!)

If I find more time and/or this finds more interest I'll spend time refactoring to make this more friendly to web
developers.

It directly targets the Nintendo gameboy, but can be easily adapted to work with the NES, or likely many
other consoles. 

Check it out at https://cppchriscpp.github.io/2bit-tile-generator

## Run it locally

You must have nodejs installed on your machine. open a command line terminal into the folder this file is in.

Run the following commands: 
1. `npm install`
2. `npm start`

That's it! You should now see the app when you load http://localhost:3000 in your browser.

## Building for production

You probably won't need to do this unless you're forking this! The deploy process handles this.

Run this command: `npm run build`

## Contributing

In short, submit a PR! This is a pretty small proejct, but I'll try to stay on top of it. If you've got something
useful to add, I'm sure we can work something out.