// Copyright 2002-2013, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'beers-law-lab' );
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MFont = require( 'molarity/MFont' );
  var MStrings = require( 'molarity/MStrings' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Array<Solute>} solutes
   * @param {Property<Solute>} selectedSoluteProperty
   * @constructor
   */
  function SoluteComboBox( solutes, selectedSoluteProperty ) {

    // 'Solute' label
    var labelNode = new Text( StringUtils.format( MStrings.pattern_0label, MStrings.solute ), { font: new MFont( 22 ) } );

    // items
    var items = [];
    for ( var i = 0; i < solutes.length; i++ ) {
      var solute = solutes[i];
      items[i] = createItem( solute );
    }

    ComboBox.call( this, items, selectedSoluteProperty, {
      labelNode: labelNode,
      listPosition: 'above',
      itemYMargin: 12,
      itemHighlightFill: 'rgb(218,255,255)' } );
  }

  inherit( ComboBox, SoluteComboBox );

  /**
   * Creates an item for the combo box.
   * @param solute
   * @returns {*|{node: *, value: *}}
   */
  var createItem = function( solute ) {

    var node = new Node();
    var colorNode = new Rectangle( 0, 0, 20, 20, { fill: solute.maxColor, stroke: solute.maxColor.darkerColor() } );
    var textNode = new Text( solute.name, { font: new MFont( 20 ) } );
    node.addChild( colorNode );
    node.addChild( textNode );
    textNode.left = colorNode.right + 5;
    textNode.centerY = colorNode.centerY;

    return ComboBox.createItem( node, solute );
  };

  return SoluteComboBox;
} );