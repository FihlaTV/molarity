// Copyright 2019, University of Colorado Boulder

/**
 * sound generator used to indicate changes to the selected solute
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );
  const MultiClip = require( 'TAMBO/sound-generators/MultiClip' );

  // sounds
  const selectionSounds = [
    require( 'sound!MOLARITY/compound-w-low-pass-filter-001.mp3' ),
    require( 'sound!MOLARITY/compound-w-low-pass-filter-002.mp3' ),
    require( 'sound!MOLARITY/compound-w-low-pass-filter-003.mp3' ),
    require( 'sound!MOLARITY/compound-w-low-pass-filter-004.mp3' ),
    require( 'sound!MOLARITY/compound-w-low-pass-filter-005.mp3' ),
    require( 'sound!MOLARITY/compound-w-low-pass-filter-006.mp3' ),
    require( 'sound!MOLARITY/compound-w-low-pass-filter-007.mp3' ),
    require( 'sound!MOLARITY/compound-w-low-pass-filter-008.mp3' ),
    require( 'sound!MOLARITY/compound-w-low-pass-filter-009.mp3' )
  ];

  class SoluteSelectionSoundGenerator extends MultiClip {

    /**
     * @param {Property.<Solute>} soluteProperty
     * @param {Solute[]} solutes - a list of the values that soluteProperty can take on
     * @param {Property.<boolean>} resetInProgressProperty - indicates when a reset is happening, used to mute sounds
     * @param {Object} [options]
     */
    constructor( soluteProperty, solutes, resetInProgressProperty, options ) {

      super( selectionSounds, _.extend( { orderedValueList: solutes }, options ) );

      // play a sound when the solute change unless a reset is in progress
      soluteProperty.lazyLink( solute => {

        if ( !resetInProgressProperty.value ) {
          this.playByValue( solute );
        }
      } );
    }
  }

  return molarity.register( 'SoluteSelectionSoundGenerator', SoluteSelectionSoundGenerator );
} );