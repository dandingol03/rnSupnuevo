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
var Proxy = require('../../proxy/Proxy');
var Popover = require('react-native-popover');

class Stock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            state: 0,
            start: 0,
            limit: 4,
            arrlong: 0,
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
        //this.showpopupDialog = this.showpopupDialog.bind(this);

    }

    showpopupDialog() {
        this.popupDialog.show();
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
        Proxy.post({
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
        }, (json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var infoList = json.data;
                var arrlong = json.data.length;
                this.setState({infoList: infoList});
                this.setState({arrlong: arrlong});
            }
        })
    }

    fetchData_Province() {
        // var sessionId = this.props.sessionId;
        Proxy.post({
            url: Config.server + "/func/merchant/getSupnuevoProvinceListMobile",
            headers: {
                'Content-Type': 'application/json',
                // 'Cookie': sessionId
            },
            body: {}
        }, (json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var provinceList = json.data;
                this.setState({provinceList: provinceList});
                //this.state.provinceList = provinceList;
            }
        }, (err) => {
            alert(err);
        });
    }

    fetchData_City() {
        var provinceId = this.state.provinceId;
        Proxy.post({
            url: Config.server + "/func/merchant/getSupnuevoCityListMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                provinceId: provinceId
            }
        }, (json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var cityList = json.data;
                this.setState({cityList: cityList});
            }
        }, (err) => {
            alert(err);
        });
    }

    fetchData_Zhonglei() {
        var zhongleiList = this.state.zhongleiList;
        Proxy.post({
            url: Config.server + "/func/merchant/getSupnuevoCommodityRubroList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {}
        }, (json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                zhongleiList = json.data;
                this.setState({zhongleiList: zhongleiList});
            }
        }, (err) => {
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
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>如果是商品，标注价格</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    renderRow_Province(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    this.setState({provinceId: rowData.value, province: rowData.label})
                }}>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text>{rowData.label}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    renderRow_City(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() => this.setState({city: rowData.label})}>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 3}}>{rowData.label}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    renderRow_zhonglei(rowData) {
        var row =
            <View>
                <TouchableOpacity onPress={() =>  this.setState({shangpinzhonglei: rowData.label})}>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 3}}>{rowData.label}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    closePopover() {
        this.setState({menuVisible: false});
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    /*
     searchInfo(){
     var sInfo=
     }
     */

    renderModal() {
        if (this.state.modalDropdown) {
        }
    }

    componentDidMount() {
    }

    /*    _toEnd() {
     const { reducer } = this.props;
     //ListView滚动到底部，根据是否正在加载更多 是否正在刷新 是否已加载全部来判断是否执行加载更多
     if (reducer.isLoadingMore || reducer.products.length >= reducer.totalProductCount || reducer.isRefreshing) {
     return;
     }
     InteractionManager.runAfterInteractions(() => {
     console.log("触发加载更多 toEnd() --> ");
     this._loadMoreData();
     });
     }

     _loadMoreData() {
     this.state.start = this.state.limit + 1;
     this.fetchData();
     }

     _renderFooter() {
     //通过当前product数量和刷新状态（是否正在下拉刷新）来判断footer的显示
     if (reducer.products.length < 1 || reducer.isRefreshing) {
     return null
     }
     ;
     if (reducer.products.length < reducer.totalProductCount) {
     //还有更多，默认显示‘正在加载更多...’
     return <LoadMoreFooter />
     } else {
     // 加载全部
     return <LoadMoreFooter isLoadAll={true}/>
     }
     }*/

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
                    /*onEndReached={ this._toEnd.bind(this) }
                    onEndReachedThreshold={10}*/
                    // renderFooter={ this._renderFooter.bind(this) }
                    //enableEmptySections={true}
                    />
        } else {
            this.state.infoList = [];
            this.fetchData();
        }

        var zhongleiList = this.state.zhongleiList;
        if (zhongleiList === null)
            this.fetchData_Zhonglei();

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
                    <Text style={{fontSize: 22, flex: 3, textAlign: 'center', color: '#fff'}}>
                        {this.props.username}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            margin: 10,
                            borderWidth: 1,
                            borderColor: '#343434'
                        }}>
                            <TextInput
                                style={{
                                    flex: 3,
                                    height: 40,
                                    marginLeft: 10,
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
                        flex: 0.6,
                        borderBottomWidth: 1,
                        borderColor: '#ddd',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 16}}>市场上所有供应商列表</Text>
                    </View>
                    <View style={{flex: 5, borderBottomWidth: 1, borderColor: '#ddd'}}>
                        <ScrollView>
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
                            <TextInput style={{flex: 8, height: 40, marginLeft: 10}}
                                       placeholder="商品种类"
                                       onChangeText={(zhonglei) => {
                                           if (zhonglei !== null) {
                                               this.state.shangpinzhonglei = zhonglei;
                                           }
                                       }}
                                       value={this.state.shangpinzhonglei}
                                />
                            <TouchableOpacity style={{
                                flex: 1, paddingRight: 10, backgroundColor: 'transparent', borderLeftWidth: 1,
                                borderLeftColor: '#ddd',
                            }}>
                                <ModalDropdown options={zhongleiList}
                                               style={{
                                               flex: 1,
                                               paddingRight: 10,
                                               backgroundColor: 'transparent',
                                               borderLeftWidth: 1,
                                               borderLeftColor: '#ddd',
                                           }}
                                               dropdownStyle={{
                                               width: 200,
                                               borderWidth: 3,
                                               paddingLeft: 5,
                                               borderColor: '#20C3DD'
                                           }}
                                               renderRow={this.renderRow_zhonglei.bind(this)}>
                                    <Icon1 name="triangle-down" color="blue" size={40}/>
                                </ModalDropdown>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 40, marginLeft: 10}}
                                       placeholder="省"
                                       onChangeText={(province) => {
                                           if (province !== null) {
                                               this.state.province = province;
                                           }
                                       }}
                                       value={this.state.province}
                                />
                            <ModalDropdown options={provinceList}
                                           style={{
                                               flex: 1,
                                               paddingRight: 10,
                                               backgroundColor: 'transparent',
                                               borderLeftWidth: 1,
                                               borderLeftColor: '#ddd',
                                           }}
                                           dropdownStyle={{
                                               width: 200,
                                               borderWidth: 3,
                                               paddingLeft: 5,
                                               borderColor: '#20C3DD'
                                           }}
                                           renderRow={this.renderRow_Province.bind(this)}>
                                <Icon1 name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 40, marginLeft: 10}}
                                       placeholder="市"
                                       onChangeText={(city) => {
                                           if (city !== null) {
                                               this.state.city = city;
                                           }
                                       }}
                                       value={this.state.city}
                                />
                            <ModalDropdown options={cityList}
                                           style={{
                                               flex: 1,
                                               paddingRight: 10,
                                               backgroundColor: 'transparent',
                                               borderLeftWidth: 1,
                                               borderLeftColor: '#ddd',
                                           }}
                                           dropdownStyle={{
                                               width: 150,
                                               borderWidth: 3,
                                               paddingLeft: 5,
                                               borderColor: '#20C3DD'
                                           }}
                                           onDropdownWillShow={this.state.showDropdown}
                                           renderRow={this.renderRow_City.bind(this)}>
                                <Icon1 name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 4, height: 40, marginLeft: 10}}
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
                                flex: 1,
                                backgroundColor: 'white',
                                borderRadius: 4,
                                marginLeft: 120,
                                marginRight: 120,
                                marginBottom: 10,
                                marginTop: 15
                            }} onPress={() => {}
                            }>
                                <View style={{paddingTop: 18, alignItems: 'center'}}>
                                    <Text style={{fontSize: 20}}>确定</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </PopupDialog>
                <Popover
                    isVisible={this.state.menuVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={displayArea}
                    onClose={() => {
                        this.closePopover();

                    }}>
                    <TouchableOpacity
                        style={{borderBottomWidth: 1, borderBottomColor: '#ddd'}}
                        onPress={() => {
                            this.closePopover();
                        }}>
                        <Text style={[styles.popoverText, {color: '#444'}]}>1</Text>
                    </TouchableOpacity>
                </Popover>
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
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        commodityClassList: state.sale.commodityClassList,
        weightService: state.sale.weightService,
        sessionId: state.user.sessionId,
    })
)(Stock);

