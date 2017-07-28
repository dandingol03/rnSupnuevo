/**
 * Created by danding on 16/11/21.
 */
import React, {Component} from 'react';

import  {
    NetInfo,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
import Myinfo from './Myinfo';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Config from '../../../config';
var Proxy = require('../../proxy/Proxy');

class My extends Component {


    constructor(props) {
        super(props);
        this.state = {
            info: null,
        }

    }

    navigatemyinfo() {
        const {navigator} = this.props;
        Proxy.postes({
            url: Config.server + '/func/merchant/getSupnuevoMerchantInfoMobile',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {}
        }).then((json) => {
            var errMessage = json.errMessage;
            if (errMessage !== null && errMessage !== undefined && errMessage !== "") {
                alert(errMessage);

            } else {
                var nickName = json.nickName;
                var nubre = json.nubre;
                var cuit = json.cuit;
                var direccion = json.direccion;
                var nomroDeTelePhono = json.nomroDeTelePhono;
                var info = {
                    nickName: nickName,
                    nubre: nubre,
                    cuit: cuit,
                    direccion: direccion,
                    nomroDeTelePhono: nomroDeTelePhono
                };
                this.setState({info: info});
                //TODO:跳转
                navigator.push({
                    name: 'Myinfo',
                    component: Myinfo,
                    params: {
                        info: this.state.info,
                    }
                })
            }
        })
    }


    render() {

        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    height: 55,
                    padding: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }, styles.card]}>
                    <View style={{flex: 1}}>

                    </View>
                    <Text style={{fontSize: 22, flex: 3, textAlign: 'center', color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View ref="menu"
                          style={{flex: 1, marginRight: 2, flexDirection: 'row', justifyContent: 'center'}}>

                    </View>
                </View>

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    </View>
                    <TouchableOpacity style={{
                        flex: 0.25,
                        height: 10,
                        paddingTop: 2,
                        paddingLeft:5,
                        paddingRight:5,
                        paddingBottom: 2,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 0,
                        borderRadius: 4,
                        backgroundColor: '#CAE1FF'
                    }}
                                      onPress={() => {
                                          this.navigatemyinfo();
                                      }}>
                        <Text >我的信息</Text>
                    </TouchableOpacity>

                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>我的二维码</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>扫一扫商家二维码</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                    </View>
                </View>
            </View>
        );
    }
}


var
    styles = StyleSheet.create({

        card: {
            borderTopWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.1)',
            shadowColor: '#ccc',
            shadowOffset: {width: 2, height: 2,},
            shadowOpacity: 0.5,
            shadowRadius: 3,
        },

    });


module
    .exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
    })
)(My);

