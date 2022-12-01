/* ******************************************************************************
 * AutoCompleteInput.tsx                                                        *
 * ******************************************************************************
 *
 * @fileoverview An input component which shows a list of users that can be referenced
 * when a search query (a word started with '@') is inputted by the user. Selecting an 
 * entry will replace the query with the name of the selected user.
 * 
 * Created on       Dec 1, 2022
 * @author          Oliver Millard
 *
 * ******************************************************************************/
import React, { useState } from 'react';
import { CommentBox } from './CommentBox';
import { UserDataItem, UserEntries } from './UserEntries';

const AutoCompleteInput = () => {
    /** The word beginning with '@' in the user's input which is the name being searched */
    const [ nameQuery, setNameQuery ] = useState<string>('');

    /** The entry that the user selects from the name list */
    const [ selectedUser, setSelectedUser ] = useState<UserDataItem | null>(null);

    return (
        <div className='autoCompleteInputWrapper'>
            <CommentBox
                nameQuery={nameQuery}
                setNameQuery={setNameQuery}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />   
            {nameQuery &&   
                <UserEntries
                    nameQuery={nameQuery}
                    setSelectedUser={setSelectedUser}
                />
            }
        </div> 
    );
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export { 
    AutoCompleteInput
};