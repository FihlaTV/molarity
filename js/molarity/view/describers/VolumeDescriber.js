// Copyright 2019, University of Colorado Boulder

/**
 * VolumeDescriber is responsible for generating strings about VolumeProperty.
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

  // strings
  const hasVolumePatternString = MolarityA11yStrings.hasVolumePattern.value;
  const qualitativeVolumeSliderValueTextPatternString = MolarityA11yStrings.qualitativeVolumeSliderValueTextPattern.value;
  const qualitativeVolumeStatePatternString = MolarityA11yStrings.qualitativeVolumeStatePattern.value;
  const quantitativeVolumeSliderValueTextPatternString = MolarityA11yStrings.quantitativeVolumeSliderValueTextPattern.value;
  const solutionVolumeAndUnitPatternString = MolarityA11yStrings.solutionVolumeAndUnitPattern.value;
  const volumeChangePatternString = MolarityA11yStrings.volumeChangePattern.value;

  // volume regions strings
  const fullString = MolarityA11yStrings.full.value;
  const halfFullString = MolarityA11yStrings.halfFull.value;
  const nearlyEmptyString = MolarityA11yStrings.nearlyEmpty.value;
  const nearlyFullString = MolarityA11yStrings.nearlyFull.value;
  const overHalfFullString = MolarityA11yStrings.overHalfFull.value;
  const underHalfFullString = MolarityA11yStrings.underHalfFull.value;

  // volume active regions strings
  const isFullString = MolarityA11yStrings.isFull.value;
  const isNearlyFullString = MolarityA11yStrings.isNearlyFull.value;
  const isOverHalfFullString = MolarityA11yStrings.isOverHalfFull.value;
  const isHalfFullString = MolarityA11yStrings.isHalfFull.value;
  const isUnderHalfFullString = MolarityA11yStrings.isUnderHalfFull.value;
  const hasLowestAmountString = MolarityA11yStrings.hasLowestAmount.value;
  const isNearlyEmptyString = MolarityA11yStrings.isNearlyEmpty.value;

  // change strings
  const lessCapitalizedString = MolarityA11yStrings.lessCapitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.moreCapitalized.value;

  // constants
  const VOLUME_STRINGS = [
    hasLowestAmountString,
    nearlyEmptyString,
    underHalfFullString,
    halfFullString,
    overHalfFullString,
    nearlyFullString,
    fullString
  ];

  const VOLUME_ACTIVE_STRINGS = [
    hasLowestAmountString,
    isNearlyEmptyString,
    isUnderHalfFullString,
    isHalfFullString,
    isOverHalfFullString,
    isNearlyFullString,
    isFullString
  ];

  class VolumeDescriber {

    /**
     * @param {Solution} solution - from model
     * @param {ConcentrationDescriber} concentrationDescriber
     * @param {Property.<boolean>} useQuantitativeDescriptionsProperty
     */
    constructor( solution, concentrationDescriber, useQuantitativeDescriptionsProperty ) {

      // @private
      this.solution = solution;
      this.volumeProperty = solution.volumeProperty;
      this.concentrationDescriber = concentrationDescriber;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private
      // {number} - the index of the descriptive region from VOLUME_STRINGS array.
      this.currentRegion = volumeToIndex( this.solution.volumeProperty.value );

      // @private
      // {boolean} - tracks whether the descriptive volume region has just changed.
      this.volumeRegionChanged = false;

      // @private
      // {boolean} - tracks whether the volume slider has just been focused.
      this.isInitialVolumeAlert = true;

      // @private
      // {boolean|null} - tracks whether volume has just increased or decreased. null when simulation starts or resets.
      this.volumeIncreased = null;

      this.volumeProperty.link( ( newValue, oldValue ) => {
        assert && assert( newValue !== oldValue, 'unexpected: called with no change in volume' );
        assert && oldValue && assert( this.currentRegion === volumeToIndex( oldValue ),
          'current volume region not tracking the previous region as expected' );
        const oldRegion = this.currentRegion;
        this.currentRegion = volumeToIndex( newValue );
        this.volumeRegionChanged = this.currentRegion !== oldRegion;
        this.volumeIncreased = newValue > oldValue;
      } );
    }

    /**
     * Sets the initial volume alert value to true when a slider is focused to trigger a special alert right after focus.
     * @public
     */
    setInitialVolumeAlert() {
      this.isInitialVolumeAlert = true;
    }

    /**
     * Gets the current value of volume either quantitatively or quantitatively to plug into descriptions.
     * @param {boolean} [isActive]
     * @public
     * @returns {string} - examples: "1.500 Liters" for quantitative or "half full" for qualitative.
     */
    getCurrentVolume( isActive = false ) {
      const volumeIndex = volumeToIndex( this.volumeProperty.value );
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        const quantitativeString = isActive ? hasVolumePatternString : solutionVolumeAndUnitPatternString;
        return StringUtils.fillIn( quantitativeString, {
          volume: Util.toFixed( this.volumeProperty.value, MConstants.SOLUTION_VOLUME_DECIMAL_PLACES )
        } );
      }
      else if ( isActive ) {
        return VOLUME_ACTIVE_STRINGS [ volumeIndex ];
      }
      else {
        return VOLUME_STRINGS[ volumeIndex ];
      }
    }

    /**
     * Creates a substring describing the change in volume
     * @public
     * @returns {string} - example "More solution"
     */
    getVolumeChangeString() {
      return StringUtils.fillIn( volumeChangePatternString, {
        moreLess: this.volumeIncreased ? moreCapitalizedString : lessCapitalizedString
      } );
    }

    /**
     * Creates a substring describing the volume state
     * @public
     * @returns {string} - something like "Beaker half full"
     */
    getVolumeState() {
      return StringUtils.fillIn( qualitativeVolumeStatePatternString, { volume: this.getCurrentVolume() } );
    }

    /**
     * Creates the string to be used as the volume slider's aria-valueText on focus, and .
     * @public
     * @returns {string}
     */
    getOnFocusVolumeValueText() {
      const string = this.useQuantitativeDescriptionsProperty.value ?
                     quantitativeVolumeSliderValueTextPatternString :
                     qualitativeVolumeSliderValueTextPatternString;
      return StringUtils.fillIn( string, {
        volume: this.getCurrentVolume()
      } );
    }
  }

  /**
   * Calculates which item to use from the VOLUME_STRINGS array.
   * @param {number} volume
   * @returns {number} - index to pull from VOLUME_STRINGS array.
   */
  const volumeToIndex = ( volume ) => {
    if ( volume <= .200 ) {
      return 0;
    }
    else if ( volume <= .350 ) {
      return 1;
    }
    else if ( volume <= .499 ) {
      return 2;
    }
    else if ( volume === .500 ) {
      return 3;
    }
    else if ( volume <= .750 ) {
      return 4;
    }
    else if ( volume <= .999 ) {
      return 5;
    }
    else {
      return 6;
    }
  };

  return molarity.register( 'VolumeDescriber', VolumeDescriber );
} );