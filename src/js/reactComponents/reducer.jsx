function reducer (state, action) {
    switch (action.type) {
        case 'changeArea':
            return ({
                ...state,
                ...{
                    currentCityId: action.payload.currentCityId,
                    currentCityName: action.payload.currentCityName
                }
            })
        default:
            return state
    }
}

export default reducer