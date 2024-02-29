// destructuring te matter.js lib;

const { Engine, Render, Runner, World, Bodies} = Matter;
const engine = Engine.create();
const { world } = engine;

const cells = 10;
const width = 600;
const height = 600;

const unitLength = width / cells;
const render = Render.create({
   element: document.body,
   engine: engine,
   options : {
    wireframes: false,
    width,
    height
   }

})
console.log(render)
Render.run(render)
Runner.run(Runner.create(), engine)


// if anytime you want to use the mouseConstraint you need to destructure it from the Matte.js
// World.add(world, MouseConstraint.create(engine,{
//   mouse: Mouse.create(render.canvas)
// }))

// walls 
const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width/2, height, width, 2, { isStatic: true}),
    Bodies.rectangle(0, height/2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height/2, 2, height, { isStatic: true }),
]
World.add(world, walls);
//creating a number of random shapes and adind it to the wall

// for (let i= 0;  i < 30; i++){
//     if(Math.random() > 0.5){
//      let shape = Bodies.rectangle(Math.random()* width, Math.random()*height, 50, 50, { isStatic: false});
//         World.add(world, shape);
//     }else{
//       let circle = Bodies.circle(Math.random() * width, Math.random() * height,35, {
//         render:{
//           fillStyle: 'red'
//         }
//       })  
     
//      World.add(world,circle);
//     }
// }

// maze generation
// const gridd = [];
// for(let i = 0; i < 2; i++){
//   gridd.push([]);
//   for(let j = 0; j < 3; j++){
//  gridd[i].push(false);
//   }
// }
// console.log(gridd)


//shuffling
const shuffle = (arr) =>{
    let counter = arr.length;
    while(counter > 0){
        const index = Math.floor(Math.random() * counter);

        counter --
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp
    }
    return arr;
}
//maze generation using another method,
const grid = Array.from({length: cells}).fill(null).map(()=>{
    return Array.from({length : cells}).fill(false)
})


const verticals = Array.from({length : cells}).fill(null).map(()=>{
    return Array.from({length : cells - 1}).fill(false)
})

const horizontals = Array.from({length : cells - 1}).fill(null).map(()=>{
    return Array.from({length : cells}).fill(false)
})




const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random()* cells);


const stepThoughCell = (row, column) =>{

    if(grid[row][column]){
        return;
    }
    grid[row][column] = true;
    //shuffling the neighbor around the cell;

    const neighbors = shuffle([
          [row - 1, column, 'up'],
          [row, column + 1, 'right'],
          [row + 1, column, 'down'],
          [row, column - 1, 'left']
    ]) 


    
    //for Each neighbor....
    for(let neighbor of neighbors){
        const [nextRow, nextColumn, direction] = neighbor;
        if(nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells){
            continue;
        }
        if(grid[nextRow][nextColumn]){
            continue;
        }
        //remove a wall from either horizontals or verticals
        if(direction === 'left'){
            verticals[row][column - 1] = true;
        }else if(direction === 'right'){
           verticals[row][column] = true;
        }else if (direction === 'up'){
            horizontals[row - 1][column] = true;
        }else if( direction === 'down'){
            horizontals[row][column] = true;
        }

        //recursion;
        stepThoughCell(nextRow,nextColumn)
    }
};


//stepThoughCell(1,1);
stepThoughCell(startRow, startColumn);


horizontals.forEach((row, rowIndex)=>{
    row.forEach((open, columnIndex)=>{
        if(open){
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            5,
            {
                isStatic: true
            }
        );
        World.add(world,wall)
    })
})

verticals.forEach((row, rowIndex)=>{
       row.forEach((open,columnIndex)=>{
        if(open){
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength / 2,
            5,
            unitLength,
            {
                isStatic: true
            }
        );
        World.add(world, wall)
       })
})

//the goal of the game,
const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * .7,
    unitLength * .7,
    {
        isStatic: true
    }
)
World.add(world, goal)
// Ball
const ball = Bodies.circle(
    unitLength / 2,
    unitLength / 2,
    unitLength * .25
)
World.add(world, ball)


document.addEventListener('keydown', (e)=>{
    if(e.key.toLowerCase() === 'w' || e.key === 'ArrowUp'){
        console.log('move ball up')
    }
    if(e.key.toLowerCase() === 'd' || e.key === 'ArrowRight'){
        console.log('move ball right')
    }
    if(e.key.toLowerCase() === 's' || e.key === 'ArrowDown'){
        console.log('move ball down')
    }
    if(e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft'){
        console.log('move ball left')
    }
    
    
})
