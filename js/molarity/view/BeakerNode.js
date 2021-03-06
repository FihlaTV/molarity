// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of a beaker.
 * 3D perspective is provided by an image (see BeakerImageNode).
 * Other elements (ticks, label, ...) are added programmatically.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import molarityStrings from '../../molarity-strings.js';
import molarity from '../../molarity.js';
import BeakerImageNode from './BeakerImageNode.js';
import BeakerLabelNode from './BeakerLabelNode.js';
import MolarityBeakerDescriptionNode from './MolarityBeakerDescriptionNode.js';

const pattern0Value1UnitsString = molarityStrings.pattern[ '0value' ][ '1units' ];
const unitsLitersString = molarityStrings.units.liters;

// a11y strings
const beakerHeaderString = molarityStrings.a11y.beaker.header;

// constants
const DEBUG_SHAPES = false;
const TICK_COLOR = Color.GRAY;
const MINOR_TICK_SPACING = 0.1; // L
const MINOR_TICKS_PER_MAJOR_TICK = 5;
const MAJOR_TICK_LABELS = [ '\u00bd', '1' ]; // 1/2L, 1L
const TICK_LABEL_FONT = new PhetFont( 20 );
const TICK_LABEL_COLOR = Color.DARK_GRAY;
const TICK_LABEL_X_SPACING = 8;

/**
 * @param {Solution} solution
 * @param {number} maxVolume
 * @param {Property.<boolean>} valuesVisibleProperty
 * @param {Tandem} tandem
 * @param {SoluteDescriber} soluteDescriber - for interactive descriptions
 * @param {SoluteAmountDescriber} soluteAmountDescriber - for interactive descriptions
 * @param {VolumeDescriber} volumeDescriber - for interactive descriptions
 * @param {ConcentrationDescriber} concentrationDescriber - for interactive descriptions
 * @param {PrecipitateAmountDescriber} precipitateAmountDescriber
 * @param {Property.<boolean>} useQuantitativeDescriptionsProperty - for interactive descriptions
 * @constructor
 */
function BeakerNode( solution, maxVolume, valuesVisibleProperty, tandem, soluteDescriber, soluteAmountDescriber,
                     volumeDescriber, concentrationDescriber, precipitateAmountDescriber, useQuantitativeDescriptionsProperty ) {

  Node.call( this, {
    pickable: false,
    tandem: tandem,
    tagName: 'div',
    labelTagName: 'h3',
    labelContent: beakerHeaderString
  } );

  // @private the glass beaker
  this.beakerImageNode = new BeakerImageNode( tandem.createTandem( 'beakerImageNode' ), { scale: 0.75 } );
  const cylinderSize = this.beakerImageNode.getCylinderSize();
  const cylinderOffset = this.beakerImageNode.getCylinderOffset();
  const cylinderEndHeight = this.beakerImageNode.getCylinderEndHeight();
  this.beakerImageNode.translation = new Vector2( -cylinderOffset.x, -cylinderOffset.y );

  // inside bottom line
  const bottomShape = new Shape().ellipticalArc( cylinderSize.width / 2, cylinderSize.height,
    cylinderSize.width / 2, cylinderEndHeight / 2,
    0, Utils.toRadians( 0 ), Utils.toRadians( 180 ), true );
  const bottomNode = new Path( bottomShape, {
    stroke: new Color( 150, 150, 150, 100 ),
    lineWidth: 2,
    tandem: tandem.createTandem( 'bottomNode' )
  } );

  // label on the beaker
  const labelNode = new BeakerLabelNode( solution, tandem.createTandem( 'labelNode' ) );
  labelNode.x = cylinderSize.width / 2;
  labelNode.y = 0.15 * cylinderSize.height;

  // parents for tick marks and labels
  const tickMarksParent = new Node( { tandem: tandem.createTandem( 'tickMarksParent' ) } );
  const tickLabelsParent = new Node( { tandem: tandem.createTandem( 'tickLabelsParent' ) } );

  // rendering order
  this.addChild( bottomNode );
  this.addChild( this.beakerImageNode );
  this.addChild( tickMarksParent );
  this.addChild( tickLabelsParent );
  this.addChild( labelNode );

  // tick marks, arcs that wrap around the edge of the beaker's cylinder
  const numberOfTicks = Utils.roundSymmetric( maxVolume / MINOR_TICK_SPACING );
  const bottomY = cylinderSize.height; // don't use bounds or position will be off because of stroke width
  const deltaY = cylinderSize.height / numberOfTicks;

  // vars used inside the for-loop
  let y;
  let tickMarkShape;
  let tickMarkNode;
  let tickLabelIndex;
  let tickLabel;
  let tickLabelNode;

  const tickMarkNodeGroupTandem = tandem.createGroupTandem( 'tickMarkNode' );
  const tickLabelNodeGroupTandem = tandem.createGroupTandem( 'tickLabelNode' );

  for ( let i = 1; i <= numberOfTicks; i++ ) {
    y = bottomY - ( i * deltaY );
    if ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 ) {

      // major tick mark
      tickMarkShape = new Shape().ellipticalArc( cylinderSize.width / 2, y, cylinderSize.width / 2, cylinderEndHeight / 2, 0, Utils.toRadians( 165 ), Utils.toRadians( 135 ), true );
      tickMarkNode = new Path( tickMarkShape, {
        stroke: TICK_COLOR,
        lineWidth: 2,
        tandem: tickMarkNodeGroupTandem.createNextTandem()
      } );
      tickMarksParent.addChild( tickMarkNode );

      // major tick label
      tickLabelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
      if ( tickLabelIndex < MAJOR_TICK_LABELS.length ) {
        tickLabel = StringUtils.format( pattern0Value1UnitsString, MAJOR_TICK_LABELS[ tickLabelIndex ], unitsLitersString );
        tickLabelNode = new Text( tickLabel, {
          font: TICK_LABEL_FONT,
          stroke: TICK_LABEL_COLOR,
          maxWidth: 100,
          tandem: tickLabelNodeGroupTandem.createNextTandem()
        } );
        tickLabelsParent.addChild( tickLabelNode );
        tickLabelNode.left = tickMarkNode.right + TICK_LABEL_X_SPACING;
        tickLabelNode.centerY = tickMarkNode.bottom;
      }
    }
    else {

      // minor tick mark, no label
      tickMarkShape = new Shape().ellipticalArc( cylinderSize.width / 2, y, cylinderSize.width / 2, cylinderEndHeight / 2, 0, Utils.toRadians( 165 ), Utils.toRadians( 150 ), true );
      tickMarkNode = new Path( tickMarkShape, {
        stroke: TICK_COLOR,
        lineWidth: 2,
        tandem: tickMarkNodeGroupTandem.createNextTandem()
      } );
      tickMarksParent.addChild( tickMarkNode );
    }
  }

  if ( DEBUG_SHAPES ) {
    // draw the cylinder that represents the beaker's interior
    this.addChild( new Rectangle( 0, 0, cylinderSize.width, cylinderSize.height, { stroke: 'red' } ) );
    // draw a circle at the origin
    this.addChild( new Circle( { radius: 3, fill: 'red' } ) );
  }

  valuesVisibleProperty.link( function( visible ) {
    tickLabelsParent.visible = visible;
  } );

  // a11y - adds the description node that holds the PDOM summary of the beaker.
  this.addChild( new MolarityBeakerDescriptionNode( solution, useQuantitativeDescriptionsProperty, soluteDescriber,
    concentrationDescriber, precipitateAmountDescriber, soluteAmountDescriber, volumeDescriber ) );

}

molarity.register( 'BeakerNode', BeakerNode );

export default inherit( Node, BeakerNode, {

  // @public
  getCylinderSize: function() {
    return this.beakerImageNode.getCylinderSize();
  },

  // @public
  getCylinderEndHeight: function() {
    return this.beakerImageNode.getCylinderEndHeight();
  }
} );