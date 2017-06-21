window.requestAnimationFrame = window.requestAnimationFrame
                               || window.mozRequestAnimationFrame
                               || window.webkitRequestAnimationFrame
                               || window.msRequestAnimationFrame
                               || function(f){return setTimeout(f, 1000/60)}

window.cancelAnimationFrame = window.cancelAnimationFrame
                              || window.mozCancelAnimationFrame
                              || function(requestID){clearTimeout(requestID)}

var ModernWorld = (function() {
    var ani_frame_ref;
    var canvas = document.getElementById('screen');
    var context = canvas.getContext('2d');
    var fg_color = '#00FF00'; // foreground color
    // coords is a list of tuples, eg [[0,0],[1,1]]
    // fill is a boolean. if false, it traces instead.
    var draw = function (ctx, coords, fill, start_point) {
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
        if (fill){
            ctx.fillStyle = fg_color;
            ctx.fill();
        } else {
            ctx.strokeStyle = fg_color;
            ctx.stroke();
        }
    };
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
    Player.img.src = 'player.png';

    var Bombs = {
        bounds: [200,600],
        counter: [200,0],
        bomb_width: 3,
        bomb_height: 10,
        have_exceeded_bounds: false,
        random_int: function(max, min){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        fall_down: function (){
            // all bombs descend at a rate, default is 5.

            if (Bombs.counter[1] < 200) {
                Bombs.have_exceeded_bounds = false;
                Bombs.counter[1] += 5;
            }
            else {
                // Should issue some kind of "bomb halt, erase and redraw"
                Bombs.have_exceeded_bounds = true;
                Bombs.counter[0] = Bombs.random_int(Bombs.bounds[0], Bombs.bounds[1]);
                Bombs.counter[1] = 0;
            }
            return Bombs.counter;
        },
    };
    return {
        init: function() {
            Player.img.onload = function() {
                //ctx.moveTo(0,0);
                context.beginPath();
                context.drawImage(Player.img,
                                              Player.pos[0],
                                              Player.pos[1]);
            }

            for(var i=1;i<=4;i++){
                ModernWorld.draw_house(context, [(100*i)+(50*i),200]);
            }
        },
        play: function() {
            context.save();
            var bomb_pos = Bombs.fall_down();
            console.log(bomb_pos);
            // fillRect( x, y, width, height)
            context.fillRect(bomb_pos[0],bomb_pos[1],Bombs.bomb_width,Bombs.bomb_height);
            ModernWorld.init();
            //ModernWorld.redraw_player();
            ModernWorld.ani_frame_ref = window.requestAnimationFrame(ModernWorld.play);
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
           // TODO make redraw and clear rect where sign used to be. similar to the way the player is handled
           var img = new Image();
           img.onload = function() {
               context.beginPath();
               context.drawImage(img,
                                 Player.pos[0] + 25,
                                 Player.pos[1] - 25);
           }
           img.src = 'sign.png';
        },
        // Takes a 2d context, [x,y] array of coordinates, and a CSS color.
        draw_house: function (ctx, start_point) {
            var house_coords = [
                [0, 20], [20, 0], [80,0], [100,20],  [100,100],
                [60,100], [60,75], [40,75], [40,100], [0,100]
            ];
            draw(ctx, house_coords, true, start_point);
        }
     }
})();

document.addEventListener("DOMContentLoaded", function(event) {
    ModernWorld.init();
    requestAnimationFrame(ModernWorld.play);
});

document.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Should do nothing if the key event was already consumed.
  }
  switch (event.key) {
      case "x":
          ModernWorld.player_protest();
      break;
    case "ArrowLeft":
      ModernWorld.redraw_player(-15);
      break;
    case "ArrowRight":
        ModernWorld.redraw_player(15);
      break;
    case "p":
        console.log(ModernWorld.ani_frame_ref);
        cancelAnimationFrame(ModernWorld.ani_frame_ref);
        break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Consume the event for suppressing "double action".
  event.preventDefault();
}, true);

