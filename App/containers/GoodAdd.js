/**
 * Created by dingyiming on 2017/1/18.
 */
import React, {Component} from 'react';

import {
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
    TouchableOpacity,
    Button
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ActionSheet from 'react-native-actionsheet';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
import Config from '../../config';
import Camera from 'react-native-camera';


class GoodAdd extends Component {

    cancel() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    goBack() {
        var code = {codigo: this.state.newGoodInfo.codigo};
        this.props.onCodigoSelect(code);
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    confirm() {

        //修改信息
        if (this.state.newGoodInfo != undefined && this.state.newGoodInfo != null) {
            if (this.state.newGoodInfo.codigo === null || this.state.newGoodInfo.codigo === undefined || this.state.newGoodInfo.codigo === '') {
                alert("商品条码不能为空");
                return false;
            }
            if (this.state.newGoodInfo.codigo !== null || this.state.newGoodInfo.codigo !== undefined || this.state.newGoodInfo.codigo !== '') {
                if (this.state.newGoodInfo.codigo.length !== 8 && this.state.newGoodInfo.codigo.length !== 13) {
                    alert("商品条码位数错误");
                    return false;
                }
            }
            if (this.state.newGoodInfo.taxId === null || this.state.newGoodInfo.taxId === undefined || this.state.newGoodInfo.taxId === '') {
                alert("商品税类不能为空");
                return false;
            }
            if (this.state.newGoodInfo.nombre === null || this.state.newGoodInfo.nombre === undefined || this.state.newGoodInfo.nombre === '') {
                alert("商品名称不能为空");
                return false;
            }
            if (this.state.newGoodInfo.nombre !== null || this.state.newGoodInfo.nombre !== undefined || this.state.newGoodInfo.nombre !== '') {
                if (this.state.newGoodInfo.nombre.length < 10) {
                    alert("商品名称不能少于10位");
                    return false;
                }
            }

            if (this.state.newGoodInfo.setSizeValue === null || this.state.newGoodInfo.setSizeValue === undefined || this.state.newGoodInfo.setSizeValue === '') {
                alert("商品含量不能为空");
                return false;
            }
            if (this.state.newGoodInfo.sizeUnit === null || this.state.newGoodInfo.sizeUnit === undefined || this.state.newGoodInfo.sizeUnit === '') {
                alert("含量单位不能为空");
                return false;
            }
            if (this.state.newGoodInfo.scaleUnit === null || this.state.newGoodInfo.scaleUnit === undefined || this.state.newGoodInfo.scaleUnit === '') {
                alert("比价单位不能为空");
                return false;
            }

            this.setState({wait: true, bgColor: '#D4D4D4'});
            var sessionId = this.props.sessionId;
            proxy.postes({
                url: Config.server + '/func/commodity/saveOrUpdateSupnuevoCommonCommodityMobile',
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json',
                    //'Cookie':sessionId,
                },
                // body: "taxId=" + this.state.newGoodInfo.taxId + "&supnuevoMerchantId=" + this.state.merchantId
                // + "&codigo=" + this.state.newGoodInfo.codigo+ "&nombre=" + this.state.newGoodInfo.nombre+
                // "&sizeValue=" + this.state.newGoodInfo.setSizeValue+ "&sizeUnited=" + this.state.newGoodInfo.sizeUnit+
                // "&scaleUnited=" + this.state.newGoodInfo.scaleUnit
                body: {
                    taxId: this.state.newGoodInfo.taxId,
                    supnuevoMerchantId: this.state.merchantId,
                    codigo: this.state.newGoodInfo.codigo,
                    nombre: this.state.newGoodInfo.nombre,
                    sizeValue: this.state.newGoodInfo.setSizeValue,
                    sizeUnited: this.state.newGoodInfo.sizeUnit,
                    scaleUnited: this.state.newGoodInfo.scaleUnit
                }
            }).then((json)=> {
                var errorMsg = json.errorMsg;
                var message = json.message;

                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);
                    this.goBack();
                }
                if (message !== null && message !== undefined && message !== "") {
                    alert(message);
                    this.goBack();
                }
                this.setState({wait: false, bgColor: '#11c1f3'});
            }).catch((err) => {
                this.setState({wait: false, bgColor: '#11c1f3'});
                alert(err);
                this.goBack();
            });

        }


    }

    _handlePress1(index) {
        if (index > 0) {
            this.state.newGoodInfo.sizeUnit = this.state.sizeArr[index - 1].label;
            var newGoodInfo = this.state.newGoodInfo;
            var sizeUnit = this.state.newGoodInfo.sizeUnit;
            this.setState({newGoodInfo: newGoodInfo});
        }
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/getSupnuevoScaleInfoListMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            // body: "sizeUnit=" + sizeUnit + "&merchantId=" + this.state.merchantId
            body: {
                sizeUnit: sizeUnit,
                merchantId: this.state.merchantId
            }

        }).then((json)=> {
            var scaleArr = new Array();
            json.scaleArr.map(function (index, i) {
                scaleArr.push(index);
            });

            this.setState({scaleArr: scaleArr});

        }).catch((err) => {
            alert(err);
        });


    }

    _handlePress2(index) {
        this.state.newGoodInfo.scaleUnit = this.state.scaleArr[index - 1].label;
        var newGoodInfo = this.state.newGoodInfo;
        this.setState({newGoodInfo: newGoodInfo});


    }

    _handlePress3(index) {
        this.state.newGoodInfo.taxId = index - 1;
        var newGoodInfo = this.state.newGoodInfo;
        this.setState({newGoodInfo: newGoodInfo});
    }

    show(actionSheet) {
        if (actionSheet == 'actionSheet2') {
            if (this.state.scaleArr !== undefined && this.state.scaleArr !== null && this.state.scaleArr.length > 0) {
                this[actionSheet].show();
            } else {
                alert('请先选择含量单位');
            }
        } else {
            this[actionSheet].show();
        }
    }

    closeCamera(newGoodInfo) {
        if (newGoodInfo !== undefined && newGoodInfo !== null) {
            this.setState({cameraModalVisible: false, newGoodInfo: newGoodInfo});
        } else {
            this.setState({cameraModalVisible: false});
        }

    }


    constructor(props) {
        super(props);
        this.state = {
            onCodigoSelect: props.onCodigoSelect,
            merchantId: props.merchantId,
            wait: false,
            newGoodInfo: {
                codigo: '',
                nombre: '',
                setSizeValue: '',
                sizeUnit: '',
                scaleUnit: '',
                selectTax: '',
                taxId: null
            },
            taxArr: props.taxArr,
            sizeArr: props.sizeArr,
            scaleArr: [],
            cameraModalVisible: false,
            bgColor: '#11c1f3',
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
            barcodeX: null,
            barcodeY: null,
            barcodeWidth: null,
            barcodeHeight: null,
        };
    }

    render() {
        var newGoodInfo = this.state.newGoodInfo;
        var codigo = newGoodInfo.codigo;
        var name = newGoodInfo.nombre;
        var sizeValue = newGoodInfo.setSizeValue;

        var sizeUnit = newGoodInfo.sizeUnit;
        var scaleUnit = newGoodInfo.scaleUnit;
        var selectTax = '';

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const sizeUnitButtons = [];
        const scaleUnitButtons = [];
        const taxButtons = [];

        sizeUnitButtons.push('取消');
        taxButtons.push('取消');
        scaleUnitButtons.push('取消');

        this.state.sizeArr.map(function (index, i) {
            sizeUnitButtons.push(index.label);
        })
        this.state.taxArr.map(function (index, i) {
            taxButtons.push(index.label);
            if ((index.value - 1) == newGoodInfo.taxId) {
                selectTax = index.label;
            }
        })
        this.state.scaleArr.map(function (index, i) {
            scaleUnitButtons.push(index.label);
        })


        return (
            <View style={{flex: 1}}>
                <ScrollView>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    padding: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }, styles.card]}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={{flex: 1}}
                                          onPress={() => {
                                              this.cancel();
                                          }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 17, flex: 3, textAlign: 'center', color: '#fff'}}>
                        添加商品
                    </Text>
                    <View style={{flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center'}}>
                    </View>
                </View>

                {/* body */}

                <View style={{padding: 10, marginTop: 20}}>


                    {/*表单*/}
                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 0,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>商品内码:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                        </View>
                    </View>


                    <View style={[styles.row, {
                        borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 0,
                        borderColor: '#aaa', borderBottomColor: '#aaa', paddingLeft: 12, paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>商品条码:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>
                            <TextInput
                                style={{height: 40}}
                                onChangeText={(codigo) => {
                                    this.state.newGoodInfo.codigo = codigo;
                                    var newGoodInfo = this.state.newGoodInfo;
                                    this.setState({newGoodInfo: newGoodInfo});
                                }}
                                value={this.state.newGoodInfo.codigo}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <TouchableOpacity style={{
                            flex: 2, height: 40, marginRight: 6, marginTop: 5, paddingTop: 10, paddingBottom: 6,
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                            marginBottom: 0, borderRadius: 4, backgroundColor: 'rgba(17, 17, 17, 0.6)'
                        }}
                                          onPress={() => {
                                              this.setState({cameraModalVisible: true})
                                          }}>

                            <View>
                                <Text style={{color: '#fff', fontSize: 12}}>扫码</Text>
                            </View>
                        </TouchableOpacity>

                    </View>


                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 0,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>商品名称:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                            <TextInput
                                style={{height: 40}}
                                onChangeText={(nombre) => {
                                    this.state.newGoodInfo.nombre = nombre;
                                    var newGoodInfo = this.state.newGoodInfo;
                                    this.setState({newGoodInfo: newGoodInfo});
                                }}
                                value={this.state.newGoodInfo.nombre}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>商品含量:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>
                            <TextInput
                                style={{height: 40}}
                                onChangeText={(sizeValue) => {
                                    this.state.newGoodInfo.setSizeValue = sizeValue;
                                    var newGoodInfo = this.state.newGoodInfo;
                                    this.setState({newGoodInfo: newGoodInfo});
                                }}
                                value={this.state.newGoodInfo.setSizeValue.toString()}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>含量单位:</Text>
                        </View>
                        <View
                            style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text>{sizeUnit}</Text>
                        </View>

                        <View style={{flex: 3, padding: 5}}>

                            <TouchableOpacity style={{justifyContent: 'center'}}
                                              onPress={() => {
                                                  this.show('actionSheet1');
                                              }}>
                                <Icon name="chevron-circle-down" color="#aaa" size={30}></Icon>
                                <ActionSheet
                                    ref={(o) => {
                                        this.actionSheet1 = o;
                                    }}
                                    title="请选择含量单位"
                                    options={sizeUnitButtons}
                                    cancelButtonIndex={CANCEL_INDEX}
                                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                    onPress={
                                        (data) => {
                                            this._handlePress1(data);
                                        }
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>比价单位:</Text>
                        </View>
                        <View
                            style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text>{scaleUnit}</Text>
                        </View>
                        <View style={{flex: 3, padding: 5}}>

                            <TouchableOpacity style={{justifyContent: 'center'}}
                                              onPress={
                                                  () => {
                                                      this.show('actionSheet2');
                                                  }}>
                                <Icon name="chevron-circle-down" color="#aaa" size={30}></Icon>
                                <ActionSheet
                                    ref={(p) => this.actionSheet2 = p}
                                    title="请选择比价单位"
                                    options={scaleUnitButtons}
                                    cancelButtonIndex={CANCEL_INDEX}
                                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                    onPress={
                                        (data) => {
                                            this._handlePress2(data);
                                        }
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>商品税类:</Text>
                        </View>
                        <View
                            style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text>{selectTax}</Text>
                        </View>
                        <View style={{flex: 3, padding: 5}}>

                            <TouchableOpacity style={{justifyContent: 'center'}}
                                              onPress={
                                                  () => {
                                                      this.show('actionSheet3');
                                                  }}>
                                <Icon name="chevron-circle-down" color="#aaa" size={30}></Icon>
                                <ActionSheet
                                    ref={(q) => this.actionSheet3 = q}
                                    title="请选择商品税类"
                                    options={taxButtons}
                                    cancelButtonIndex={CANCEL_INDEX}
                                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                    onPress={
                                        (data) => {
                                            this._handlePress3(data);
                                        }
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 40}}>
                        <TouchableOpacity style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            backgroundColor: this.state.bgColor,
                            borderTopRightRadius: 4,
                            borderBottomRightRadius: 4,
                            alignItems: 'center',
                            padding: 8,
                            borderRadius: 4
                        }}
                                          disabled={this.state.wait}
                                          onPress={
                                              () => {
                                                  this.confirm();
                                              }}>
                            <Text style={{color: '#fff', fontSize: 18}}>确认</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                </ScrollView>

                {/*camera part*/}
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
                        captureTarget={this.state.camera.captureTarget}
                        type={this.state.camera.type}
                        flashMode={this.state.camera.flashMode}
                        defaultTouchToFocus
                        mirrorImage={false}
                        onBarCodeRead={(barcode) => {
                            var {type, data, bounds} = barcode;

                            if (data !== undefined && data !== null) {
                                console.log('barcode data=' + data);

                                this.state.newGoodInfo.codigo = data;
                                var newGoodInfo = this.state.newGoodInfo;
                                this.closeCamera(newGoodInfo);


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

            </View>);
    }
}


var styles = StyleSheet.create({
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
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    button: {
        width: 100,
        margin: 10,
        paddingTop: 15,
        paddingBottom: 15,
        color: '#fff',
        textAlign: 'center',
        backgroundColor: 'blue'
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
        sessionId: state.user.sessionId,
    })
)(GoodAdd);

