import React from "react";
import ReactDOM from "react-dom";
import App from "@/js/reactComponents/App";
import {BrowserRouter, Switch, Route} from "react-router-dom"

import "@/css/CSSreset.scss"
import "../css/index.scss"

ReactDOM.render(
    <BrowserRouter>
            <Switch>
                <Route exact path='/' component={App}/>
                <Route path='/:areaId' component={App}/>
            </Switch>
    </BrowserRouter>
    , document.getElementById('react_container')
)