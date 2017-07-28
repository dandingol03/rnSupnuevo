/**
 * Created by dingyiming on 2017/7/25.
 */

/**
 * Created by danding on 16/11/21.
 */
import React,{Component} from 'react';

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
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView,{DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');



class Stock extends Component{


    constructor(props)
    {
        super(props);
        this.state = {

        }

    }

    render(){

        return (
            <View style={{flex:1}}>
                {/* header bar */}
                <View style={[{backgroundColor:'#387ef5',height:55,padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1}}>

                    </View>
                    <Text style={{fontSize:22,flex:3,textAlign:'center',color:'#fff'}}>
                        {this.props.username}
                    </Text>
                    <View ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center'}}>

                    </View>
                </View>

                <View style={{flex:1,flexDirection:'row',justifyContent: 'center',alignItems: 'center'}}>
                    <Text>进货</Text>
                </View>
            </View>
        );
    }
}


var styles = StyleSheet.create({

    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },

});



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username,
        commodityClassList:state.sale.commodityClassList,
        weightService:state.sale.weightService
    })
)(Stock);
