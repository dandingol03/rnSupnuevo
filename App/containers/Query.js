/**
 * Created by danding on 16/11/21.
 */
import React,{Component} from 'react';

import  {
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
var Popover = require('react-native-popover');


var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Proxy = require('../proxy/Proxy');
import Config from '../../config';
import CodesModal from '../components/modal/CodesModal';
import Group from './Group';
import GroupQuery from './GroupQuery';
import GroupMaintain from './GroupMaintain';


class Query extends Component{



    closeCodesModal(val){
        this.setState({codesModalVisible:val})
    }

    showPopover(ref){
        this.refs[ref].measure((ox, oy, width, height, px, py) => {
            this.setState({
                menuVisible: true,
                buttonRect: {x: px+20, y: py+40, width: width, height: height}
            });
        });
    }

    closePopover(){
        this.setState({menuVisible: false});
    }

    onCodigoSelect(code)
    {
        const {merchantId}=this.props;
        var codigo=code.codigo;
        Proxy.post({
            url:Config.server+"supnuevo/supnuevoGetSupnuevoBuyerPriceFormByCodigoBs.do",
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "codigo=" + codigo + "&supnuevoMerchantId=" + merchantId
        },(json)=> {
            var goodInfo = json.object;

            if(goodInfo.setSizeValue!=undefined&&goodInfo.setSizeValue!=null
                &&goodInfo.sizeUnit!=undefined&&goodInfo.sizeUnit!=null)
            {
                goodInfo.goodName=goodInfo.nombre+','+
                    goodInfo.setSizeValue+','+goodInfo.sizeUnit;
            }
            else{
                goodInfo.goodName=goodInfo.nombre;
            }
            this.setState({selectedCodeInfo: goodInfo,codigo:codigo,priceShow:goodInfo.priceShow});
        }, (err) =>{
            alert(err);
            this.setState({codigo:codigo});
        });

    }

    queryGoodsCode(codeNum){
        var code = parseInt(codeNum);
        const { merchantId } = this.props;
        Proxy.post({
            url:Config.server+'supnuevo/supnuevoGetQueryDataListByInputStringBs.do',
            headers: {
                'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "codigo=" + code + "&merchantId=" + merchantId
        },(json)=> {
            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);

            }else{
                var codes=json.array;
                this.setState({codes: codes,codesModalVisible:true});
            }
        }, (err) =>{
            alert(err);
        });

    }

    navigateGoodUpdate(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'group',
                component: Group,
                params: {
                }
            })
        }
    }

    navigateGroupQuery(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'groupManager',
                component: GroupQuery,
                params: {
                }
            })
        }
    }

    navigateGroupMaintain(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'groupMaintain',
                component: GroupMaintain,
                params: {
                }
            })
        }
    }



    navigate_priceGroupChange(){
        const { navigator } = this.props;
        const {merchantId}=this.props;
        var selectGoodInfo=this.state.selectedCodeInfo;
        if(selectGoodInfo.groupId!==undefined&&selectGoodInfo.groupId!==null)
        {
            if(navigator) {
                navigator.push({
                    name: 'group',
                    component: Group,
                    params: {
                        merchantId:merchantId,
                        goodInfo:this.state.selectedCodeInfo
                    }
                })
            }
        }else{
            alert('所选商品无法进行组改价');
        }
    }


    updatePrice(price){

        var goodInfo = this.state.selectedCodeInfo;
        goodInfo.oldPrice = price;
        goodInfo.price=price;
        goodInfo.price1=price;
        goodInfo.priceShow=price;
        this.setState({selectedCodeInfo: goodInfo,priceShow:goodInfo.priceShow});
    }




    constructor(props)
    {
        super(props);
        this.state = {
            uploadModalVisible:false,
            goods:{},
            codesModalVisible:false,
            codigo:null,
            selectedCodeInfo:{},
            priceShow:null
        };
    }


    render(){

        var username = this.props.username;
        var codigo = this.state.selectedCodeInfo.codigo;
        var goodName = this.state.selectedCodeInfo.goodName;
        var oldPrice = this.state.selectedCodeInfo.oldPrice;
        var suggestPrice = this.state.selectedCodeInfo.price;
        var fixedPrice = this.state.selectedCodeInfo.price1;

        var displayArea = {x: 5, y: 20, width: width - 10, height: height - 25};

        return (
            <View style={{flex:1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{backgroundColor:'#387ef5',padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <View style={{flex:1}}>

                        </View>
                        <Text style={{fontSize:22,flex:3,textAlign:'center',color:'#fff'}}>
                            {username}
                        </Text>
                        <TouchableOpacity ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center'}}
                                          onPress={this.showPopover.bind(this, 'menu')}>
                            <Icon name="chevron-circle-left" color="#fff" size={30}></Icon>
                        </TouchableOpacity>
                    </View>


                    <View style={{padding:10}}>

                        {/*输入条码*/}
                        <View style={[styles.row,{borderBottomWidth:0}]}>

                            <View style={{flex:1,borderWidth:1,borderColor:'#ddd'}}>
                                <TextInput
                                    style={{height: 46,paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6}}
                                    onChangeText={(codeNum) => {
                                    if(codeNum.toString().length==4)
                                    {
                                        this.state.goods.codeNum=codeNum;
                                        this.setState({goods:this.state.goods});
                                        this.queryGoodsCode(codeNum.toString().substring(0,4));
                                    }else if(codeNum.toString().length>4){}
                                    else{
                                        this.state.goods.codeNum=codeNum;
                                        this.setState({goods:this.state.goods});
                                    }
                                }}
                                    value={this.state.goods.codeNum}
                                    placeholder='请输入条码最后四位'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        {/* 价位横幅 */}
                        <View style={[styles.row,{borderBottomWidth:0,padding:18,backgroundColor:'#eee'}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>原价位</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>建议改位</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>固定改位</Text>
                            </View>
                        </View>

                        {/* 三个无意义的大方块 */}
                        <View style={[styles.row,{borderBottomWidth:0,height:50}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>

                                <TouchableOpacity
                                    onPress={
                                    ()=>{
                                        this.updatePrice(oldPrice);
                                    }}>
                                    <Text style={{'fontSize':14,color:'#fff'}}>{oldPrice}</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5}}>
                                <Text style={{'fontSize':14,color:'#fff'}}>{suggestPrice}</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4}}>
                                <Text style={{'fontSize':14,color:'#fff'}}>{fixedPrice}</Text>
                            </View>
                        </View>
                        {/*商品概要*/}

                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',
                                padding:12,marginBottom:1}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
                                <Text>商品条码:</Text>
                            </View>
                            <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start'}}>
                                <Text>{codigo}</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',
                                padding:12,marginBottom:1}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
                                <Text>商品名称:</Text>
                            </View>
                            <View style={{flex:5,flexDirection:'row',justifyContent:'flex-start'}}>
                                <Text>{goodName}</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa'
                            ,paddingLeft:12,paddingRight:12}]}>

                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text >更新改价:</Text>
                            </View>
                            <View style={{flex:5}}>
                                <TextInput
                                    style={{height: 40}}
                                    onChangeText={(priceShow) => {

                                        this.state.selectedCodeInfo.priceShow=priceShow;
                                        this.setState({priceShow:priceShow});

                                }}

                                    value={''+(this.state.priceShow!==undefined&&this.state.priceShow!==null?this.state.priceShow.toString():'')}
                                    placeholder='请输入您的价格'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>



                        <View style={[styles.row,{borderBottomWidth:0,padding:18,backgroundColor:'#eee',borderRadius:8,
                            marginTop:10,marginBottom:4}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>标签</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>大折扣</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>中折扣</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{'fontSize':14,color:'#444'}}>小折扣</Text>
                            </View>
                        </View>

                        {/*包含8个按钮的按钮组*/}
                        <View style={[styles.row,{borderBottomWidth:0,height:50}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>+IVA</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>+10%</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>+5%</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>.00</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginTop:4}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>-IVA</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>-10%</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>-5%</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:20}}>0.50</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginTop:12}]}>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                    marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}
                                onPress={
                                    ()=>{
                                        this.navigateGoodUpdate();
                                    }}>
                                    <Text style={{color:'#fff',fontSize:18}}>改价</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,alignItems:'center'}}
                                onPress={
                                    ()=>{
                                        this.navigate_priceGroupChange();
                                    }}>
                                <Text style={{color:'#fff',fontSize:18}}>组改价</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',backgroundColor:'#387ef5',
                                    marginRight:.5,alignItems:'center',justifyContent:'center'}}
                                onPress={
                                    ()=>{
                                        this.navigateGoodUpdate();
                                    }}>
                                <Text style={{color:'#fff',fontSize:18}}>添加</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                    borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center'}}
                                onPress={
                                    ()=>{
                                        this.navigateGoodUpdate();
                                    }}>
                                    <Text style={{color:'#fff',fontSize:18}}>修改</Text>
                            </TouchableOpacity>
                        </View>

                    </View>


                    <Popover
                        isVisible={this.state.menuVisible}
                        fromRect={this.state.buttonRect}
                        displayArea={displayArea}
                        onClose={()=>{this.closePopover()
                        }}>

                        <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd'}]}
                                          onPress={()=>{
                                              console.log('choose add commodity');
                                              this.closePopover();
                                          }}>
                            <Text style={[styles.popoverText,{color:'#444'}]}>添加商品</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd'}]}
                                          onPress={()=>{
                                              this.closePopover();
                                              this.navigateGroupQuery();
                                          }}>
                            <Text style={[styles.popoverText,{color:'#444'}]}>添加商品至组</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.popoverContent]}
                                          onPress={()=>{
                                              this.closePopover();
                                              this.navigateGroupMaintain();
                                          }}>
                            <Text style={[styles.popoverText,{color:'#444'}]}>商品组维护</Text>
                        </TouchableOpacity>

                    </Popover>


                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.codesModalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}>

                        <CodesModal
                            onClose={()=>{
                            this.closeCodesModal(!this.state.codesModalVisible)
                        }}
                            onCodigoSelect={
                            (code)=>{
                                this.onCodigoSelect(code);
                            }}
                            codes={this.state.codes}
                        />
                    </Modal>





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
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
    popoverContent: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
    }
});



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username
    })
)(Query);

