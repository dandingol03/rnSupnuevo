/**
 * Created by danding on 16/11/21.
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

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
import Config from '../../config';
import _ from 'lodash';


class Group extends Component {

    goBack() {
        this.props.reset();
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    toggleAll() {
        if (this.state.relatedGoods0 !== undefined && this.state.relatedGoods0 !== null) {
            var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
            if (this.state.selectAll != true) {
                relatedGoods0.map(function (good, i) {
                    good.checked = true;
                });
            } else {
                relatedGoods0.map(function (good, i) {
                    good.checked = false;
                });
            }
            var dataSource0 = this.state.dataSource0.cloneWithRows(relatedGoods0);
            this.setState({
                relatedGoods0: relatedGoods0,
                selectAll: !this.state.selectAll,
                dataSource0: dataSource0
            });
        }
    }

    getCommoditiesByPriceId(commodityId) {

        var merchantId = this.props.merchantId;
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/getSupnuevoBuyerCommodityPriceFormListOfGroupMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            // body: "commodityId=" + commodityId + "&merchantId=" + merchantId
            body: {
                commodityId: commodityId,
                merchantId: merchantId
            }
        }).then((json) => {
            var errorMsg = json.errorMessage;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                var relatedGoods0 = json.array0;
                var relatedGoods1 = json.array1;
                relatedGoods0.map(function (good, i) {
                    if (good.commodityId == commodityId || good.groupPriceMark == 1) {
                        good.checked = true;
                    } else {
                        good.checked = false;
                    }
                    if (good.sizeValue != undefined && good.sizeValue != null
                        && good.sizeUnit != undefined && good.sizeUnit != null) {
                        good.goodName = good.nombre + ',' +
                            good.sizeValue + ',' + good.sizeUnit;
                    } else {
                        good.goodName = good.nombre;
                    }
                });

                relatedGoods1.map(function (good, i) {
                    if (good.commodityId == commodityId || good.groupPriceMark == 1) {
                        good.checked = true;
                    } else {
                        good.checked = false;
                    }
                    if (good.sizeValue != undefined && good.sizeValue != null
                        && good.sizeUnit != undefined && good.sizeUnit != null) {
                        good.goodName = good.nombre + ',' +
                            good.sizeValue + ',' + good.sizeUnit;
                    } else {
                        good.goodName = good.nombre;
                    }
                });

                //TDOO:set state relatedGoods
                this.setState({
                    relatedGoods0: relatedGoods0, relatedGoods1: relatedGoods1,
                    dataSource0: this.state.dataSource0.cloneWithRows(relatedGoods0),
                    dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1),
                });
            }
        }).catch((err) => {
            alert(err);
        });

    }


    renderRow0(rowData, sectionId, rowId) {

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

        var chebx = null;
        if (rowData.checked == true) {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
                    relatedGoods0.map(function (good, i) {
                        if (good.commodityId == rowData.commodityId)
                            good.checked = false;
                    });
                    this.setState({
                        relatedGoods0: relatedGoods0,
                        dataSource0: this.state.dataSource0.cloneWithRows(relatedGoods0)
                    });
                }}
                isChecked={true}
                leftText={null}
            />;
        } else {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
                    relatedGoods0.map(function (good, i) {
                        if (good.commodityId == rowData.commodityId)
                            good.checked = true;
                    });
                    this.setState({
                        relatedGoods0: relatedGoods0,
                        dataSource0: this.state.dataSource0.cloneWithRows(relatedGoods0)
                    });

                }}
                isChecked={false}
                leftText={null}
            />;
        }


        var row =
            <View>

                <View style={lineStyle}>

                    {
                        rowData.checked == true ?
                            <TouchableOpacity onPress={function () {
                                var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
                                relatedGoods0.map(function (good, i) {
                                    if (good.commodityId == rowData.commodityId) {
                                        good.checked = false;
                                    }
                                });
                                this.setState({
                                    relatedGoods0: relatedGoods0,
                                    dataSource0: this.state.dataSource0.cloneWithRows(relatedGoods0)
                                });
                            }.bind(this)}>
                                <View style={{
                                    flex: 3,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 8
                                }}>
                                    <Icon name='check-square' size={24} color="#444"></Icon>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={function () {
                                var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
                                relatedGoods0.map(function (good, i) {
                                    if (good.commodityId == rowData.commodityId) {
                                        good.checked = true;
                                    }
                                });
                                this.setState({
                                    relatedGoods0: relatedGoods0,
                                    dataSource0: this.state.dataSource0.cloneWithRows(relatedGoods0)
                                });
                            }.bind(this)}>
                                <View style={{
                                    flex: 3,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 8
                                }}>
                                    <Icon name='square-o' size={24} color="#444"></Icon>
                                </View>
                            </TouchableOpacity>

                    }

                    <View style={{
                        flex: 10,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        padding: 8
                    }}>
                        <Text style={{
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: 18
                        }}>{rowData.codigo + '\n' + rowData.goodName}</Text>
                    </View>

                </View>

            </View>;

        return row;
    }

    renderRow1(rowData, sectionId, rowId) {

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
                backgroundColor: '#ece863'
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

        var chebx = null;
        if (rowData.checked == true) {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                    relatedGoods1.map(function (good, i) {
                        if (good.commodityId == rowData.commodityId)
                            good.checked = false;
                    });
                    this.setState({
                        relatedGoods1: relatedGoods1,
                        dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1)
                    });
                }}
                isChecked={true}
                leftText={null}
            />;
        } else {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                    relatedGoods1.map(function (good, i) {
                        if (good.commodityId == rowData.commodityId)
                            good.checked = true;
                    });
                    this.setState({
                        relatedGoods1: relatedGoods1,
                        dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1)
                    });

                }}
                isChecked={false}
                leftText={null}
            />;
        }


        var row =
            <View>
                <TouchableOpacity onPress={
                    function () {
                        //TODO:
                    }.bind(this)}>
                    <View style={lineStyle}>
                        {
                            rowData.checked == true ?
                                <TouchableOpacity onPress={function () {
                                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                                    relatedGoods1.map(function (good, i) {
                                        if (good.commodityId == rowData.commodityId) {
                                            good.checked = false;
                                        }
                                    });
                                    this.setState({
                                        relatedGoods1: relatedGoods1,
                                        dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1)
                                    });
                                }.bind(this)}>
                                    <View style={{
                                        flex: 3,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 8
                                    }}>
                                        <Icon name='check-square' size={24} color="#444"></Icon>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={function () {
                                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                                    relatedGoods1.map(function (good, i) {
                                        if (good.commodityId == rowData.commodityId) {
                                            good.checked = true;
                                        }
                                    });
                                    this.setState({
                                        relatedGoods1: relatedGoods1,
                                        dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1)
                                    });
                                }.bind(this)}>
                                    <View style={{
                                        flex: 3,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 8
                                    }}>
                                        <Icon name='square-o' size={24} color="#444"></Icon>
                                    </View>
                                </TouchableOpacity>

                        }

                        <View style={{
                            flex: 10,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: 8
                        }}>
                            <Text style={{
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: 18
                            }}>{rowData.codigo + '\n' + rowData.goodName}</Text>
                        </View>

                    </View>
                </TouchableOpacity>

            </View>;
    return row;
    }

    changePriceRelated() {
        var selectedRelativePriceIds = [];
        var relatedGoods0 = this.state.relatedGoods0;
        var relatedGoods1 = this.state.relatedGoods1;
        relatedGoods0.map(function (good, i) {
            if (good.checked == true) {
                selectedRelativePriceIds.push(good.commodityId);
            }
        });
        relatedGoods1.map(function (good, i) {
            if (good.checked == true) {
                selectedRelativePriceIds.push(good.commodityId);
            }
        });
        const {goodInfo} = this.props;
        const {merchantId} = this.props;
        var sessionId = this.props.sessionId;
        this.setState({wait:true,bgColor:"#D4D4D4"});
        //TODO:make a fetch

        proxy.postes({
            url: Config.server + '/func/commodity/updateSupnuevoBuyerCommodityPriceGroupMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            //body: "commodityIds=" + selectedRelativePriceIds.toString() +
            //"&merchantId=" + merchantId+
            //'&priceShow='+goodInfo.priceShow+
            //'&printType='+goodInfo.printType+
            //'&price='+goodInfo.price
            body: {
                commodityIds: selectedRelativePriceIds.toString(),
                merchantId: merchantId,
                priceShow: goodInfo.priceShow.toString(),
                printType: goodInfo.printType,
                price: goodInfo.price
            }
        }).then((json) => {
            this.setState({wait:false,bgColor:"#3b5998"});
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

    constructor(props) {
        super(props);
        const ds0 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            bgColor:"#3b5998",
            wait:false,
            merchantId: props.merchantId,
            goodInfo: props.goodInfo,
            relatedGoods0: null,
            relatedGoods1: null,
            selectAll: false,
            dataSource0: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSource1: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }


    render() {

        const {username} = this.props;
        const {goodInfo} = this.props;

        var relatedGoods0 = [];
        if (this.state.relatedGoods0 !== undefined && this.state.relatedGoods0 !== null) {
            relatedGoods0 = this.state.relatedGoods0;
        } else {
            this.getCommoditiesByPriceId(goodInfo.commodityId);
        }

        var relatedGoods1 = [];
        if (this.state.relatedGoods1 !== undefined && this.state.relatedGoods1 !== null) {
            relatedGoods1 = this.state.relatedGoods1;
        } else {
            this.getCommoditiesByPriceId(goodInfo.commodityId);
        }

        var listView0 = null;
        var listView1 = null;
        if (relatedGoods0.length > 0) {

            listView0 =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource0}

                    renderRow={this.renderRow0.bind(this)}
                />;

        } else {
        }

        if (relatedGoods1.length > 0) {

            listView1 =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource1}
                    renderRow={this.renderRow1.bind(this)}
                />;

        } else {
        }

        return (
            <View style={{flex: 1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{
                        backgroundColor: 'rgba(240,240,240,0.8)',
                        padding: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }, styles.card]}>
                        <TouchableOpacity style={{flex: 1}}
                                          onPress={
                                              function () {
                                                  this.goBack();
                                              }.bind(this)}>
                            <Icon name='chevron-left' size={24} color="#444"></Icon>
                        </TouchableOpacity>
                        <Text style={{fontSize: 21, flex: 3, textAlign: 'center', color: '#444', fontWeight: 'bold'}}>
                            {username}
                        </Text>
                        <TouchableOpacity style={{
                            flex: 1,
                            marginRight: 0,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            backgroundColor: this.state.bgColor,
                            alignItems: 'center',
                            paddingLeft: 20,
                            paddingRight: 4,
                            paddingTop: 4,
                            paddingBottom: 4,
                            borderRadius: 6
                        }}
                                          disabled={this.state.wait}
                                          onPress={function () {
                                              this.changePriceRelated();
                                          }.bind(this)}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>改价</Text>
                            <Icon name="check" size={24} color="#fff"/>
                        </TouchableOpacity>
                    </View>


                    {/*显示组改价名称*/}
                    <View style={[styles.card, {padding: 8, borderWidth: 0}]}>
                        <View>
                            <Text style={{color: '#222', fontSize: 20}}>
                                改动的价格:  &nbsp;&nbsp;&nbsp;
                                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                                    {goodInfo.priceShow}
                                </Text>
                            </Text>
                        </View>
                        <View>
                            <Text style={{color: '#222', fontSize: 20}}>
                                商品组名: &nbsp;&nbsp;&nbsp;<Text
                                style={{color: '#222', fontSize: 18, fontWeight: 'bold'}}>{goodInfo.groupName}</Text>
                            </Text>
                        </View>
                    </View>


                    <View style={{padding: 10, paddingLeft: 0, paddingRight: 0}}>

                        {/*显示组内商品列表*/}
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>

                            <TouchableOpacity style={{
                                flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                backgroundColor: '#90B4FF', borderBottomWidth: 1, borderColor: '#aaa', padding: 8
                            }}
                                              onPress={
                                                  function () {
                                                      this.toggleAll();
                                                  }.bind(this)}>

                                <Text style={{color: '#fff', fontWeight: 'bold'}}>
                                    {this.state.selectAll != true ? '全选' : '全不选'}&nbsp;
                                </Text>
                                <Icon name='hand-pointer-o' size={20} color="#fff"></Icon>
                            </TouchableOpacity>


                            <View style={{
                                flex: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                borderColor: '#aaa', borderWidth: 1, borderRightWidth: 0, padding: 8
                            }}>
                                <Text>商品信息</Text>
                            </View>


                        </View>
                        <ScrollView>
                            <View style={{margin: 10, borderWidth: 1, borderColor: '#343434'}}>
                                {listView0}
                            </View>

                            <View style={{marginTop: 20, margin: 10, borderWidth: 1, borderColor: '#343434'}}>
                                {listView1}
                            </View>

                        </ScrollView>
                        <View style={{height: 50, width: width}}></View>


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
        borderBottomWidth: 0,
        shadowColor: '#eee',
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
    }
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(Group);

