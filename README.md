# Stimula2

Based on [GPGPU Curl-noise + DOF](https://codesandbox.io/s/zgsyn) by Paul Henschel

## Tutorials

- [The Study of Shaders with React Three Fiber](https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/)
- [The magical world of Particles with React Three Fiber and Shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/)
- [FBO particles](https://barradeau.com/blog/?p=621)

## Future considerations

- [ ] Try seeding positions with shape (SEE: SimulatiomMaterial constructor)

    function parseMesh(g){
        var vertices = g.vertices;
        var total = vertices.length;
        var size = parseInt( Math.sqrt( total * 3 ) + .5 );
        var data = new Float32Array( size*size*3 );
        for( var i = 0; i < total; i++ ) {
            data[i * 3] = vertices[i].x;
            data[i * 3 + 1] = vertices[i].y;
            data[i * 3 + 2] = vertices[i].z;
        }
        return data;
    }
    ...
    // Then you convert it to a Data texture:
    var data = getRandomData( width, height, 256 );
    var positions = new THREE.DataTexture( data, width, height, THREE.RGBFormat, THREE.FloatType );
    positions.needsUpdate = true;

- [ ] Use zustand to globally store fft
- [ ] Add a 16k fft to a 128\*128 texture for use in the shader
- [ ] Scatter particles on source geometry and use as emmitters/attractors for particle
- [ ] Skin the audio player using [react-audio-player](https://github.com/justinmc/react-audio-player#readme) or [react-h5-audio-player](https://github.com/lhz516/react-h5-audio-player)

## Further research

- [Passing a list of values to fragment shader](https://stackoverflow.com/questions/7954927/passing-a-list-of-values-to-fragment-shader)
