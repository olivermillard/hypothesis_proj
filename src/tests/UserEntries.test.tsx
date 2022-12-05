import React from 'react';
import { render } from '@testing-library/react';
import { UserEntries } from '../components/UserEntries';

test('UserEntries: shows correct message when no users are found', () => {
    const nameQuery = '@UNUSED_NAME_!!!!!';
    const setSelectedUser = jest.fn();

    const elem = render(
        <UserEntries 
            nameQuery={nameQuery}
            setSelectedUser={setSelectedUser}
        />
    ); 
   
    expect(elem.getByText(/no users found/i)).toBeInTheDocument();
});

test('UserEntries: shows correct message when loading data', async () => {
    const nameQuery = '@';
    const setSelectedUser = jest.fn();

    const elem = render(
        <UserEntries 
            nameQuery={nameQuery}
            setSelectedUser={setSelectedUser}
        />
    ); 
    
    expect(elem.getByText(/collecting user data/i)).toBeInTheDocument();
});
