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

import React, { useEffect, useState, useRef } from 'react';
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

/** The coordinates of a search query in the user's input */
interface QueryCoordinates { 
    /** The start position of the query (i.e. the position of the '@') */
    start: number;

    /** The end position of the query (i.e. the last character in the query) */
    end: number;
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

    /** The position of the name query the user is currently typing */
    const [ queryPos, setQueryPos ] = useState<QueryCoordinates>({start: -1, end: -1});

    /** The ref for the textarea component */
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /** 
     * Delays the call to update the name query to prevent multiple rerenders 
     * in the UserEntries component while the user is still typing
     */
    const debounceInput = React.useRef(
        debounce(async (val) => {
            props.setNameQuery(val);
        }, 200)
    ).current;

    /* **************************************************************************
     * useEffect                                                           */ /**
     *
     * Throws away any pending invocation of the debounced function when unmounted
     */
    useEffect(() => {
        return () => {
            debounceInput.cancel();
        };
    }, [ debounceInput ]);

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
            setInputValue(replaceWithinRange(inputValue, props.selectedUser.name, queryPos.start, queryPos.end));
            
            // reset the selected user and the search input
            props.setSelectedUser(null);
            // do this immediately instead of using debounce because this doesn't require a delay
            props.setNameQuery('');
            
            // focus back on the comment area after selecting a user
            if(textareaRef.current){
                textareaRef.current.focus();
            }
        }
    }, [ props.selectedUser ]);
    
    /* ******************************************************************************
     * handleInputChange                                                       */ /**
     *
     * Changes the input value of the text area when a user writes in it. Debounces
     * the name search call associated with changing the input to avoid unnecessary 
     * rerenders while the user is typing. 
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target;
        const inputVal = input.value;

        // update the input value's state
        setInputValue(inputVal);

        // get the current position of the user's caret
        const caretPos = input.selectionStart;
       
        // inspect the current word that the user is typing to see if it is a name query
        findNameQuery(inputVal, caretPos);
    };

    /* **************************************************************************
     * findNameQuery                                                       */ /**
     *
     * Given the current position of the user's caret and the input, check if the
     * word that the user is currently writing is a valid name query.
     *
     * @input inputVal - the current input in the textarea 
     * @input replacement - the name of the selected user which will be replacing the 
     */
    const findNameQuery = (inputVal: string, caretPos: number) => {
        // there can't be a query if there is no text
        if(inputVal.length === 0) {
            resetQuery();
        }
        // if there is only character, just check to see if it is a query 
        else if(inputVal.length === 1) {
            if(inputVal === '@') {
                setQueryPos({ start: 0, end: caretPos });
                debounceInput(inputVal);
            }
            else {
                resetQuery();
            }
        }
        // otherwise, iterate backwards from the cursor position until a space is found 
        else {
            for(let i = caretPos - 1; i >= 0; i--) {
                // // if a space is found, then this isn't a query 
                // // i.e. it could be a case that uses '@' in another way, such as an email address
                if(inputVal[i] === ' ') { 
                    resetQuery();
                    break;
                }
                
                // if the '@' is the first character in the string, then it is a valid query
                const selectorInFirstPos = i === 0;
                // if there is a space before the '@', then it is a valid query
                const spaceBeforeSelector = inputVal[i-1] === ' ';
                
                // if an '@' is found and it is in a valid position, then update search query
                if(inputVal[i] === '@' && (spaceBeforeSelector || selectorInFirstPos)) { 
                    // the next space after the query will be the end of the query
                    const nextSpacePos = inputVal.indexOf(' ', i);
        
                    // the end of the query will either be the position of the next space or the end of the input
                    const queryEndPos = nextSpacePos !== -1 ? nextSpacePos : inputVal.length;
                    setQueryPos({ start: i, end: queryEndPos });
                   
                    // set name query value after debounce
                    const queryStr = inputVal.slice(i, queryEndPos);
                    debounceInput(queryStr);

                    // imperative to break the loop otherwise the check at the beginning of the loop will 
                    // overwrite the value of the current search query
                    break;
                }
            }
        }
    };

    /* **************************************************************************
     * resetQuery                                                          */ /**
     *
     * Resets the name query value to '' and resets the query position to -1, -1.
     * Resetting the name hides the UserEntries component.
     */
    const resetQuery = () => {
        debounceInput('');
        setQueryPos({ start: -1, end: -1});
    };

    return(
        <textarea
            className='commentBox'
            id='commentBox'
            placeholder='reference a user with the @ sign'
            onChange={(e) => handleInputChange(e)}
            value={inputValue}
            ref={textareaRef}
        />
    );
};


/* **************************************************************************
 * replaceWithinRange                                                  */ /**
 *
 * @input original - the user's current input in the textarea
 * @input replacement - the name of the selected user which will be replacing the 
 *                      search query
 * @input start - the start position of the search query
 * @input end - the end position of the search query
 * 
 * @returns the original input with the search query replaced by the selected 
 *          user's name
 */
const replaceWithinRange = (original: string, replacement: string, start: number, end: number): string => {
    return original.substring(0, start) + replacement + original.substring(end);
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    CommentBox,
    CommentBoxProps,
};
