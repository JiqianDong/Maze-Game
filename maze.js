const start_color   = 'red';
const start_point_color = 'blue';
const finish_color  = 'lime';
const route_color   = 'rgba(100%,100%,20%,0.5)';
const deadend_color = 'rgba(93.3%,51%,93.3%,0.7)';
const best_route_color = 'rgba(100%,65%,0%,0.3)'

var offset = 10;
var cols =20;
var rows = 20;
var w=20;
var grid =[];
var current;
var stack=[];
var starts;
var pg; 
var canvas;
var state = 100;
var speed = 50;
var route = [];
var finish1 = [];
var finish2 = [];
var finish3 = [];
var mark = 0;
var aimark = 0;
var deadend = [];
var playermark = 0;
var song;

const STATES = {
  Creating_Maze: 0,
  AI           : 1,
  Solve        : 2,
  Daiji        : 100,
  Zuikaishi    : 1000,
  BestSolution : 3
};
// function preload(){

// }
// function loaded()
// {
// 	song.play();
// }
function setup()
{
	state = STATES.Zuikaishi;
	canvas = createCanvas(offset+cols*w+100,offset+rows*w+50);
	// song = loadSound("./pandora.mp3",loaded); 
	// best_route();

	initialize();
	// display_steps();
	// display_AI_steps();
	mazecreating_button = createButton('Generate Your Own Maze');
	mazecreating_button.position(offset+10,offset+rows*w+10);
	mazecreating_button.mousePressed(initial_maze);

	mazesolving_button = createButton('Add a finish');
	mazesolving_button.position(offset+200,offset+rows*w+10);
	mazesolving_button.mousePressed(addfinish);

	mazesolving_button = createButton('Watch AI');
	mazesolving_button.position(offset+300,offset+rows*w+10);
	mazesolving_button.mousePressed(initial_AI);


	mazesolving_button = createButton('Best route');
	mazesolving_button.position(offset+380,offset+rows*w+10);
	mazesolving_button.mousePressed(best_route);

	frameRate(speed);	
}


function draw()
{		
	if (state===STATES.Creating_Maze){

		createmaze();	
	}
	else if (state===STATES.Solve)// let user play the game
	{
		// image(pg,0,0,width,height);
		
		background("violet");
		starts.highlight(start_point_color);
		for (var i = grid.length - 1; i >= 0; i--) {
			grid[i].show();
		}
		for (var i=0;i<route.length;i++){route[i].highlight(route_color);}
		for (var i=0;i<finish1.length;i++){finish1[i].highlight(finish_color);}
		current.highlight(start_color);
		display_steps();
		
	}
	else if (state===STATES.AI) // let the AI play the game
	{

		// image(pg,0,0,width,height);
		background("violet");
		starts.highlight(start_point_color);
		for (var i = grid.length - 1; i >= 0; i--) {
			grid[i].show();
		}
		for (var i=0;i<finish1.length;i++){finish1[i].highlight(finish_color); } // display finish points
		for (var i=1;i<route.length;i++){route[i].highlight(route_color);}
		for (var i=0;i<deadend.length;i++){deadend[i].highlight(deadend_color);}	
		current.highlight(start_color);	
		AI_solving();
		// display_steps();
		display_AI_steps();
		
	}	
}

function AI_solving(){
	// console.log(finish3.length);
	if (finish3.length != 0) {
        // STEP 1
      var next = current.checkNeighbors(true);
      if (next) {
        // STEP 2
        stack.push(current);
        route.push(current);
        // STEP 3
        current = next;
        current.visited = true;
      }
      else if (route.length > 0) {
        // backtrack
        deadend.push(current);
        current = stack.pop();

      }
      judge_is_finish(current);
    }
   // else {
   // 	// console.log("AI succeeded.");
   // 	// console.log(finish2.length);
   // }
}

function initial_maze()
{	
	initialize();
	state = STATES.Creating_Maze;
}


function addfinish()
{
	if (state===STATES.Creating_Maze|| state === STATES.Zuikaishi){
		alert("please waiting until the maze is finished creating");
	}
	else if(route.length==0 && state!=STATES.AI)
	{
				
		state = STATES.Solve
		var newfinish = grid[floor(random(15,grid.length))];
		finish1.push(newfinish);
		finish2.push(newfinish);
		finish3.push(newfinish);
		current = grid[0];
		starts = grid[0];
		starts.highlight(start_point_color);
		
		mark=0;
		aimark=0;
		playermark=0;		
	}
	else if (state===STATES.Daiji){
		for (var i = grid.length - 1; i >= 0; i--) {
			grid[i].visited=true;
		}
		current = grid[0];
		starts = grid[0];
		state = STATES.Solve
		finish1=[];
		finish2=[];
		finish3=[];
		
		addfinish();
		stack = [];
		route=[];
	}
	

}

function initial_AI(){
	if (state===STATES.Creating_Maze){
		alert("Please waiting until the maze is finished creating");
	}
	else if(finish1.length==0)
		{alert("please add some end points")}
	else
	{
		finish3 = finish1.slice();
		state = STATES.AI		
		current = grid[0];
		// current.highlight(start_point_color);
		route = [];
		deadend = [];
		starts = grid[0];
		stack = [];
		for (var i = 0; i < grid.length; i++)
		{
			grid[i].visited = false;
		}
	}
		
}

function best_route(){
	// if (finish1.length==1)
	// {

		state = STATES.Daiji;
		var diff = route.filter(function(x) { return deadend.indexOf(x) < 0 });
		var uniqueItems = Array.from(new Set(diff));
		for (var i = 0; i < uniqueItems.length; i++) {
			uniqueItems[i].highlight(best_route_color);
		}

		display_text("  Minimum \n     Steps ",offset+cols*w+8, offset+20,offset+cols*w+30,offset+40);
		display_text(String(uniqueItems.length), offset+cols*w+45, offset+60,offset+cols*w+30,offset+150);
	// }
	// else {alert("There is no best route for multiple endings")}

}



function keyPressed() {
	 if (state===STATES.Creating_Maze||state===STATES.AI)
	 {
	 	if (keyCode == UP_ARROW) 
	 	{
		    speed += 5;
		    frameRate(speed);
	  	}
	    else if (keyCode == DOWN_ARROW) 
	    {
		    speed = max(1, speed - 5);
		    frameRate(speed);
	    }
	 }
	 else if (state===STATES.Solve){
	 	if (keyCode == UP_ARROW && current.walls[0]==false){
	 		ci = current.i;
	 		cj = current.j;
	 		current  = grid[index(ci,cj-1)];
	 		route.push(current);
	 	}
	 	else if (keyCode == RIGHT_ARROW && current.walls[1]==false){
	 		ci = current.i
	 		cj = current.j
	 		current  = grid[index(ci+1,cj)];
	 		route.push(current);
	 	}
	 	else if (keyCode == DOWN_ARROW && current.walls[2]==false){
	 		ci = current.i
	 		cj = current.j
	 		current  = grid[index(ci,cj+1)];
	 		route.push(current);
	 	}
	 	else if (keyCode == LEFT_ARROW && current.walls[3]==false){
	 		ci = current.i
	 		cj = current.j
	 		current  = grid[index(ci-1,cj)];
	 		route.push(current);
	 	}	
	 	judge_is_finish(current); 	 
 	}		
}

function judge_is_finish(current)
{
	if (state==STATES.Solve)
	{
		for(var q = 0; q < finish2.length; q++)
		{
			if (finish2[q].i == current.i && finish2[q].j == current.j) 
				{
			        mark+=1;
			        finish2.splice(q,1)
			        break;       
				}
		}
		if (finish2.length==0)
			 {

	        	alert("You finished")
	        	playermark = route.length;
	   //      	playerpg = createGraphics(width, height);
				// playerpg.copy(canvas, 0, 0, width, height, 0, 0, width, height);	        	
		     }
	}
	else if (state==STATES.AI) {
		for(var q = 0; q < finish3.length; q++)
		{
			if (finish3[q].i == current.i && finish3[q].j == current.j) 
				{
			        aimark+=1;
			        finish3.splice(q,1)
			        break;       
				}
		}
		if (finish3.length==0)
			 {
	        	alert("AI finishes")
	        	state=STATES.Daiji;
	        	
		     }

	}
		
}

