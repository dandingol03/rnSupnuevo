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
    View,
    Alert,
    Modal,
    ListView,
    TouchableOpacity
    } from 'react-native';
var proxy = require('../../proxy/Proxy');
import {connect} from 'react-redux';
import Config from '../../../config';
import MyConcernOffer from './MyConcernOffer';
import MyOffer from './MyOffer';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import Bigpic from './Bigpic'
import Camera from 'react-native-camera';

class AllCompany extends Component {

    constructor(props) {
        super(props);
        this.state = {
            goodsCount: 0,
            start: 0,
            limit: 4,
            firststate: 0,
            arrlong: 0,
            infoList: null,
            nubre: this.props.nubre,
            direccion: this.props.direccion,
            rubroDes: this.props.rubroDes,
            nomroDeTelePhono: this.props.nomroDeTelePhono,
            merchantId: this.props.merchantId,
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
            })
        }
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
            if (this.props.reset)
                this.props.reset();
        }
    }

    fetchData() {
        var start = this.state.start;
        var merchantId = this.state.merchantId;
        var limit = this.state.limit;
        proxy.postes({
            url: Config.server + "/func/merchant/getCommodityLabelListofSellerMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                sellerId: merchantId,
                start: start,
                limit: limit,
            }
        }).then((json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var infoList = this.state.infoList;
                infoList = infoList.concat(json.data);
                /*json.data.map(function (item, i) {
                 infoList.push(
                 item
                 );
                 });*/
                this.setState({infoList: infoList});
                var arrlong = json.data.length;
                this.setState({arrlong: arrlong});
            }
        }).catch((err)=>{alert(err);});
    }

    renderRow(rowData) {
        // var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';
        // var img='data:image/jpeg;base64,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';
        var row =
            <View>
                <TouchableOpacity onPress={() => {this.navigateBigpic(rowData.attachId)}}>
                    <View style={{
                    marginTop:50,marginRight:15,
                        flex: 1, padding: 10,borderLeftWidth:1, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                        <Image resizeMode="stretch" style={{width:65,height:65}}
                               source={{uri:rowData.imgData}}
                            //source={{uri:base64Icon}}
                            //source={{uri:img}}
                            />
                    </View>
                    <View style={{padding:10}}>
                        <Text style={{fontSize:15}}>
                            价格:{rowData.precio}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    laruguanzhu() {
        //var sessionId = this.props.sessionId;
        var state = 1;
        var merchantId = this.state.merchantId;
        proxy.postes({
            url: Config.server + '/func/merchant/setBuyerSellerStateMobile',
            headers: {
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            body: {
                sellerId: merchantId,
                state: state,
            }
        }).then((json)=> {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                alert("成功拉入关注");
            }
        }).catch((err) => {
            alert(err);
        });
    }

    larugongyingshang() {
        var state = 2;
        //var sessionId = this.props.sessionId;
        var merchantId = this.state.merchantId;
        proxy.postes({
            url: Config.server + '/func/merchant/setBuyerSellerStateMobile',
            headers: {
                'Content-Type': 'application/json',
                // 'Cookie': sessionId,
            },
            body: {
                sellerId: merchantId,
                state: state,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                alert("成功拉入我的供应商");
            }
        }).catch((err) => {
            alert(err);
        });
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

    navigateBigpic(attachId) {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'Bigpic',
                component: Bigpic,
                params: {
                    attachId: attachId
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

    _endReached() {
        this.state.start += this.state.arrlong;
        if (this.state.arrlong === this.state.limit)
            this.fetchData();
    }

    render() {
        var listView = null;
        var infoList = this.state.infoList;
        if (infoList !== undefined && infoList !== null) {
            var data = infoList;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ScrollView>
                    <ListView
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}
                        padingEnable={true}
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}

                        onEndReached={this._endReached.bind(this)}
                        onEndReachedThreshold={200}
                        />
                </ScrollView>;
        } else {
            this.state.infoList = [];
            this.fetchData();
        }

        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    height: 55,
                    padding: 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }, styles.card]}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={() => {
                            this.goBack()
                        }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: 22, flex: 3, textAlign: 'center', color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View style={{flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center'}}>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex: 7, borderWidth: 1, borderColor: '#ddd'}}>
                        <View style={{flex: 1, flexDirection: 'row', borderWidth: 1, borderColor: '#ddd'}}>
                            <View style={{flex: 3}}>
                                <View style={{
                                flex:1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <View style={{flex: 2}}>
                                        <Text style={styles.ziti}>公司名称：</Text>
                                    </View>
                                    <View style={{flex: 3, justifyContent: 'flex-start'}}>
                                        <Text style={styles.popoverText}>{this.state.nubre}</Text>
                                    </View>
                                </View>
                                <View style={{
                                flex:1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <View style={{flex: 2}}>
                                        <Text style={styles.ziti}>公司地址：</Text>
                                    </View>
                                    <View style={{flex: 3}}>
                                        <Text style={styles.popoverText}>{this.state.direccion}</Text>
                                    </View>
                                </View>
                                <View style={{
                                flex:1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <View style={{flex: 2}}>
                                        <Text style={styles.ziti}>公司营业范围：</Text>
                                    </View>
                                    <View style={{flex: 3}}>
                                        <Text style={styles.popoverText}>{this.state.rubroDes}</Text>
                                    </View>
                                </View>
                                <View style={{
                                flex:1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 5
                                }}>
                                    <View style={{flex: 2}}>
                                        <Text style={styles.ziti}>公司联系电话：</Text>
                                    </View>
                                    <View style={{flex: 3}}>
                                        <Text style={styles.popoverText}>{this.state.nomroDeTelePhono}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={styles.touchOty}
                                                  onPress={() => {
                                                      this.laruguanzhu()
                                                  }}>
                                    <Text style={{fontSize: 14}}>拉入关注</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touchOty}
                                                  onPress={() => {
                                                      this.larugongyingshang()
                                                  }}>
                                    <Text style={{fontSize: 14, padding: 2,paddingLeft:5}}>拉入我的供应商</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touchOty} onPress={() => {
                                this.setState({cameraModalVisible: true})
                            }}>
                                    <Text style={{fontSize: 14}}>扫描</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <ScrollView>
                                {listView}
                            </ScrollView>
                        </View>
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
                            <View>
                                <Text style={{fontSize: 16}}>我的供应商</Text>
                            </View>
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
                        }} onPress={() => {
                            this.navigateMyConcernOffer()
                        }}>
                            <View>
                                <Text style={{fontSize: 16}}>我关注</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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
    ziti: {
        fontSize: 14,
        paddingLeft: 5,
    },
    touchOty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CAE1FF',
        borderRadius: 4,
        marginTop: 12,
        marginRight: 6,
        marginBottom: 12
    },
    popoverText: {
        fontSize: 14,
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
});

module.exports = connect(state => ({
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(AllCompany);