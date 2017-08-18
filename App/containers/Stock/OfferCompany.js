/**
 * Created by dingyiming on 2017/7/25.
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
var Proxy = require('../../proxy/Proxy');
import {connect} from 'react-redux';
import Config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Myconcerncpy from './ConcernOfferCompany';
import MyOffer from './MyOffer';

class OfferCompany extends Component {

    constructor(props) {
        super(props);
        this.state = {
            goodsCount: 0,
            nubre: this.props.nubre,
            direccion: this.props.direccion,
            rubroDes: this.props.rubroDes,
            nomroDeTelePhono: this.props.nomroDeTelePhono,
            merchantId: this.props.merchantId,
        }
    }

    navigateMyconcerncpy() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'Myconcerncpy',
                component: Myconcerncpy,
                params: {}
            })
        }
    }

    goBack() {
        const {navigator} = this.props;

        /*if (navigator) {
         navigator.pop();
         if (this.props.reset)
         this.props.reset();
         }*/
        if (navigator) {
            navigator.push({
                name: "MyOffer",
                component: MyOffer,
                params: {}
            })
        }
    }

    laruguanzhu() {
        var sessionId = this.props.sessionId;
        var state = 1;
        var merchantId = this.state.merchantId;
        Proxy.post({
            url: Config.server + '/func/merchant/setBuyerSellerStateMobile',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionId,
            },
            body: {
                sellerId: merchantId,
                state: state,
            }
        }, (json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                alert("成功拉入关注");
            }
        }, (err) => {
            alert(err);
        });
    }

    buzaiguanzhu() {
        var state = 0;
        var sessionId = this.props.sessionId;
        var merchantId = this.state.merchantId;
        Proxy.post({
            url: Config.server + '/func/merchant/setBuyerSellerStateMobile',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionId,
            },
            body: {
                sellerId: merchantId,
                state: state,
            }
        }, (json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                alert("成功不再关注");
            }
        }, (err) => {
            alert(err);
        });
    }

    render() {

        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    height: 55,
                    padding: 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }, styles.card]}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={() => {
                            this.goBack()
                        }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 22, flex: 3, textAlign: 'center', color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View style={{flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center'}}>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex: 7, borderWidth: 1, borderColor: '#ddd'}}>
                        <View style={{flex: 1, flexDirection: 'row', borderWidth: 1, borderColor: '#ddd'}}>
                            <View style={{flex: 3}}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.ziti}>公司名称：</Text>
                                    </View>
                                    <View style={{flex: 1, justifyContent: 'flex-start'}}>
                                        <Text style={styles.popoverText}>{this.state.nubre}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.ziti}>公司地址：</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.popoverText}>{this.state.direccion}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.ziti}>公司营业范围：</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.popoverText}>{this.state.rubroDes}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.ziti}>公司联系电话：</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.popoverText}>{this.state.nomroDeTelePhono}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={styles.touchOty}
                                                  onPress={() => {
                                                      this.buzaiguanzhu()
                                                  }}>
                                    <Text style={{fontSize: 14}}>不再关注</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touchOty}
                                                  onPress={() => {
                                                      this.laruguanzhu()
                                                  }}>
                                    <Text style={{fontSize: 14, padding: 2}}>拉回我的关注</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touchOty}>
                                    <Text style={{fontSize: 14}}>扫描</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 2}}>

                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <TouchableOpacity style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#FFDE4C',
                            marginLeft: 20,
                            marginRight: 20,
                            marginBottom: 20,
                            marginTop: 10,
                            borderRadius: 4,
                        }}>
                            <View>
                                <Text style={{fontSize: 16}}>我的供应商</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#CAE1FF',
                            marginLeft: 20,
                            marginRight: 20,
                            marginBottom: 20,
                            marginTop: 10,
                            borderRadius: 4,
                        }} onPress={() => {
                            this.navigateMyconcerncpy()
                        }}>
                            <View>
                                <Text style={{fontSize: 16}}>我关注</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}


var styles = StyleSheet.create({
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    ziti: {
        fontSize: 13,
        paddingLeft: 5,
        paddingTop: 6,
    },
    touchOty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CAE1FF',
        borderRadius: 4,
        marginTop: 7,
        marginRight: 6,
        marginBottom: 3
    }
});


module.exports = connect(state => ({
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(OfferCompany);
