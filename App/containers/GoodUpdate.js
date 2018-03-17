/**
 * Created by danding on 16/11/21.
 */
import React, {Component} from 'react';

import  {
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
import DatePicker from 'react-native-datepicker';
import ActionSheet from 'react-native-actionsheet';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
import Config from '../../config';


class GoodUpdate extends Component {

    cancel() {
        //this.props.reset();
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    goBack() {
        var code = {codigo: this.state.selectedCodeInfo.codigo};
        this.props.onCodigoSelect(code);
        this.props.setHasCodigo();
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    confirm() {
        //修改信息
        if (this.state.selectedCodeInfo != undefined && this.state.selectedCodeInfo != null) {
            if (this.state.selectedCodeInfo.codigo === null || this.state.selectedCodeInfo.codigo === undefined || this.state.selectedCodeInfo.codigo === '') {
                alert("商品条码不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.taxId === null || this.state.selectedCodeInfo.taxId === undefined || this.state.selectedCodeInfo.taxId === '') {
                alert("商品税类不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.nombre === null || this.state.selectedCodeInfo.nombre === undefined || this.state.selectedCodeInfo.nombre === '') {
                alert("商品名称不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.nombre !== null || this.state.selectedCodeInfo.nombre !== undefined || this.state.selectedCodeInfo.nombre !== '') {
                if (this.state.selectedCodeInfo.nombre.length < 10) {
                    alert("商品名称不能少于10位");
                    return false;
                }
            }

            if (this.state.selectedCodeInfo.setSizeValue === null || this.state.selectedCodeInfo.setSizeValue === undefined || this.state.selectedCodeInfo.setSizeValue === '') {
                alert("商品含量不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.sizeUnit === null || this.state.selectedCodeInfo.sizeUnit === undefined || this.state.selectedCodeInfo.sizeUnit === '') {
                alert("含量单位不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.scaleUnit === null || this.state.selectedCodeInfo.scaleUnit === undefined || this.state.selectedCodeInfo.scaleUnit === '') {
                alert("比价单位不能为空");
                return false;
            }
            this.setState({wait:true,bgColor:'#D4D4D4'});

            var sessionId = this.props.sessionId;
            proxy.postes({
                url: Config.server + '/func/commodity/saveOrUpdateSupnuevoCommonCommodityMobile',
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json',
                    //'Cookie': sessionId,
                },
                // body: "taxId=" + this.state.selectedCodeInfo.taxId + "&supnuevoMerchantId=" + this.state.merchantId
                // + "&codigo=" + this.state.selectedCodeInfo.codigo+ "&nombre=" + this.state.selectedCodeInfo.nombre+
                // "&sizeValue=" + this.state.selectedCodeInfo.setSizeValue+ "&sizeUnited=" + this.state.selectedCodeInfo.sizeUnit+
                // "&scaleUnited=" + this.state.selectedCodeInfo.scaleUnit
                body: {
                    taxId: this.state.selectedCodeInfo.taxId,
                    supnuevoMerchantId: this.state.merchantId,
                    codigo: this.state.selectedCodeInfo.codigo,
                    nombre: this.state.selectedCodeInfo.nombre,
                    sizeValue: this.state.selectedCodeInfo.setSizeValue,
                    sizeUnited: this.state.selectedCodeInfo.sizeUnit,
                    scaleUnited: this.state.selectedCodeInfo.scaleUnit
                }
            }).then((json)=> {
                var errorMsg = json.errorMsg;
                var message = json.message;
                this.setState({wait:false,bgColor:'#11c1f3'});
                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);
                }
                if (message !== null && message !== undefined && message !== "") {
                    alert(message);
                    this.goBack();
                }

            }).catch((err) => {
                this.setState({wait:false,bgColor:'#11c1f3'});
                alert(err);
            });

        }


    }

    constructor(props) {
        super(props);
        this.state = {
            onCodigoSelect: props.onCodigoSelect,
            merchantId: props.merchantId,
            selectedCodeInfo: props.goodInfo,
            taxArr: props.taxArr,
            sizeArr: props.sizeArr,
            scaleArr: [],
            wait:false,
            bgColor:'#11c1f3',
        };

    }

    _handlePress1(index) {

        var sizeUnit = this.state.selectedCodeInfo.sizeUnit;
        if (index > 0) {
            this.state.selectedCodeInfo.sizeUnit = this.state.sizeArr[index - 1].label;
            var selectedCodeInfo = this.state.selectedCodeInfo;
            var sizeUnit = this.state.selectedCodeInfo.sizeUnit;
            this.setState({selectedCodeInfo: selectedCodeInfo});
        }
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/getSupnuevoScaleInfoListMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
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
            })

            this.setState({scaleArr: scaleArr});

        }).catch((err) => {
            alert(err);
        });
    }

    _handlePress2(index) {
        this.state.selectedCodeInfo.scaleUnit = this.state.scaleArr[index - 1].label;
        var selectedCodeInfo = this.state.selectedCodeInfo;
        this.setState({selectedCodeInfo: selectedCodeInfo});


    }

    _handlePress3(index) {
        this.state.selectedCodeInfo.taxId = index - 1;
        var selectedCodeInfo = this.state.selectedCodeInfo;
        this.setState({selectedCodeInfo: selectedCodeInfo});
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


    render() {

        var selectedCodeInfo = this.state.selectedCodeInfo;
        if (selectedCodeInfo.setSizeValue !== undefined && selectedCodeInfo.setSizeValue !== null) {
            selectedCodeInfo.setSizeValue = selectedCodeInfo.setSizeValue.toString();
        }

        var codigo = selectedCodeInfo.codigo;
        var name = selectedCodeInfo.nombre;
        var sizeValue = selectedCodeInfo.setSizeValue;

        var sizeUnit = selectedCodeInfo.sizeUnit;
        var scaleUnit = selectedCodeInfo.scaleUnit;
        var selectTax = '';

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;
        const buttons = ['取消', '确认退出', '😄😄😄', '哈哈哈'];
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
            if ((index.value - 1) == selectedCodeInfo.taxId) {
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
                        修改商品
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
                            <Text >商品内码:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                        </View>
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
                            <Text >商品条码:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>
                            <Text>
                                {codigo}
                            </Text>
                        </View>
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
                            <Text >商品名称:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                            <TextInput
                                style={{height: 40}}
                                onChangeText={(nombre) => {
                                    this.state.selectedCodeInfo.nombre = nombre;
                                    var selectedCodeInfo = this.state.selectedCodeInfo;
                                    this.setState({selectedCodeInfo: selectedCodeInfo});
                                }}
                                value={this.state.selectedCodeInfo.nombre}
                                placeholder={name}
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
                            <Text >商品含量:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>
                            <TextInput
                                style={{height: 40}}
                                onChangeText={(sizeValue) => {
                                    this.state.selectedCodeInfo.setSizeValue = sizeValue;
                                    var selectedCodeInfoNew = this.state.selectedCodeInfo;
                                    this.setState({selectedCodeInfo: selectedCodeInfoNew});
                                }}
                                value={(selectedCodeInfo.setSizeValue !== undefined && selectedCodeInfo.setSizeValue !== null)
                                    ? selectedCodeInfo.setSizeValue + '' : ''}
                                placeholder={sizeValue}
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
                            <Text >含量单位:</Text>
                        </View>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingLeft: 12
                        }}>
                            <Text >{sizeUnit}</Text>
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
                            <Text >比价单位:</Text>
                        </View>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingLeft: 12
                        }}>
                            <Text >{scaleUnit}</Text>
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
                            <Text >商品税类:</Text>
                        </View>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingLeft: 12
                        }}>
                            <Text >{selectTax}</Text>
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
    }
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        sessionId: state.user.sessionId,
    })
)(GoodUpdate);

