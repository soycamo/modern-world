var ModernWorld = {};
var Player = {};
ModernWorld.canvas = document.getElementById('tutorial');
ModernWorld.context = ModernWorld.canvas.getContext('2d');
Player.img = new Image();
Player.initial_pos = [400,350];
Player.pos = [400,350];

ModernWorld.render = function() {
    fg_color = '#00FF00'; // foreground color

    Player.img.onload = function() {
        //ctx.moveTo(0,0);
        ModernWorld.context.beginPath();
        ModernWorld.context.drawImage(Player.img,
                                      Player.pos[0],
                                      Player.pos[1]);
    }
    Player.img.src = 'player.png';

    for(var i=1;i<=4;i++){
        ModernWorld.draw_house(ModernWorld.context, [(100*i)+(50*i),200]);
    }
}

ModernWorld.redraw_player = function (increment) {
    ModernWorld.context.clearRect(0, Player.initial_pos[1], ModernWorld.canvas.width, ModernWorld.canvas.height);
    Player.pos[0] = Player.pos[0] + increment;
    ModernWorld.context.drawImage(Player.img,
                                  Player.pos[0],
                                  Player.pos[1]);
}


// Takes a 2d context, [x,y] array of coordinates, and a CSS color.
ModernWorld.draw_house = function (ctx, start_point) {
    var house_coords = [
        [0, 20], [20, 0], [80,0], [100,20],  [100,100],
        [60,100], [60,75], [40,75], [40,100], [0,100]
    ];
    if(start_point) {
        house_coords = house_coords.map(function(coord){
            return [coord[0] + start_point[0], coord[1] + start_point[1]]
        });
    }
    ctx.beginPath();
    ctx.moveTo(house_coords[0][0], house_coords[0][1]);
    for (var h=1;h<house_coords.length;h++){
        ctx.lineTo(house_coords[h][0], house_coords[h][1]);
    }
    ctx.closePath();
    ctx.fillStyle = fg_color;
    ctx.fill();
}

document.addEventListener("DOMContentLoaded", function(event) {
    ModernWorld.render();
});

document.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Should do nothing if the key event was already consumed.
  }

  switch (event.key) {
    case "ArrowDown":
      // Do something for "down arrow" key press.
      break;
    case "ArrowUp":
      // Do something for "up arrow" key press.
      break;
    case "ArrowLeft":
        ModernWorld.redraw_player(-30);
      // Do something for "left arrow" key press.
      break;
    case "ArrowRight":
        ModernWorld.redraw_player(30);
      // Do something for "right arrow" key press.
      break;
    case "Enter":
      // Do something for "enter" or "return" key press.
      break;
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Consume the event for suppressing "double action".
  event.preventDefault();
}, true);

