// Copyright 2013-2020, University of Colorado Boulder

/**
 * Combo box for choosing a solute.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import generalOpenSound from '../../../../tambo/sounds/general-open_mp3.js';
import molarityStrings from '../../molarity-strings.js';
import molarity from '../../molarity.js';

const pattern0LabelString = molarityStrings.pattern[ '0label' ];
const soluteString = molarityStrings.solute;

// a11y strings
const soluteComboBoxHelpTextString = molarityStrings.a11y.soluteComboBoxHelpText;

// sounds

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

    options = merge( {

      // 'Solute' label
      labelNode: new Text( StringUtils.format( pattern0LabelString, soluteString ), { font: new PhetFont( 22 ) } ),
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

    // sound generation
    const comboBoxOpenSoundClip = new SoundClip( generalOpenSound, { initialOutputLevel: 0.3 } );
    soundManager.addSoundGenerator( comboBoxOpenSoundClip );

    // play a sound when the list box opens
    this.listBox.on( 'visibility', () => {
      if ( this.listBox.visible ) {
        comboBoxOpenSoundClip.play();
      }
    } );
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

export default SoluteComboBox;