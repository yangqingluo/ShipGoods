/**
 * Created by gyg on 2017/4/24.
 */
'use strict'
import React, {Component} from 'react';
import Sign from './Sign'
import {DURATION} from "react-native-easy-toast";
const DEBUG = true;
export default class NetUtil extends Component {

    //get请求
    static get(url, params) {
        if (params) {
            let paramsArray = []
            for(var item of params.entries()){
                paramsArray.push(item[0]+'='+encodeURIComponent(item[1]));
            }
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
    }
        return this.request(url, 'get', undefined, null);
    }

    //pos请求
    static post(url, params) {
        if (userData!= null) {
            if (userData.uid!= null) {
                params.uid = userData.uid;
            }
        }
        params.deviceid = 'iPhone121334';
        params.devicetype = '2';

        let body = JSON.stringify(params);
        return this.request(url, 'post', body, null);
    }

    //pos请求
    static postForm(url, formData) {
        formData.append("uid", userData.uid);
        formData.append("deviceid", "iPhone121334");
        formData.append("devicetype", "2");
        return this.request(url, 'post', formData, {
            'Content-Type':'multipart/form-data',
        });
    }

    static async request(url, method, body, headers) {
        // DEBUG && console.log("#REQUEST NetUtil# [" + method + "] url=" + url + ",body=" + body);
        // var timestamp = new Date().getTime()/1000;//当前时间毫秒值
        // var user = global.userData;
        //     // await AsyncStorage.getItem('user');//缓存本地的用户数据
        // var token='';//用户token
        // if(user!=null){
        //     token= user.token;
        // }else{
        //     token='';
        // }
        // var sign= await Sign.createSign(params, timestamp);//获取签名

        let opts = {
            method: method,
            headers: headers ? headers : {
                'Accept': 'application/json'
            },
            body: body
        }

        return new Promise((resolve, reject)=> {
            fetch(url, opts)
                .then((response)=> {
                    if(response.ok){
                        return response.text();
                    }else{
                        reject("服务器错误!");
                    }
                })
                .then((responseText)=> {
                    resolve(JSON.parse(responseText));
                })
                .catch((error)=> {
                    reject("网络错误!");
                });
        });
    }
}