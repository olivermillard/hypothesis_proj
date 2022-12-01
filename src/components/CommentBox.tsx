/* ******************************************************************************
 * CommentBox.tsx                                                               *
 * ******************************************************************************
 *
 * @fileoverview A component which allows users to write a comment in it. If the 
 * user begins a word with '@', it will suggest users with a username/name which 
 * matches the query string. The query string will be replaced with the user's name
 * when a user is selected. 
 *
 * Created on       Dec 1, 2022
 * @author          Oliver Millard
 *
 * ******************************************************************************/

import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { UserDataItem } from './UserEntries';

/** The props used by the CommentBox component */
interface CommentBoxProps {
    /** the name query (i.e. substring beginning with '@') from the textarea */
    nameQuery: string;
    
    /** the setState hook for the nameQuery state variable */
    setNameQuery: React.Dispatch<React.SetStateAction<string>>;

    /** the user entry that has been selected from the UserEntries list */
    selectedUser: UserDataItem | null;

    /** the setState hook for the selectedUser state variable */
    setSelectedUser: React.Dispatch<React.SetStateAction<UserDataItem | null>>
}

/* ******************************************************************************
 * CommentBox                                                              */ /**
 *
 * React input component which allows 
 *
 ********************************************************************************/
const CommentBox = (props: CommentBoxProps) => {        
    /** The input value for the CommentBox */
    const [ inputValue, setInputValue ] = useState('');

    /** 
     * Delays the call to update the name query to prevent multiple rerenders 
     * in the UserEntries component while the user is still typing
     */
    const debouncedInput = React.useRef(
        debounce(async (val) => {
            props.setNameQuery(findNameQuery(val));
        }, 300)
    ).current;

    /* **************************************************************************
     * useEffect                                                           */ /**
     *
     * Unmounts the debounced input
     */
    useEffect(() => {
        return () => {
            debouncedInput.cancel();
        };
    }, [ debouncedInput ]);

    /* **************************************************************************
     * useEffect                                                           */ /**
     *
     * Handles the selection of a user from the UserEntries item. Replaces the name query
     * with the selected user's name.
     */
    useEffect(() => {
        if(props.selectedUser) {
            // replace the search input (the word beginning with @) with the selected user's name
            // NOTE: didn't use .replace method to overcome edge cases 
            setInputValue(findAndReplace(inputValue, props.selectedUser.name));
            
            // reset the selected user and the search input
            props.setSelectedUser(null);
            props.setNameQuery(findNameQuery(''));
        }
    }, [ props.selectedUser ]);
    
    /* ******************************************************************************
     * handleInputChange                                                       */ /**
     *
     * Changes the input value of the text area when a user writes in it. Debounces
     * the name search call associated with changing the input to avoid unnecessary 
     * rerenders while the user is typing. 
     */
    const handleInputChange = (val: string) => {
        setInputValue(val);
        debouncedInput(val);
    };

    return(
        <textarea
            className='commentBox'
            id='commentBox'
            placeholder='reference a user with the @ sign'
            onChange={(e) => handleInputChange(e.target.value)}
            value={inputValue}
        />
    );
};

/* **************************************************************************
 * findNameQuery                                                       */ /**
 *
 * Finds the first word in the input that has the query selector ('@') as the
 * first character.
 * 
 * @input val - the current user input in the textarea
 * 
 * @returns the search query inputted by the user
 */
const findNameQuery = (val: string): string => {
    const words = val.split(' ');
    
    for (const word of words) {
        // only update the search input if the first character of a word is '@'
        // to avoid constant searching
        if (word.charAt(0) === '@') {
            return(word);
        }
    }

    return('');
};

/* **************************************************************************
 * findAndReplace                                                      */ /**
 *
 * Finds the search query and replaces it with the name of the selected user.
 * This method avoids edge cases that arose when using the .replace method, such 
 * as replacing the first '@' in the string even if it wasn't the first character
 * in the word in cases when users select a UserEntry after only inputting '@'.
 * 
 * @input input - the user's current input in the textarea
 * @input replacement - the name of the selected user which will be replacing the 
 *                      search query
 * 
 * @returns the original input with the search query replaced by the selected 
 *          user's name
 */
const findAndReplace = (input: string, replacement: string): string => {
    const words = input.split(' ');
    let newString = '';
    // only want to replace the first '@' found, so set this to true when found
    let foundReplacement = false;
        
    for (const word of words) {
        // replace the word(s) that begins with '@', 
        const shouldReplace = ((word.charAt(0) === '@') && !foundReplacement);
        newString += shouldReplace ? replacement + ' ' : word + ' ';
            
        if(shouldReplace) {
            foundReplacement = true;
        }
    }

    // remove the whitespace added to the last word in the string
    return(newString.trim());
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    CommentBox,
    CommentBoxProps,
    findNameQuery,
    findAndReplace,
};
