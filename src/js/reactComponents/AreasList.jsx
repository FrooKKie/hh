import {NavLink} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {StateContext} from "@/js/reactComponents/App";
import "@/css/AreasList.scss"



async function getAllAreas() {
    const response = await fetch(`https://api.hh.ru/areas/113`, {
        method: 'GET',
    })

    let areasList = await response.json()

    areasList = areasList.areas.sort( (a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })

    return areasList
}



const AreaList = () => {
    const [areaListState, setAreaListState] = useState({
        allAreas: null,
    })

    const {dispatch} = useContext(StateContext)

    /*получить список всех областей*/
    useEffect(() => {
        getAllAreas().then((areasList) =>
            setAreaListState ( (prevState) => ({...prevState,
                ...{
                    allAreas: areasList,
                }
            }))
        )
    }, [])

    let firstLetter

    return (
        <ul
            className={'all_areas_menu'} id={'all_areas_menu'}
            /*скрыть меню областей при выборе*/
            onClick={ () => document.getElementById('all_areas_menu').style.visibility = 'hidden' }
        >
            {areaListState.allAreas === null
                ? ''
                : areaListState.allAreas.map(function (item) {
                    /*если true будет добавлена большая буква перед областями начинающимеся на эту букву*/
                    let isCapitalLetter

                    if (firstLetter !== item.name[0]) {
                        firstLetter = item.name[0]
                        isCapitalLetter = true
                    } else {
                        isCapitalLetter = false
                    }

                    return (
                        <li key={item.id}>
                            {isCapitalLetter
                                ? <h4> {item.name[0]}</h4>
                                : ''
                            }

                            <NavLink
                                to={`/${item.id}`}
                                activeClassName="selectedNavLink"
                                onClick={() =>
                                    dispatch({
                                        type: 'changeArea',
                                        payload: {
                                            currentCityId: parseInt(item.id),
                                            currentCityName: item.name
                                        }
                                    })
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    )
                })
            }
        </ul>
    )

}

export default AreaList