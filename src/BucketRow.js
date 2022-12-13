import React from 'react';
import styled from 'styled-components';
import Bucket from './Bucket';

const StyledBucketRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`;

const BucketColumn = styled.div`
    display: flex;
    width: 33%;
    margin: 20px 0;
`;

const BucketColumnLeft = styled(BucketColumn)`
    justify-content: flex-end;
    margin-right: 10px;
`;

const BucketColumnCenter = styled(BucketColumn)`
    display: flex;
    flex-direction: column;
    width: 33%;
    height: 100%;
    align-items: center;
    justify-content: flex-start;
    margin: 0 10px;
`;

const BucketColumnRight = styled(BucketColumn)`
    display: flex;
    width: 33%;
    justify-content: flex-start;
    maring-left: 10px;
`;

const BucketRow = ({
    smallBucketAmount, 
    largeBucketAmount, 
    smallBucketWidth, 
    largeBucketWidth, 
    step, 
    stepInstructions,
    smallSelected,
    largeSelected,
    viewOption
}) => {
    return (
        <>
            
            <StyledBucketRow>
                <BucketColumnLeft>
                    <Bucket units={largeBucketAmount} width={largeBucketWidth} totalUnits={largeSelected} viewOption={viewOption}/>
                </BucketColumnLeft>
                <BucketColumnCenter>  
                    <h4>{`Step ${step}`}</h4>
                    <label>{stepInstructions}</label>
                    <br/>
                    <label>{`<= Number of Units in Large Bucket: ${largeBucketAmount}`}</label>
                    <br/>
                    <label>{`Number of Units in Small Bucket: ${smallBucketAmount} =>`}</label>
                </BucketColumnCenter>
                <BucketColumnRight>
                    <Bucket units={smallBucketAmount} width={smallBucketWidth} totalUnits={smallSelected} viewOption={viewOption}/>
                </BucketColumnRight>
            </StyledBucketRow>
        </>
    );
};

export default BucketRow;