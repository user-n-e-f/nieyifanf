/**
 * @author mr.doob / http://mrdoob.com/
 */

import {
	BufferAttribute,
	BufferGeometry,
	Color,
	DynamicDrawUsage,
	Mesh,
	MeshStandardMaterial,
	Vector3,
	VertexColors
} from '../../../build/three.module.js';

function TubePainter() {

	const BUFFER_SIZE = 1000000 * 3;

	let positions = new BufferAttribute( new Float32Array( BUFFER_SIZE ), 3 );
	positions.usage = DynamicDrawUsage;

	let normals = new BufferAttribute( new Float32Array( BUFFER_SIZE ), 3 );
	normals.usage = DynamicDrawUsage;

	let colors = new BufferAttribute( new Float32Array( BUFFER_SIZE ), 3 );
	colors.usage = DynamicDrawUsage;

	let geometry = new BufferGeometry();
	geometry.setAttribute( 'position', positions );
	geometry.setAttribute( 'normal', normals );
	geometry.setAttribute( 'color', colors );
	geometry.drawRange.count = 0;

	let material = new MeshStandardMaterial( {
		roughness: 0.9,
		metalness: 0.0,
		vertexColors: VertexColors
	} );

	let mesh = new Mesh( geometry, material );
	mesh.frustumCulled = false;

	//

	function getPoints( size ) {

		let PI2 = Math.PI * 2;

		let sides = 10;
		let array = [];
		let radius = 0.01 * size;

		for ( let i = 0; i < sides; i ++ ) {

			let angle = ( i / sides ) * PI2;
			array.push( new Vector3( Math.sin( angle ) * radius, Math.cos( angle ) * radius, 0 ) );

		}

		return array;

	}

	let vector1 = new Vector3();
	let vector2 = new Vector3();
	let vector3 = new Vector3();
	let vector4 = new Vector3();

	let color = new Color( 0xffffff );
	let size = 1;

	function stroke( position1, position2, matrix1, matrix2 ) {

		if ( position1.distanceToSquared( position2 ) === 0 ) return;

		let count = geometry.drawRange.count;

		let points = getPoints( size );

		for ( let i = 0, il = points.length; i < il; i ++ ) {

			let vertex1 = points[ i ];
			let vertex2 = points[ ( i + 1 ) % il ];

			// positions

			vector1.copy( vertex1 ).applyMatrix4( matrix2 ).add( position2 );
			vector2.copy( vertex2 ).applyMatrix4( matrix2 ).add( position2 );
			vector3.copy( vertex2 ).applyMatrix4( matrix1 ).add( position1 );
			vector4.copy( vertex1 ).applyMatrix4( matrix1 ).add( position1 );

			vector1.toArray( positions.array, ( count + 0 ) * 3 );
			vector2.toArray( positions.array, ( count + 1 ) * 3 );
			vector4.toArray( positions.array, ( count + 2 ) * 3 );

			vector2.toArray( positions.array, ( count + 3 ) * 3 );
			vector3.toArray( positions.array, ( count + 4 ) * 3 );
			vector4.toArray( positions.array, ( count + 5 ) * 3 );

			// normals

			vector1.copy( vertex1 ).applyMatrix4( matrix2 ).normalize();
			vector2.copy( vertex2 ).applyMatrix4( matrix2 ).normalize();
			vector3.copy( vertex2 ).applyMatrix4( matrix1 ).normalize();
			vector4.copy( vertex1 ).applyMatrix4( matrix1 ).normalize();

			vector1.toArray( normals.array, ( count + 0 ) * 3 );
			vector2.toArray( normals.array, ( count + 1 ) * 3 );
			vector4.toArray( normals.array, ( count + 2 ) * 3 );

			vector2.toArray( normals.array, ( count + 3 ) * 3 );
			vector3.toArray( normals.array, ( count + 4 ) * 3 );
			vector4.toArray( normals.array, ( count + 5 ) * 3 );

			// colors

			color.toArray( colors.array, ( count + 0 ) * 3 );
			color.toArray( colors.array, ( count + 1 ) * 3 );
			color.toArray( colors.array, ( count + 2 ) * 3 );

			color.toArray( colors.array, ( count + 3 ) * 3 );
			color.toArray( colors.array, ( count + 4 ) * 3 );
			color.toArray( colors.array, ( count + 5 ) * 3 );

			count += 6;

		}

		geometry.drawRange.count = count;

	}

	function setSize( value ) {

		size = value;

	}

	function updateGeometry( start, end ) {

		if ( start === end ) return;

		let offset = start * 3;
		let count = ( end - start ) * 3;

		positions.updateRange.offset = offset;
		positions.updateRange.count = count;
		positions.needsUpdate = true;

		normals.updateRange.offset = offset;
		normals.updateRange.count = count;
		normals.needsUpdate = true;

		colors.updateRange.offset = offset;
		colors.updateRange.count = count;
		colors.needsUpdate = true;

	}

	return {
		mesh: mesh,
		stroke: stroke,
		setSize: setSize,
		updateGeometry: updateGeometry
	};

}

export { TubePainter };
