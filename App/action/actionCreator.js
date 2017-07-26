/**
 * BrandAction
 * 因为没有api 只能拿固定数据
 */


import * as types from './types';
import Config from '../../config';
var Proxy = require('../proxy/Proxy');

export let loginAction=function(username,password,cb) {

    return dispatch => {

        var versionName = "3.0";

        Proxy.postes({
            url: Config.server + '/func/auth/webLogin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                loginName: username,
                password: password,
                loginType:1,
                parameter:{appVersion:versionName}
            }
        }).then((json) => {
            var errorMsg=json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                dispatch(getSession(null));
                dispatch(clearTimerAction());
                if (cb)
                    cb(errorMsg);
            }
            else {
                dispatch(setAnnouncement(json.dataMap.helpContent));
                dispatch(setCommodityClassList(json.dataMap.commodityClassList));
                dispatch(setWeightService(json.dataMap.weightService));
                dispatch(getSession({
                    username: username,
                    merchantStates: json.dataMap.merchantStates,
                    supnuevoMerchantId: json.dataMap.merchantId
                }));
                dispatch(clearTimerAction());
            }
        })
    }

}

export let setTimerAction=function (timer) {
    return dispatch=>{
        dispatch({
            type: types.TIMER_SET,
            timer:timer
        });
    };
}

export let clearTimerAction=function () {
    return dispatch=>{
        dispatch({
            type: types.TIMER_CLEAR
        });
    };
}

export let setNetInfo=function (connectionInfoHistory) {
    return dispatch=>{
        dispatch({
            type: types.SET_NETINFO,
            connectionInfoHistory:connectionInfoHistory
        })
    };
}

export let setAnnouncement=function (string) {
    return dispatch=>{
        dispatch({
            type: types.SET_ANNOUNCEMENT,
            announcement:string
        });
    };
}

export let setCommodityClassList=function (commodityClassList) {
    return dispatch=>{
        dispatch({
            type: types.SET_COMMODITY_CLASS_LIST,
            commodityClassList:commodityClassList
        });
    };
}

export let setWeightService=function (weightService) {
    return dispatch=>{
        dispatch({
            type: types.SET_WEIGHT_SERVICE,
            weightService:weightService
        });
    };
}

let getSession= (ob)=>{
    if(ob!==null)
        return {
            type: types.AUTH_ACCESS__ACK,
            supnuevoMerchantId:ob.supnuevoMerchantId,
            merchantStates:ob.merchantStates,
            auth:true,
            validate:true,
            username:ob.username
        };
    else
        return {
            type:types.AUTH_ACCESS__ACK,
            auth:false
        }
}

export let changeRoute=(navigator)=>{
    if(navigator!==undefined&&navigator!==null)
    {

        return {
            type: types.ROUTE_CHANGE,
            navigator:navigator
        };
    }
}

export let setTimer=(timer)=>{
    if(timer!==undefined&&timer!==null)
    {

        return {
            type: types.TIMER_SET,
            timer:timer
        };
    }
}

export let selectCarAction=function(car){
    return {
        type:types.SELECT_CUSTOMER_CAR,
        car:car
    }
}
