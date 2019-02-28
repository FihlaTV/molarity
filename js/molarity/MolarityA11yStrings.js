// Copyright 2019, University of Colorado Boulder

/**
 * Single location of all accessibility strings.  These strings are not meant to be translatable yet.  Rosetta needs
 * some work to provide translators with context for these strings, and we want to receive some community feedback
 * before these strings are submitted for translation.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Taylor Want (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const molarity = require( 'MOLARITY/molarity' );

  const MolarityA11yStrings = {
      screenSummaryFirstParagraphPattern: {
        value: 'In the Play Area, you find a beaker containing a solution and a concentration scale. You can choose 1 of {{numberOfSolutes}} solutes for the beaker, and observe changes to concentration scale as you adjust solute amount or solution volume. In the Control Area, there is a checkbox to show measured values for mols, Liters and Molarity, and a button to reset the sim.'
      },
      stateOfSimPattern: {
        value: 'Beaker is {{volume}} of a {{saturatedConcentration}} {{solute}} solution, containing {{soluteAmount}} of {{solute}} solute. {{concentrationClause}}.'
      },
      soluteAmountAndUnitPattern: {
        value: '{{soluteAmount}} mol'
      },
      soluteAmountPattern: {
        value: 'Solute amount is {{soluteAmount}}.'
      },
      solutionVolumePattern: {
        value: 'Solution is {{volume}}.'
      },
      solutionVolumeAndUnitPattern: {
        value: '{{volume}} liters'
      },
      solutionConcentrationValuesVisiblePattern: {
        value: 'Concentration is {{concentration}} molar'
      },
      solutionConcentrationPattern: {
        value: 'Solution is {{concentration}} and is {{saturatedConcentration}}'
      },
      soluteAmountAccessibleName: {
        value: 'Solute Amount'
      },
      solutionVolumeAccessibleName: {
        value: 'Solution Volume'
      },
      beakerHeader: {
        value: 'Beaker'
      },
      beakerDescription: {
        value: 'Solution Concentration of {{solute}} has reached {{concentration}} the peak of this solute is {{maxConcentration}}'
      },
      soluteComboBoxLabel: {
        value: 'Select Solute'
      },
      sliderControlsLabelString: {
        value: 'Slider Controls'
      },
      sliderControlsDescriptionString: {
        value: 'Solute Amount and Solution Volume sliders change solution in Beaker.'
      },
      fullString: {
        value: 'Full'
      },
      nearlyFullString: {
        value: 'Nearly Full'
      },
      overHalfString: {
        value: 'Over Half'
      },
      halfFullString: {
        value: 'Half Full'
      },
      underHalfString: {
        value: 'Under Half'
      },
      lowString: {
        value: 'Low'
      },
      leastAmountString: {
        value: 'Least Amount'
      },
      notConcentratedString: {
        value: 'Not Concentrated'
      },
      barelyConcentratedString: {
        value: 'Barely Concentrated'
      },
      slightlyConcentratedString: {
        value: 'Slightly Concentrated'
      },
      concentratedString: {
        value: 'Concentrated'
      },
      veryConcentratedString: {
        value: 'Very Concentrated'
      },
      noneString: {
        value: 'None'
      },
      minimumString: {
        value: 'Minimum'
      },
      belowHalfString: {
        value: 'Below Half'
      },
      halfSoluteString: {
        value: 'Half Solute'
      },
      aboveHalfString: {
        value: 'Above Half'
      },
      nearlyMaximumString: {
        value: 'Nearly Maximum'
      },
      maximumString: {
        value: 'Maximum'
      },
      saturatedString: {
        value: 'Saturated'
      },
      notSaturatedString: {
        value: 'not yet saturated'
      },
      increasesString: {
        value: 'increases'
      },
      decreasesString: {
        value: 'decreases'
      },
      raisesString: {
        value: 'raises'
      },
      lowersString: {
        value: 'lowers'
      },
      sliderMovedAlertPattern: {
        value: 'As {{sliderName}} {{increases}}, Molarity {{raises}}. {{concentrationClause}}.'
      },
      soluteChangedAlertPattern: {
        value: '{{solute}} Starts at 0.0 and Peaks at {{maxConcentration}}'
      }
    }
  ;

  // TODO: This seems it should be factored out, see https://github.com/phetsims/tasks/issues/917
  if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
    for ( const key in MolarityA11yStrings ) {
      MolarityA11yStrings[ key ].value += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.location.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
    }
  }

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( MolarityA11yStrings ); }

  return molarity.register( 'MolarityA11yStrings', MolarityA11yStrings );
} );
