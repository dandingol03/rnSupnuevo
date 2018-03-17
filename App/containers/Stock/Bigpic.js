/**
 * Created by xqli on 2017/8/23.
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
    ListView,
    TouchableOpacity
    } from 'react-native';
var proxy = require('../../proxy/Proxy');
import {connect} from 'react-redux';
import Config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;

class Bigpic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attachId: this.props.attachId,
            img: null,
        }
    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
            if (this.props.reset)
                this.props.reset();
        }
    }

    fetchData() {
        var attachId = this.state.attachId;
        proxy.postes({
            url: Config.server + "/func/merchant/getImageByAttachIdMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                attachId: attachId
            }
        }).then((json)=> {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var img = json.data;
                this.setState({img: img});
            }
        }).catch((err)=>{alert(err);});
    }

    render() {
        var pic_paddingLR = (ScreenWidth - 350) / 2;
        var pic_paddingTB = (ScreenHeight - 350) / 4;
        if (this.state.img === null) {
            this.fetchData();
        }
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
                <View
                    style={{paddingLeft:pic_paddingLR,paddingTop:pic_paddingTB}}>
                    <Image
                        resizeMode="stretch" style={{width:350,height:350}}
                        source={{uri:this.state.img}}
                        />
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
        fontSize: 14,
        paddingLeft: 5,
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
    },
    popoverText: {
        fontSize: 14,
    },
});


module.exports = connect(state => ({
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(Bigpic);