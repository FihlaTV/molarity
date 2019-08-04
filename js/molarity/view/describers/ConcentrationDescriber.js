// Copyright 2019, University of Colorado Boulder

/**
 * ConcentrationDescriber is responsible for generating strings about ConcentrationProperty. Also includes alert text
 * for alerts past saturation point, including descriptions about the amount of solids (precipitate) in the beaker.
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
  const Util = require( 'DOT/Util' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  const beakerQuantitativeConcentrationPatternString = MolarityA11yStrings.beakerQuantitativeConcentrationPattern.value;
  const beakerQualitativeConcentrationPatternString = MolarityA11yStrings.beakerQualitativeConcentrationPattern.value;
  const beakerSaturationPatternString = MolarityA11yStrings.beakerSaturationPattern.value;
  const concentrationAndUnitString = MolarityA11yStrings.concentrationAndUnit.value;
  const concentrationChangePatternString = MolarityA11yStrings.concentrationChangePattern.value;
  const concentrationRangePatternString = MolarityA11yStrings.concentrationRangePattern.value;
  const qualitativeConcentrationStatePatternString = MolarityA11yStrings.qualitativeConcentrationStatePattern.value;
  const quantitativeConcentrationStatePatternString = MolarityA11yStrings.quantitativeConcentrationStatePattern.value;
  const saturationLostAlertPatternString = MolarityA11yStrings.saturationLostAlertPattern.value;
  const saturationReachedAlertString = MolarityA11yStrings.saturationReachedAlert.value;
  const stillSaturatedAlertPatternString = MolarityA11yStrings.stillSaturatedAlertPattern.value;
  const withSolidsAlertPatternString = MolarityA11yStrings.withSolidsAlertPattern.value;

  // Concentration region strings
  const solidsChangePatternString = MolarityA11yStrings.solidsChangePattern.value;
  const someString = MolarityA11yStrings.some.value;
  const zeroConcentrationString = MolarityA11yStrings.zeroConcentration.value;
  const lowConcentrationString = MolarityA11yStrings.lowConcentration.value;
  const slightlyConcentratedString = MolarityA11yStrings.slightlyConcentrated.value;
  const notVeryConcentratedString = MolarityA11yStrings.notVeryConcentrated.value;
  const veryConcentratedString = MolarityA11yStrings.veryConcentrated.value;
  const highlyConcentratedString = MolarityA11yStrings.highlyConcentrated.value;
  const maxConcentrationString = MolarityA11yStrings.maxConcentration.value;

  const hasZeroConcentrationString = MolarityA11yStrings.hasZeroConcentration.value;
  const hasLowConcentrationString = MolarityA11yStrings.hasLowConcentration.value;
  const isSlightlyConcentratedString = MolarityA11yStrings.isSlightlyConcentrated.value;
  const isNotVeryConcentratedString = MolarityA11yStrings.isNotVeryConcentrated.value;
  const isVeryConcentratedString = MolarityA11yStrings.isVeryConcentrated.value;
  const isHighlyConcentratedString = MolarityA11yStrings.isHighlyConcentrated.value;
  const hasMaxConcentrationString = MolarityA11yStrings.hasMaxConcentration.value;

  // Solids region strings
  const aBunchOfString = MolarityA11yStrings.aBunchOf.value;
  const aCoupleOfString = MolarityA11yStrings.aCoupleOf.value;
  const aFewString = MolarityA11yStrings.aFew.value;
  const aLotOfString = MolarityA11yStrings.aLotOf.value;
  const someLowercaseString = MolarityA11yStrings.someLowercase.value;
  const aBunchOfLowercaseString = MolarityA11yStrings.aBunchOfLowercase.value;
  const aLotOfLowercaseString = MolarityA11yStrings.aLotOfLowercase.value;

  // Change strings
  const lessString = MolarityA11yStrings.less.value;
  const moreString = MolarityA11yStrings.more.value;
  const lessCapitalizedString = MolarityA11yStrings.lessCapitalized.value;
  const moreCapitalizedString = MolarityA11yStrings.moreCapitalized.value;

  // constants
  const ACTIVE_CONCENTRATION_STRINGS = [
    hasZeroConcentrationString,
    hasLowConcentrationString,
    isSlightlyConcentratedString,
    isNotVeryConcentratedString,
    isVeryConcentratedString,
    isHighlyConcentratedString,
    hasMaxConcentrationString
  ];

  const CONCENTRATION_STRINGS = [
    zeroConcentrationString,
    lowConcentrationString,
    slightlyConcentratedString,
    notVeryConcentratedString,
    veryConcentratedString,
    highlyConcentratedString,
    maxConcentrationString
  ];

  const SOLIDS_STRINGS = [
    aCoupleOfString,
    aFewString,
    someString,
    aBunchOfString,
    aLotOfString
  ];
  const SOLIDS_STRINGS_LOWERCASE = [
    aCoupleOfString,
    aFewString,
    someLowercaseString,
    aBunchOfLowercaseString,
    aLotOfLowercaseString
  ];

  class ConcentrationDescriber {

    /**
     * @param {Solution} solution - from MolarityModel.
     * @param {Property.<boolean>>} useQuantitativeDescriptionsProperty
     */
    constructor( solution, useQuantitativeDescriptionsProperty ) {

      // @public
      this.concentrationRegionChanged = null; // boolean - tracks whether the concentration descriptive region has changed

      // @private
      this.solution = solution;
      this.soluteProperty = solution.soluteProperty;
      this.concentrationProperty = solution.concentrationProperty;
      this.precipitateAmountProperty = solution.precipitateAmountProperty;
      this.useQuantitativeDescriptionsProperty = useQuantitativeDescriptionsProperty;

      // @private
      // {number} - the index of the last concentration descriptive region
      this.concentrationRegion = concentrationToIndex( this.soluteProperty.value.saturatedConcentration,
        this.concentrationProperty.value );

      // @private
      // {boolean} - tracks whether the concentration descriptive region has just changed.
      this.concentrationRegionChanged = false;

      // @private
      // {boolean|null} - tracks whether concentration has increased or decreased. null when simulation starts or resets.
      this.concentrationIncreased = null;

      // @private
      // {number} - tracks the index of the last descriptive region for solids from SOLIDS_STRINGS array
      this.solidsRegion = solidsToIndex( this.precipitateAmountProperty.value, this.getCurrentSaturatedConcentration() );

      // @private
      // {boolean} - tracks whether the solids descriptive region has just changed
      this.solidsRegionChanged = false;

      // @private
      // {boolean|null} - tracks whether solids amount has increased or decreased. null when simulation starts or resets.
      this.solidsIncreased = null;

      // @private
      // {boolean} - tracks whether the solution has just become saturated or unsaturated.
      this.saturationStateChanged = false;

      this.concentrationProperty.lazyLink( ( newValue, oldValue ) => {
        assert && assert( newValue !== oldValue, 'unexpected: called with no change in concentration' );
        const newConcentrationRegion = concentrationToIndex( this.soluteProperty.value.saturatedConcentration,
          this.concentrationProperty.value );
        const previousSaturationState = oldValue >= this.getCurrentSaturatedConcentration();
        const newSaturationState = newValue >= this.getCurrentSaturatedConcentration();
        this.concentrationIncreased = newValue > oldValue;
        this.concentrationRegionChanged = newConcentrationRegion !== this.concentrationRegion;
        this.concentrationRegion = newConcentrationRegion;
        this.saturationStateChanged = newSaturationState !== previousSaturationState;
      } );

      this.precipitateAmountProperty.lazyLink( ( newValue, oldValue ) => {
        const newSolidsRegion = solidsToIndex( this.precipitateAmountProperty.value, this.getCurrentSaturatedConcentration() );
        const previousSaturationState = oldValue !== 0;
        const newSaturationState = newValue !== 0;
        this.saturationStateChanged = newSaturationState !== previousSaturationState;
        this.solidsIncreased = newValue > oldValue;
        this.solidsRegionChanged = newSolidsRegion !== this.solidsRegion;
        this.solidsRegion = newSolidsRegion;
      } );
    }

    /**
     * Getter for newSaturationState
     * @public
     * @returns {boolean} - whether or not the solution has been newly saturated or unsaturated
     * */
    isNewSaturationState() {
      return this.saturationStateChanged;
    }


    /**
     * determines if there is no solute in the beaker.
     * @returns {boolean}
     * @public
     */
    isNoSolute() {
      return this.solution.soluteAmountProperty.value <= 0.001;
    }

    /**
     * Gets the current value of concentration either quantitatively or quantitatively to plug into descriptions.
     * Qualitative description is in active voice.
     * @public
     * @returns {string} - description of current concentration (e.g. "1.500 Molar" or "is very concentrated")
     */
    getCurrentConcentration() {
      const concentration = this.concentrationProperty.value;
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        return StringUtils.fillIn( concentrationAndUnitString, {
          concentration: Util.toFixed( concentration, MConstants.CONCENTRATION_DECIMAL_PLACES )
        } );
      }
      else {
        const index = concentrationToIndex( this.soluteProperty.value.saturatedConcentration, concentration );
        return ACTIVE_CONCENTRATION_STRINGS[ index ];
      }
    }

    /**
     * Gets the current qualitative passive concentration description (e.g. "slightly concentrated").
     * @public
     * @returns {string}
     */
    getCurrentPassiveConcentration() {
      const concentration = this.concentrationProperty.value;
      const index = concentrationToIndex( this.soluteProperty.value.saturatedConcentration, concentration );
      return CONCENTRATION_STRINGS[ index ];
    }

    /**
     * Creates a string describing the concentration range of the current solute.
     * @public
     * @returns {string} - quantitative or qualitative description of current concentration (e.g. "1.500 Molar" or "very concentrated")
     */
    getCurrentConcentrationRange() {
      const maxConcentration = this.getCurrentSaturatedConcentration() > 5.0 ? 5.0 : this.getCurrentSaturatedConcentration();
      return StringUtils.fillIn( concentrationRangePatternString, {
        maxConcentration: Util.toFixed( maxConcentration, 1 )
      } );
    }

    /**
     * Gets the saturated concentration amount of the currently selected solute.
     * @private
     * @returns {number}
     */
    getCurrentSaturatedConcentration() {
      return this.soluteProperty.value.saturatedConcentration;
    }

    /**
     * Gets the qualitative description of the amount of solids in the beaker.
     * @private
     * @param {boolean} [isCapitalized]
     * @returns {string} - example: "a bunch"
     */
    getCurrentSolidsAmount( isCapitalized = true ) {
      const solidsIndex = solidsToIndex( this.precipitateAmountProperty.value, this.getCurrentSaturatedConcentration() );
      return isCapitalized ?
             SOLIDS_STRINGS[ solidsIndex ] :
             SOLIDS_STRINGS_LOWERCASE[ solidsIndex ];
    }

    /**
     * Creates a string that describes the solids in the beaker
     * @public
     * @returns {string} - e.g. "is saturated with a bunch of solids"
     */
    getBeakerSaturationString() {
      return StringUtils.fillIn( beakerSaturationPatternString, {
        solids: this.getCurrentSolidsAmount( false )
      } );
    }

    /**
     * Creates a string that describes the concentration of in the beaker
     * {Property.<boolean>} useQuantitativeDescriptionsProperty
     * @public
     * @returns {string} - e.g. "concentration 1.400 molar" or "is very concentrated"
     */
    getBeakerConcentrationString( useQuantitativeDescriptionsProperty ) {
      const concentrationString = useQuantitativeDescriptionsProperty.value ?
                                  beakerQuantitativeConcentrationPatternString :
                                  beakerQualitativeConcentrationPatternString;
      return StringUtils.fillIn( concentrationString, {
        concentration: this.getCurrentConcentration()
      } );
    }

    /**
     * Fills in the state info if region has changed and the solution is saturated.
     * @public
     * @returns {string} - example: "still saturated with a bunch of solids"
     */
    getStillSaturatedClause() {
      return StringUtils.fillIn( stillSaturatedAlertPatternString, {
        withSolids: this.solidsRegionChanged ? StringUtils.fillIn( withSolidsAlertPatternString, {
          solidAmount: this.getCurrentSolidsAmount( false )
        } ) : ''
      } );
    }

    /**
     * Creates a substring to describe how concentration has changed
     * @param {boolean} [isCapitalized]
     * @public
     * @returns {string} - example: "more concentrated"
     */
    getConcentrationChangeString( isCapitalized = false ) {
      let moreLessString = isCapitalized ? lessCapitalizedString : lessString;
      if ( this.concentrationIncreased ) {
        moreLessString = isCapitalized ? moreCapitalizedString : moreString;
      }
      return StringUtils.fillIn( concentrationChangePatternString, {
        moreLess: moreLessString
      } );
    }

    /**
     * Creates a substring to describe the change in the amount of solids
     * @public
     * @returns {string} - example: "more solids"
     */
    getSolidsChangeString() {
      assert && assert( this.precipitateAmountProperty.value > 0 );
      return StringUtils.fillIn( solidsChangePatternString, {
        moreLess: this.solidsIncreased ? moreString : lessString
      } );
    }

    /**
     * Creates the description strings that are read out when the solution is either newly saturated or newly unsaturated.
     * @public
     * @returns {string} - returns a string if the saturation state has changed
     * */
    getSaturationChangedString() {
      assert && assert( this.saturationStateChanged, 'failed: saturation state has not changed' );
      return this.solution.isSaturated() ?
             saturationReachedAlertString :
             StringUtils.fillIn( saturationLostAlertPatternString, {
               concentration: this.getCurrentConcentration()
             } );
    }

    /**
     * Creates the quantitative and qualitative substrings to describe the concentration state of the solution.
     * @public
     * @returns {string} - examples: "Concentration 0.600 Molar" or "Solution very concentrated".
     * */
    getConcentrationState() {
      if ( this.useQuantitativeDescriptionsProperty.value ) {
        return StringUtils.fillIn( quantitativeConcentrationStatePatternString, {
          concentration: this.getCurrentConcentration()
        } );
      }
      else {
        return StringUtils.fillIn( qualitativeConcentrationStatePatternString, {
          concentration: this.getCurrentConcentration()
        } );
      }
    }
  }

  /**
   * Calculates which item to use from the SOLIDS_STRINGS array.
   * @param {number} precipitateAmount
   * @param {number} saturatedConcentration
   * @returns {number} - index to pull from SOLIDS_STRINGS array
   */
  const solidsToIndex = ( precipitateAmount, saturatedConcentration ) => {
    const fraction = ( 5 - saturatedConcentration ) / SOLIDS_STRINGS.length;
    if ( precipitateAmount <= fraction / 5 ) {
      return 0;
    }
    else if ( precipitateAmount <= 2 * fraction / 5 ) {
      return 1;
    }
    else if ( precipitateAmount <= 3 * fraction / 5 ) {
      return 2;
    }
    else if ( precipitateAmount <= 4 * fraction / 5 ) {
      return 3;
    }
    else {
      return 4;
    }
  };

  /**
   * Calculates the which item to use from the CONCENTRATION_STRINGS array.
   * @param {number} maxConcentration
   * @param {number} concentration
   * @returns {number} index to pull from CONCENTRATION_STRINGS array
   */
  const concentrationToIndex = ( maxConcentration, concentration ) => {
    const scaleIncrement = maxConcentration / ( CONCENTRATION_STRINGS.length - 2 );
    if ( concentration <= 0.001 ) {
      return 0;
    }
    else if ( concentration <= scaleIncrement ) {
      return 1;
    }
    else if ( concentration <= 2 * scaleIncrement ) {
      return 2;
    }
    else if ( concentration <= 3 * scaleIncrement ) {
      return 3;
    }
    else if ( concentration <= 4 * scaleIncrement ) {
      return 4;
    }
    else if ( concentration >= scaleIncrement * 5 ) {
      return 6;
    }
    else {
      return 5;
    }
  };

  return molarity.register( 'ConcentrationDescriber', ConcentrationDescriber );
} );