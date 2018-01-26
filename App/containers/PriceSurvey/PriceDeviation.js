import React, {Component} from 'react';
import {
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

import PopupDialog from 'react-native-popup-dialog';
import Camera from 'react-native-camera';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Proxy = require('../../proxy/Proxy');
var Popover = require('react-native-popover');
import Quary from '../Query';
import {setGoodsInfo} from "../../action/actionCreator";

class Stock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            infoList: null,
            sortList: null,
            orderType: 0,
        };
    }

    navigatorQuary() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
            if (this.props.reset)
                this.props.reset();
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


    quickSort(array, first, last) {

        var prev = first;
        var numsize = last;

        function sort(prev, numsize) {
            var nonius = prev;
            var j = numsize - 1;
            var flag = array[prev];
            if ((numsize - prev) > 1) {
                while (nonius < j) {
                    for (; nonius < j; j--) {
                        if (array[j].differ < flag.differ) {
                            array[nonius++] = array[j];
                            console.log(array);
                            break;
                        }
                    }
                    for (; nonius < j; nonius++) {
                        if (array[nonius].differ > flag.differ) {
                            array[j--] = array[nonius];
                            console.log(array);
                            break;
                        }
                    }
                }
                array[nonius] = flag;
                sort(0, nonius);
                sort(nonius + 1, numsize);
            }
        }

        sort(0, array.length);
        console.log(array);
        this.setState({infoList: array});
        return array;

    }

    getPriceD() {
        var infoList = null;
        var orderType = this.state.orderType;
        Proxy.post({
            url: Config.server + "/func/commodity/getSupnuevoBuyerPriceDifferListMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderType: orderType
            }
        }, (json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                infoList = json.priceList;
                this.setState({infoList: infoList});
                /*for(var i=0;i<40;i++){
                    sortList[i]=infoList[i];
                }
                this.quickSort(sortList,0,sortList.length);*/
            }
        })
    }

    renderRow(rowData) {
        const {dispatch} = this.props;
        this.state.merchantId = rowData.merchantId;
        var price=null;
        if(rowData.price!==null){
            price=rowData.price;
        }
        else{
            price=rowData.oldPrice;
        }
        var row =
            <View>
                <TouchableOpacity onPress={() => {
                    dispatch(setGoodsInfo({
                        codigo: rowData.codigo,
                        nombre: rowData.nombre,
                        oldPrice: rowData.oldPrice,
                        price: rowData.price,
                        suggestPrice: rowData.suggestPrice,
                        differ: rowData.differ
                    }));
                    this.navigatorQuary();
                }}>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>{rowData.codigo}</Text>
                            <Text style={{flex: 2}}>{rowData.nombre}</Text>
                        </View>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>原价：{price}</Text>
                            <Text style={{flex: 1}}>建议价格：{rowData.suggestPrice}</Text>
                            <Text style={{flex: 1}}>偏差：{rowData.differ}%</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    sortchangeorder() {
        var orderType = this.state.orderType;
        if (orderType === 0) {
            this.state.orderType = 1;
        }
        else {
            this.state.orderType = 0;
        }
        this.getPriceD();
    }

    render() {

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
                />
        } else {
            this.state.infoList = [];
            this.getPriceD();
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
                        height: 50,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderColor: '#ddd',
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 2,
                                backgroundColor: '#CAE1FF',
                                borderWidth: 1,
                                marginLeft: 20,
                                marginRight: 10,
                                borderRadius: 4
                            }}
                            onPress={() => {
                                this.sortchangeorder()
                            }}
                        >
                            <View style={{padding: 10, alignItems: 'center'}}>
                                <Text style={{fontSize: 16}}>颠倒排序方式</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                backgroundColor: '#CAE1FF',
                                marginLeft: 20,
                                marginRight: 10,
                                borderRadius: 4
                            }}
                            onPress={() => {
                                this.goBack()
                            }}
                        >
                            <View style={{padding: 10, alignItems: 'center'}}>
                                <Text style={{fontSize: 16}}>返回</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 7, borderBottomWidth: 1, borderColor: '#ddd'}}>
                        <ScrollView>
                            {listView}
                        </ScrollView>
                    </View>

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