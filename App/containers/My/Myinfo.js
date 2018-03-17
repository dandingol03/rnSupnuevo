/**
 * Created by imac on 2017/7/27.
 */
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

import {connect} from 'react-redux';
import Config from '../../../config';

import Icon from 'react-native-vector-icons/FontAwesome';
var proxy = require('../../proxy/Proxy');

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


class Myinfo extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            info: this.props.info,
            nickName:this.props.nickName,
            nubre:this.props.nubre,
            cuit:this.props.cuit,
            direccion:this.props.direccion,
            nomroDeTelePhono:this.props.nomroDeTelePhono,

        };
    }

    render() {
        var info = this.state.info;
        return (
            <View style={{flex: 1}}>
                {/* header bar */}

                <View style={{
                    backgroundColor: '#387ef5',
                    height: 55,
                    padding: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        height: 45,
                        marginRight: 10,
                        marginTop:10
                    }}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>
                {/* body */}
                <View style={{padding: 10, marginTop: 20}}>

                    <View style={styles.row}>
                        <View style={{flex:1}}>
                            <Text style={styles.popoverText}>昵称：</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.popoverText}>{info.nickName}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{flex:1}}>
                            <Text style={styles.popoverText}>商户名称：</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.popoverText}>{info.nubre}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{flex:1}}>
                            <Text style={styles.popoverText}>税号：</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.popoverText}>{info.cuit}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{flex:1}}>
                            <Text style={styles.popoverText}>地址：</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.popoverText}>{info.direccion}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{flex:1}}>
                            <Text style={styles.popoverText}>电话：</Text>
                        </View>
                        <View style={{flex:2}}>
                            <Text style={styles.popoverText}>{info.nomroDeTelePhono}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


var styles = StyleSheet.create({
    row: {
        height:65,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#aaa',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft:10
    },
    popoverText: {

        fontSize: 16
    },
});


module.exports = connect(state => ({

        username: state.user.username,

    })
)(Myinfo);

