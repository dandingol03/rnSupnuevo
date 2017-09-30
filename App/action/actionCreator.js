import * as types from './types';
import Config from '../../config';
var Proxy = require('../proxy/Proxy');
import PreferenceStore from '../utils/PreferenceStore';

export let loginAction=function(username,password,cb) {

    return dispatch => {
        return new Promise((resolve, reject) => {
            var versionName = "3.0";

            Proxy.postes({
                url: Config.server + '/func/auth/webLogin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    loginName: username,
                    password: password,
                    loginType: 1,
                    parameter: {appVersion: versionName}
                }
            }).then((json) => {

                if (json.errorMessageList !== null && json.errorMessageList !== undefined && json.errorMessageList.length > 0) {
                    resolve(json.errorMessageList[1]);
                }
                else {
                    Proxy.postes({

                        url: Config.server + '/func/merchant/getMerchantInitInfoMobile',

                        headers: {
                            'Content-Type': 'application/json'
                            // 'Cookie': sessionId
                        },
                        body: {}
                    }).then((json) => {
                        var errorMsg = json.errorMsg;
                        if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                            dispatch(getSession(null));
                            dispatch(clearTimerAction());
                            if (cb)
                                cb(errorMsg);
                        }
                        else {
                            dispatch(setAnnouncement(json.data.helpContent));
                            dispatch(setCommodityClassList(json.data.commodityClassList));
                            dispatch(setWeightService(json.data.weightService));
                            dispatch(getSession({
                                username: username,
                                merchantStates: json.data.merchantStates,
                                supnuevoMerchantId: json.data.merchantId,
                                merchantType: json.data.merchantType,
                                //sessionId: sessionId
                            }));
                            PreferenceStore.put('username', username);
                            PreferenceStore.put('password', password);

                            dispatch(clearTimerAction());
                        }
                    }).catch((err)=>{
                        alert(err.message);
                    })
                }
            }).catch((err)=>{
                resolve(err);
                //alert(err.message);
            })
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
            username:ob.username,
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
