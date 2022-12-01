import React from 'react';
import { render, screen } from '@testing-library/react';
import { AutoCompleteInput } from '../components/AutoCompleteInput';

test('renders auto complete input field', () => {
    render(<AutoCompleteInput />);
    const textAreaElement = screen.getByPlaceholderText('reference a user with the @ sign');
    expect(textAreaElement).toBeInTheDocument();
});

