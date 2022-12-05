import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AutoCompleteInput } from '../components/AutoCompleteInput';

const setup = () => {
    const autoCompleteElem = render(<AutoCompleteInput />);
    const textArea = autoCompleteElem.container.querySelector('#commentBox');

    return {
        autoCompleteElem,
        textArea,
    };
};

test('setup renders the autocomplete input and the textarea', () => {
    const { autoCompleteElem, textArea } = setup();
    const commentBox = autoCompleteElem.container.querySelector('#commentBox');

    expect(commentBox).toBeInTheDocument();
    expect(textArea).toBeInTheDocument();
    expect(commentBox).toHaveAttribute('id', 'commentBox');
});

test('the correct textContent when inputting a value', () => {
    const { textArea } = setup();
    const newInput = 'oliver';

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.change(textArea!, { target: {value: newInput }});
    expect(textArea?.textContent).toBe('oliver');
});

test('UserEntries appears with valid input', async () => {
    const { autoCompleteElem, textArea } = setup();
    const validInput = '@';
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.change(textArea!, { target: {value: validInput }});
    
    await waitFor(() => {
        const userEntries = autoCompleteElem.container.querySelector('#userEntriesWrapper');
        expect(userEntries).toBeInTheDocument();
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // const invalidInput = 'abc'
    // fireEvent.change(textArea!, { target: {value: invalidInput }});

    // await waitFor(() => {
    //     const userEntries = autoCompleteElem.container.querySelector('#userEntriesWrapper');
    //     expect(userEntries).not.toBeInTheDocument();
    // });
});
