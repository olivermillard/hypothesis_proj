import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {  CommentBox } from '../components/CommentBox';
import { UserEntryProps } from '@/components/UserEntry';
import * as _ from 'lodash';

jest.mock('lodash/debounce');

const setup = (nameVal?: string, selectedUserVal?: UserEntryProps) => {
    const nameQuery = nameVal ? nameVal : '';
    const setNameQuery = jest.fn();
    const selectedUser = selectedUserVal ? selectedUserVal : null;
    const setSelectedUser = jest.fn();

    const utils = render(<CommentBox //await
        nameQuery={nameQuery}
        setNameQuery={setNameQuery}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
    />); 

    const textarea = utils.getByDisplayValue(nameQuery);

    return {
        textarea,
        ...utils,
    };
};

test('valid inputs', async () => {
    const { textarea } = setup();
    const input = 'oliver@gmail.com'; 

    fireEvent.change(textarea, {target: {value: input}});
    
    expect(textarea.textContent).toBe('oliver@gmail.com');
});

// test the debounce method 
jest.useFakeTimers();
describe('debounce', () => {
    let func: jest.Mock;
    let debouncedFunc: () => void;

    beforeEach(() => {
        func = jest.fn();
        debouncedFunc = _.debounce(func, 1000);
    });

    test('execute just once', () => {
        for (let i = 0; i < 100; i++) {
            debouncedFunc();
        }
        
        jest.runAllTimers();

        expect(func).toBeCalledTimes(1);
    });
});

// /** findNameQuery tests */
// test('findNameQuery: @ not at beginning doesn\'t count as a name query', () => {
//     const input = 'oliver@gmail.com';
//     const expectedResult = '';
//     const result = findNameQuery(input);

//     expect(result).toBe(expectedResult);
// });

// test('findNameQuery: input with multiple valid entries will use first entry', () => {
//     const input = '@oliver @chris';
//     const expectedResult = '@oliver';
//     const result = findNameQuery(input);
    
//     expect(result).toBe(expectedResult);
// });

// test('findNameQuery: input with no @ does not find search query', () => {
//     const input = '!qwryqiu 124yq98yfa ashfkja';
//     const expectedResult = '';
//     const result = findNameQuery(input);
    
//     expect(result).toBe(expectedResult);
// });

// /** findAndReplace tests */
// test('findAndReplace: properly replaces query with name', () => {
//     const input = 'this is @oliver';
//     const replacement = 'oliver';
//     const expectedResult = 'this is oliver';
//     const result = findAndReplace(input, replacement);
    
//     expect(result).toBe(expectedResult);
// });

// test('findAndReplace: replaces only first name query in string', () => {
//     const input = 'this is @oliver and @chris';
//     const replacement = 'oliver';
//     const expectedResult = 'this is oliver and @chris';
//     const result = findAndReplace(input, replacement);
    
//     expect(result).toBe(expectedResult);
// });

// test('findAndReplace: doesn\'t replace anything when no valid query even when given replacement', () => {
//     const input = 'this is oliver@gmail.com';
//     const replacement = 'oliver';
//     const expectedResult = 'this is oliver@gmail.com';
//     const result = findAndReplace(input, replacement);
    
//     expect(result).toBe(expectedResult);
// });