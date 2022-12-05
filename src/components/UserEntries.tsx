/* ******************************************************************************
 * UserEntries.tsx                                                              *
 * ******************************************************************************
 *
 * @fileoverview A component that displays all the user entries which match the 
 * search query inputted by the inputter. 
 *
 * Created on       Dec 1, 2022
 * @author          Oliver Millard
 *
 * ******************************************************************************/

import React, { useState, useEffect, memo } from 'react';
import { UserEntry } from './UserEntry';

/** The relative path of the user data */
const DATA_PATH = './UserData.json';

/** The type of a user data item */
interface UserDataItem {
    /** The user's username, always a single string with no spaces */
    username: string;

    /** The user's name, first and last */
    name: string;

    /** The url to the user's avatar */
    avatar_url: string;
}

/** The props used by the UserEntries component */
interface UserEntriesProps {
    /** the name query (i.e. substring beginning with '@') from the textarea */
    nameQuery: string;

    /** the setState hook for the selectedUser state variable */
    setSelectedUser: React.Dispatch<React.SetStateAction<UserDataItem | null>>;
}

/* ******************************************************************************
 * UserEntries                                                             */ /**
 *
 * A component which shows all the users that match the search query inputted 
 * by the user.
 *
 ********************************************************************************/
const UserEntries = (props: UserEntriesProps) => {
    /** The currently displayed users */
    const [ currEntries, setCurrEntries ] = useState<UserDataItem[] | null>(null);
    
    /** All of the users from the fetch */
    const [ userData, setUserData ] = useState<UserDataItem[] | null>(null);

    /* **************************************************************************
     * useEffect                                                           */ /**
     *
     * Fetches the user data from the source (in this case, the local JSON file). 
     * The data is then sorted and the state variables for the user data and the currently
     * displayed data are updated appropriately.
     */
    useEffect(() => {
        if(userData === null){ 
            const getUsers = async () => { 
                await fetchUsers(DATA_PATH)
                    .then(result => { 
                        setUserData(result);
                    })
                    .catch(err => {
                        console.error(err);
                        // set the user data and current entries to empty array so that 
                        // users are informed that no users were found instead of a hanging 'Collecting Data'
                        setUserData([]);
                        setCurrEntries([]);
                    });
            };

            getUsers(); 
        }
    }, []);

    /* **************************************************************************
     * useEffect                                                           */ /**
     *
     * Update the current entries after UserData has been updated to avoid filtering
     * issues otherwise filtering issues.
     */
    useEffect(() => { 
        props.nameQuery.length > 1 ? filterEntries(props.nameQuery) : setCurrEntries(userData);
    }, [ userData ]);

    /* **************************************************************************
     * useEffect                                                           */ /**
     *
     * Updates the displayed entries based off of the user's search input. If the
     * user has only written '@', displays all entries.
     */
    useEffect(() => {
        // if the user has inputted a character beyond the '@' sign, filter the data
        // otherwise just set it to all user data (unfiltered)
        const shouldFilterEntries = props.nameQuery.length > 1;
        shouldFilterEntries ? filterEntries(props.nameQuery) : setCurrEntries(userData);
    }, [ props.nameQuery ]);

    /* **************************************************************************
     * fetchUsers                                                          */ /**
     *
     * Fetches the user data and returns it in alphabetical order.
     * @input dataPath - the url/relative path for the database
     * 
     * @returns the sorted data from the fetch
     */
    const fetchUsers = async (dataPath: string): Promise<UserDataItem[]> => {
        const userData = await fetch(dataPath)
            .then(res => res.json());     
        const sortedData = userData.sort((a: UserDataItem, b: UserDataItem) => a.name > b.name ? 1 : -1);
        
        return sortedData;
    };

    /* **************************************************************************
     * filterEntries                                                       */ /**
     *
     * Filters out users who's name or username do not match the search query and
     * sets the current entries state variable when ready
     * 
     * @input nameQuery - the relevant substring from the user's input, i.e. 
     *                    the word that begins with '@'
     */
    const filterEntries = (nameQuery: string) => {
        const filteredEntries = userData?.filter((entry: UserDataItem) => {
            // remove the '@' from the beginning of the search and make text lower case
            const cleanedSearchInput = nameQuery.slice(1).toLowerCase();

            // make the username lowercase to match the search input 
            const cleanedUsername = entry.username.toLowerCase();
            
            // additionally, remove spaces in the name since spaces cannot be inputed with the '@' method
            const cleanedName = entry.name.toLowerCase().replaceAll(' ', '');

            // check if the user's name and/or their username matches the search query
            const userMatchesQuery = (cleanedName.includes(cleanedSearchInput) || cleanedUsername.includes(cleanedSearchInput));
            
            return userMatchesQuery;
        });

        setCurrEntries(filteredEntries ?? []);
    };

    // check if the currEntries have been set and whether there are any found that match the name query
    const usersWereFound = currEntries && currEntries.length > 0;
   
    // If currEntries is null, then the data is still being collected, otherwise no users were found that match the search query
    const messageText = currEntries === null ? 'Collecting User Data' : 'No Users Found';

    return (
        <div
            className='userEntriesWrapper'
            style={{visibility: props.nameQuery ? 'visible' : 'hidden' }}
            id='userEntriesWrapper'
        >
            {/* display either the user entries or the message to the user */}
            {usersWereFound ? ( 
                <>
                    {currEntries?.map((entry: UserDataItem, idx: number) => {
                        return(
                            <UserEntry
                                name={entry.name}
                                username={entry.username}
                                avatar_url={entry.avatar_url}
                                handleUserChoice={() => props.setSelectedUser(entry)}
                                key={`${entry.username}_${idx}`}
                            />
                        );
                    })}
                </>
            ) : (
                <div className='infoMessageWrapper'>
                    <div className='infoMessageText'>
                        {messageText}
                    </div>
                </div>
            )}
        </div> 
    );    
};

/** Memoize the component to avoid unnecessary rerenders when users change their input */
const UserEntriesMemo = memo(UserEntries);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    UserEntriesMemo as UserEntries,
    UserDataItem,
};