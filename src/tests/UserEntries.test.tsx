import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserEntries} from '../components/UserEntries';

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

test('UserEntries: shows correct message when loading data', () => {
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

test('UserEntries: shows correct message when loading data', () => {
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



test('Entries are displayed when found', async () => {
    const nameQuery = '@pturner0';
    const setSelectedUser = jest.fn();

    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                {
                    'username': 'pturner0',
                    'avatar_url': 'https://secure.gravatar.com/avatar/cd4318b7fb1cf64648f59198aca8757f?d=mm',
                    'name': 'Paula Turner'
                },
                {
                    'username': 'pdixon1',
                    'avatar_url': 'https://secure.gravatar.com/avatar/be09ed96613495dccda4eeffc4dd2daf?d=mm',
                    'name': 'Patrick Dixon'
                },
            ]),
        }),
    ) as jest.Mock;

    render(
        <UserEntries 
            nameQuery={nameQuery}
            setSelectedUser={setSelectedUser}
        />
    ); 
    const firstUserEntry = await screen.findByTestId('userEntry_0');
    const firstEntryByName = await screen.findByText('Paula Turner');
    
    expect(firstUserEntry).toBeInTheDocument();
    expect(firstEntryByName).toBeInTheDocument();
});
