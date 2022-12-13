import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import BucketRow from './BucketRow';
import ResultsTable from './ResultsTable';
import { findBestSolution, reducer } from './helpers';

const StyledApp = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  background-color: #F3F2EE;
  height: 100%;
  min-height: 100vh;
`;

const BucketRows = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const BucketTotalUnitsLabel = styled.label`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: center;
`;

const Selects = styled.div`
  display: flex;
  flex-direction: column;
  width: 15vw;
  min-width: 200px;
  height: 700px;
  align-items: center;
  padding-top: 50px;
  background-color: white;
  border-radius: 15px;
  margin: 10px 0 0 10px;
  position: sticky;
  top: 10px;
`;

const Select = styled.select`
  height: 30px;
  border-radius: 5px;
  width: 80%;
  margin: 15px 0;
  border: 1px solid #797977;
`;

const EnterButton = styled.button`
  height: 30px;
  border-radius: 5px;
  width: 80%;
  margin: 15px 0;
  border: 1px solid #797977;
  background-color: #F3F2ED;
`;

const ResultsSection = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
  border-radius: 15px;
  padding: 50px 0;
  margin: 10px;
  width: 85vw;
  min-height: 650px;
  height: 100%;
  overflow: hidden;
`;

const StyledNoResults = styled.h4`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Header = styled.header`
  width: calc(100% - 20px);
  border-radius: 15px;
  background-color: white;
  margin: 10px 10px 0 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledErrorMessage = styled.div`
  margin: 10px;
`;

function App() {
  const [state, dispatch] = useReducer(reducer, {
    smallBucketLimit: 99,
    largeBucketLimit: 2,
    smallSelected: 1,
    largeSelected: 99,
    unitSumSelected: 1,
    bucketUnitsSmall: null,
    bucketUnitsLarge: null,
    smallBucketOptions: [],
    largeBucketOptions: [],
    unitSumOptions: [],
    smallBucketWidth: null,
    largeBucketWidth: null,
    totalNumOfSteps: null,
    noValidResults: false,
    viewOption: 'table',
    bucketRows: [],
    results: [],
    errorMessage: null,
  });

  const onSelectLargeBucket = (e) => {
    const value = parseInt(e.target.value);
    const newState = {
      largeSelected: value,
      smallBucketLimit: value,
      smallBucketOptions: [],
      unitSumOptions: [],
    };
    for (let i = 1; i < value; i += 1) {
      newState.smallBucketOptions.push(<option value={i}>{i}</option>)
    };
    if (state.unitSumSelected > value) {
      newState.unitSumSelected = value
    };
    for (let i = state.smallSelected; i <= value; i += 1) {
      newState.unitSumOptions.push(<option value={i}>{i}</option>)
    };
    dispatch({
      type: 'select_large_bucket',
      ...newState
    });
  }

  const onSelectSmallBucket = (e) => {
    const value = parseInt(e.target.value);
    const newState = {
      smallSelected: value,
      largeBucketLimit: value + 1,
      largeBucketOptions: [],
      unitSumOptions: [],
    };
    for (let i = value + 1; i < 100; i += 1) {
      newState.largeBucketOptions.push(<option value={i}>{i}</option>)
    };
    if (state.unitSumSelected < value) {
      newState.unitSumSelected = value
    };
    for (let i = value; i <= state.largeSelected; i += 1) {
      newState.unitSumOptions.push(<option value={i}>{i}</option>)
    };
    dispatch({
      type: 'select_small_bucket',
      ...newState
    });
  };

  const onSelectViewOption = (e) => {
    const bucketRows = state.results.reduce((acc, result, i) => {
      return [
        ...acc,
        <BucketRow
          smallBucketAmount={result[0]}
          largeBucketAmount={result[1]}
          smallSelected={state.smallSelected}
          largeSelected={state.largeSelected}
          smallBucketWidth={state.smallBucketWidth}
          largeBucketWidth={state.largeBucketWidth}
          viewOption={e.target.value}
          step={i}
          stepInstructions={result[2]}
        />
      ]
    }, []);
    dispatch({
      type: 'select_view_option',
      bucketRows,
      viewOption: e.target.value
    });
  };

  const onEnter = () => {
    const smallBucketWidth = Math.ceil(Math.sqrt(state.smallSelected));
    const largeBucketWidth = Math.ceil(Math.sqrt(state.largeSelected));
    const { results, noValidResult, errorMessage } = findBestSolution(state.smallSelected, state.largeSelected, state.unitSumSelected);
    const bucketRows = results.reduce((acc, result, i) => {
      return [
        ...acc,
        <BucketRow
          smallBucketAmount={result[0]}
          largeBucketAmount={result[1]}
          smallSelected={state.smallSelected}
          largeSelected={state.largeSelected}
          smallBucketWidth={smallBucketWidth}
          largeBucketWidth={largeBucketWidth}
          viewOption={state.viewOption}
          step={i}
          stepInstructions={result[2]}
        />
      ]
    }, []);

    dispatch({
      type: 'on_enter',
      bucketUnitsSmall: state.smallSelected,
      bucketUnitsLarge: state.largeSelected,
      totalNumOfSteps: results.length - 1,
      noValidResults: noValidResult,
      smallBucketWidth,
      largeBucketWidth,
      bucketRows,
      results,
      errorMessage
    });
  };

  useEffect(() => {
    const smallBucketOptions = [];
    for (let i = 1; i < 99; i += 1) {
      smallBucketOptions.push(<option value={i}>{i}</option>)
    };
    const largeBucketOptions = [];
    for (let i = 2; i < 100; i += 1) {
      largeBucketOptions.push(<option value={i}>{i}</option>)
    };
    const unitSumOptions = []
    for (let i = 1; i < 100; i += 1) {
      unitSumOptions.push(<option value={i}>{i}</option>)
    };
    dispatch({
      type: 'set_initial_options',
      smallBucketOptions,
      largeBucketOptions,
      unitSumOptions,
    });
  }, []);

  return (
    <StyledApp>
      <Header>
        <h1>Water Bucket Puzzle</h1>
      </Header>
      <Content>
        <Selects>
          <label>View:</label>
          <Select id="view" onChange={onSelectViewOption}>
            <option value="table">Table</option>
            <option value="water">Water Level</option>
            <option value="water units">Water Units</option>
          </Select>
          <label>Large Bucket:</label>
          <Select id="largeBucket" onChange={onSelectLargeBucket} value={state.largeSelected}>{state.largeBucketOptions}</Select>
          <label>Small Bucket:</label>
          <Select id="smallBucket" onChange={onSelectSmallBucket} value={state.smallSelected}>{state.smallBucketOptions}</Select>
          <label>Solve For:</label>
          <Select id="sum" onChange={(e) => dispatch({ type: 'unit_sum_selected', unitSumSelected: parseInt(e.target.value) })} value={state.unitSumSelected}>{state.unitSumOptions}</Select>
          <EnterButton onClick={onEnter}>Enter</EnterButton>
          {state.noValidResults && 
            <>
              <StyledNoResults>
                No Possible Solution
              </StyledNoResults>
              {state.errorMessage && <StyledErrorMessage>{state.errorMessage}</StyledErrorMessage>}
              <br/>
            </>
          }
          {!!state.results.length &&
            <>
              {(!state.noValidResults && state.totalNumOfSteps) && <h4>{'Total Number of Steps:'} <br />{state.totalNumOfSteps}<br /></h4>}
              {(state.bucketUnitsLarge && state.bucketUnitsSmall) &&
                <BucketTotalUnitsLabel>
                  Large Bucket Units:
                  <br />
                  {state.bucketUnitsLarge}
                  <br />
                  <br />
                  Small Bucket Units:
                  <br />
                  {state.bucketUnitsSmall}
                </BucketTotalUnitsLabel>
              }
            </>
          }
        </Selects>
        <ResultsSection>
          {state.results.length > 0 &&
            (state.viewOption === 'table' ?
              <ResultsTable results={state.results} /> :
              <BucketRows>{state.bucketRows}</BucketRows>)
          }
        </ResultsSection>
      </Content>
    </StyledApp>
  );
};

export default App;
