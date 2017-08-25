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

    _renderPage(pageData,pageID){
        return (

            <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>

                <Image
                    source={pageData}
                    style={{width:width,flex:3}}
                    resizeMode={"stretch"}
                />
                <View>
                    <Text>
                        广发1
                    </Text>
                </View>

            </View>

        );
    }

    constructor(props) {
        super(props);
        var ds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2});
        this.state = {
            dataSource: ds.cloneWithPages(IMGS),
        };
    }

    render() {

        return (
            <View style={styles.container}>
                {/* header bar */}
                <View style={[{backgroundColor:'#387ef5',height:55,padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <Text style={{fontSize:20,flex:3,textAlign:'center',color:'#fff'}}>
                        Supnuevo(3.0)-{this.props.username}
                    </Text>
                </View>

                <View style={{width:width,flex:2,}}>
                    <ViewPager
                        style={this.props.style}
                        dataSource={this.state.dataSource}
                        renderPage={this._renderPage}
                        isLoop={true}
                        autoPlay={true}
                        locked={false}

                    />
                </View>

                <View style={{width:width,flex:2,}}>
                </View>

            </View>
        )
    }

    componentDidMount()
    {

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
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username,
        commodityClassList:state.sale.commodityClassList,
        weightService:state.sale.weightService,
        sessionId:state.user.sessionId,
    })
)(AdvertiseMent);

