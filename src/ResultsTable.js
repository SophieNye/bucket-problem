import React from 'react';
import styled from 'styled-components';

const StyledTable = styled.table`
    margin-bottom: 10px;
    min-width: 80%;
`;

const StyledRow = styled.tr`
    height: 50px;
`;

const StyledCell = styled.td`
    border-top: 1px black solid;
    overflow-wrap: break-word;
    padding: 0 25px;
`;

const StyledHeader = styled.th`
    padding: 0 5px;
`;

const ResultsTable = ({results}) => {

    const rows = results.map((result, i) => {
        return (
            <StyledRow>
                <StyledCell>{`Step ${i}`}</StyledCell>
                <StyledCell>{result[2]}</StyledCell>
                <StyledCell>{result[1]}</StyledCell>
                <StyledCell>{result[0]}</StyledCell>
            </StyledRow>
        );
    });

    return (
        <StyledTable>
            <StyledRow>
                <StyledHeader>Step</StyledHeader>
                <StyledHeader>Action</StyledHeader>
                <StyledHeader>Large Bucket Amount</StyledHeader>
                <StyledHeader>Small Bucket Amount</StyledHeader>
            </StyledRow>
            {rows}
        </StyledTable>
    );
};

export default ResultsTable;