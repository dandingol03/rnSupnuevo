import React, {Component} from 'react';

import  {
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
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';
import Modalbox from 'react-native-modalbox';
import _ from 'lodash';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
import Config from '../../config';
import CodesModal from '../components/modal/CodesModal';


class GroupInfoManage extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }


    toggleAll() {
        if (this.state.relatedGoods !== undefined && this.state.relatedGoods !== null) {
            var relatedGoods = _.cloneDeep(this.state.relatedGoods);
            if (this.state.selectAll != true) {
                relatedGoods.map(function (good, i) {
                    good.checked = true;
                });
            } else {
                relatedGoods.map(function (good, i) {
                    good.checked = false;
                });
            }
            var dataSource = this.state.dataSource.cloneWithRows(relatedGoods);
            this.setState({
                relatedGoods: relatedGoods,
                selectAll: !this.state.selectAll,
                dataSource: dataSource
            });
        }
    }


    closeCodesModal(val) {
        this.setState({codesModalVisible: val});
    }


    renderRow(rowData, sectionId, rowId) {

        var lineStyle = null;
        if (parseInt(rowId) % 2 == 0) {
            lineStyle = {
                flex: 1,
                flexDirection: 'row',
                padding: 8,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#ddd',
                justifyContent: 'flex-start',
                backgroundColor: '#C4D9FF'
            };
        } else {
            lineStyle = {
                flex: 1,
                flexDirection: 'row',
                padding: 8,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#ddd',
                justifyContent: 'flex-start',
                backgroundColor: '#fff'
            }
        }

        if (rowData.codigo == this.state.code.codigo)
            lineStyle = Object.assign(lineStyle, {
                borderColor: '#284bff',
                borderWidth: 2,
                borderBottomWidth: 2,
                borderLeftWidth: 2,
                borderRightWidth: 2
            });

        var row =
            <View>
                <View>
                    <View style={lineStyle}>

                        <View style={{
                            flex: 5,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: 8
                        }}>
                            <Text style={{color: '#222', fontWeight: 'bold'}}>{rowData.codigo}</Text>
                        </View>

                        <View style={{
                            flex: 5,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: 8
                        }}>
                            <Text style={{color: '#222', fontWeight: 'bold'}}>{rowData.goodName}</Text>
                        </View>

                        <TouchableOpacity style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8
                        }}
                                          onPress={() => {
                                              this.removeCommodity(rowData.commodityId);
                                          }}>
                            <Icon name='remove' color="#ef473a" size={30}></Icon>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>;

        return row;
    }

    changePriceRelated() {
        var selectedRelativePriceIds = [];
        var relatedGoods = this.state.relatedGoods;
        relatedGoods.map(function (good, i) {
            if (good.checked == true) {
                selectedRelativePriceIds.push(good.priceId);
            }
        });
        const {goodInfo} = this.props;
        const {merchantId} = this.props;
        //TODO:make a fetch
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/updateSupnuevoBuyerCommodityPriceGroupMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            //body: "priceIds=" + selectedRelativePriceIds.toString() +
            //"&merchantId=" + merchantId+
            //'&priceShow='+goodInfo.priceShow+
            //'&printType='+goodInfo.printType+
            // '&price='+goodInfo.price
            body: {
                priceIds: selectedRelativePriceIds.toString(),
                merchantId: merchantId,
                priceShow: goodInfo.priceShow,
                printType: goodInfo.printType,
                price: goodInfo.price
            }
        }).then((json)=> {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                Alert.alert(
                    'Alert Title',
                    '组改价成功',
                    [
                        {text: 'OK', onPress: () => this.goBack()},
                    ]
                );
            }
        }).catch((err) => {
            alert(err);
        });

    }


    addCommodity() {

        const {groupInfo} = this.props;
        var code = this.state.selectedCodeInfo;
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + "/func/commodity/addSupnuevoCommodityIntoGroupMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            //body: "commodityId=" + code.commodityId + "&groupId=" + groupInfo.groupId
            body: {
                commodityId: code.commodityId,
                groupId: groupInfo.groupId
            }
        }).then((json)=> {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                //TODO:return to previous page
                if (json.groupNum !== undefined && json.groupNum !== null) {
                    Alert.alert(
                        '信息',
                        '商品添加成功',
                        [
                            {text: 'OK', onPress: () => this.setState({selectedCodeInfo: {}})},
                        ]
                    );
                }
            }
        }).catch((err) => {
            alert(err);

        });
    }

    removeCommodity(commodityId) {

        var commodityIds = [commodityId];
        var sessionId = this.props.sessionId;
        const {groupInfo} = this.props;
        proxy.postes({
            url: Config.server + "/func/commodity/removeSupnuevoCommodityFromGroupMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            //body: "commodityIds=" + commodityIds + "&groupId=" + groupInfo.groupId
            body: {
                commodityIds: commodityIds,
                groupId: groupInfo.groupId
            }
        }).then((json)=> {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                //TODO:return to previous page
                if (json.groupNum !== undefined && json.groupNum !== null) {
                    Alert.alert(
                        '信息',
                        '商品删除成功',
                        [
                            {text: 'OK', onPress: () => console.log('...')},
                        ]
                    );
                }
            }
        }).catch((err) => {
            alert(err);

        });
    }

    updateGroupName(groupName) {

    }

    commodityGroupNameUpdate() {
        var groupName = this.state.groupName;
        const {merchantId} = this.props;
        const {groupInfo} = this.props;
        var sessionId = this.props.sessionId;
        if (groupName !== undefined && groupName !== null && groupName != '') {
            proxy.postes({
                url: Config.server + '/func/commodity/saveOrUpdateSupnuevoBuyerCommodityGroupMobile',
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json',
                    //'Cookie': sessionId,
                },
                //body: "groupName=" + groupName + "&groupId="+groupInfo.groupId+ ''+'&supnuevoMerchantId='+merchantId
                body: {
                    groupName: groupName,
                    groupId: groupInfo.groupId,
                    supnuevoMerchantId: merchantId
                }
            }).then((json)=> {
                var errorMsg = json.errorMsg;
                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);
                } else {
                    Alert.alert(
                        '信息',
                        '商品组名修改成功',
                        [
                            {text: 'OK', onPress: () => this.refs.modal3.close()}
                        ]
                    );
                }
            }).catch((err) => {
                alert(err);
            });
        } else {
            Alert.alert(
                '错误',
                '请填写完组名再点击确认',
                [
                    {text: 'OK'}
                ]
            );
        }

    }

    openGroupNameUpdateModal() {
        this.refs.modal3.open();
    }

    onCodigoSelect(code) {

        if (code.codigo == this.state.code.codigo) {
            Alert.alert(
                '错误',
                '您不能选择已在组的商品进行添加',
                [
                    {text: 'OK', onPress: () => console.log('...')},
                ]
            );
        } else {
            this.state.selectedCodeInfo = code;
            this.setState({selectedCodeInfo: this.state.selectedCodeInfo});
        }
    }


    queryGoodsCodigo(codigo) {
        var codigo = parseInt(codigo);
        const {merchantId} = this.props;
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/getSupnuevoCommonCommodityListByLastFourCodigoMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            //body: "codigo=" + codigo + "&merchantId=" + merchantId
            body: {
                codigo: codigo,
                merchantId: merchantId
            }
        }).then((json)=> {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var codes = json.array;
                this.setState({codes: codes, codesModalVisible: true});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    constructor(props) {
        super(props);
        var groupInfo = props.groupInfo;
        var goods = groupInfo.array;
        var code = props.code;
        goods.map(function (good, i) {
            if (good.codigo == code.codigo)
                good.checked = true;
            else
                good.checked = false;
        });
        this.state = {
            merchantId: props.merchantId,
            groupInfo: groupInfo,
            groupName: null,
            goods: goods,
            code: code,
            selectedCodeInfo: {},
            selectAll: false,
            codesModalVisible: false,
            containedInGroup: props.containedInGroup,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            })
        };
    }


    render() {

        var groupInfo = this.state.groupInfo;
        const {code} = this.props;
        const {containedInGroup} = this.props;
        var goods = this.state.goods;

        var listView = null;
        if (goods !== undefined && goods !== null && Object.prototype.toString.call(goods) == '[object Array]') {

            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView =
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(goods)}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>;
        } else {
        }


        return (
            <View style={{flex: 1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{
                        backgroundColor: '#387ef5',
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }, styles.card]}>
                        <TouchableOpacity style={{flex: 1}}
                                          onPress={() => {
                                              this.goBack();
                                          }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                        <Text style={{fontSize: 22, flex: 3, textAlign: 'center', color: '#fff'}}>
                            商品管理
                        </Text>
                        <TouchableOpacity ref="menu" style={{
                            flex: 1,
                            marginRight: 2,
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}
                        >
                        </TouchableOpacity>
                    </View>

                    {/*搜索框*/}
                    <View style={[styles.card, {marginTop: 10, padding: 8}]}>
                        <View style={{
                            flex: 1,
                            padding: 8,
                            paddingLeft: 10,
                            paddingRight: 10,
                            backgroundColor: '#eee',
                            borderRadius: 8
                        }}>

                            {/* 条码 */}
                            <View style={[styles.row, {borderBottomWidth: 0, marginBottom: 8}]}>
                                <View style={{
                                    flex: 2,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 4,
                                    marginLeft: 0
                                }}>
                                    <Text style={{color: '#222'}}>条码</Text>
                                </View>
                                <View style={{
                                    flex: 6,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 4,
                                    marginLeft: 0
                                }}>

                                    <TextInput
                                        style={{
                                            height: 40,
                                            width: width * 2 / 4,
                                            backgroundColor: '#fff',
                                            paddingLeft: 15,
                                            borderRadius: 4,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                        onChangeText={(codigo) => {
                                            this.state.selectedCodeInfo.codigo = codigo;
                                            if (codigo.toString().length == 4) {
                                                this.setState({selectedCodeInfo: this.state.selectedCodeInfo});
                                                this.queryGoodsCodigo(codigo.toString().substring(0, 4));
                                            } else if (codigo.toString().length > 4) {
                                                this.setState({selectedCodeInfo: this.state.selectedCodeInfo});
                                            }
                                            else {
                                                this.setState({selectedCodeInfo: this.state.selectedCodeInfo});
                                            }
                                        }}
                                        value={this.state.selectedCodeInfo.codigo}
                                        placeholder='在此输入条码最后四位'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />

                                </View>

                                <TouchableOpacity style={{
                                    flex: 2,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                    padding: 4
                                }}
                                                  onPress={() => {
                                                      this.addCommodity();
                                                  }}>
                                    <View style={{
                                        backgroundColor: '#00f',
                                        padding: 8,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        borderRadius: 8
                                    }}>
                                        <Text style={{color: '#fff', fontSize: 14}}>添加</Text>
                                    </View>
                                </TouchableOpacity>


                            </View>

                            {/*组特征码*/}
                            <View style={[styles.row, {borderBottomWidth: 0, marginBottom: 8}]}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 4,
                                    marginLeft: 0
                                }}>
                                    <Text style={{color: '#222'}}>组特征码</Text>
                                </View>
                                <View style={{
                                    flex: 4,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 4,
                                    marginLeft: 9
                                }}>
                                    <Text style={{color: '#222'}}>
                                        {groupInfo.groupNum}
                                    </Text>
                                </View>

                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', padding: 4}}>
                                </View>
                            </View>

                            {/*商品组名*/}
                            <View style={[styles.row, {borderBottomWidth: 0}]}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 4,
                                    marginLeft: 0
                                }}>
                                    <Text style={{color: '#222'}}>商品组名</Text>
                                </View>
                                <View style={{
                                    flex: 3,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 4,
                                    marginLeft: 2
                                }}>
                                    <Text style={{color: '#222'}}>
                                        {groupInfo.groupName}
                                    </Text>
                                </View>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 4,
                                    borderRadius: 8,
                                    height: 30,
                                    paddingLeft: 12,
                                    paddingRight: 12,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    justifyContent: 'center'
                                }}>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View style={{padding: 10}}>
                        <View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>


                                <View style={{
                                    flex: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                    borderColor: '#aaa', borderWidth: 1, borderRightWidth: 0, padding: 8
                                }}>
                                    <Text>条码</Text>
                                </View>

                                <View style={{
                                    flex: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                    borderColor: '#aaa', borderWidth: 1, padding: 8
                                }}>
                                    <Text>名称</Text>
                                </View>
                                <View style={{
                                    flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                    borderColor: '#aaa', borderWidth: 1, padding: 8
                                }}>
                                    <Text>
                                        删除
                                    </Text>
                                </View>
                            </View>
                        </View>


                        {listView}
                    </View>

                </ScrollView>


                <Modalbox
                    style={[styles.modal3, {borderRadius: 12, padding: 4, paddingLeft: 12, paddingRight: 12}]}
                    position={"center"} ref={"modal3"}
                    animationType={"slide"}>


                    <View style={[styles.row, {borderWidth: 0, borderBottomWidth: 1, borderBottomColor: '#ddd'}]}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: 4,
                            marginLeft: 5
                        }}>
                            <Text style={{color: '#222'}}>组名</Text>
                        </View>
                        <View style={{flex: 5, flexDirection: 'row', alignItems: 'center', padding: 4}}>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: width * 2 / 4,
                                    backgroundColor: '#fff',
                                    paddingLeft: 15,
                                    borderRadius: 4,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                                onChangeText={(groupName) => {
                                    this.state.groupName = groupName;
                                    this.setState({groupName: this.state.groupName});
                                }}
                                value={this.state.groupName}
                                placeholder='在此输入更新的组名'
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>


                    <View style={[styles.row, {borderBottomWidth: 0, marginTop: 10, justifyContent: 'center'}]}>
                        <TouchableOpacity style={{
                            backgroundColor: '#00f',
                            borderRadius: 8,
                            padding: 8,
                            paddingLeft: 20,
                            paddingRight: 20
                        }}
                                          onPress={() => {
                                              this.commodityGroupNameUpdate();
                                          }}>
                            <Text style={{color: '#fff', fontSize: 16}}>确认</Text>
                        </TouchableOpacity>
                    </View>

                </Modalbox>


                {/*条码模态框*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.codesModalVisible}
                    onClose={() => {
                        this.closeCodesModal(!this.state.codesModalVisible)
                    }}
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
        paddingTop: 1,
        paddingBottom: 1,
        shadowColor: ' rgba(0, 0, 0, 0.1)',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8'
    },
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    modal3: {
        height: 120,
        width: 300
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        sessionId: state.user.sessionId
    })
)(GroupInfoManage);

