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
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';


var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import MultiPrices from './MultiPrices';
import PriceCodes from './PriceCodes';
import Camera from 'react-native-camera';

class PriceSurvey extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    navigateMultiPrices(o, count) {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'multiPrices',
                component: MultiPrices,
                params: {
                    surveyDetail: o,
                    priceCount: count,
                }
            })
        }
    }

    navigatePriceCodes(codes, count) {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'priceCodes',
                component: PriceCodes,
                params: {
                    codes: codes,
                    count: count,
                }
            })
        }
    }

    fetchData() {
        const merchantId = this.props.merchantId;
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + "/func/commodity/getSupnuevoCommonCommodityGroupListByCodigoMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            //body:"merchantId=" + merchantId
            body: {
                merchantId: merchantId
            }
        }).then((json)=> {
            var o = json;
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var groupCodes = json.array;
                this.state.groupCodes = groupCodes;
                this.setState({groupCodes: groupCodes});
            }

        }).catch((err) => {
            alert(err);
        });
    }

    fetchDataDetail(groupId, count) {
        const merchantId = this.props.merchantId;
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + "/func/commodity/getGroupCommodityListOfGroupMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            // body: "groupId=" + groupId + "&merchantId=" + merchantId
            body: {
                groupId: groupId,
                merchantId: merchantId
            }
        }).then((json)=> {
            var o = json;
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var codes = json.array;
                this.state.codes = codes;
                this.setState({codes: codes});
                this.navigatePriceCodes(this.state.codes, count);
            }

        }).catch((err) => {
            alert(err);
        });
    }

    onCodigoSelect(code, count) {
        const merchantId = this.props.merchantId;
        var codigo = code;
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + "/func/commodity/getAreaGroupPriceByCommodityIdMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
               // 'Cookie': sessionId,
            },
            //body: "commodityId=" + codigo + "&merchantId=" + merchantId
            body: {
                commodityId: codigo,
                merchantId: merchantId
            }
        }).then((json)=> {
            var o = json;
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                this.navigateMultiPrices(o, count);
            }

        }).catch((err) => {
            alert(err);
        });
    }

    queryGoodsCode(codeNum) {
        //var code = parseInt(codeNum);
        const {merchantId} = this.props;
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/getGroupCommodityCodigoListByLastCodigoMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            //body: "codigo=" + codeNum + "&merchantId=" + merchantId
            body: {
                codigo: codeNum,
                merchantId: merchantId
            }
        }).then((json)=> {
            var o = json;
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json.array !== undefined && json.array !== null && json.array.length > 0) {
                    var codes = json.array;
                    this.setState({codes: codes});
                    this.navigatePriceCodes(codes, null)
                }
                else {
                    this.navigateMultiPrices(o);
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    renderRow(rowData) {

        var colorText = null;
        switch (rowData.count) {
            case 0:
                colorText =
                    <View style={{
                        flex: 1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                        <Text style={{flex: 1, fontSize: 15, color: '#343434'}}>{rowData.groupNum}</Text>
                        <Text style={{flex: 2, fontSize: 15, color: '#343434'}}>{rowData.groupName}</Text>
                    </View>
                break;
            case 1:
                colorText =
                    <View style={{
                        flex: 1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#32b968'
                    }}>
                        <Text style={{flex: 1, fontSize: 15, color: '#343434'}}>{rowData.groupNum}</Text>
                        <Text style={{flex: 2, fontSize: 15, color: '#343434'}}>{rowData.groupName}</Text>
                    </View>
                break;
            case 2:
                colorText =
                    <View style={{
                        flex: 1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fd871a'
                    }}>
                        <Text style={{flex: 1, fontSize: 15, color: '#343434'}}>{rowData.groupNum}</Text>
                        <Text style={{flex: 2, fontSize: 15, color: '#343434'}}>{rowData.groupName}</Text>
                    </View>
                break;
            case 3:
                colorText =
                    <View style={{
                        flex: 1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#ec0909'
                    }}>
                        <Text style={{flex: 1, fontSize: 15, color: '#343434'}}>{rowData.groupNum}</Text>
                        <Text style={{flex: 2, fontSize: 15, color: '#343434'}}>{rowData.groupName}</Text>
                    </View>
                break;
            default:
                break;
        }

        var row =
            <View>
                <TouchableOpacity onPress={
                    function () {
                        this.fetchDataDetail(rowData.groupId, rowData.count);
                    }.bind(this)}>

                    {colorText}

                </TouchableOpacity>

            </View>;

        return row;
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }


    constructor(props) {
        super(props);
        this.state = {
            codes: null,
            groupCodes: null,
            goods: {},
            count: null,
            cameraModalVisible: false,
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

        var username = this.props.username;
        var listView = null;
        const groupCodes = this.state.groupCodes;
        if (groupCodes !== undefined && groupCodes !== null && Object.prototype.toString.call(groupCodes) == '[object Array]') {
            var data = groupCodes;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView =
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}

                    />
                </ScrollView>;
        } else {

            this.fetchData();
        }


        return (
            <View style={{flex: 1}}>

                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    padding: 8,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flexDirection: 'row'
                }, styles.card]}>

                    <TouchableOpacity ref="menu" style={{
                        flex: 1,
                        marginRight: 2,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'flex-end'
                    }}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>

                    <Text style={{fontSize: 22, flex: 3, textAlign: 'center', color: '#fff'}}>
                        {username}
                    </Text>

                    <View style={{flex: 1}}>

                    </View>
                </View>


                <View style={{padding: 10}}>

                    {/*输入条码*/}
                    <View style={[styles.row, {borderBottomWidth: 0}]}>

                        <View style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#ddd',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TextInput
                                style={{
                                    flex: 8,
                                    height: 50,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    paddingTop: 6,
                                    paddingBottom: 6
                                }}
                                onChangeText={(codeNum) => {
                                    if (codeNum.toString().length == 13) {
                                        this.state.goods.codeNum = codeNum;
                                        this.setState({goods: this.state.goods});
                                        this.queryGoodsCode(codeNum.toString());
                                    }
                                    else {
                                        if (codeNum !== undefined && codeNum !== null) {
                                            this.state.goods.codeNum = codeNum;
                                            this.setState({goods: this.state.goods});
                                        }
                                    }

                                }}
                                value={this.state.goods.codeNum}
                                placeholder='请输入商品条码尾数'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />

                            <TouchableOpacity style={{
                                flex: 2,
                                height: 40,
                                marginRight: 10,
                                paddingTop: 6,
                                paddingBottom: 6,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 0,
                                borderRadius: 4,
                                backgroundColor: 'rgba(17, 17, 17, 0.6)'
                            }}
                                              onPress={() => {
                                                  if (this.state.goods.codeNum !== undefined && this.state.goods.codeNum !== null) {
                                                      var codeNum = this.state.goods.codeNum;
                                                      if (codeNum.toString().length >= 1 && codeNum.toString().length <= 13) {
                                                          this.queryGoodsCode(this.state.goods.codeNum.toString());
                                                      }
                                                      else {
                                                          Alert.alert(
                                                              '提示信息',
                                                              '请输入4-13位的商品条码进行查询',
                                                              [
                                                                  {
                                                                      text: 'OK',
                                                                      onPress: () => console.log('OK Pressed!')
                                                                  },
                                                              ]
                                                          )
                                                      }
                                                  }
                                                  else {
                                                      Alert.alert(
                                                          '提示信息',
                                                          '请输入4-13位的商品条码进行查询',
                                                          [
                                                              {text: 'OK', onPress: () => console.log('OK Pressed!')},
                                                          ]
                                                      )
                                                  }
                                              }}>
                                <View>
                                    <Text style={{color: '#fff', fontSize: 12}}>查询</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                flex: 2,
                                height: 40,
                                marginRight: 10,
                                paddingTop: 6,
                                paddingBottom: 6,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 0,
                                borderRadius: 4,
                                backgroundColor: 'rgba(17, 17, 17, 0.6)'
                            }}
                                              onPress={() => {
                                                  this.setState({cameraModalVisible: true})
                                              }}>

                                <View>
                                    <Text style={{color: '#fff', fontSize: 12}}>扫码</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>

                    {/* 彩色横幅 */}
                    <View style={[styles.row, {borderBottomWidth: 0, height: 50, marginTop: 12, marginBottom: 0}]}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            marginRight: .5,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderTopLeftRadius: 4,
                            borderBottomLeftRadius: 4,
                            borderColor: '#ddd'
                        }}>

                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#32b968',
                            justifyContent: 'center',
                            marginRight: .5,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRightWidth: 0,
                            borderLeftWidth: 0,
                            borderColor: '#ddd'
                        }}>

                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#fd871a',
                            justifyContent: 'center',
                            marginRight: .5,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRightWidth: 0,
                            borderLeftWidth: 0,
                            borderColor: '#ddd'
                        }}>

                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#ec0909',
                            justifyContent: 'center',
                            marginRight: .5,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderTopRightRadius: 4,
                            borderBottomRightRadius: 4,
                            borderColor: '#ddd'
                        }}>

                        </View>
                    </View>

                </View>

                {/* 商品条码列表 */}
                <View>
                    <ScrollView>
                        <View style={{
                            height: 40,
                            flexDirection: 'row',
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: '#ddd',
                            borderWidth: 1,
                            justifyContent: 'flex-start',
                            backgroundColor: '#fff'
                        }}>
                            <Text style={{flex: 1, fontSize: 15, color: '#343434'}}>组编号</Text>
                            <Text style={{flex: 2, fontSize: 15, color: '#343434'}}>组名称</Text>
                        </View>
                        <View style={{flex: 1}}>
                            {listView}
                        </View>
                    </ScrollView>
                </View>

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
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(PriceSurvey);

