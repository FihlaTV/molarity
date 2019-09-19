// Copyright 2013-2017, University of Colorado Boulder

/**
 * This class encapsulates the beaker image, including "points of interest" in that image.
 * The image was built around the 2D projection of a 3D cylinder.
 * Methods are provided to access the points of interest, allowing client code to construct
 * a shape that looks like solution inside the beaker cylinder.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const molarity = require( 'MOLARITY/molarity' );
  const Vector2 = require( 'DOT/Vector2' );

  // images
  const beakerImage = require( 'image!MOLARITY/beaker.png' );

  // points of interest in the image file
  const CYLINDER_UPPER_LEFT = new Vector2( 98, 192 );
  const CYLINDER_LOWER_RIGHT = new Vector2( 526, 644 );
  const CYLINDER_END_BACKGROUND = new Vector2( 210, 166 );
  const CYLINDER_END_FOREGROUND = new Vector2( 210, 218 );

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function BeakerImageNode( tandem, options ) {

    options = options || {};
    assert && assert( !options.tandem, 'tandem is passed via constructor parameter' );
    options.tandem = tandem;

    Image.call( this, beakerImage, options );
  }

  molarity.register( 'BeakerImageNode', BeakerImageNode );

  return inherit( Image, BeakerImageNode, {

    // @public Gets the cylinder dimensions.
    getCylinderSize: function() {
      const pUpperLeft = this.localToParentPoint( CYLINDER_UPPER_LEFT );
      const pLowerRight = this.localToParentPoint( CYLINDER_LOWER_RIGHT );
      return new Dimension2( pLowerRight.x - pUpperLeft.x, pLowerRight.y - pUpperLeft.y );
    },

    // @public Gets the offset of the cylinder from the upper-left corner of the image.
    getCylinderOffset: function() {
      return this.localToParentPoint( CYLINDER_UPPER_LEFT );
    },

    // @public Gets the 2D height of the cylinder's end cap.
    getCylinderEndHeight: function() {
      return this.localToParentPoint( CYLINDER_END_FOREGROUND ).y - this.localToParentPoint( CYLINDER_END_BACKGROUND ).y;
    }
  } );
} );

