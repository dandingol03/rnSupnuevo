

import * as types from '../action/types';

const initialState = {
    carSelect: null,
    orders:[]
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case types.SELECT_CUSTOMER_CAR:

            return Object.assign({}, state, {
                carSelect: action.car
            })
        case types.FETCH_CAR_ORDERS:
            return Object.assign({}, state, {
                orders:action.orders
            })

        default:
            return state;
    }
}

export default user;
