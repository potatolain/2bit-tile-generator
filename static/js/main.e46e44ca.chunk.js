(this["webpackJsonp2bit-tile-generator"]=this["webpackJsonp2bit-tile-generator"]||[]).push([[0],{140:function(e,t,a){},169:function(e,t){},171:function(e,t){},22:function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return n})),a.d(t,"e",(function(){return i})),a.d(t,"f",(function(){return l})),a.d(t,"g",(function(){return o})),a.d(t,"d",(function(){return s})),a.d(t,"c",(function(){return c}));var r=["block","brick","plant","grass","hole","lava","rock","sand","water"],n="block",i={grass:3,water:2,lava:3,rock:3,brick:2,hole:0,plant:3,block:3,sand:0},l={grass:"Grass",water:"Water",lava:"Lava",block:"Block / Tile",brick:"Brick Wall",rock:"Rock",hole:"Hole / Gap",plant:"Bush",sand:"Sand"},o={grass:[{name:"Palette",type:"palette",defaultValue:"NES Default Green"},{name:"Short Blades",min:0,max:10,type:"range",defaultValue:1},{name:"Tall Blades",min:0,max:10,type:"range",defaultValue:0},{name:"Triangles",min:0,max:8,type:"range",defaultValue:4}],water:[{name:"Palette",type:"palette",defaultValue:"NES Default Blue"},{name:"Lines",min:2,max:4,type:"range"},{name:"Deeper Areas",min:0,max:3,type:"range",disabled:!0,defaultValue:0}],lava:[{name:"Palette",type:"palette",defaultValue:"NES Default Red"},{name:"Frequency",min:15,max:25,type:"range"},{name:"Offset",min:0,max:15,type:"range"},{name:"Wave Width",min:4,max:8,type:"range"}],rock:[{name:"Palette",type:"palette",defaultValue:"Gameboy"},{name:"Rock Size",min:3,max:7,type:"range"},{name:"Rock Color",type:"color",defaultValue:2},{name:"Rock Highlight Color",type:"color",defaultValue:3}],brick:[{name:"Palette",type:"palette",defaultValue:"NES Default Red"},{name:"Brick Width",min:5,max:12,type:"range"},{name:"Brick Height",min:2,max:12,type:"range"},{name:"Brick Color",type:"color",defaultValue:2}],block:[{name:"Palette",type:"palette",defaultValue:"NES Default Red"},{name:"Height",min:2,max:8,type:"range"}],hole:[{name:"Palette",type:"palette",defaultValue:"Gameboy"},{name:"Hole Size",min:6,max:14,type:"range",step:2},{name:"Fuzz Area",min:1,max:2,type:"range",defaultValue:1}],plant:[{name:"Palette",type:"palette",defaultValue:"NES Default Green"},{name:"Bush Size",min:3,max:6,type:"range"},{name:"Bush Color",type:"color",defaultValue:2},{name:"Freckle Color",type:"color",defaultValue:1},{name:"Freckle Count",min:2,max:8,type:"range"},{name:"Freckle Size",min:1,max:2,type:"range",defaultValue:1}],sand:[{name:"Palette",type:"palette",defaultValue:"NES Default Yellow"},{name:"Frequency",min:15,max:75,type:"range"},{name:"Offset",min:0,max:15,type:"range"},{name:"Wave Width",min:3,max:12,type:"range"}]},s=16,c=16},287:function(e,t,a){},288:function(e,t,a){},290:function(e,t,a){},291:function(e,t,a){},292:function(e,t,a){},293:function(e,t,a){"use strict";a.r(t);var r=a(16),n=a.n(r),i=a(132),l=a.n(i),o=(a(140),a(41)),s=a(9),c=a.n(s),u=a(18),h=a(32),p=a(3),d=a(4),m=a(6),f=a(7),b=(a(141),a(52)),g=a(68),j=a(69),x=a(71),v=a(87),y=(a(287),a(133)),k=a(134),O=a(135),w=["Gameboy","NES Default Red","NES Default Blue","NES Default Green","NES Default Yellow"],P={Gameboy:[255,2155905279,3233857791,4294967295],"NES Default Blue":[255,36863,1149829119,2580348927],"NES Default Red":[255,1426063615,2570256639,3714467071],"NES Default Green":[255,288555263,862322943,2008744191],"NES Default Yellow":[255,1717960959,3148480767,4007495935]},C=function(e){return"string"===typeof e?P[e]:P[w[e]]},T=(a(288),a(2)),S=function(e){Object(m.a)(a,e);var t=Object(f.a)(a);function a(){return Object(p.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"render",value:function(){return Object(T.jsx)("div",{className:"palette-color-preview",style:{backgroundColor:"#"+this.props.color}})}}]),a}(n.a.Component),I=(a(290),function(e){Object(m.a)(a,e);var t=Object(f.a)(a);function a(){return Object(p.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"render",value:function(){return Object(T.jsx)("div",{className:"palette-preview",children:this.props.palette.map((function(e){return Object(T.jsx)(S,{color:e.toString(16).padStart(8,"0")},"prev-"+e)}))})}}]),a}(n.a.Component)),M=function(e){Object(m.a)(a,e);var t=Object(f.a)(a);function a(e){var r;return Object(p.a)(this,a),(r=t.call(this,e)).setting=null,r.state=null,r.tileTypeId=null,r.updateTileState=function(){},r.state=e.state,r.reloadFromProps(e),r}return Object(d.a)(a,[{key:"UNSAFE_componentWillReceiveProps",value:function(e){this.reloadFromProps(e),this.setState(e.state)}},{key:"reloadFromProps",value:function(e){this.setting=e.setting,this.tileTypeId=e.tileTypeId,this.updateTileState=function(t,a,r){e.updateTileState(t,a,r)}}},{key:"render",value:function(){var e=this,t=this.setting;if(t.disabled||null===t)return Object(T.jsx)("span",{},"disabled-setting-"+t.type+t.name);switch(t.type){case"range":return Object(T.jsxs)("div",{className:"tile-option",children:[Object(T.jsx)(O.a,{min:t.min,max:t.max,step:t.step||1,label:t.name,value:this.state.tileProps[this.tileTypeId][t.name],onSlChange:function(a){return e.updateTileState(e.tileTypeId,t.name,a.target.value)}},this.tileTypeId+t.name),Object(T.jsxs)("div",{className:"below-range",children:[Object(T.jsx)("small",{className:"left",children:t.min}),Object(T.jsxs)("small",{className:"mid",children:["Current: ",this.state.tileProps[this.tileTypeId][t.name]]}),Object(T.jsx)("small",{className:"right",children:t.max})]})]},"range-"+t.type+t.name);case"color":return Object(T.jsx)("div",{className:"tile-option",children:Object(T.jsx)(k.a,{label:t.name,children:[0,1,2,3].map((function(a){return Object(T.jsxs)(y.a,{value:a,checked:e.state.tileProps[e.tileTypeId][t.name]===a,onSlChange:function(r){return r.target.checked?e.updateTileState(e.tileTypeId,t.name,a):null},children:["Color ",a+1,Object(T.jsx)(S,{color:e.state.palette[a].toString(16).padStart(8,"0")})]},"palette-color"+t.type+t.name+"-"+a)}))})},"palette-"+t.type+t.name);case"palette":return Object(T.jsx)("div",{className:"tile-option",children:Object(T.jsx)(g.a,{label:"Palette Color",value:this.state.tileProps[this.tileTypeId][t.name],onSlChange:function(a){return e.updateTileState(e.tileTypeId,t.name,a.target.value)},children:w.map((function(e){return Object(T.jsxs)(j.a,{value:e,children:[e," ",Object(T.jsx)(I,{palette:C(e)})]},e)}))})},"palette-"+t.type+t.name);default:return console.error('Unknown tile option type "'.concat(t.type,'" found!'),t),Object(T.jsx)("span",{})}}}]),a}(n.a.Component),A=a(17),B=(a(291),function(e){Object(m.a)(a,e);var t=Object(f.a)(a);function a(){return Object(p.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"render",value:function(){var e=this;return Object(T.jsx)("div",{className:"tile-preview-collection",children:Object(A.a)(Array(this.props.size*this.props.size).keys()).map((function(t){return Object(T.jsx)("img",{alt:"tile"+t,src:e.props.src},"preview-"+t)}))})}}]),a}(n.a.Component)),N=a(22),z=(a(292),function(e){Object(m.a)(a,e);var t=Object(f.a)(a);function a(e){var r;return Object(p.a)(this,a),(r=t.call(this,e)).state={tileType:N.b,tileProps:{},palette:C(0),currentTileImg:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",builtTileImages:{}},N.a.forEach((function(e){r.state.tileProps[e]={},N.g[e].forEach((function(t){if(void 0!==t.defaultValue)r.state.tileProps[e][t.name]=t.defaultValue;else if(void 0!==t.min&&void 0!==t.max){var a=Math.floor(Math.random()*(t.max-t.min+1))+t.min;t.step&&(a-=a%t.step),r.state.tileProps[e][t.name]=a}})),r.state.builtTileImages[e]=null,r.generateTileImage(e)})),r}return Object(d.a)(a,[{key:"componentDidMount",value:function(){this.reloadImage()}},{key:"reRandomize",value:function(){var e=this,t={tileProps:Object(h.a)({},this.state.tileProps)};N.a.forEach((function(a){t.tileProps[a]=Object(h.a)({},e.state.tileProps[a]),N.g[a].forEach((function(e){if(!e.disabled&&void 0!==e.min&&void 0!==e.max){var r=Math.floor(Math.random()*(e.max-e.min+1))+e.min;e.step&&(r-=r%e.step),t.tileProps[a][e.name]=r}}))})),this.setState(t,this.reloadImage)}},{key:"generateTileImage",value:function(){var e=Object(u.a)(c.a.mark((function e(t){var a,r,n=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=n.length>1&&void 0!==n[1]&&n[1],r=this.state.palette,this.state.tileProps[t].Palette&&(r=C(this.state.tileProps[t].Palette)),null!==this.state.builtTileImages[t]&&!a){e.next=7;break}return e.next=6,v.a.generateImage(t,this.state.tileProps[t],r);case 6:this.state.builtTileImages[t]=e.sent;case 7:return e.abrupt("return",this.state.builtTileImages[t]);case 8:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getCurrentTileImage",value:function(){var e=Object(u.a)(c.a.mark((function e(){var t,a=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.length>0&&void 0!==a[0]&&a[0],e.next=3,this.generateTileImage(this.state.tileType,t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"reloadImage",value:function(){var e=Object(u.a)(c.a.mark((function e(){var t,a=arguments;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=!(a.length>0&&void 0!==a[0])||a[0],e.t0=this,e.next=4,this.getCurrentTileImage(t);case 4:e.t1=e.sent,e.t2={currentTileImg:e.t1},e.t0.setState.call(e.t0,e.t2);case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"updateTileType",value:function(e){var t=this;this.setState({tileType:e.target.value},(function(){return t.reloadImage(!1)}))}},{key:"updateTileState",value:function(e,t,a){this.state.tileProps[e][t]!==a&&this.setState({tileProps:Object(h.a)(Object(h.a)({},this.state.tileProps),{},Object(o.a)({},e,Object(h.a)(Object(h.a)({},this.state.tileProps[e]),{},Object(o.a)({},t,a))))},this.reloadImage)}},{key:"downloadAll",value:function(){var e=Object(u.a)(c.a.mark((function e(){var t,a,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=0;case 1:if(!(t<N.a.length)){e.next=7;break}return e.next=4,this.generateTileImage(N.a[t]);case 4:t++,e.next=1;break;case 7:return e.next=9,v.a.generateFullSet(this.state.builtTileImages);case 9:a=e.sent,(r=document.createElement("a")).href="data:"+a,r.download="Tileset.png",r.click();case 14:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this;return Object(T.jsxs)("div",{className:"App",children:[Object(T.jsx)("header",{className:"App-header",children:Object(T.jsx)("h1",{children:"2Bit Tile Generator"})}),Object(T.jsxs)("section",{children:[Object(T.jsxs)("div",{className:"control-bar",children:[Object(T.jsx)(x.a,{content:"Download a single png file with all tiles",children:Object(T.jsx)(b.a,{onClick:function(){return e.downloadAll()},children:"Download All"})}),Object(T.jsx)(x.a,{content:"Randomize the settings for all tiles.",children:Object(T.jsx)(b.a,{onClick:function(){return e.reRandomize()},children:"Randomize Settings"})}),Object(T.jsx)(x.a,{content:"Regenerate tile image with the current settings",children:Object(T.jsx)(b.a,{onClick:function(){return e.reloadImage(!0)},children:"Regenerate"})})]}),Object(T.jsxs)("div",{className:"configurator",children:[Object(T.jsxs)("div",{className:"left",children:[Object(T.jsx)("h3",{children:"Tile Preview"}),Object(T.jsx)("h4",{children:"Single"}),Object(T.jsx)("img",{className:"tile-preview",alt:"Tile Preview",src:this.state.currentTileImg}),Object(T.jsx)("h4",{children:"Tiled"}),Object(T.jsx)(B,{src:this.state.currentTileImg,size:3}),Object(T.jsx)("div",{className:"dl-bar",children:Object(T.jsx)(b.a,{href:this.state.currentTileImg,download:this.state.tileType+".png",children:"Download"})})]}),Object(T.jsxs)("div",{className:"right",children:[Object(T.jsx)("h3",{children:"Tile Configuration"}),Object(T.jsx)("div",{className:"tile-option",children:Object(T.jsx)(g.a,{label:"Tile Type",value:this.state.tileType,onSlChange:function(t){return e.updateTileType(t)},children:N.a.map((function(e){return Object(T.jsx)(j.a,{value:e,children:N.f[e]},e)}))})}),N.g[this.state.tileType].map((function(t){return Object(T.jsx)(M,{setting:t,state:e.state,tileTypeId:e.state.tileType,updateTileState:function(t,a,r){return e.updateTileState(t,a,r)}},e.state.tileType+t.name)}))]})]})]}),Object(T.jsxs)("footer",{children:[Object(T.jsxs)("p",{children:["Heavily inspired by ",Object(T.jsx)("a",{href:"https://0x72.itch.io/2bitcharactergenerator",target:"_blank",children:"0x72's 2BitCharactersGenerator"}),". UI powered by ",Object(T.jsx)("a",{href:"https://shoelace.style/",target:"_blank",children:"Shoelace"}),"."]}),Object(T.jsxs)("p",{children:["All images generated by this tool are free for use. (CC0) Tool available under the MIT license. (",Object(T.jsx)("a",{href:"https://github.com/cppchriscpp/2bit-tile-generator",target:"_blank",children:"Source"})," \u2022 "," ",Object(T.jsx)("a",{href:"https://github.com/cppchriscpp/2bit-tile-generator/issues",target:"_blank",children:"Feature Requests"}),")"]}),Object(T.jsxs)("p",{children:["There is no requirement to credit me, but please consider tweeting me if you find this useful! "," ",Object(T.jsx)("a",{href:"https://twitter.com/cppchriscpp",target:"_blank",children:"@cppchriscpp"})]}),Object(T.jsxs)("p",{children:["Wanna see the other stuff I do? Check out ",Object(T.jsx)("a",{href:"https://cpprograms.net",target:"_blank",children:"cpprograms.net"}),"."]}),Object(T.jsxs)("p",{className:"version",children:["version: ","1.1.0"]})]})]})}}]),a}(n.a.Component)),E=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,294)).then((function(t){var a=t.getCLS,r=t.getFID,n=t.getFCP,i=t.getLCP,l=t.getTTFB;a(e),r(e),n(e),i(e),l(e)}))};l.a.render(Object(T.jsx)(n.a.StrictMode,{children:Object(T.jsx)(z,{})}),document.getElementById("root")),E()},87:function(e,t,a){"use strict";(function(e){a.d(t,"a",(function(){return d}));var r=a(9),n=a.n(r),i=a(18),l=a(3),o=a(4),s=a(70),c=a.n(s),u=a(22);function h(e,t){return(e%t+t)%t}function p(e){return{x:Math.floor(Math.random()*e.bitmap.width),y:Math.floor(Math.random()*e.bitmap.height)}}var d=function(){function t(){Object(l.a)(this,t)}return Object(o.a)(t,null,[{key:"generateImage",value:function(e,a,r){return new Promise((function(n,i){new c.a(u.d,u.c,r[u.e[e]],(function(l,o){switch(l&&i(l),e){case"grass":t.drawGrass(o,a,r);break;case"water":t.drawWater(o,a,r);break;case"brick":t.drawBrick(o,a,r);break;case"block":t.drawBlock(o,a,r);break;case"hole":t.drawHole(o,a,r);break;case"plant":t.drawPlant(o,a,r);break;case"rock":t.drawRock(o,a,r);break;case"lava":t.drawLava(o,a,r);break;case"sand":t.drawSand(o,a,r);break;default:console.warn("Unimplemented tile type given!",e,"blank image ahoy")}o.getBase64Async("image/png").then(n,i)}))}))}},{key:"drawGrass",value:function(e,t,a){for(var r=0;r<t["Short Blades"];r++){var n=p(e),i=n.x,l=n.y;e.setPixelColor(a[2],i,l)}for(var o=0;o<t["Tall Blades"];o++){var s=p(e),c=s.x,u=s.y;e.setPixelColor(a[2],c,u),e.setPixelColor(a[2],c,0===u?e.bitmap.height-1:u-1)}for(var h=0;h<t.Triangles;h++){var d=p(e),m=d.x,f=d.y;e.setPixelColor(a[2],m>0?m-1:e.bitmap.width-1,f),e.setPixelColor(a[2],m<e.bitmap.width-1?m+1:0,f),e.setPixelColor(a[2],m,f>0?f-1:e.bitmap.height-1)}}},{key:"drawWater",value:function(e,t,a){for(var r=function(t){var r=p(e),n=r.x,i=r.y,l=Math.floor(4*Math.random())+3;e.scan(0,0,e.bitmap.width,e.bitmap.height,(function(t,r,o){var s=n-t,c=i-r;s*s+c*c<=l*l&&e.setPixelColor(a[1],t,r)}))},n=0;n<t["Deeper Areas"];n++)r();for(var i=0;i<t.Lines;i++){var l=p(e),o=l.x,s=l.y,c=1===Math.floor(2*Math.random())?1:-1,u=1===Math.floor(2*Math.random())?1:-1,d=o,m=s;for(e.setPixelColor(a[3],d,m),d=h(d+c,e.bitmap.width),m=h(m+u,e.bitmap.height);d!==o&&m!==s;)e.setPixelColor(a[3],d,m),Math.random()>.3&&(d=h(d+c,e.bitmap.width)),Math.random()>.3&&(m=h(m+u,e.bitmap.height));e.setPixelColor(a[3],d,m)}}},{key:"drawBrick",value:function(e,t,a){for(var r=[],n=[],i=0;i<e.bitmap.width;i++)0===h(i+1,t["Brick Width"]+1)?r.push(i):0===h(i+1+Math.floor(t["Brick Width"]/2),t["Brick Width"]+1)&&n.push(i);var l=0;e.scan(0,0,e.bitmap.width,e.bitmap.height,(function(i,o,s){e.setPixelColor(a[t["Brick Color"]],i,o),o%(t["Brick Height"]+1)===0&&(e.setPixelColor(a[0],i,o),0===i&&++l),l%2===0?-1!==r.indexOf(i)&&e.setPixelColor(a[0],i,o):-1!==n.indexOf(i)&&e.setPixelColor(a[0],i,o)}))}},{key:"drawBlock",value:function(e,t,a){e.scan(0,0,e.bitmap.width,e.bitmap.height,(function(r,n){var i=2*(10-t.Height);e.setPixelColor(r>e.bitmap.height-n-1?a[1]:a[3],r,n),r===n?e.setPixelColor(a[2],r,n):r===e.bitmap.height-n-1&&e.setPixelColor(a[1],r,n);var l=e.bitmap.height/2-i/2;r>l&&r<l+i-1&&n>l&&n<l+i-1&&e.setPixelColor(a[2],r,n)}))}},{key:"drawHole",value:function(e,t,a){var r=Math.floor(e.bitmap.width/2-t["Hole Size"]/2),n=t["Fuzz Area"];e.scan(0,0,e.bitmap.width,e.bitmap.height,(function(i,l){if(i<r||i>e.bitmap.width-1-r||l<r||l>e.bitmap.height-1-r){if((i>=r-n&&i<r&&l>r&&l<e.bitmap.height-1-r||i>=r+t["Hole Size"]&&i<r+t["Hole Size"]+n&&l>r&&l<e.bitmap.height-1-r||l>=r-n&&l<r&&i>r&&i<e.bitmap.width-1-r||l>=r+t["Hole Size"]&&l<r+t["Hole Size"]+n&&i>r&&i<e.bitmap.width-1-r)&&Math.random()>.35)return;e.setPixelColor(a[2],i,l)}}))}},{key:"drawPlant",value:function(e,t,a){for(var r,n,i,l=t["Bush Size"],o=10-Math.floor(t["Bush Size"]/2),s=0;s<360;s++)r=s,n=l*Math.cos(r*Math.PI/180),i=l*Math.sin(r*Math.PI/180),e.setPixelColor(a[0],Math.round(8+n),Math.round(o+i));for(var c=0;c<e.bitmap.height;c++)for(var u=!1,h=!1,p=!1,d=0,m=0;m<e.bitmap.width;m++)e.getPixelColor(m,c)===a[0]?(d++,u?h&&(p=!0):u=!0):(u&&e.getPixelColor(m,c)===a[3]&&(h=!0),h&&!p&&d<5&&e.setPixelColor(a[t["Bush Color"]],m,c));for(var f=8-Math.floor(l/2)+1;f<8+l+1;f++)e.setPixelColor(a[0],f,o+l+1),f<8+l&&e.setPixelColor(a[0],f,o+l);var b=0;for(s=0;s<100&&!(b>=t["Freckle Count"]);s++){var g=Math.floor(Math.random()*e.bitmap.width),j=Math.floor(Math.random()*e.bitmap.height);e.getPixelColor(g,j)===a[t["Bush Color"]]&&(b++,e.setPixelColor(a[t["Freckle Color"]],g,j),t["Freckle Size"]>1&&[[g-1,j],[g+1,j],[g,j-1],[g,j+1]].forEach((function(r){var n=r[0],i=r[1];e.getPixelColor(n,i)===a[t["Bush Color"]]&&e.setPixelColor(a[t["Freckle Color"]],n,i)})))}}},{key:"drawRock",value:function(e,t,a){for(var r,n,i,l=t["Rock Size"],o=e.bitmap.height-(t["Rock Size"]-2),s=0;s<360;s++)r=s,n=l*Math.cos(r*Math.PI/180),i=l*Math.sin(r*Math.PI/180),e.setPixelColor(a[0],Math.round(8+n),Math.round(o+i));for(var c=0;c<e.bitmap.height;c++)for(var u=!1,h=!1,p=!1,d=0,m=0;m<e.bitmap.width;m++)e.getPixelColor(m,c)===a[0]?(d++,u?h&&(p=!0):u=!0):(u&&e.getPixelColor(m,c)===a[3]&&(h=!0),h&&!p&&d<5&&(m-c<l-Math.floor(l/1.2)?e.setPixelColor(a[t["Rock Color"]],m,c):e.setPixelColor(a[t["Rock Highlight Color"]],m,c)))}},{key:"drawLava",value:function(e,t,a){for(var r=t.Frequency/100,n=t.Offset,i=t["Wave Width"],l=0;l<e.bitmap.width;l++){for(var o=Math.sin(r*(Math.abs(l-n)%e.bitmap.width))*Math.floor(e.bitmap.height/3);o<e.bitmap.width;)e.setPixelColor(4278255615,o,l),o+=i;var s=1;for(o=0;o<e.bitmap.width;o++)4278255615===e.getPixelColor(o,l)&&(s=1+(s+1)%3),e.setPixelColor(a[s],o,l)}}},{key:"drawSand",value:function(e,t,a){for(var r=t.Frequency/100,n=t.Offset,i=t["Wave Width"],l=0;l<e.bitmap.width;l++){for(var o=Math.sin(r*(Math.abs(l-n)%e.bitmap.width))*Math.floor(e.bitmap.height/3);o<e.bitmap.width;)e.setPixelColor(4278255615,o,l),o+=i;var s=2;for(o=0;o<e.bitmap.width;o++)4278255615===e.getPixelColor(o,l)&&(s=2+(s+1)%2),e.setPixelColor(a[s],o,l)}}},{key:"generateFullSet",value:function(){var t=Object(i.a)(n.a.mark((function t(a){return n.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,r){new c.a(u.d*u.a.length,u.c,4294967295,(function(l,o){l&&r(l),Object(i.a)(n.a.mark((function t(){var r,i,l;return n.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=0;case 1:if(!(r<u.a.length)){t.next=12;break}return i=(i=a[u.a[r]]).substr(i.indexOf(",")+1),t.next=6,c.a.read(e.from(i,"base64"));case 6:return l=t.sent,t.next=9,o.blit(l,r*u.d,0);case 9:r++,t.next=1;break;case 12:return t.abrupt("return",o.getBase64Async("image/png"));case 13:case"end":return t.stop()}}),t)})))().then(t,r)}))})));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}]),t}()}).call(this,a(8).Buffer)}},[[293,1,2]]]);
//# sourceMappingURL=main.e46e44ca.chunk.js.map