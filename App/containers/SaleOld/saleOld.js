/**
 * Created by dingyiming on 2017/3/7.
 */
import React, {Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    ListView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';


var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Proxy = require('../../proxy/Proxy');
var Popover = require('react-native-popover');
var QRCode = require('react-native-qrcode');

import Camera from 'react-native-camera';

class Sale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupCodes:null,
            goodNum: 1,
            cameraModalVisible: false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            }),
        };
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    renderRow(rowData){
        var row=
            <View>
                <TouchableOpacity onPress={()=>{}}>

                    <View style={{flex:1,flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:'#ddd',
                        justifyContent:'flex-start',backgroundColor:'#fff'}}>
                        <Text style={{flex:1,fontSize:15,color:'#343434'}}>{rowData}</Text>
                    </View>

                </TouchableOpacity>

            </View>;

        return row;
    }

    render() {
        var username = this.props.username;
        var Num = this.props.goodNum;
        var listView = null;
        var groupCodes = ["111111","222222","333333","444444","555555","666666","777777","888888","999999","101010","1111111111111"];
        var data = groupCodes;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        listView =
            <ScrollView>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(data)}
                    renderRow={this.renderRow.bind(data)}
                />
            </ScrollView>;
        return (

            <View style={{flex: 1}}>

                {/* header bar */}
                <View style={{}}>
                    <View style={[{
                        backgroundColor: '#387ef5',
                        padding: 3,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        flexDirection: 'row'
                    }, styles.card]}>
                    </View>
                    <View style={[{
                        backgroundColor: '#387ef5',
                        padding: 12,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        flexDirection: 'row'
                    }, styles.card]}>
                        <Text style={{fontSize: 22, textAlign: 'center', color: '#fff'}}>
                            Supnuevo(v4.0)-{username}
                        </Text>
                    </View>
                </View>
                <View style={{padding: 2}}>
                    {/*第二行*/}
                    <View style={[styles.row, {borderBottomWidth: 1}]}>
                        <View style={{flex: 1.5}}>
                            <TouchableOpacity style={styles.button} onPress={() => {}
                            }>
                                <Text style={styles.buttonText}>作废</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 2, flexDirection: 'row', paddingTop: 10}}>
                            <Text style={{fontSize: 22, textAlign: 'center', color: 'black'}}>
                                CANTIDAD
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: 'black',
                            //flexDirection: 'row',
                            //justifyContent: 'center',
                            //alignItems: 'center'
                        }}>
                            <TextInput style={{paddingLeft: 1, paddingRight: 1, paddingTop: 2, paddingBottom: 5}}
                                       onChangeText={(text) => this.setState({text})}

                                //value={this.state.goodNum}

                                       underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                                style={{flex: 1, marginRight: 2, flexDirection: 'row', justifyContent: 'center'}}
                                onPress={() => {
                                } }>
                                <Icon name="chevron-circle-right" color="black" size={50}></Icon>
                            </TouchableOpacity>
                        </View>
                    </View >
                    {/*列表*/}
                    <View style={{height:400}}>
                        <ScrollView>

                            <View style={{flex:1}}>
                                {listView}
                            </View>
                        </ScrollView>
                    </View>
                    {/*添加扫码图标 */}
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={[styles.button, {flex: 2}]}
                                          onPress={() => {
                                              Alert.alert(
                                                  '提示信息',
                                                  //'请输入4-13位的商品条码进行查询',
                                                  this.state.goodNum,
                                                  [
                                                      {text: 'OK', onPress: () => console.log('OK Pressed!')},
                                                  ]
                                              )
                                          }}>
                            <Text style={styles.buttonText}>结账</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {flex: 2}]}
                                          onPress={() => {
                                              this.setState({cameraModalVisible: true})
                                          }}>
                            <Text style={styles.buttonText}>扫码</Text>
                        </TouchableOpacity>
                        <View style={{flex: 7}}>
                            <Text style={{fontSize: 22, paddingTop: 10, textAlign: 'left', color: 'black'}}>
                                TOTAL:
                            </Text>
                        </View>
                    </View>
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.cameraModalVisible}
                        onRequestClose={() => {
                            alert("Modal has been closed.")
                        }}
                    >
                        <Camera
                            ref={(cam) => {
                                this.camera = cam;
                            }}
                            style={styles.preview}
                            aspect={this.state.camera.aspect}
                            captureTarget={this.state.camera.captureTarget}
                            type={this.state.camera.type}
                            flashMode={this.state.camera.flashMode}
                            defaultTouchToFocus
                            mirrorImage={false}
                            onBarCodeRead={(barcode) => {
                                var {type, data, bounds} = barcode;
                                if (data !== undefined && data !== null) {
                                    console.log('barcode data=' + data);
                                    this.state.goods.codeNum = data;
                                    var goods = this.state.goods;
                                    goods.codeNum = data;
                                    this.queryGoodsCode(data);
                                    this.closeCamera();
                                }
                            }}
                        />
                        <View style={[styles.box]}>
                        </View>
                        <View style={{
                            position: 'absolute',
                            right: 1 / 2 * width - 100,
                            top: 1 / 2 * height,
                            height: 100,
                            width: 200,
                            borderTopWidth: 1,
                            borderColor: '#e42112',
                            backgroundColor: 'transparent'
                        }}>
                        </View>
                        <View style={[styles.overlay, styles.bottomOverlay]}>
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={() => {
                                    this.closeCamera()
                                }}
                            >
                                <Icon name="times-circle" size={50} color="#343434"/>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}


var styles = StyleSheet.create({
    lTimeList: {
        backgroundColor:"#fff",
        alignItems: "center"
    },
    buttonText: {
        paddingTop: 3,
        paddingLeft: 3,
        fontSize: 20,
        fontWeight: '500',
    },
    button: {
        borderRadius: 4,
        padding: 10,
        marginLeft: 5,
        marginRight: 10,
        backgroundColor: '#8EE5EE',
        borderColor: '#333',
        borderWidth: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',

        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    popoverContent: {
        width: 140,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    box: {
        position: 'absolute',
        right: 1 / 2 * width - 100,
        top: 1 / 2 * height - 100,
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#387ef5',
        backgroundColor: 'transparent'

    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },

});

module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username
    })
)(Sale);

