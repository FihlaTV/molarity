// Copyright 2013-2019, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const pattern0LabelString = require( 'string!MOLARITY/pattern.0label' );
  const soluteString = require( 'string!MOLARITY/solute' );

  // a11y strings
  const soluteComboBoxHelpTextString = MolarityA11yStrings.soluteComboBoxHelpText.value;

  class SoluteComboBox extends ComboBox {
    /**
     * @param {Solute[]} solutes
     * @param {Property.<Solute>} selectedSoluteProperty
     * @param {Node} listParent parent node for the popup list
     * @param {Tandem} tandem
     * @param {Object} [options]
     * @constructor
     */
    constructor( solutes, selectedSoluteProperty, listParent, tandem, options ) {

      options = _.extend( {
        labelNode: new Text( StringUtils.format( pattern0LabelString, soluteString ), { font: new PhetFont( 22 ) } ), // 'Solute' label
        listPosition: 'above',
        cornerRadius: 8,
        xMargin: 16,
        yMargin: 16,
        highlightFill: 'rgb( 218, 255, 255 )',

        // a11y
        accessibleName: soluteString,
        helpText: soluteComboBoxHelpTextString
      }, options );

      assert && assert( !options.tandem, 'tandem is a required constructor parameter' );
      options.tandem = tandem;

      // {ComboBoxItem[]}
      const items = solutes.map( createItem );

      super( items, selectedSoluteProperty, listParent, options );
    }
  }

  molarity.register( 'SoluteComboBox', SoluteComboBox );

  /**
   * Creates an item for the combo box.
   * @param {Solute} solute
   * @returns {ComboBoxItem}
   */
  const createItem = function( solute ) {

    const colorNode = new Rectangle( 0, 0, 20, 20, {
      fill: solute.maxColor,
      stroke: solute.maxColor.darkerColor()
    } );

    const textNode = new Text( solute.name, {
      font: new PhetFont( 20 )
    } );

    const hBox = new HBox( {
      spacing: 5,
      children: [ colorNode, textNode ]
    } );

    return new ComboBoxItem( hBox, solute, {
      tandemName: solute.tandem.name,
      a11yLabel: solute.name
    } );
  };

  return SoluteComboBox;
} );