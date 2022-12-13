export const findBestSolution = (smallSelected, largeSelected, unitSumSelected) => {

    // results will keep track of [<small bucket amount>, <large bucket amount>, <instructions for that step>]
    const smallFirstResult = [[0, 0, 'Both Buckets are Emtpy']];
    const largeFirstResult = [[0, 0, 'Both Buckets are Empty']];

    // keeping track of all the steps already logged so that if a state has already been visited, we know that the solution will fail
    const smallFirstLogOfSteps = {};
    const largeFirstLogOfSteps = {};

    // keeping track of whether the solutions for starting with the small bucket or large bucket individually fail
    let noValidResultLargeFirst = false;
    let noValidResultSmallFirst = false;

    // results to be returned
    const results = {
        results: [],
        noValidResult: false,
        errorMessage: null
    };

    // some of the identified ways a solution can fail with error messages
    if (
      smallSelected % 2 === 0
      && largeSelected % 2 ===0
      && unitSumSelected % 2 === 1
    ) {
      results.errorMessage = 'Two even buckets cannot result in an odd number';
    } else if (
        largeSelected % smallSelected === 0
        && unitSumSelected% smallSelected !== 0
    ) {
        results.errorMessage = 'When a large bucket is evenly divisible by a small bucket, the result must also be divisible by the small bucket';
    };

    // loop for starting with the large bucket
    for (let i = 0; i < largeFirstResult.length; i += 1) {

        const lastState = largeFirstResult.length - 1;

        // check if the last state of the buckets has already been visited, if so break the loop as the solution has failed
        if (largeFirstLogOfSteps[largeFirstResult[lastState][1]]) {
            if (largeFirstLogOfSteps[largeFirstResult[lastState][1]][largeFirstResult[lastState][0]] === true) {
                noValidResultLargeFirst = true;
                largeFirstResult[lastState][2] = `${largeFirstResult[lastState][2]}:
                    FAIL - This combination has already been seen`;
                break;
            };
        // if the last state has not been visited, add it to the log
        } else {
            largeFirstLogOfSteps[largeFirstResult[lastState][1]] = [];
            largeFirstLogOfSteps[largeFirstResult[lastState][1]][largeFirstResult[lastState][0]] = true;
        };

        // if the last state contains the solution, break the loop
        if (largeFirstResult[lastState][1] === unitSumSelected || largeFirstResult[lastState][0] === unitSumSelected) {
            break;
        };

        // if the small bucket is not full and the large bucket is empty, 
        // assume that it is time to fill the large bucket, 
        // add the state of the newly full bucket and the last state of the small bucket to the end of largeFirstResult
        if (largeFirstResult[lastState][0] < smallSelected && largeFirstResult[lastState][1] === 0) {
            largeFirstResult.push([largeFirstResult[lastState][0], largeSelected, 'Fill Large Bucket']);
        // if the small bucket is not full and the large bucket contains some amount over 0, pour the large bucket into the small bucket
        } else if (largeFirstResult[lastState][0] < smallSelected && largeFirstResult[lastState][1] !== 0) {
            // add the new state to the end of the result array
            largeFirstResult.push(
                [
                    // the new small bucket state should the smaller of either the amount that was in the large bucket 
                    // (in case it is smaller than what the small bucket can hold), or the entire amount the small bucket can contain
                    Math.min(largeFirstResult[lastState][1], smallSelected),
                    // the new large bucket state should be the larger of either the last large bucket state minus the difference between
                    // the small bucket size and the last small bucket state OR zero
                    Math.max(largeFirstResult[lastState][1] - (smallSelected - largeFirstResult[lastState][0]), 0),
                    'Pour Large Bucket into Small Bucket'
                ]
            );
        // if the small bucket is full, empty it
        } else if (largeFirstResult[lastState][0] === smallSelected) {
            largeFirstResult.push([0, largeFirstResult[lastState][1], 'Empty small bucket']);
        };
    };

    // loop for starting with the small bucket
    for (let i = 0; i < smallFirstResult.length; i += 1) {

        const lastState = smallFirstResult.length - 1;

        // check if the last state of the buckets has already been visited, if so break the loop as the solution has failed
        if (smallFirstLogOfSteps[smallFirstResult[lastState][1]]) {
            if (smallFirstLogOfSteps[smallFirstResult[lastState][1]][smallFirstResult[lastState][0]] === true) {
                noValidResultSmallFirst = true;
                smallFirstResult[lastState][2] = `${smallFirstResult[lastState][2]}:
                    FAIL - This combination has already been seen`;
                break;
            };
        // if the last state has not been visited, add it to the log
        } else {
            smallFirstLogOfSteps[smallFirstResult[lastState][1]] = []
            smallFirstLogOfSteps[smallFirstResult[lastState][1]][smallFirstResult[lastState][0]] = true;
        };

        // if the last state contains the solution, break the loop
        if (smallFirstResult[lastState][1] === unitSumSelected || smallFirstResult[lastState][0] === unitSumSelected) {
            break;
        };

        // if the small bucket is empty and the large bucket is not, 
        // assume that it is time to fill the small bucket, 
        // add the state of the newly full bucket and the last state of the large bucket to the end of smallFirstResult
        if (smallFirstResult[lastState][0] === 0 && smallFirstResult[lastState][1] < largeSelected) {
            smallFirstResult.push([smallSelected, smallFirstResult[lastState][1], 'Fill Small Bucket']);
        // if the small bucket contains some amount over 0 and the large bucket is not full, pour the small bucket into the large bucket
        } else if (smallFirstResult[lastState][0] !== 0 && smallFirstResult[lastState][1] < largeSelected) {
            smallFirstResult.push(
                [
                    // the new small bucket state should be the larger of either the last small bucket state minus the difference between
                    // the large bucket size and the last large bucket state OR zero
                    Math.max(smallFirstResult[lastState][0]-(largeSelected-smallFirstResult[lastState][1]),0),
                    // the new large bucket state should the smaller of either the amount that was in the small bucket plus the 
                    // amount in the large bucket, or the entire amount the large bucket can contain
                    Math.min(smallFirstResult[lastState][1]+smallFirstResult[lastState][0], largeSelected),
                    "Pour Small Bucket into Large Bucket"
                ]
            );
        // if the large bucket is full, empty it
        } else if (smallFirstResult[lastState][1] === largeSelected) {
            smallFirstResult.push([smallFirstResult[lastState][0], 0, 'Empty large bucket'])
        };
    };

    // if there are no valid results return the shorter path of the two options and set results.noValidResults to true
    if (noValidResultSmallFirst && noValidResultLargeFirst) {
        results.results = smallFirstResult.length < largeFirstResult.length ? smallFirstResult : largeFirstResult;
        results.noValidResult = true; 
    // if there is a valid large-first result OR the large first result is shorter, set that on the returned resutls object
    } else if (noValidResultSmallFirst || largeFirstResult.length <= smallFirstResult.length) {
        results.results = largeFirstResult;
    // if there is a valid small-first result OR the small first result is shorter, set that on the returned resutls object
    } else if (noValidResultLargeFirst || smallFirstResult.length <= largeFirstResult.length) {
        results.results = smallFirstResult;
    };
    return results;
}

export const reducer = (state, action) => {

    switch (action.type) {
      case 'select_large_bucket': {
        return {
          ...state,
          largeSelected: action.largeSelected,
          smallBucketLimit: action.smallBucketLimit,
          smallBucketOptions: action.smallBucketOptions,
          unitSumOptions: action.unitSumOptions,
          unitSumSelected: action.unitSumSelected ? action.unitSumSelected : state.unitSumSelected
        };
      }
      case 'select_small_bucket': {
        return {
          ...state,
          smallSelected: action.smallSelected,
          largeBucketLimit: action.largeBucketLimit,
          largeBucketOptions: action.largeBucketOptions,
          unitSumOptions: action.unitSumOptions,
          unitSumSelected: action.unitSumSelected ? action.unitSumSelected : state.unitSumSelected
        };
      }
      case 'select_view_option': {
        return {
          ...state,
          bucketRows: action.bucketRows,
          viewOption: action.viewOption
        };
      }
      case 'no_valid_result': {
        return {
          ...state,
          noValidResults: action.noValidResults,
          results: action.results,
          bucketRows: action.bucketRows,
        };
      }
      case 'on_enter': {
        return {
          ...state,
          bucketUnitsSmall: action.bucketUnitsSmall,
          bucketUnitsLarge: action.bucketUnitsLarge,
          totalNumOfSteps: action.totalNumOfSteps,
          noValidResults: action.noValidResults,
          smallBucketWidth: action.smallBucketWidth,
          largeBucketWidth: action.largeBucketWidth,
          bucketRows: action.bucketRows,
          results: action.results,
          errorMessage: action.errorMessage,
        };
      }
      case 'large_bucket_options': {
        return {
          ...state,
          largeBucketOptions: action.largeBucketOptions
        }
      }
      case 'unit_sum_selected': {
        return {
          ...state,
          unitSumSelected: action.unitSumSelected
        }
      }
      case 'set_initial_options': {
        return {
          ...state,
          smallBucketOptions: action.smallBucketOptions,
          largeBucketOptions: action.largeBucketOptions,
          unitSumOptions: action.unitSumOptions,
        }
      }
      default: {
        return state
      }
    };
  };
