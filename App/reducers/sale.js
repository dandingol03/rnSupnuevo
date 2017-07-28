/**
 * Created by dingyiming on 2017/7/25.
 */

import * as types from '../action/types';

const initialState = {
    commodityClassList:null,
    weightService:null,
};

let sale = (state = initialState, action) => {

    switch (action.type) {

        case types.SET_COMMODITY_CLASS_LIST:
            return Object.assign({}, state, {
                commodityClassList:action.commodityClassList,
            });
            break;

        case types.SET_WEIGHT_SERVICE:
            return Object.assign({}, state, {
                weightService:action.weightService,
            });
            break;

        default:
            return state;
    }
}

export default sale;