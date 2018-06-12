/**
 * Created by gyg on 2017/4/24.
 */
'use strict';
import React,{Component} from 'react';
import {
    NativeModules,
} from 'react-native';
let EncryptionModule = NativeModules.EncryptionModule;
export default class Sign extends Component{
    
    static async createSign(map, timestamp){
        if(map == null) map = new Map();
        map.set('uid', '867909021770429');
        let user = global.userData;
        map.set('token',user.token == null ? '' : user.token);
        map.set('timestamp', timestamp);
        let keys = Array.from(map.keys()).sort();
        let sb = '';
        for(let key of keys) {
            sb += key + "=" + map.get(key) + "&"
        }
        sb = sb.substring(0, sb.length - 1);
        let sign = sb;
        // let sign = await EncryptionModule.MD5ByPromise(sb);//md5加密
        return sign;
    }

}
