import React, {useContext, useEffect, useState} from "react";
import {StateContext} from "@/js/reactComponents/App";
import "@/css/AsideAreaMenu.scss"


async function getCurrentArea(setAreaState, currentAreaId, inputValue, dispatch) {
    const response = await fetch(`https://api.hh.ru/areas/${currentAreaId}`, {
        method: 'GET',
    })

    return await response.json().then(function (areaCitiesList) {
        let cities = areaCitiesList.areas

        if (inputValue) {
            cities = cities.filter((city) => {
                return city.name.toLowerCase().includes(inputValue.toLowerCase())
            })
        }

        dispatch({
            type: 'changeArea',
            payload: {
                currentCityId: parseInt(currentAreaId),
                currentCityName: areaCitiesList.name
            }
        })

        setAreaState ((prevState) => ({
            ...prevState,
            ...{
                currentAreaId: currentAreaId,
                currentAreaName: areaCitiesList.name,
                cities: cities,
            }
        }))
    })
}



const AsideAreaMenu = ({currentAreaId, currentCityId}) => {
    const [areaState, setAreaState] = useState({
        currentAreaId: currentAreaId,
        currentAreaName: null,
        cities: null,
    })

    const {dispatch} = useContext(StateContext)

    //добавить в стейт список городов в выбраной области
    useEffect(() => {
        getCurrentArea(setAreaState, currentAreaId, '',dispatch)
    }, [currentAreaId])

    return (
            <aside className={'citiesMenu'}>
                <h5>Регион:</h5>

                <button
                    /*показать меню областей*/
                    onClick={ () => document.getElementById('all_areas_menu').style.visibility = 'visible'}
                >
                    {areaState.currentAreaName}
                </button>

                <h5>Город:</h5>

                <input
                    type={'text'}
                    onChange={(e) => {
                        getCurrentArea(setAreaState, currentAreaId, e.target.value, dispatch)
                    }}
                />

                <ul>
                    {areaState.cities === null || areaState.cities.length === 0
                        ? <li>Поиск в данном регионе не дал результатов</li>
                        : areaState.cities.map(function(item) {
                            return (
                                /*меню выбора города в области*/
                                <li
                                    key={item.id}
                                    style={
                                        currentCityId === parseInt(item.id)
                                        ? {backgroundColor: 'burlywood'}
                                        : {}
                                    }
                                    /*передать id города в редьюсер*/
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
                                </li>
                            )
                        })
                    }
                </ul>
            </aside>
    )
}

export default AsideAreaMenu