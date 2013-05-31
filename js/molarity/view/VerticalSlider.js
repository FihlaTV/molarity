// Copyright 2002-2013, University of Colorado

/**
 * Vertical sliders in the Molarity simulation.
 * Can be switched between qualitative and quantitative display of range and value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var Color = require( "SCENERY/util/Color" );
  var Dimension2 = require( "DOT/Dimension2" );
  var DualLabelNode = require( "molarity/view/DualLabelNode" );
  var FillHighlighter = require( "common/util/FillHighlighter" );
  var HTMLText = require( "SCENERY/nodes/HTMLText" );
  var inherit = require( "PHET_CORE/inherit" );
  var MFont = require( "molarity/MFont" );
  var MStrings = require( "molarity/MStrings" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Range = require( "DOT/Range" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );
  var Shape = require( "KITE/Shape" );
  var SimpleDragHandler = require( "SCENERY/input/SimpleDragHandler" );
  var StringUtils = require( "PHETCOMMON/util/StringUtils" );
  var Text = require( "SCENERY/nodes/Text" );
  var toFixed = require( "common/util/toFixed" );
  var Util = require( "DOT/Util" );

  // constants
  var TITLE_FONT = new MFont( 24, "bold" );
  var SUBTITLE_FONT = new MFont( 22 );
  var RANGE_FONT = new MFont( 20 );
  var VALUE_FONT = new MFont( 20 );
  var RANGE_DECIMAL_PLACES = 1;
  var VALUE_DECIMAL_PLACES = 2;
  var THUMB_SIZE = new Dimension2( 68, 30 );
  var THUMB_NORMAL_COLOR = new Color( 89, 156, 212 );
  var THUMB_HIGHLIGHT_COLOR = THUMB_NORMAL_COLOR.brighterColor();
  var THUMB_STROKE_COLOR = Color.BLACK;
  var THUMB_CENTER_LINE_COLOR = Color.WHITE;

  // Track that the thumb moves in, origin at upper left. Clicking in the track changes the value.
  function Track( size, property, range, decimalPlaces ) {

    var thisNode = this;
    Rectangle.call( thisNode, 0, 0, size.width, size.height, { fill: "black", cursor: "pointer" } );

    // click in the track to change the value, continue dragging if desired
    var handleEvent = function( event ) {
      var y = thisNode.globalToLocalPoint( event.pointer.point ).y;
      var value = Util.linear( 0, range.max, size.height, range.min, y );
      property.value = toFixed( Util.clamp( value, range.min, range.max ), decimalPlaces );
    };
    thisNode.addInputListener( new SimpleDragHandler(
        {
          start: function( event ) {
            handleEvent( event );
          },
          drag: function( event ) {
            handleEvent( event );
          },
          translate: function() {
            // do nothing, override default behavior
          }
        } ) );
  }

  inherit( Track, Rectangle );

  // The slider thumb, a rounded rectangle with a horizontal line through its center. Origin is at the thumb's geometric center.
  function Thumb( size, property, valueRange, decimalPlaces, positionRange ) {

    var thisNode = this;
    Node.call( this );

    // nodes
    var bodyNode = new Rectangle( -size.width / 2, -size.height / 2, size.width, size.height, 10, 10,
                                  { fill: THUMB_NORMAL_COLOR, stroke: THUMB_STROKE_COLOR, lineWidth: 1 } );
    var centerLineNode = new Path( { shape: Shape.lineSegment( -( size.width / 2 ) + 3, 0, ( size.width / 2 ) - 3, 0 ),
                                     stroke: THUMB_CENTER_LINE_COLOR } );

    // rendering order
    thisNode.addChild( bodyNode );
    thisNode.addChild( centerLineNode );

    // interactivity
    thisNode.cursor = "pointer";
    thisNode.addInputListener( new ThumbDragHandler( thisNode, property, valueRange, decimalPlaces, positionRange ) );
    thisNode.addInputListener( new FillHighlighter( bodyNode, THUMB_NORMAL_COLOR, THUMB_HIGHLIGHT_COLOR ) );
  }

  inherit( Thumb, Node );

  /**
   * Drag handler for the slider thumb.
   * @param {Node} dragNode
   * @param {*} property
   * @param {Range} valueRange
   * @param {Number} decimalPlaces
   * @param {Range} positionRange
   * @constructor
   */
  function ThumbDragHandler( dragNode, property, valueRange, decimalPlaces, positionRange ) {
    var clickYOffset; // y-offset between initial click and thumb's origin
    SimpleDragHandler.call( this, {
      start: function( event ) {
        clickYOffset = dragNode.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
      },
      drag: function( event ) {
        var y = dragNode.globalToParentPoint( event.pointer.point ).y - clickYOffset;
        var value = Util.linear( positionRange.min, valueRange.max, positionRange.max, valueRange.min, y );
        property.value = toFixed( Util.clamp( value, valueRange.min, valueRange.max ), decimalPlaces );
      },
      translate: function() {
        // do nothing, override default behavior
      }
    } );
  }

  inherit( ThumbDragHandler, SimpleDragHandler );

  function VerticalSlider( title, subtitle, minLabel, maxLabel, trackSize, property, range, decimalPlaces, units, valuesVisible ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var titleNode = new HTMLText( title, { font: TITLE_FONT } );
    var subtitleNode = new Text( subtitle, { font: SUBTITLE_FONT } );
    var minNode = new DualLabelNode( range.min.toFixed( range.min === 0 ? 0 : RANGE_DECIMAL_PLACES ), minLabel, valuesVisible, RANGE_FONT );
    var maxNode = new DualLabelNode( range.max.toFixed( RANGE_DECIMAL_PLACES ), maxLabel, valuesVisible, RANGE_FONT );
    var trackNode = new Track( trackSize, property, range, decimalPlaces );
    var xMargin = 7, yMargin = 7, cornerRadius = 10;
    var backgroundNode = new Rectangle( -xMargin, -yMargin, trackSize.width + ( 2 * xMargin ), trackSize.height + ( 2 * yMargin ), cornerRadius, cornerRadius,
                                        { fill: new Color( 200, 200, 200, 140 ) } );
    var thumbNode = new Thumb( THUMB_SIZE, property, range, decimalPlaces, new Range( 0, trackSize.height ) );
    var valueNode = new Text( "?", { font: VALUE_FONT } );

    // rendering order
    thisNode.addChild( titleNode );
    thisNode.addChild( subtitleNode );
    thisNode.addChild( minNode );
    thisNode.addChild( maxNode );
    thisNode.addChild( backgroundNode );
    thisNode.addChild( trackNode );
    thisNode.addChild( thumbNode );
    thisNode.addChild( valueNode );

    // layout
    var centerX = backgroundNode.centerX;
    maxNode.centerX = centerX;
    maxNode.bottom = backgroundNode.top - ( thumbNode.height / 2 );
    minNode.centerX = centerX;
    minNode.top = backgroundNode.bottom + ( thumbNode.height / 2 );
    subtitleNode.centerX = centerX;
    subtitleNode.bottom = maxNode.top - 5;
    titleNode.centerX = centerX;
    titleNode.bottom = subtitleNode.top - 5;
    thumbNode.centerX = trackNode.centerX;
    thumbNode.centerY = trackNode.centerY;

    var updateValuePosition = function() {
      if ( valueNode.visible ) {
        valueNode.left = thumbNode.right + 5;
        valueNode.centerY = thumbNode.centerY;
      }
    };

    // move the slider thumb to reflect the model value
    property.link( function( value ) {
      // move the thumb
      var y = Util.linear( range.min, trackSize.height, range.max, 0, value );
      thumbNode.y = Util.clamp( y, 0, trackSize.height );
      // update the value
      valueNode.text = StringUtils.format( MStrings.pattern_0value_1units, value.toFixed( VALUE_DECIMAL_PLACES ), units );
      updateValuePosition();
    } );

    // switch between quantitative and qualitative display
    valuesVisible.link( function( visible ) {
      valueNode.setVisible( visible );
      updateValuePosition();
    } );
  }

  inherit( VerticalSlider, Node );

  return VerticalSlider;
} );