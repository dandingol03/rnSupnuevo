
/**
 * Created by danding on 16/11/21.
 */
import React,{Component} from 'react';

import  {
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

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView,{DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


class CommodityClass extends Component{


    renderRow(rowData,sectionId,rowId){

        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,}}>
              <Text>
                  {row}
              </Text>
            </View>
        );
        return row;
    }

    constructor(props)
    {
        super(props);
        this.state = {
            goodsCount:1,
        }

    }

    render(){

        var commodityClassListView=null;
        var {commodityClassList}=this.props;

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        if (commodityClassList !== undefined && commodityClassList !== null && commodityClassList.length > 0) {

            commodityClassListView = (
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(commodityClassList)}
                    renderRow={this.renderRow.bind(this)}
                />
            );
        }

        return (
            <View style={{flex:1}}>
                {/* header bar */}
                <View style={[{backgroundColor:'#387ef5',height:55,padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <Text style={{fontSize:20,flex:3,textAlign:'center',color:'#fff'}}>
                        Supnuevo(3.0)-{this.props.username}
                    </Text>
                </View>

                {/* body */}
                <View style={{flex:1}}>

                    {/* ListView */}
                    <View style={{flexDirection:'row',flex:5,}}>

                        {commodityClassListView}

                    </View>

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
    })
)(CommodityClass);


