// Copyright 2013-2017, University of Colorado Boulder

/**
 * Simple model of a solution.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );
  var molarity = require( 'MOLARITY/molarity' );
  var MConstants = require( 'MOLARITY/molarity/MConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );

  // phet-io modules
  var TSolute = require( 'ifphetio!MOLARITY/molarity/model/TSolute' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @param {Solvent} solvent
   * @param {Solute} solute
   * @param {number} soluteAmount moles
   * @param {number} volume Liters
   * @param {Tandem} tandem
   * @constructor
   */
  function Solution( solvent, solute, soluteAmount, volume, tandem ) {

    // @public
    this.solvent = solvent;

    // @public
    this.soluteProperty = new Property( solute, {
      tandem: tandem.createTandem( 'soluteProperty' ),
      phetioValueType: TSolute
    } );

    // @public
    this.soluteAmountProperty = new NumberProperty( soluteAmount, {
      tandem: tandem.createTandem( 'soluteAmountProperty' ),
      units: 'moles',
      range: MConstants.SOLUTE_AMOUNT_RANGE
    } );

    // @public
    this.volumeProperty = new NumberProperty( volume, {
      tandem: tandem.createTandem( 'volumeProperty' ),
      units: 'liters',
      range: MConstants.SOLUTION_VOLUME_RANGE
    } );

    // @public derive the concentration: M = moles/liter
    this.concentrationProperty = new DerivedProperty( [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        return Util.toFixedNumber( volume > 0 ? Math.min( solute.saturatedConcentration, soluteAmount / volume ) : 0, MConstants.CONCENTRATION_DECIMAL_PLACES );
      }, {
        tandem: tandem.createTandem( 'concentrationProperty' ),
        units: 'moles/liter',
        // no range, since this is derived
        phetioValueType: TNumber
      } );

    // @public derive the amount of precipitate
    this.precipitateAmountProperty = new DerivedProperty( [ this.soluteProperty, this.soluteAmountProperty, this.volumeProperty ],
      function( solute, soluteAmount, volume ) {
        return Solution.computePrecipitateAmount( volume, soluteAmount, solute.saturatedConcentration );
      }, {
        tandem: tandem.createTandem( 'precipitateAmountProperty' ),
        units: 'moles',
        phetioValueType: TNumber
      } );
  }

  molarity.register( 'Solution', Solution );

  return inherit( Object, Solution, {

    // @public
    reset: function() {
      this.soluteProperty.reset();
      this.soluteAmountProperty.reset();
      this.volumeProperty.reset();
    },

    // @public
    isSaturated: function() {
      return this.precipitateAmountProperty.value !== 0;
    },

    // @public
    getColor: function() {
      if ( this.concentrationProperty.value > 0 ) {
        var solute = this.soluteProperty.get();
        var colorScale = Util.linear( 0, solute.saturatedConcentration, 0, 1, this.concentrationProperty.value );
        return Color.interpolateRGBA( solute.minColor, solute.maxColor, colorScale );
      }
      else {
        return this.solvent.color;
      }
    }
  }, {

    // @public @static
    computePrecipitateAmount: function( volume, soluteAmount, saturatedConcentration ) {
      return volume > 0 ? Math.max( 0, volume * ( ( soluteAmount / volume ) - saturatedConcentration ) ) : soluteAmount;
    }
  } );
} );