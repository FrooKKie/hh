import React, {Fragment, useEffect, useState} from "react";
import "@/css/VacanciesList.scss"

async function getVacancies(
        setVacanciesState,
        currentCityId,
        {
            keywords,
            pagination: {
                currentPage,
                perPage
            }
        }
    ) {

    let response = await fetch(
        `https://api.hh.ru/vacancies?area=${currentCityId}&page=${currentPage}&per_page=${perPage}&text=${keywords}`,
        {
            method: 'GET',
        }
    )

    await response.json().then(function (vacanciesList) {
        setVacanciesState ( (prevState) => ({
            ...prevState,
            ...{
                vacancies: vacanciesList,
            }
        }))
    })
}



// создает элемент span вместо highlighttext(тег для выделения из ответа с сервера) и добавляет его как элемент(для выделения найденных совпадений)
// вместо dangerouslySetInnerHTML={{__html: item.snippet.responsibility}}
function markFound(str) {
    let result = str.replace(/<highlighttext>/g, str => `=|`).replace(/<\/highlighttext>/g, str => `=|`)

    result = result.split('=|')

    result.map(function (item,index) {
        if (Math.ceil(index/2) === index/2) return

        result[index] = React.createElement('span', {key: index * 0.3, className: 'highlight_text'}, item)

    })

    return result
}



function Pagination({
                        position,
                        currentCityId,
                        optionsState,
                        setOptionsState,
                        vacanciesState
}) {
    let pagination = []

    /*первая страница если текущая 5 и дальше*/
    if (optionsState.pagination.currentPage - 3 > 0) {
        pagination.push(
            <Fragment key={position + 'first'}>
                <a
                    onClick={() => {
                        setOptionsState((prevState) => ({
                            ...prevState,
                            ...{
                                pagination: {
                                    currentPage: 0,
                                    perPage: prevState.pagination.perPage
                                }
                            }
                        }))
                    }}
                >
                    {1}
                </a>

                <strong>...</strong>
            </Fragment>
        )
    }

    /*страницы до текущей*/
    for(
        let i = optionsState.pagination.currentPage - 3;
        i < optionsState.pagination.currentPage;
        ++i
    ) {
        if (i < 0) continue

        pagination.push(
            <a
                key={currentCityId * i + position}
                onClick={() => {
                    setOptionsState((prevState) => ({
                        ...prevState,
                        ...{
                            pagination: {
                                currentPage: i,
                                perPage: prevState.pagination.perPage
                            }
                        }
                    }))
                }}
            >
                {i + 1}
            </a>
        )
    }

    /*текущая страница и следующие*/
    for(
        let i = optionsState.pagination.currentPage;
        i !== vacanciesState.vacancies.pages && i !== (optionsState.pagination.currentPage + 3);
        ++i
    ) {
        pagination.push(
            <a
                key={currentCityId * i + position}
                style={
                    i === optionsState.pagination.currentPage
                        ? {backgroundColor: 'burlywood'}
                        : {}
                }
                onClick={() => {
                    setOptionsState((prevState) => ({
                        ...prevState,
                        ...{
                            pagination: {
                                currentPage: i,
                                perPage: prevState.pagination.perPage
                            }
                        }
                    }))
                }}
            >
                {i + 1}
            </a>
        )
    }

    /*последняя страница*/
    if (optionsState.pagination.currentPage + 3 < vacanciesState.vacancies.pages) {
        pagination.push(
            <Fragment key={position + 'last'}>
                <strong>...</strong>

                <a
                    onClick={() => {
                        setOptionsState((prevState) => ({
                            ...prevState,
                            ...{
                                pagination: {
                                    currentPage: vacanciesState.vacancies.pages - 1,
                                    perPage: prevState.pagination.perPage
                                }
                            }
                        }))
                    }}
                >
                    {vacanciesState.vacancies.pages}
                </a>
            </Fragment>
        )
    }

    return (
        pagination.length <= 1
            ? ''
            : <nav className={'pagination'}>
                {pagination}
            </nav>
    )
}



const VacanciesList = ({currentCityId, currentCityName}) => {
    /*полученный список вакансий*/
    const [vacanciesState , setVacanciesState] = useState({
        vacancies: null
    })

    /*опции для запроса списка параметров*/
    const [optionsState, setOptionsState] = useState({
        currentCityId: currentCityId,
        keywords: '',
        pagination: {
            currentPage: 0,
            perPage: 20,
        }
    })

    /*при выборе нового города в меню начать пагинацию с первой страницы*/
    useEffect(() => {
        if (optionsState.currentCityId === currentCityId) return

            setVacanciesState({
                vacancies: null
            })

            setOptionsState((prevState) => ({
                ...prevState,
                ...{
                    currentCityId: optionsState.currentCityId,
                    keywords: '',
                    pagination: {
                        currentPage: 0,
                        perPage: 20
                    }
                }
            }))
        }
        , [currentCityId]
    )

    /*при изменении опций поиска - сделать новый запрос*/
    useEffect(() => {
            getVacancies(setVacanciesState, currentCityId, optionsState)
    }
        , [optionsState]
    )

    return (
        vacanciesState.vacancies === null || vacanciesState.vacancies.found === 0
            ? <article className={'vacanciesList'}><h3>Вакансий не найдено</h3></article>
            : <article className={'vacanciesList'}>
                <h4>{currentCityName}</h4>

                <h5>Всего: {vacanciesState.vacancies.found} вакансии</h5>

                <form
                    className={'options'}

                    onSubmit={ (e) => {
                        e.preventDefault()

                        let form = new FormData(e.target)

                        setOptionsState((prevState) => ({
                            ...prevState,
                            ...{
                                currentCityId: optionsState.currentCityId,
                                keywords: form.get('key_words'),
                                pagination: {
                                    currentPage: 0,
                                    perPage: form.get('per_page'),
                                }
                            }
                        }))

                    }}
                >
                    <label>
                        Отображать на одной странице:
                        <select className={'per_page_select'} name={'per_page'}>
                            <option>20</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                    </label>

                    <label>
                        Ключевые слова:
                        <input className={'key_words_field'} type={'text'} name={'key_words'}/>
                    </label>


                    <input className={'submit_button'} type={'submit'} value={'Поиск'}/>
                </form>


                <Pagination
                    position={'top'}
                    currentCityId={currentCityId}
                    optionsState={optionsState}
                    setOptionsState={setOptionsState}
                    vacanciesState={vacanciesState}
                />

                <ul>
                    {vacanciesState.vacancies.items.map(function (item) {
                            /*список вакансий в выбранном городе*/
                            return (
                                <li key={item.id}>
                                    <h5>{item.name}</h5>
                                    <p>
                                        {
                                            item.salary === null
                                                ? `з\\п не указана`
                                                : `з\\п 
                                                  ${ (item.salary.from === null && '\n') || `от ${item.salary.from}` }
                                                  ${ (item.salary.to === null && '\n') || `до ${item.salary.to}` } 
                                                  ${ (item.salary.currency === "RUR" && `руб.`) || item.salary.currency }`
                                        }
                                    </p>
                                    {
                                        item.snippet.responsibility === null || optionsState.keywords === ''
                                            ? item.snippet.responsibility
                                            : markFound(item.snippet.responsibility)
                                    }
                                    <p>
                                        {item.address && item.address.raw}
                                    </p>
                                </li>
                            )
                        })
                    }
                </ul>

                <Pagination
                    position={'bot'}
                    currentCityId={currentCityId}
                    optionsState={optionsState}
                    setOptionsState={setOptionsState}
                    vacanciesState={vacanciesState}
                />
            </article>
    )
}

export default VacanciesList