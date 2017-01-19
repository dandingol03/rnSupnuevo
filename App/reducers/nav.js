

import * as types from '../action/types';

const initialState = {
    navigator:null
};

let nav = (state = initialState, action) => {

    switch (action.type) {

        case types.ROUTE_CHANGE:

            return Object.assign({}, state, {
                navigator:action.navigator
            })
        default:
            return state;
    }
}

export default nav;
