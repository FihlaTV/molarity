// Copyright 2019, University of Colorado Boulder

/**
 * SoluteAmountDescriber is responsible for generating strings about VolumeProperty.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MConstants = require( 'MOLARITY/molarity/MConstants' );
  const molarity = require( 'MOLARITY/molarity' );
  const MolarityA11yStrings = require( 'MOLARITY/molarity/MolarityA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );

  // a11y strings
  const fullString = MolarityA11yStrings.fullString.value;
  const halfFullString = MolarityA11yStrings.halfFullString.value;
  const lowString = MolarityA11yStrings.lowString.value;
  const nearlyEmptyString = MolarityA11yStrings.nearlyEmptyString.value;
  const nearlyFullString = MolarityA11yStrings.nearlyFullString.value;
  const overHalfString = MolarityA11yStrings.overHalfString.value;
  const solutionVolumeAndUnitPatternString = MolarityA11yStrings.solutionVolumeAndUnitPattern.value;
  const underHalfString = MolarityA11yStrings.underHalfString.value;
  const volumeStateInfoPatternString = MolarityA11yStrings.volumeStateInfoPattern.value;

  // constants
  const VOLUME_STRINGS = [
    nearlyEmptyString,
    lowString,
    underHalfString,
    halfFullString,
    overHalfString,
    nearlyFullString,
    fullString
  ];

  class VolumeDescriber {

    /**
     * @param {Property} volumeProperty - from Solution model element
     * @param {Property} soluteProperty - from Solution model element
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {BooleanProperty} valuesVisibleProperty - whether values are visible in the view
     */
    constructor( volumeProperty, soluteProperty, concentrationDescriber, valuesVisibleProperty ) {

      // @private
      this.concentrationDescriber = concentrationDescriber;
      this.volumeProperty = volumeProperty;
      this.soluteProperty = soluteProperty;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.volumeRegion = 0; // tracks the last descriptive region for volume
    }

    /**
     * Gets the current value of volume either quantitatively or quantitatively to plug into descriptions.
     * @private
     * @returns {string} - quantitative or qualitative description of current volume.
     */
    getCurrentVolume() {
      if ( this.valuesVisibleProperty.value ) {
        return StringUtils.fillIn( solutionVolumeAndUnitPatternString, {
          volume: Util.toFixed( this.volumeProperty.value, MConstants.SOLUTION_VOLUME_DECIMAL_PLACES )
        } );
      }
      else {
        return VOLUME_STRINGS[ volumeToIndex( this.volumeProperty.value ) ];
      }
    }

    /**
     * Checks to see if the volume descriptive region has changed, and update volumeRegion accordingly.
     * @public
     * @returns {boolean}
     */
    updateVolumeRegion() {
      const volumeIndex = volumeToIndex( this.volumeProperty.value );
      const isNewVolumeRegion = this.volumeRegion !== volumeIndex;

      // update the region to the new one if a region has changed
      if ( isNewVolumeRegion ) {
        this.volumeRegion = volumeIndex;
      }

      return isNewVolumeRegion;
    }

    /**
     * Fills in the state info if region has changed and the solution is not saturated.
     * @private
     * @returns {string}
     */
    getVolumeStateInfoNotSaturated() {
      return StringUtils.fillIn( volumeStateInfoPatternString, {
        volume: this.getCurrentVolume(),
        concentration: this.concentrationDescriber.getCurrentConcentration()
      } );
    }
  }

  /**
   * Calculates which item to use from the VOLUME_STRINGS array.
   * @param {number} volume
   * @returns {number} - index to pull from VOLUME_STRINGS array.
   */
  const volumeToIndex = ( volume ) => {
    if ( volume <= .220 ) {
      return 0;
    }
    else if ( volume <= .330 ) {
      return 1;
    }
    else if ( volume <= .410 ) {
      return 2;
    }
    else if ( volume <= .530 ) {
      return 3;
    }
    else if ( volume <= .780 ) {
      return 4;
    }
    else if ( volume <= .960 ) {
      return 5;
    }
    else {
      return 6;
    }
  };

  return molarity.register( 'VolumeDescriber', VolumeDescriber );
} )
;