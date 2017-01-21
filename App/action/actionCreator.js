/**
 * BrandAction
 * 因为没有api 只能拿固定数据
 */


import * as types from './types';
import Config from '../../config';
var Proxy = require('../proxy/Proxy');


export let loginAction=function(username,password){

    return dispatch=>{

        Proxy.post({
            url:Config.server+'supnuevo/supnuevoGetUserLoginJSONObjectMobile.do',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "password=" + password + "&loginName=" + username
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
                dispatch(getSession(null));
                dispatch(clearTimerAction());
            }else{

                dispatch(getSession({username:username,merchantStates:json.merchantStates,supnuevoMerchantId:json.merchantId}));
                dispatch(clearTimerAction());
            }


        }, (err) =>{
                dispatch(getSession(null));
            dispatch(clearTimerAction());
            });
    };


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
