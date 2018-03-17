/**
 * Created by dingyiming on 2017/8/16.
 */

import React, { Component } from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    TextInput,
    InteractionManager
    } from 'react-native';
import Config from '../../config';
var proxy = require('../proxy/Proxy');
import { connect } from 'react-redux';
var { height, width } = Dimensions.get('window');
import ViewPager from 'react-native-viewpager';

var IMGS = [
    require('../img/tt1@2x.png'),
    require('../img/tt2@2x.jpeg'),
    require('../img/tt3@2x.jpeg'),
    require('../img/tt4@2x.jpeg'),
];

class AdvertiseMent extends Component {

    constructor(props) {
        super(props);
        var ds_adv = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
        this.state = {
            state: 0,
            advName: null,
            attachIdList: null,
            advbreif: null,
            advList: null,
            infoList: null,
            img: [],
            j: 1,
            attachId: null,
            //dataSource_Adv: ds_adv.cloneWithPages(IMGS),
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            }),
        };
    }

    fetchData() {
        var advList = this.state.advList;
        var advName = this.state.advName;
        var advbreif = this.state.advbreif;
        var attachIdList = this.state.attachIdList;
        proxy.postes({
            url: Config.server + "/func/merchant/getAdvertisementListMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {}
        }).then((json)=> {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                advList = json.data;
                advbreif = json.data[0].breif;
                attachIdList = json.data[0].attachIdList;
                this.setState({advList: advList, advbreif: advbreif, attachIdList: attachIdList});
            }
        }).catch((err)=>{alert(err);});
    }

    fetchAdvPic(attachId) {
        proxy.postes({
            url: Config.server + "/func/merchant/getImageByAttachIdMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                attachId: attachId
            }
        }).then((json)=> {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var img = this.state.img.concat(json.data);
                this.setState({img: img});
            }
        }).catch((error)=> {
            alert(error);
        })
    }

    fetchAdvPic_List(attachIdList) {
        proxy.postes({
            url: Config.server + "/func/merchant/getImagesByAttachIdListMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                attachIdList: attachIdList
            }
        }).then((json)=> {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var img = json.data;
                this.setState({img: img});
            }
        }).catch((error)=> {
            alert(error);
        })
    }

    renderPage(pageData, pageID) {
        return (
            <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                <Image
                    source={{uri:pageData}}
                    style={{width:width,flex:3}}
                    resizeMode={"stretch"}
                    />
            </View>
        );
    }

    renderRow(rowData) {
        var row =
            <View>
                <TouchableOpacity
                    onPress={() => {this.fetchAdvPic_List(rowData.attachIdList);this.setState({advbreif:rowData.breif})}}>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff'
                    }}>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={{flex: 1}}>商户名称</Text>
                            <Text style={{flex: 3}}>{rowData.advName}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    getAdvPic(param) {
        var attachIdList = this.state.attachIdList;
        for (let i = 0; i < attachIdList.length; i++) {
            var attachId = attachIdList[i];
            this.fetchAdvPic(attachId);
        }
    }

    render() {
        var listView = null;
        const advList = this.state.advList;
        var advbreif = this.state.advbreif;
        var attachIdList = this.state.attachIdList;
        if (this.state.img.length === 0 && attachIdList !== null) {
           // this.getAdvPic();
            this.fetchAdvPic_List(attachIdList);
        }
        if (advList !== null) {
            var data = advList;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(data)}
                    renderRow={this.renderRow.bind(this)}
                    />
        } else {
            this.state.infoList = [];
            this.fetchData();
        }
        console.log(this.state.img);
        var img = this.state.img;
        var ds_adv = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
        var dataSource_Adv = ds_adv.cloneWithPages(img);
        return (
            <View style={styles.container}>
                {/* header bar */}
                <View
                    style={[{backgroundColor:'#387ef5',height:55,padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <Text style={{fontSize:20,flex:3,textAlign:'center',color:'#fff'}}>
                        Supnuevo(4.0)-{this.props.username}
                    </Text>
                </View>
                <View style={{width:width,flex:3}}>
                    <View style={{flex:3}}>
                        <ViewPager
                            dataSource={dataSource_Adv}
                            renderPage={this.renderPage}
                            isLoop={true}
                            autoPlay={true}
                            locked={false}
                            renderPageIndicator={false}
                            />
                    </View>
                    <View style={{flex:1,paddingTop:10,paddingLeft:10}}>
                        <Text style={{fontSize:20}}>商品简介：{this.state.advbreif}</Text>
                    </View>
                </View>
                <View style={{flex:1,borderTopWidth:1,borderColor:'black'}}>
                    <ScrollView>
                        {listView}
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    popoverContent: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: 14
    }
});

module.exports = connect(state=>({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(AdvertiseMent);