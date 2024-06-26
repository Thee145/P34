const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

let engine, world, render;
let ground;
let balls = [];
let objects = [];

function setup() {
    engine = Engine.create();
    world = engine.world;

    render = Render.create({
        element: document.body,
        engine: engine,
        canvas: document.getElementById('gameCanvas'),
        options: {
            width: 800,
            height: 600,
            wireframes: false
        }
    });

    ground = Bodies.rectangle(400, 590, 810, 20, { isStatic: true });

    // Create some static objects (example)
    objects.push(Bodies.rectangle(200, 300, 100, 50, { isStatic: true }));
    objects.push(Bodies.rectangle(600, 400, 80, 80, { isStatic: true }));

    World.add(world, [ground, ...objects]);

    // Mouse controls for throwing balls
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    World.add(world, mouseConstraint);

    Render.run(render);
    Engine.run(engine);

    render.canvas.addEventListener('mousedown', function(event) {
        const ball = Bodies.circle(event.offsetX, event.offsetY, 20, { restitution: 0.6 });
        balls.push(ball);
        World.add(world, ball);
    });
}

function draw() {
    Engine.update(engine);

    for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[i].position.y > 610) {
            World.remove(world, balls[i]);
            balls.splice(i, 1);
        }
    }
}

setup();
(function renderLoop() {
    draw();
    requestAnimationFrame(renderLoop);
})();