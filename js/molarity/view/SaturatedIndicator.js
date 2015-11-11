// Copyright 2013-2015, University of Colorado Boulder

/**
 * Indicator that the solution is saturated.
 * This consists of 'Saturated!' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var molarity = require( 'MOLARITY/molarity' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var saturatedString = require( 'string!MOLARITY/saturated' );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function SaturatedIndicator( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    var label = new Text( saturatedString, { font: new PhetFont( 22 ), maxWidth: 200 } );

    // translucent light-gray background, so this shows up on all solution colors
    var background = new Rectangle( 0, 0, 1.2 * label.width, 1.2 * label.height, 8, 8,
      { fill: 'rgba( 240, 240, 240, 0.6 )' } );

    // rendering order
    thisNode.addChild( background );
    thisNode.addChild( label );

    // layout
    label.centerX = background.centerX;
    label.centerY = background.centerY;

    // make this node visible when the solution is saturated
    solution.precipitateAmountProperty.link( function() {
      thisNode.visible = solution.isSaturated();
    } );
  }

  molarity.register( 'SaturatedIndicator', SaturatedIndicator );

  return inherit( Node, SaturatedIndicator );
} );