var ModernWorld = (function() {
    var canvas = document.getElementById('tutorial');
    var context = canvas.getContext('2d');
    var fg_color = '#00FF00'; // foreground color
    // coords is a list of tuples, eg [[0,0],[1,1]]
    var draw = function (ctx, coords, start_point) {
        if(start_point) {
            coords = coords.map(function(coord){
                return [coord[0] + start_point[0], coord[1] + start_point[1]]
            });
        }
        ctx.beginPath();
        ctx.moveTo(coords[0][0], coords[0][1]);
        for (var h=1;h<coords.length;h++){
            ctx.lineTo(coords[h][0], coords[h][1]);
        }
        ctx.closePath();
        ctx.fillStyle = fg_color;
        ctx.fill();
    };
     return {
        init: function() {
            Player.bounds = canvas.width;
            Player.img.onload = function() {
                //ctx.moveTo(0,0);
                context.beginPath();
                context.drawImage(Player.img,
                                              Player.pos[0],
                                              Player.pos[1]);
            }
            Player.img.src = 'player.png';

            for(var i=1;i<=4;i++){
                ModernWorld.draw_house(context, [(100*i)+(50*i),200]);
            }
            //this.player_protest();
        },
        redraw_player: function (increment) {
            // REFACTOR
            Player.change_position(increment, canvas.width);
            if (Player.has_changed_position){
                context.clearRect(0, Player.initial_pos[1], canvas.width, canvas.height);
                context.drawImage(Player.img,
                                  Player.pos[0],
                                  Player.pos[1]);
            }
        },
       player_protest: function() {
            var p_x = Player.pos[0];
            var p_y = Player.pos[1];
            var coords = [ [p_x, p_y], [p_x+40, p_y], [p_x+40, p_y+30]
            ];
            draw(context, coords);
        },
        // Takes a 2d context, [x,y] array of coordinates, and a CSS color.
        draw_house: function (ctx, start_point) {
            var house_coords = [
                [0, 20], [20, 0], [80,0], [100,20],  [100,100],
                [60,100], [60,75], [40,75], [40,100], [0,100]
            ];
            draw(ctx, house_coords, start_point);
        }
     }
})();

var Player = {
    img: new Image(),
    initial_pos: [400,350],
    pos: [400,350],
    has_changed_position: false,
    change_position: function(increment, bounds){
        var newpos = Player.pos[0] + increment;
        if (newpos < 10 ) { newpos = 0; this.has_changed_position = false;}
        else if (newpos > bounds - 60)
            { newpos = bounds - 60; this.has_changed_position = false;} //replace with width of image
        else { this.has_changed_position = true; }
        Player.pos[0] = newpos;
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    ModernWorld.init();
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
      break;
    case "ArrowLeft":
      ModernWorld.redraw_player(-15);
      break;
    case "ArrowRight":
        ModernWorld.redraw_player(15);
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

