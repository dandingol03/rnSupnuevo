/**
 * Created by dingyiming on 2017/7/25.
 */
import React, {Component} from 'react';

import {
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
    BackAndroid,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
import {getSession,setGoodsInfo} from "../action/actionCreator";
import Icon from 'react-native-vector-icons/FontAwesome';
import PreferenceStore from '../utils/PreferenceStore';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Login from './Login';

class Announcement extends Component {


    navigatorToLogin(){
        const {navigator} = this.props;

        if (navigator) {
            navigator.replacePrevious({
                name: 'Login',
                component: Login,
                params: {
                }
            })
        }
    }


    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {dispatch} = this.props;
        var hhh=null;
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
                    <TouchableOpacity
                    onPress={()=>{
                        PreferenceStore.delete('username');
                        PreferenceStore.delete('password');
                        dispatch(setGoodsInfo({
                            codigo: null,
                            nombre: null,
                            oldPrice: null,
                            suggestPrice: null,
                            differ: null,
                            price: null,
                        }));
                        dispatch(getSession(hhh));
                        this.navigatorToLogin();

                    }}>
                        <Text style={{color: '#fff',}}>
                            exit
                        </Text>
                    </TouchableOpacity>

                    <Text style={{fontSize: 20, flex: 10, textAlign: 'center', color: '#fff'}}>
                        Supnuevo(4.0)-{this.props.username}
                    </Text>
                </View>

                <ScrollView>
                    <View style={{padding: 10, flex: 1, justifyContent: 'center', alignItems: 'center',}}>

                        <Text style={{padding: 10, justifyContent: 'center', alignItems: 'center',}}>
                            {this.props.announcement}
                        </Text>
                    </View>

                </ScrollView>
            </View>);
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
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        announcement: state.user.announcement,
    })
)(Announcement);

