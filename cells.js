function index(i,j)
{
	if (i<0|| j<0|| i>cols-1||j>rows-1)
	{return -1;}
	else {return i+j*cols;}
}
function Cell(i,j)
{
	this.i=i;
	this.j=j;
	this.walls = [true,true,true,true];
	this.visited = false;
	this.checkNeighbors = function(noFenced){

		// If no parameters entered
		if(typeof noFenced === 'undefined') {
		  noFenced = false;
		}

		var cells = [];
		var neighbors = [];		
		var top    = grid[index(i,j-1)];
	    var right  = grid[index(i+1,j)];
		var bottom = grid[index(i,j+1)];
		var left   = grid[index(i-1,j)];
		if (top   && !top.visited && (!noFenced || !isFenced(this, top)))                   {neighbors.push(top);}
		if (right && !right.visited && (!noFenced || !isFenced(this, right)))               {neighbors.push(right);}
		if (bottom && !bottom.visited && (!noFenced || !isFenced(this, bottom)))            {neighbors.push(bottom);}
		if (left   &&!left.visited && (!noFenced || !isFenced(this, left)))                 {neighbors.push(left);}
		if (neighbors.length>0)
		{
			var r= floor(random(0,neighbors.length));
			
			return neighbors[r];
		}
		else { return undefined; }
	}

	this.show = function()
	{
		var x = offset+this.i*w;
		var y = offset+this.j*w;
		stroke(0,0,0);
		strokeWeight(4);
		if (this.walls[0]){line(x,  y,  x+w, y);}    //  top		
		if (this.walls[1]){line(x+w,y,  x+w, y+w);}  //  right
		if (this.walls[2]){line(x+w,y+w,  x, y+w);}  //  bottom
		if (this.walls[3]){line(x,  y+w,  x, y); }   //  left		
		if (this.visited)
		{
		noStroke();
		fill(75,0,130,100); 
		rect(x,y,w,w);
		}
	}
	this.highlight = function(color)
	{	
		var x = offset+this.i*w;
		var y = offset+this.j*w;
		noStroke();
		fill(color); 
		rect(x,y,w,w);	
	}
	
}
//(8 6 2 4   0 1 2 3 )
function isFenced(a, b) {
  if (a.i === b.i && a.j === b.j + 1) {
    return a.walls[0] || b.walls[2];
  }// b is on the top of a 

  if (a.i === b.i - 1 && a.j === b.j) {
    return a.walls[1] || b.walls[3];
  }
  if (a.i === b.i && a.j === b.j - 1) {
    return a.walls[2] || b.walls[0];
  }
  if (a.i === b.i + 1 && a.j === b.j) {
    return a.walls[3] || b.walls[1];
  }
}

function removeWalls(a,b)
{
  x = a.i-b.i
  if (x==1){a.walls[3] = false; b.walls[1]= false;}
  else if (x==-1){a.walls[1]=false;b.walls[3]=false;}
  
  y = a.j-b.j
  if (y==1){a.walls[0] = false; b.walls[2]= false;}
  else if (y==-1){a.walls[2]=false;b.walls[0]=false;}
}

function initialize(){
grid=[];
finish1 = [];
finish2 = [];
route = [];	
mark = 0;

	background("violet");
		for (var j=0;j<rows;j++ )
	{
		for (var i=0; i<cols; i++)
		{
			var cell = new Cell(i,j);
			grid.push(cell);
		}			
	}
	
	for (var i=0; i<grid.length;i++)
	{
		grid[i].show();
	} 
state = STATES.Daiji;
stack = [];
current = grid[0];
}



function createmaze(){
	background("violet");
	display_text(" Press up \n speed up",offset+cols*w+8, offset+5,offset+cols*w+30,offset+40);
	display_text(" Press down \n speed down",offset+cols*w+5, offset+80,offset+cols*w+30,offset+150);
	for  (var i=0; i<grid.length;i++)
	{
		grid[i].show()
	} 	
	
	current.visited=true;
	current.highlight(start_color);
	
	var next  = current.checkNeighbors();
	if (next)
	 {
		next.visited=true;
		stack.push(current);
		removeWalls(current,next);
		current = next;			
	}
	else if (stack.length>0){
		var old_cell = stack.pop();
		current = old_cell;
	}
	else {
		current.highlight("start_point_color")
		// pg = createGraphics(width,height);
		// pg = createGraphics(cols*w,rows*w);
		// console.log(width);
		// console.log(height);
		// pg.copy(canvas, 0, 0, width, height, 0, 0, width, height);
		// pg.copy(canvas, offset, offset, offset+cols*w, offset+rows*w,offset,offset,offset+cols*w,offset+rows*w);
		
		state = STATES.Daiji;	

	}
}


function display_steps(){
	offset2 = offset+60;
	

	display_text("Your Steps: ",offset+cols*w+10, offset2+70,offset2+cols*w+30,offset2+90);

	display_text(String(route.length), offset+cols*w+40, offset2+90,offset2+cols*w+30,offset2+110);
	playermark = route.length;

	display_text("Your Marks: ",offset+cols*w+10, offset2+130,offset2+cols*w+30,offset2+150);
	display_text(String(mark), offset+cols*w+40, offset2+150,offset2+cols*w+30,offset2+170);
}


function display_AI_steps(){
	offset2 = offset+60;
	display_text("Your Steps: ",offset+cols*w+10, offset2+70,offset2+cols*w+30,offset2+90);
	display_text(String(playermark), offset+cols*w+40, offset2+90,offset2+cols*w+30,offset2+110);
	

	display_text("Your Marks: ",offset+cols*w+10, offset2+130,offset2+cols*w+30,offset2+150);
	display_text(String(mark), offset+cols*w+40, offset2+150,offset2+cols*w+30,offset2+170);
	offset2 = offset+80;


	display_text("AI Steps: ",offset+cols*w+13, offset2+190,offset+cols*w+30,offset2+210)
	display_text(String(route.length), offset+cols*w+40,offset2+210,offset+cols*w+30,offset2+230);

	display_text("AI Marks: ",offset+cols*w+13, offset2+230,offset+cols*w+30,offset2+250)
	display_text(String(aimark), offset+cols*w+40,offset2+250,offset+cols*w+30,offset2+270);

}

function display_text(content,p1,p2,p3,p4)

{
	stroke("white");
	textSize(15);
	fill(0, 102, 153);
	text(content,p1, p2,p3,p4);
	
}