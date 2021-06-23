import React, {Fragment, useReducer} from "react";
export const StateContext = React.createContext()
import reducer from "@/js/reactComponents/reducer";
import AsideAreaMenu from "@/js/reactComponents/AsideAreaMenu";
import AreaList from "@/js/reactComponents/AreasList";
import VacanciesList from "@/js/reactComponents/VacanciesList";

const App = (props) => {
    const [state, dispatch] = useReducer(reducer, {
        currentCityId: +props.match.params.areaId || 2019,
        currentCityName: ""
    })

    return (
        <StateContext.Provider value={{state, dispatch}}>
            <main>
                <AreaList/>

                <AsideAreaMenu
                    currentAreaId={+props.match.params.areaId || 2019}
                    currentCityId={state.currentCityId}
                    currentCityName={state.currentCityName}
                />

                <VacanciesList
                    currentCityId={state.currentCityId}
                    currentCityName={state.currentCityName}
                />
            </main>
        </StateContext.Provider>
    )
}

export default App