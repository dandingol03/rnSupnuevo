

import * as types from '../action/types';

const initialState = {
    supnuevoMerchantId:null,
    merchantStates:null,
    validate:false,
    auth:false,
    info:null
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case types.AUTH_ACCESS__ACK:

            return Object.assign({}, state, {
                validate:action.validate,
                auth:action.auth,
                supnuevoMerchantId:action.supnuevoMerchantId,
                merchantStates:action.merchantStates,
                username:action.username
            });
            break;

        default:
            return state;
    }
}

export default user;
