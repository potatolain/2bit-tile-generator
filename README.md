# What is this?

This is a quick-and-dirty react app put together to generate some simple tiles for retro-styled games. I honestly
didn't follow a lot of best practices here, and didn't do much of any code separation. (At least not yet). The main
goal was to get something working, not to make something for others to extend. (Though you're of course welcome to!)

It directly targets the Nintendo gameboy and NES, but may be able to be used with other consoles as well.

It outputs png files, as well as NES-compatible chr and pal files.

Check it out live at: https://cppchriscpp.github.io/2bit-tile-generator

## Run it locally

You must have nodejs installed on your machine. open a command line terminal into the folder this file is in.

Run the following commands: 
1. `npm install`
2. `npm start`

That's it! You should now see the app when you load http://localhost:3000 in your browser.

## Building for production

You probably won't need to do this unless you're forking this! The deploy process handles this.

Run this command: `npm run build`

You can test the result with a server by doing `http-server ./build`. (http-server is a node module, install 
it globally)

## Some potential future goals

If this thing takes of at all, I might consider exapnding this. If you have ideas (or just like one of these a lot!)
create an issue on the github issue tracker. I'll see what I can do!

Potential future enhancements:
* Allow multiple tile sizes (I could also do 32x32 pretty easily, and maybe 8x8 too.)
  * The main thing would just be finding an intuitive way to expose this through the UI, and make the settings adjust accordingly
* Add more palettes? (What kinds of palettes would you like to see?)
* More tile types (examples help a lot!)

## Contributing

In short, submit a PR! This is a pretty small project, but I'll try to stay on top of it. If you've got something
useful to add, I'm sure we can work something out.

If it's a really big feature or a rewrite, you can also submit an issue to discuss it first. I'm not really looking to completely
rewrite this tool right now, but discussion is always welcome.
