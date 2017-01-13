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
            }else{


                // if(json.merchantStates[0]==1){
                //     $state.go("query");
                // }else{
                //     $state.go("thefifth");
                // }

                dispatch(getSession({merchantStates:json.merchantStates,supnuevoMerchantId:json.merchantId}));

            }


        }, (err) =>{
                dispatch(getSession(null));
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
            validate:true
        };
    else
        return {
            type:types.AUTH_ACCESS__ACK,
            auth:false
        }
}

export let selectCarAction=function(car){
    return {
        type:types.SELECT_CUSTOMER_CAR,
        car:car
    }
}
