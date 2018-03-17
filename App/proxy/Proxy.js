/**
 * Created by danding on 17/1/12.
 */
/**
 * Created by danding on 16/11/13.
 */


import {
    NetInfo,
    Alert,
    ToastAndroid,
} from 'react-native';
import store from '../store/index';


let Proxy = {

    get: (params) => {
        var url = params.url;
        if (url !== undefined && url !== null) {

            var options = {
                method: 'GET',
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                cache: 'default'
            };
            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then((response) => response.text())
                    .then((responseText) => {
                        resolve(JSON.parse(responseText));
                    })
                    .catch((err) => {
                        reject(new Error(err));
                        console.warn(err);
                    }).done();
            });
        } else {
            throw new Error('lack of url field');
        }
    },

    /* post:(params,success,fail)=>{

         var connectionInfoHistory = store.getState().netInfo.connectionInfoHistory;
         var length = connectionInfoHistory.length;

         //connectionInfoHistory[length-1] = 'none';

         if(connectionInfoHistory[length-1]!=='none'&&connectionInfoHistory[length-1]!=='unknown'){

             var url=params.url;
             if(url!==undefined&&url!==null)
             {

                 if(Object.prototype.toString.call(params.body)=='[object Object]')
                     params.body = JSON.stringify(params.body);


                 var options={
                     method:'POST',
                     headers:params.headers!==undefined&&params.headers!==null?params.headers:null,
                     credentials:'include',
                     cache:false,
                     body:params.body,
                     data:params.data!==undefined&&params.data!==null?params.data:null,
                 };

                 //var options={
                 //    method:'POST',
                 //    headers:params.headers!==undefined&&params.headers!==null?params.headers:null,
                 //    cache:false,
                 //    body:params.body
                 //};

                 fetch(url,options)
                     .then((response) => response.text())
                     .then((res) => {
                         success(JSON.parse(res));
                     })
                     .catch((err) => {
                         var msg = '服务器返回失败'
                         if(fail!==null&&fail!==undefined){
                             fail(msg);
                             console.warn(err);
                         }

                     })
                     .done();

             }else{
                 throw new Error('lack of url field');
             }

         }
         else{
             if(fail!==null){
                 var msg = '未连接网络'
                 fail(msg);
             }
             console.log('没联网！！！！！')
         }

     },*/

    postes(params) {
        var url = params.url;
        NetInfo.isConnected.fetch().then((isConnected) => {
            if (isConnected === false) {
                ToastAndroid.show('网络中断', ToastAndroid.SHORT);
            }
        });

        if (url !== undefined && url !== null) {
            if (Object.prototype.toString.call(params.body) == '[object Object]')
                params.body = JSON.stringify(params.body);

            var options = {
                method: 'POST',
                cache: 'default',
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                credentials: 'include',
                body: params.body,
                data: params.data !== undefined && params.data !== null ? params.data : null,
            };

            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then((response) => response.text())
                    .then((res) => {
                        resolve(JSON.parse(res));
                    })
                    .catch((err) => {

                    }).done();
            });
        } else {
            throw new Error('lack of url field');
        }
    },


    getSession: (params) => {
        var url = params.url;
        if (url !== undefined && url !== null) {

            if (Object.prototype.toString.call(params.body) == '[object Object]')
                params.body = JSON.stringify(params.body);

            var options = {
                method: 'POST',
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                credentials: 'include',
                cache: 'default',
                body: params.body,
                data: params.data !== undefined && params.data !== null ? params.data : null,
            };

            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((err) => {
                        reject(new Error(err));
                        console.warn(err);
                    }).done();

            });

        } else {
            throw new Error('lack of url field');
        }
    },


    fetch: (params) => {
        var url = params.url;
        if (url !== undefined && url !== null) {

            var options = {
                method: params.method !== undefined && params.method !== null ? params.method : 'GET',
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                cache: 'default'
            };
            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then((response) => response.text())
                    .then((responseText) => {
                        resolve(JSON.parse(responseText));
                    })
                    .catch((err) => {
                        reject(new Error(err));
                        console.warn(err);
                    }).done();
            });
        } else {
            throw new Error('lack of url field');
        }
    },

    fetchInPlain: (params) => {
        var url = params.url;
        if (url !== undefined && url !== null && url != '') {
            var options = {
                method: params.method !== undefined && params.method !== null ? params.method : 'POST',
                headers: params.header !== undefined && params.header !== null ? params.header : null,
                cache: 'default'
            };

            var success = params.success;
            var fail = params.fail;

            fetch(url, options)
                .then((res) => res.text())
                .then((resText) => {
                    if (success !== undefined && success !== null)
                        success(JSON.parse(resText));
                })
                .catch((err) => {
                    if (fail !== undefined && fail !== null) {
                        fail(err);
                    }
                });
        } else {
            throw new Error('lack of url field');
        }

    }

}

module.exports = Proxy;
