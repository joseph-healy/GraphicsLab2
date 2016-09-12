"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 1;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2(  1,  -1 ),
        vec2(  1,  1 ),
        vec2(  -1, 1 )
    ];


    divideRectangle( vertices[0], vertices[1], vertices[2], vertices[3],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( c00, c03, c33, c30 )
{
    points.push( c00, c30, c33);
    points.push( c00, c33, c03);
}

function divideRectangle( c00, c03, c33, c30, count )
{

    // check for end of recursion

    if ( count === 0 ) {

        var c22 = mix( c00, c33, 0.66 );
        var c11 = mix( c00, c33, 0.33 );
        var c12 = mix( c03, c30, 0.33 );
        var c21 = mix( c03, c30, 0.66 );
        triangle( c11, c12, c22, c21 );
    }
    else {

        //bisect the sides

        var c22 = mix( c00, c33, 0.66 );
        var c11 = mix( c00, c33, 0.33 );
        var c12 = mix( c03, c30, 0.33 );
        var c21 = mix( c03, c30, 0.66 );
        var c13 = mix( c03, c33, 0.33 );
        var c02 = mix( c03, c00, 0.33 );
        --count;

        divideRectangle(c03, c13, c11, c02, count);

        // three new triangles

       // divideTriangle( a, ab, ac, count );
       // divideTriangle( c, ac, bc, count );
       // divideTriangle( b, bc, ab, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
