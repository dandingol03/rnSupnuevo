/**
 * Created by dingyiming on 2017/7/25.
 */

import * as types from '../action/types';

const initialState = {
    commodityClassList:null,
    weightService:null,
    codigo:null,
    nombre:null,
    oldPrice:null,
    price: null,
    flag:1,
    suggestPrice:null,
    suggestLevel:null,
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
        case types.SET_GOODSINFO:
            return Object.assign({}, state, {
                codigo:action.codigo,
                nombre:action.nombre,
                price: action.price,
                oldPrice:action.oldPrice,
                suggestPrice:action.suggestPrice,
                suggestLevel:action.suggestLevel,
                flag:action.flag,
            });
            break;

        default:
            return state;
    }
}

export default sale;