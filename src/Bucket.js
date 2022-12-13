import React from 'react';
import styled from 'styled-components';

const Unit = styled.div`
    height: 25px;
    width: 25px;
    background-color: #0B65C2;
    border: white solid 1px;
`;

const Water = styled.div`
    display: flex;
    width: ${(props) => `${props.bucketWidth}px`};
    height: ${(props) => `${props.waterHeight}px`};
    justify-content: center;
    align-tiems: flex-end;
    background-color: #0B65C2;
`;

const BucketRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`;

const BucketWall = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: ${(props) => `${props.bucketWidth}px`};
    height: ${(props) => `${props.bucketWidth}px`};
    border: black solid 5px;
    border-top: 0;
`;


const Row = ({numOfUnits}) => {
    const units = [];
    for (let i = 0; i < numOfUnits; i += 1) {
        units.push(<Unit />);
    };
    return (
        <BucketRow>
            {units}
        </BucketRow>
    );
};

const Bucket = ({units, width, totalUnits, viewOption}) => {

    const bucketWidth = width*27;
    const waterHeight = Math.floor((units/totalUnits)*bucketWidth);

    const rows = [];

    while (units - width > 0) {
        rows.push(<Row numOfUnits={width} />);
        units = units - width;
    }

    if (units > 0) {
        rows.unshift(<Row numOfUnits={units} />);
    };

    return (
        <BucketWall bucketWidth={bucketWidth}>
            {viewOption === 'water' && <Water waterHeight={waterHeight} bucketWidth={bucketWidth}/>}
            {viewOption === 'water units' && rows}
        </BucketWall>
    );
};

export default Bucket;