import * as actionTypes from '../actionTypes'

export const setTokenAction = (payload: string | null) => {
    return {
        type: actionTypes.SET_TOKEN_ACTION,
        payload
    }
}