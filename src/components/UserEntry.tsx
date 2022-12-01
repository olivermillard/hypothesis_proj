/* ******************************************************************************
 * UserEntry.tsx                                                                *
 * ******************************************************************************
 *
 * @fileoverview A component that displays a single user's entry. Includes a callback
 * function which is triggered onClick that indicates which entry a user has selected 
 *
 * Created on       Dec 1, 2022
 * @author          Oliver Millard
 *
 * ******************************************************************************/

import React, { memo } from 'react';
import { UserDataItem } from './UserEntries';

/** Props used by the UserEntry component */
interface UserEntryProps extends UserDataItem {
    /** A callback function which tells the parent which entry the user has selected */
    handleUserChoice: (entry: UserDataItem) => void;
}

/* ******************************************************************************
 * UserEntry                                                               */ /**
 *
 * React component to visualize a user's entry.
 *
 ********************************************************************************/
const UserEntry = (props: UserEntryProps) => {       
    return (
        <div className='userEntryWrapper'>
            <div 
                className='userEntryInner'
                onClick={()=> props.handleUserChoice({
                    name: props.name,
                    username: props.username,
                    avatar_url: props.avatar_url,
                })}
            >
                <img 
                    className='userEntryImg'
                    src={props.avatar_url} 
                    alt={`${props.name}'s profile pic`}
                />   
                <div className='userEntryTextContainer'> 
                    <div className='userEntryName'>
                        {props.name}
                    </div>
                    <div className='userEntryUsername'>
                        {`@${props.username}`}
                    </div>
                </div>
            </div>
        </div>
    );
};

/** Memoize the entry to avoid unnecessary rerenders when users change their input */
const UserEntryMemo = memo(UserEntry);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {  
    UserEntryMemo as UserEntry,
    UserEntryProps,
};