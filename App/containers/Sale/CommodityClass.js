
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
import PriceModal from './PriceModal';

import PopupDialog,{ScaleAnimation} from 'react-native-popup-dialog';
const scaleAnimation = new ScaleAnimation();

class CommodityClass extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    showPriceDialog()
    {
        this.setState({priceModalVisible:true});
    }

    renderRow(rowData,sectionId,rowId){

        var row=(
            <TouchableOpacity style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,padding:10,borderBottomWidth:1,borderColor:'#eee'}}
                  onPress={()=>{
                       this.showPriceDialog();
                       this.state.commodity.nombre = rowData;
            }}>
              <Text>
                  {rowData}
              </Text>
            </TouchableOpacity>
        );
        return row;
    }

    constructor(props)
    {
        super(props);
        this.state = {
            priceModalVisible:false,
            goodsCount:1,
            commodity:{codigo:'',nombre:null,price:null,}
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
                    <TouchableOpacity ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center',alignItems: 'flex-end'}}
                                      onPress={()=>{
                                              this.goBack();
                                          }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>

                    <Text style={{fontSize:20,flex:5,textAlign:'center',color:'#fff'}}>
                        Supnuevo(3.0)-{this.props.username}
                    </Text>

                    <View style={{flex:1}}>

                    </View>
                </View>

                {/* body */}
                <View style={{flex:1}}>

                    {/* ListView */}
                    <View style={{flexDirection:'row',flex:5,}}>

                        {commodityClassListView}

                    </View>

                </View>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.priceModalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    <PriceModal

                        commodity={this.state.commodity}
                        onClose={()=>{
                               this.setState({priceModalVisible:false});
                            }}

                        onConfirm={(price)=>{
                            this.state.commodity.price = price;
                            this.props.codeClass(this.state.commodity);
                            this.goBack();
                            }}
                    />

                </Modal>

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


