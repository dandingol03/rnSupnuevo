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
    ListView,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    RefreshControl,
    } from 'react-native';
import Config from '../../../config';
import {connect} from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import AllCompany from './AllCompany';
import MyConcernOffer from './MyConcernOffer';
import MyOffer from './MyOffer';
import PopupDialog from 'react-native-popup-dialog';
import Camera from 'react-native-camera';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../proxy/Proxy');
var Popover = require('react-native-popover');
const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];
class Stock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            state: 0,
            start: 0,
            limit: 4,
            arrlong: 0,
            firststate: 0,
            companyinfo: null,
            dialogShow: false,
            infoList: null,
            merchantId: 0,
            modalDropdown: false,
            shangpinzhonglei: null,
            zhongleiList: null,
            provinceList: null,
            provinceId: null,
            provinceId2: null,
            cityList: null,
            province: null,
            city: null,
            menuVisible: false,
            showDropdown: false,
            isLoadingTail: false,
            isRefreshing: false,
            isNoMoreData: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            }),
            cameraModalVisible: false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
        };
        this.showpopupDialog = this.showpopupDialog.bind(this);

    }

    showpopupDialog() {
        this.popupDialog.show();
    }

    dismisspopupDialog() {
        this.popupDialog.dismiss();
    }

    navigateAllCompany(nubre, direccion, rubroDes, nomroDeTelePhono, merchantId) {
        const {navigator} = this.props;
        var nubre = nubre;
        var direccion = direccion;
        var rubroDes = rubroDes;
        var nomroDeTelePhono = nomroDeTelePhono;
        var merchantId = merchantId;
        if (navigator) {
            navigator.push({
                name: 'AllCompany',
                component: AllCompany,
                params: {
                    nubre: nubre,
                    direccion: direccion,
                    rubroDes: rubroDes,
                    nomroDeTelePhono: nomroDeTelePhono,
                    merchantId: merchantId,
                }
            })
        }
    }

    navigateMyOffer() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'MyOffer',
                component: MyOffer,
                params: {}
            })
        }
    }

    navigateMyConcernOffer() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'MyConcernOffer',
                component: MyConcernOffer,
                params: {}
            })
        }
    }

    fetchData() {
        //var sessionId = this.props.sessionId;
        var start = this.state.start;
        var state = this.state.state;
        var limit = this.state.limit;
        proxy.postes({
            url: Config.server + "/func/merchant/getSupnuevoMerchantInfoListOfBuyerMobile",
            headers: {
                'Content-Type': 'application/json',
                // 'Cookie': sessionId
            },
            body: {
                start: start,
                state: state,
                limit: limit,
            }
        }).then((json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var infoList = this.state.infoList;
                infoList = infoList.concat(json.data);
                var arrlong = json.data.length;
                this.setState({infoList: infoList});
                this.setState({arrlong: arrlong});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    fetchData_Province() {
        // var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + "/func/merchant/getSupnuevoProvinceListMobile",
            headers: {
                'Content-Type': 'application/json',
                // 'Cookie': sessionId
            },
            body: {}
        }).then((json)=> {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var provinceList = json.data;
                this.setState({provinceList: provinceList});
                //this.state.provinceList = provinceList;
            }
        }).catch((err) => {
            alert(err);
        });
    }

    fetchData_City() {
        var provinceId = this.state.provinceId;
        proxy.postes({
            url: Config.server + "/func/merchant/getSupnuevoCityListMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                provinceId: provinceId
            }
        }).then((json)=> {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var cityList = json.data;
                this.setState({cityList: cityList});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    fetchData_Zhonglei() {
        var zhongleiList = this.state.zhongleiList;
        proxy.postes({
            url: Config.server + "/func/merchant/getSupnuevoCommodityRubroList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {}
        }).then((json)=> {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                zhongleiList = json.data;
                this.setState({zhongleiList: zhongleiList});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    renderRow(rowData) {
        this.state.merchantId = rowData.merchantId;
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.navigateAllCompany(rowData.nubre, rowData.direccion, rowData.rubroDes, rowData.nomroDeTelePhono, rowData.merchantId)
                }}>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>公司名称</Text>
                            <Text style={{flex: 3}}>{rowData.nubre}</Text>
                        </View>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>公司地址</Text>
                            <Text style={{flex: 3}}>{rowData.direccion}</Text>
                        </View>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>公司营业范围</Text>
                            <Text style={{flex: 3}}>{rowData.rubroDes}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    renderRow_Province(rowData) {
        var row =
            <TouchableOpacity>
                <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text>{rowData.label}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    }

    renderRow_City(rowData) {
        var row =
            <TouchableOpacity>
                <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={{flex: 3}}>{rowData.label}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    }

    resetzhonglei(idx, value) {
        this.setState({shangpinzhonglei: value.label})
    }

    resetprovince(idx, value) {
        this.setState({province: value.label, provinceId: value.value})
    }

    resetcity(idx, value) {
        this.setState({city: value.label})
    }

    renderRow_zhonglei(rowData) {
        var row =
            <TouchableOpacity>
                <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={{flex: 3}}>{rowData.label}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    }

    closePopover() {
        this.setState({menuVisible: false});
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        // console.log(this);
        setTimeout(()=> {
            this.setState({
                isRefreshing: false,
                start: 0,
                infoList: null
            });
        }, 100);
    }

    _endReached() {
        this.state.start += this.state.arrlong;
        if (this.state.arrlong === this.state.limit)
            this.fetchData();
    }

    hide() {
        this.setState({
            showDropdown: false
        });
    }

    surequary() {
        this.dismisspopupDialog();
        var shangpinzhonglei = this.state.shangpinzhonglei;
        var province = this.state.province;
        var city = this.state.city;
        var companyinfo = null;
        if (shangpinzhonglei !== null)
            companyinfo = shangpinzhonglei + ';';
        if (province !== null)
            companyinfo += province + ';';
        if (city !== null)
            companyinfo += city;
        //companyinfo = shangpinzhonglei + ' ; ' + province + ' ; ' + city;
        if (companyinfo !== null)
            this.setState({companyinfo: companyinfo});
    }

    render() {
        var displayArea = {x: 5, y: 20, width: width, height: height - 25};
        var listView = null;
        const infoList = this.state.infoList;
        if (infoList !== undefined && infoList !== null) {
            var data = infoList;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(data)}
                    renderRow={this.renderRow.bind(this)}
                    onEndReached={this._endReached.bind(this)}
                    onEndReachedThreshold={400}
                    />
        } else {
            this.state.infoList = [];
            this.fetchData(0);
        }

        var zhongleiList = this.state.zhongleiList;
        if (zhongleiList === null)
            this.fetchData_Zhonglei();
        //console.log(this.state.shangpinzhonglei);
        var provinceList = this.state.provinceList;
        if (provinceList === null)
            this.fetchData_Province();
        var cityList = this.state.cityList;
        var state = 0;
        if (this.state.provinceId2 !== this.state.provinceId)
            state = 1;
        var provinceId = null;
        provinceId = this.state.provinceId;
        if ((provinceId !== null && cityList === null) || state === 1) {
            this.fetchData_City();
            this.state.provinceId2 = provinceId;
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
                {/*nei rong*/}
                <View style={{flex: 1}}>
                    <View style={{
                        flex: 1,
                        height:50,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            flex: 5,
                            height:40,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            margin: 10,
                            borderWidth: 1,
                            borderColor: '#343434'
                        }}>
                            <TextInput
                                style={{
                                    flex: 5,
                                    height: 40,
                                    marginLeft: 5,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    fontSize: 16,
                                }}
                                onChangeText={(companyinfo) => {
                                    this.setState({companyinfo: companyinfo});
                                }}
                                value={this.state.companyinfo}
                                placeholder="搜索"
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                                />
                            <TouchableOpacity style={{
                                flex: 1,
                                marginRight: 2,
                                paddingRight: 5,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                            }}
                                              onPress={() => {
                                                  this.showpopupDialog();
                                                  //this.fetchData_Province();
                                                  //this.fetchData_Zhonglei();
                                              }}>
                                <Icon name="chevron-circle-down" color="#343434" size={25}></Icon>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{flex: 1, backgroundColor: '#CAE1FF', marginRight: 10, borderRadius: 4}}
                            >
                            <View style={{padding: 10, alignItems: 'center'}}>
                                <Text style={{fontSize: 16}}>查询</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 0.5,
                        borderBottomWidth: 1,
                        borderColor: '#ddd',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 16}}>市场上所有供应商列表</Text>
                    </View>
                    <View style={{flex: 5, borderBottomWidth: 1, borderColor: '#ddd'}}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    //onRefresh={this._onRefresh()}
                                    onRefresh={this._onRefresh.bind(this)}
                                    tintColor="black"
                                    title="Loading"
                                    titleColor="black"
                                    progressBackgroundColor="white"
                                 />
                             }>
                            {listView}
                        </ScrollView>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
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
                            this.navigateMyOffer()
                        }}>
                            <Text style={{fontSize: 16}}>我的供应商</Text>
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
                        }}
                                          onPress={() => {
                            this.navigateMyConcernOffer()
                        }}>
                            <Text style={{fontSize: 16}}>我关注</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}>
                    <View style={{flex: 1, backgroundColor: '#CAE1FF'}}>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10}}
                                       placeholder="商品种类"
                                       onChangeText={(zhonglei) => {
                                           if (zhonglei !== null) {
                                               this.state.shangpinzhonglei = zhonglei;
                                           }
                                       }}
                                       value={this.state.shangpinzhonglei}
                                       underlineColorAndroid="transparent"
                                />
                            <ModalDropdown style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           options={this.state.zhongleiList}
                                           renderRow={this.renderRow_zhonglei.bind(this)}
                                           onSelect={(idx, value) => this.resetzhonglei(idx, value)}>
                                <Icon1 name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10}}
                                       placeholder="省"
                                       onChangeText={(province) => {
                                           if (province !== null) {
                                               this.state.province = province;
                                           }
                                       }}
                                       value={this.state.province}
                                       underlineColorAndroid="transparent"
                                />
                            <ModalDropdown options={this.state.provinceList}
                                           style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           onSelect={(idx, value) => this.resetprovince(idx, value)}
                                           renderRow={this.renderRow_Province.bind(this)}>
                                <Icon1 name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10}}
                                       placeholder="市"
                                       onChangeText={(city) => {
                                           if (city !== null) {
                                               this.state.city = city;
                                           }
                                       }}
                                       value={this.state.city}
                                       underlineColorAndroid="transparent"
                                />
                            <ModalDropdown options={cityList}
                                           style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           onDropdownWillShow={this.state.showDropdown}
                                           onSelect={(idx, value) => this.resetcity(idx, value)}
                                           renderRow={this.renderRow_City.bind(this)}>
                                <Icon1 name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 4,height:50, marginLeft: 10}}
                                       underlineColorAndroid="transparent"
                                       placeholder="条码尾数"
                                />
                            <TouchableOpacity style={{
                                flex: 1, backgroundColor: 'transparent', borderLeftWidth: 1,
                                borderLeftColor: '#ddd',
                            }} onPress={() => {
                                this.setState({cameraModalVisible: true})
                            }}>
                                <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 10}}>
                                    <Text style={{fontSize: 16}}>扫码</Text></View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 2}}>
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                backgroundColor: 'white',
                                borderRadius: 4,
                                marginLeft: 120,
                                marginRight: 120,
                                marginBottom: 10,
                                marginTop: 15
                            }} onPress={() => {this.surequary()}
                            }>
                                <View style={{flexDirection:'row',justifyContent: 'center',alignItems: 'center'}}>
                                    <Text style={{fontSize: 20}}>确定</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </PopupDialog>

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
                                console.log('barcode data=' + data + 'barcode type=' + type);
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
    table: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#343434',
        //marginBottom: 10,
        marginRight: 10,
        marginTop: 15,
        marginLeft: 10,
        backgroundColor: 'white',
        flexDirection: 'row'
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
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    dropdown: {
        flex: 1,
        paddingRight: 10,
        backgroundColor: 'transparent',
        borderLeftWidth: 1,
        borderLeftColor: '#ddd',
    },
    dropdown_dropdownTextStyle: {
        width: 200,
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: '#20C3DD'
    },
    dropdown_3_dropdownTextHighlightStyle: {
        backgroundColor: '#fff',
        color: '#000'
    },
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        commodityClassList: state.sale.commodityClassList,
        weightService: state.sale.weightService,
        sessionId: state.user.sessionId,
    })
)(Stock);