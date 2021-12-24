import React, { Component } from 'react'
import { Route, Redirect} from "react-router-dom";
import HomePage from './components/home-page/home-page';
import { roleA, roleB1, roleB2 } from './constants/listItem';
import Cookies from 'js-cookie';

function ProtectedRoute({isAuth: isAuth, ...rest}) {
    
    return (<Route 
        {...rest}
        render={(props)=> {
            if (isAuth) {
                const role = Cookies.get('role')
                if (role.indexOf('A') === 0) return <HomePage listItems={roleA} />
                else if (role === 'B1') return <HomePage listItems={roleB1} />
                else return <HomePage listItems={roleB2} />
            } else {
                return (
                    <Redirect to= {{pathname: "/login", state: {from: props.location}}} />
                );
            }
        }}
    />
    );
}
export default ProtectedRoute