import React, {Component} from 'react';

import {
    NetInfo,
    ListView,
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

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import CommodityClass from './CommodityClass';
import Camera from 'react-native-camera';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import CodesModal from '../../components/modal/CodesModal';

var Proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import index from "../../reducers/index";

class Sale extends Component {


    codeQuery(codeNum) {
        var sessionId = this.props.sessionId;
        Proxy.postes({
            url: Config.server + '/func/sale/gerCommodityInfoByCodigoMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            //body: "codigo=" + codeNum + "&merchantId=" + merchantId
            body: {
                codigo: codeNum,
            }
        }).then((json) => {
            console.log('扫码返回成功');
            var errMessage = json.errMessage;
            if (errMessage !== null && errMessage !== undefined && errMessage !== "") {
                alert(errMessage);
            } else if (json.price === null) {
                alert("该商品暂时缺少价格");
            }
            else {
                var commodity = {codigo: json.codigo, nombre: json.nombre, price: json.price + ""};
                var commodityList = this.state.commodityList;
                var i=0;
                var f=0;
                for(i=0;i<commodityList.length;i++){
                    if(commodity.codigo===commodityList[i].codigo){
                        f=1;
                        commodityList[i].goodsCount++;
                        commodityList[i].sum=commodityList[i].goodsCount*commodityList[i].price;
                    }
                }
                if(i===commodityList.length&&f===0){
                    commodity.goodsCount = 1;
                    commodity.sum = json.price;
                    commodityList.push(commodity);
                }
                //commodity.goodsCount = 1;
                //commodity.sum = json.price;
                /*var a=typeof (commodity.sum);
                console.log(a+'2');*/
               // commodityList.push(commodity);
                /*var sum = 0;
                commodityList.map((commodity) => {
                    sum = sum + commodity.price * commodity.goodsCount;
                });*/
                this.setState({commodityList: commodityList});
            }
        }).catch((err) => {
            alert(err);
        });
    }//扫码查询

    queryGoodsCode(codeNum) {//查询按钮
        Proxy.postes({
            url: Config.server + '/func/sale/getSupnuevoBuyerPriceCommodityListByLastFourCodigoMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                codigo: codeNum,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                if (json.array.length === 1) {
                    var code = {codigo: json.array[0].codigo, commodityId: json.array[0].commodityId}
                    this.onCodigoSelect(code);
                }
                else {
                    var codes = json.array;
                    this.setState({codes: codes, codesModalVisible: true});
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    onCodigoSelect(code) {
        this.codeQuery(code.codigo);
    }

    codeMatch(codeNum) {
        var weightService = this.props.weightService;

        var str = codeNum.substr(0, 3);

        var price = parseInt(codeNum.substring(6, 12)) / 100;
        var commodity = {codigo: codeNum, nombre: weightService[str], price: price};
        var commodityList = this.state.commodityList;
        commodity.goodsCount = 1;
        commodity.sum = price;
        commodityList.push(commodity);
        /*var sum = 0;
        commodityList.map((commodity) => {
            sum = sum + commodity.price * commodity.goodsCount;
        });*/

        this.setState({commodityList: commodityList});
    }

    codeClass(commodity) {
        commodity.price = this.state.price;
        this.state.usertextinput = 0;
        var commodityList = this.state.commodityList;
        commodity.goodsCount = 1;
        commodity.sum = commodity.goodsCount * commodity.price;
        commodityList.push(commodity);

        this.setState({commodityList: commodityList});
    }

    fenlei() {
        var userinput = this.state.usertextinput;
        if (userinput === null || userinput === 0 || userinput === "") {
            alert("请您先输入价格");
        }
        else {
            this.state.price = userinput;
            this.state.usertextinput = null;
            this.navigateCommodityClass();
        }
    }

    closeCodesModal(val) {
        this.setState({codesModalVisible: val});
    }

    chaxun() {
        var userinput = this.state.usertextinput;
        if (userinput === null || userinput === 0 || userinput === "" || userinput.length < 4 || userinput.length > 13) {
            alert("请您先输入正确条码");
        }
        else {
            this.state.usertextinput = null;
            this.queryGoodsCode(userinput);
        }
    }

    navigateCommodityClass() {


        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CommodityClass',
                component: CommodityClass,
                params: {
                    codeClass: this.codeClass.bind(this)
                }
            })
        }
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    checkOut() {
        var a = typeof (this.state.commodityList[0].price);
        console.log(a + '1');
        Proxy.postes({
            url: Config.server + '/func/sale/saveCommoditySaleMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            //body: "codigo=" + codeNum + "&merchantId=" + merchantId
            body: {
                commodityList: this.state.commodityList,
            }
        }).then((json) => {
            var errMessage = json.errMessage;
            if (errMessage !== null && errMessage !== undefined && errMessage !== "") {
                alert(errMessage);

            } else {
                var commodityList = [];
                this.setState({commodityList: commodityList});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    renderRow(rowData, sectionId, rowId) {
        var goodsCount = rowData.goodsCount;
        var sum = this.state.commodityList[rowId].sum;
        //var sum = goodsCount * rowData.price;
        this.state.total[rowId] = sum;
        var sum_1 = 0;
        var total = this.state.total;
        if (total.length > 0) {
            for (var i = 0; i < total.length; i++) {
                sum_1 += total[i];
            }
        }
        this.state.total_1 = sum_1;

        var row = (
                <View style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    marginTop: 5,
                    marginBottom: 5,
                    borderBottomWidth: 1,
                    borderColor: '#eee',
                    padding: 5
                }}>

                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <Text> {rowData.goodsCount} * </Text>
                            <Text> {rowData.price}</Text>
                        </View>
                        <View style={{flex: 3}}>
                            <Text>{rowData.codigo}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{flex: 4}}>
                            <Text>{rowData.nombre}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text>{sum}</Text>
                        </View>
                    </View>
                </View>
        );

        return row;
    }

    constructor(props) {
        super(props);
        this.state = {

            total: [],//每一行的sum数组
            total_1: 0,//最后显示的total总数
            total_2: 0,
            codeNum: null,
            commodityList: [],
            codes: [],
            commodity: null,
            cameraModalVisible: false,
            usertextinput: null,
            price: 0,
            codesModalVisible: false,
            text: null,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
        }
    }

    goodcountsadd(rowId) {
        var commodityList = this.state.commodityList;
        var i = 0;
        var k = 0;
        // alert(rowId.s10.swipeInitialX);
        commodityList[rowId].goodsCount += 1;
        commodityList[rowId].sum = commodityList[rowId].goodsCount * commodityList[rowId].price;
        commodityList[rowId].sum += "";
        i = commodityList[rowId].sum.indexOf(".");
        if (i != -1) {
            // alert(i);
            k = commodityList[rowId].sum.substring(i + 2, i + 3) * 1;
            if (k === 9) {
                commodityList[rowId].sum = commodityList[rowId].sum * 1;
                commodityList[rowId].sum += 0.001;
                commodityList[rowId].sum += "";
            }
            commodityList[rowId].sum = commodityList[rowId].sum.substring(0, i + 2);
        }
        commodityList[rowId].sum = commodityList[rowId].sum * 1;
        this.setState({commodityList: commodityList});
    }

    goodcountsjian(rowId) {
        var commodityList = this.state.commodityList;
        var i = 0;
        var k = 0;
        commodityList[rowId].goodsCount -= 1;
        commodityList[rowId].sum = commodityList[rowId].goodsCount * commodityList[rowId].price;
        if (commodityList[rowId].goodsCount === 0) {
            commodityList.splice(rowId, 1);
        }
        else {
            commodityList[rowId].sum += "";
            i = commodityList[rowId].sum.indexOf(".");
            if (i != -1) {
                // alert(i);
                k = commodityList[rowId].sum.substring(i + 2, i + 3) * 1;
                if (k === 9) {
                    commodityList[rowId].sum = commodityList[rowId].sum * 1;
                    commodityList[rowId].sum += 0.001;
                    commodityList[rowId].sum += "";
                }
                commodityList[rowId].sum = commodityList[rowId].sum.substring(0, i + 2);
            }
            commodityList[rowId].sum = commodityList[rowId].sum * 1;
        }
        this.setState({commodityList: commodityList});
    }

    total() {
        var total = 0;
        var i=0;
        var commdiList = this.state.commodityList;
        for (var value of commdiList) {
            total += value.sum;
        }
        total+="";
        i = total.indexOf(".");
        if (i != -1) {
            // alert(i);
            k = total.substring(i + 2, i + 3) * 1;
            if (k === 9) {
                total = total * 1;
                total += 0.001;
                total += "";
            }
            total = total.substring(0, i + 2);
        }
        total=total*1;
        return total;
    }

    onRowDidClose(secId, rowId,rows,translateX) {
        var obj=Object.entries(rows);
        var obj_1=obj[rowId];
        var Swiperow=obj_1[1];
        //alert(Swiperow._translateX._value);
        if(Swiperow._translateX._value>0){
            this.goodcountsadd(rowId);
        }
        else if(Swiperow._translateX._value<0){
            this.goodcountsjian(rowId);
        }
    }

    render() {

        var commodityListView = null;
        var commodityList = this.state.commodityList;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        if (commodityList !== undefined && commodityList !== null && commodityList.length > 0) {
            commodityListView = (
                <SwipeListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(commodityList)}
                    renderRow={this.renderRow.bind(this)}
                    swipeToOpenPercent={100}
                    renderHiddenRow={(data, secId, rowId, rowMap) => (
                        <View style={styles.rowBack}>
                            <TouchableOpacity onPress={() => {
                                this.goodcountsadd(rowId)
                            }}><Text>数量+1</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.goodcountsjian(rowId)
                            }}><Text>数量-1</Text></TouchableOpacity>
                        </View>
                    )}
                    onRowOpen={this.onRowDidClose.bind(this)}
                    leftOpenValue={0.5}
                    rightOpenValue={-0.5}
                />
            );
        }
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
                    <Text style={{fontSize: 20, flex: 3, textAlign: 'center', color: '#fff'}}>
                        Supnuevo(4.0)-{this.props.username}
                    </Text>
                </View>

                {/* body */}
                <View style={{flex: 1}}>
                    <View style={{
                        flexDirection: 'row', flex: 1, justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TextInput
                            style={{
                                flex: 2,
                                borderWidth: 1,
                                padding: 10,
                                marginTop: 10,
                                marginLeft: 6,
                                height: 40,
                                alignItems: 'center'
                            }}
                            onFocus={() => this.setState({usertextinput: ''})}
                            value={this.state.usertextinput}
                            onChangeText={(usertextinput) => {
                                this.setState({usertextinput: usertextinput})
                            }}
                            placeholder='条码尾数或价格'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                            keyboardType="numeric"
                            //clearTextOnFocus="true"//only ios
                        />

                        <TouchableOpacity style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginLeft: 10,
                            marginTop: 10,
                            marginRight: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#CAE1FF'
                        }} onPress={() => {
                            this.chaxun()
                        }}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#343434', fontSize: 15}}>查询</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginLeft: 3,
                            marginTop: 10,
                            marginRight: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#CAE1FF'
                        }} onPress={() => {
                            this.fenlei()
                        }}>
                            <View style={{padding: 10}}>
                                <Text style={{color: '#343434', fontSize: 15}}>分类</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* ListView */}
                    <View style={{flexDirection: 'row', flex: 8, padding: 2}}>
                        {commodityListView}
                    </View>

                    <View style={{flexDirection: 'row', flex: 1, bottom: 13}}>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                            <TouchableOpacity style={{
                                flex: 1,
                                flexDirection: 'row',
                                margin: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 4,
                                backgroundColor: '#CAE1FF'
                            }}
                                              onPress={() => {
                                                  this.checkOut();
                                              }}>
                                <View style={{padding: 10}}>
                                    <Text style={{color: '#343434', fontSize: 15}}>结账</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                flex: 1,
                                flexDirection: 'row',
                                margin: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 4,
                                backgroundColor: '#CAE1FF'
                            }}
                                              onPress={() => {
                                                  this.setState({cameraModalVisible: true})
                                                  //this.codeQuery('2100010132257 ');
                                                  //this.codeMatch('2100010132257 ');
                                              }}>
                                <View style={{padding: 10}}>
                                    <Text style={{color: '#343434', fontSize: 15}}>扫码</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{
                                flex: 2,
                                flexDirection: 'row',
                                marginLeft: 15,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{flex: 1, color: '#343434', fontSize: 15,}}>TOTAL:</Text>
                                <Text style={{flex: 1, margin: 15, justifyContent: 'center', alignItems: 'center'}}>
                                    {this.total()}
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.codesModalVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}>

                    <CodesModal
                        onClose={() => {
                            this.closeCodesModal(!this.state.codesModalVisible)
                        }}
                        onCodigoSelect={
                            (code) => {
                                this.onCodigoSelect(code);
                            }}
                        codes={this.state.codes}
                    />
                </Modal>

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

                                this.state.codeNum = data;

                                var str = this.state.codeNum.substring(0, 3);
                                if (str !== 200 && str !== 210 && str !== 220 && str !== 230) {
                                    this.codeQuery(this.state.codeNum);
                                }
                                else {
                                    this.codeMatch(this.state.codeNum);
                                }

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
        );
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
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        commodityClassList: state.sale.commodityClassList,
        weightService: state.sale.weightService,
        sessionId: state.user.sessionId,
    })
)(Sale);
