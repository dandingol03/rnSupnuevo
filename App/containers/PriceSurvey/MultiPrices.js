/**
 * Created by dingyiming on 2017/3/7.
 */

import React,{Component} from 'react';

import  {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    ListView,
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
var proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import ActionSheet from 'react-native-actionsheet';

import PriceSurvey from './PriceSurvey';


class MultiPrices extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigatePriceSurvey(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
        this.props.goBack();
    }

    submit(){
        const merchantId=this.props.merchantId;
        var commodityId=this.props.surveyDetail.commodityId;
        var sessionId=this.props.sessionId;
        if(this.state.modifyType==0){
            Alert.alert(
                '提示',
                '请修改"价格"、"价格来源"及"大卖"后再提交',
                [
                    {text: 'OK', onPress: () => console.log('OK')},
                ]
            )
        }
        if(this.state.internetId==undefined||this.state.internetId==null){
            switch(this.state.modifyType){
                case 1:
                    this.state.internetId=this.props.surveyDetail.internetId;
                    break;
                case 2:
                    this.state.internetId=this.props.surveyDetail.internetId1;
                    break;
                case 3:
                    this.state.internetId=this.props.surveyDetail.internetId2;
                    break;
                default:
                    break;
            }
        }
        if(this.state.storeId==undefined||this.state.storeId==null){
            switch(this.state.modifyType){
                case 1:
                    this.state.storeId=this.props.surveyDetail.storeId;
                    break;
                case 2:
                    this.state.storeId=this.props.surveyDetail.storeId1;
                    break;
                case 3:
                    this.state.storeId=this.props.surveyDetail.storeId2;
                    break;
                default:
                    break;
            }
        }
        proxy.postes({
            url:Config.server+"/func/commodity/setAreaGroupPriceByPriceIdMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie':sessionId,
            },
            //body: "commodityId=" + commodityId + "&merchantId=" + merchantId+"&price=" +
            //this.state.price+"&internetId=" + this.state.internetId+"&storeId=" + this.state.storeId+"&modifyType=" + this.state.modifyType
            body:{
                commodityId:commodityId,
                merchantId:merchantId,
                price:this.state.price,
                internetId:this.state.internetId,
                storeId:this.state.storeId,
                modifyType:this.state.modifyType
            }
        }).then((json)=> {
            var o = json;
            var message=json.message;
            if(message !== null && message !== undefined && message !== ""){
                alert(message);
                this.navigatePriceSurvey();
            }

        }).catch((err) =>{
            alert(err);
        });
    }

    show(actionSheet) {
        this[actionSheet].show();
    }

    _handlePress1(index) {

    }

    _handlePress2(index) {
        if(index!==0){
            this.state.internetId = index;
            var internetId = this.state.internetId;
            this.setState({internetId:internetId});
        }
    }

    _handlePress3(index) {
        if(index!==0){
            this.state.storeId = index;
            var storeId = this.state.storeId;
            this.setState({storeId:storeId});
        }

    }
    _handlePress4(index) {
        if(index!==0){
            this.state.internetId = index;
            var internetId = this.state.internetId;
            this.setState({internetId:internetId});
        }
    }
    _handlePress5(index) {
        if(index!==0){
            this.state.storeId = index;
            var storeId = this.state.storeId;
            this.setState({storeId:storeId});
        }
    }
    _handlePress6(index) {
        if(index!==0){
            this.state.internetId = index;
            var internetId = this.state.internetId;
            this.setState({internetId:internetId});
        }
    }
    _handlePress7(index) {
        if(index!==0){
            this.state.storeId = index;
            var storeId = this.state.storeId;
            this.setState({storeId:storeId});
        }
    }

    constructor(props)
    {
        super(props);
        this.state = {
            codes:null,
            price:null,
            price1:this.props.surveyDetail.price,
            price2:this.props.surveyDetail.price1,
            price3:this.props.surveyDetail.price2,
            internetId:null,
            storeId:null,
            modifyType:0,

        };
    }

    render(){
        const {merchantId}=this.props;
        var username = this.props.username;

        var surveyDetail = this.props.surveyDetail;
        var price = this.props.surveyDetail.price;
        var price1 = this.props.surveyDetail.price1;
        var price2 = this.props.surveyDetail.price2;

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        var internetArray = ['取消'];
        var storeArray =  ['取消'];
        var merchantArray = ['取消'];

        if(this.state.price1==undefined){
            this.state.price1 = '';
        }
        if(this.state.price2==undefined){
            this.state.price2 = '';
        }
        if(this.state.price3==undefined){
            this.state.price3 = '';
        }


        if( surveyDetail.internetArray!==undefined&&surveyDetail.internetArray!==null&&surveyDetail.internetArray.length>0)
        {
            surveyDetail.internetArray.map(function(internet,i){
                internetArray.push(internet.label);
            })
        }
        if( surveyDetail.storeArray!==undefined&&surveyDetail.storeArray!==null&&surveyDetail.storeArray.length>0)
        {
            surveyDetail.storeArray.map(function(store,i){
                storeArray.push(store.label);
            })
        }
        if( surveyDetail.merchantArray!==undefined&&surveyDetail.merchantArray!==null&&surveyDetail.merchantArray.length>0)
        {
            surveyDetail.merchantArray.map(function(merchant,i){
                merchantArray.push(merchant);
            })
        }

        return (
            <View style={{flex:1}}>

                {/* header bar */}
                <View style={[{flex:1,paddingTop:16,backgroundColor:'#387ef5',padding:10,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>

                    <TouchableOpacity ref="menu" style={{flex:1,marginBottom:5}}
                                      onPress={()=>{
                                              this.goBack();
                                          }}>
                        <Icon name="angle-left" color="#fff" size={30}></Icon>
                    </TouchableOpacity>

                    <Text style={{fontSize:22,flex:4,textAlign:'center',color:'#fff'}}>
                        {username}
                    </Text>

                    <View style={{flex:1}}>

                    </View>
                </View>


                <View style={{flex:20,padding:10,paddingTop:5}}>

                    <View style={[styles.row,{borderWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa',marginBottom:5,paddingLeft:12,paddingRight:12}]}>

                        <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text >已获取本次建议价格</Text>
                        </View>
                    </View>

                    <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5}]}>

                        <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text >区域:</Text>
                        </View>
                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                            <Text style={{marginLeft:8,}}>测试区</Text>
                        </View>

                        <View style={{flex:2,borderWidth:1,borderLeftWidth:0,borderColor:'#aaa',paddingRight:5,alignItems:'flex-start',justifyContent:'center'}}>

                            <TouchableOpacity onPress={()=>{ this.show('actionSheet1'); }}>
                                <Icon name="angle-down" color="#aaa" size={30}></Icon>
                                <ActionSheet
                                    ref={(o) => {
                                        this.actionSheet1 = o;
                                    }}
                                    title="请选择区域"
                                    options={merchantArray}
                                    cancelButtonIndex={CANCEL_INDEX}
                                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                    onPress={
                                        (data)=>{ this._handlePress1(data); }
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                        <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text>开始日期:</Text>
                        </View>
                        <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                            <Text>{surveyDetail.priceStartDate}</Text>
                        </View>
                    </View>
                    <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                        <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text >商品条码:</Text>
                        </View>
                        <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                            <Text>{surveyDetail.codigo}</Text>
                        </View>
                    </View>
                    <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                        <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text >商品名称:</Text>
                        </View>
                        <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                            <Text> {surveyDetail.nombre}</Text>
                        </View>
                    </View>

                    {
                        (price==undefined&&price1==undefined&&price2==undefined)||(price!==undefined&&surveyDetail.modifyerId==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格一:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <TextInput
                                        style={{height:28,fontSize:12}}
                                        onChangeText={(price) => {
                                            this.state.price = price;
                                            this.setState({price:price,price1:price,modifyType:1})
                                        }
                                        }
                                        value={this.state.price1+''}
                                        placeholder='请输入价格'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />

                                </View>
                            </View>:
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格一:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{surveyDetail.price+''}</Text>
                                </View>
                            </View>
                    }

                    {
                        (price==undefined&&price1==undefined&&price2==undefined)||(price!==undefined&&surveyDetail.modifyerId==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格来源一:</Text>
                                </View>
                                {
                                    this.state.internetId==null?
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{internetArray[surveyDetail.internetId]}</Text>
                                        </View>:
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{internetArray[this.state.internetId]}</Text>
                                        </View>
                                }
                                <View style={{flex:2,borderWidth:1,borderLeftWidth:0,borderColor:'#aaa',paddingRight:5,alignItems:'flex-start',justifyContent:'center'}}>

                                    <TouchableOpacity onPress={()=>{ this.show('actionSheet2'); }}>
                                        <Icon name="angle-down" color="#aaa" size={30}></Icon>
                                        <ActionSheet
                                            ref={(o) => {
                                        this.actionSheet2 = o;
                                    }}
                                            title="请选择价格来源一"
                                            options={internetArray}
                                            cancelButtonIndex={CANCEL_INDEX}
                                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                            onPress={
                                        (data)=>{ this._handlePress2(data); }
                                    }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>:

                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格来源一:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{internetArray[surveyDetail.internetId]}</Text>
                                </View>
                            </View>

                    }

                    {
                        (price==undefined&&price1==undefined&&price2==undefined)||(price!==undefined&&surveyDetail.modifyerId==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >大卖一:</Text>
                                </View>
                                {
                                    this.state.storeId==null?
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{storeArray[surveyDetail.storeId]}</Text>
                                        </View>:
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{storeArray[this.state.storeId]}</Text>
                                        </View>
                                }

                                <View style={{flex:2,borderWidth:1,borderLeftWidth:0,borderColor:'#aaa',paddingRight:5,alignItems:'flex-start',justifyContent:'center'}}>

                                    <TouchableOpacity onPress={()=>{ this.show('actionSheet3'); }}>
                                        <Icon name="angle-down" color="#aaa" size={30}></Icon>
                                        <ActionSheet
                                            ref={(o) => {
                                        this.actionSheet3 = o;
                                    }}
                                            title="请选择大卖一"
                                            options={storeArray}
                                            cancelButtonIndex={CANCEL_INDEX}
                                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                            onPress={
                                        (data)=>{ this._handlePress3(data); }
                                    }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>:
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >大卖一:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{storeArray[surveyDetail.storeId]}</Text>
                                </View>
                            </View>

                    }

                    {
                        (price!==undefined&&surveyDetail.modifyerId!==merchantId&&price1==undefined)||(price1!==undefined&&surveyDetail.modifyerId1==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text>价格二:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <TextInput
                                        style={{height:28,fontSize:12}}
                                        onChangeText={(price) => {
                                            this.state.price = price;
                                            this.setState({price:price,price2:price,modifyType:1})
                                        }
                                        }
                                        value={this.state.price2+''}
                                        placeholder='请输入价格'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>:
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text>价格二:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{surveyDetail.price2}</Text>
                                </View>
                            </View>
                    }

                    {
                        (price!==undefined&&surveyDetail.modifyerId!==merchantId&&price1==undefined)||(price1!==undefined&&surveyDetail.modifyerId1==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格来源二:</Text>
                                </View>
                                {
                                    this.state.internetId==null?
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{internetArray[surveyDetail.internetId1]}</Text>
                                        </View>:
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{internetArray[this.state.internetId]}</Text>
                                        </View>
                                }
                                <View style={{flex:2,borderWidth:1,borderLeftWidth:0,borderColor:'#aaa',paddingRight:5,alignItems:'flex-start',justifyContent:'center'}}>

                                    <TouchableOpacity onPress={()=>{ this.show('actionSheet4'); }}>
                                        <Icon name="angle-down" color="#aaa" size={30}></Icon>
                                        <ActionSheet
                                            ref={(o) => {
                                        this.actionSheet4 = o;
                                    }}
                                            title="请选择价格来源二"
                                            options={internetArray}
                                            cancelButtonIndex={CANCEL_INDEX}
                                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                            onPress={
                                        (data)=>{ this._handlePress4(data); }
                                    }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>:

                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格来源二:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{internetArray[surveyDetail.internetId1]}</Text>
                                </View>
                            </View>

                    }

                    {
                        (price!==undefined&&surveyDetail.modifyerId!==merchantId&&price1==undefined)||(price1!==undefined&&surveyDetail.modifyerId1==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >大卖二:</Text>
                                </View>
                                {
                                    this.state.storeId==null?
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{storeArray[surveyDetail.storeId1]}</Text>
                                        </View>:
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{storeArray[this.state.storeId]}</Text>
                                        </View>
                                }
                                <View style={{flex:2,borderWidth:1,borderLeftWidth:0,borderColor:'#aaa',paddingRight:5,alignItems:'flex-start',justifyContent:'center'}}>

                                    <TouchableOpacity onPress={()=>{ this.show('actionSheet5'); }}>
                                        <Icon name="angle-down" color="#aaa" size={30}></Icon>
                                        <ActionSheet
                                            ref={(o) => {
                                        this.actionSheet5 = o;
                                    }}
                                            title="请选择大卖二"
                                            options={storeArray}
                                            cancelButtonIndex={CANCEL_INDEX}
                                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                            onPress={
                                        (data)=>{ this._handlePress5(data); }
                                    }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>:
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >大卖二:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{storeArray[surveyDetail.storeId1]}</Text>
                                </View>
                            </View>

                    }

                    {
                        (price2==undefined&&price!==undefined&&price1!==undefined&&surveyDetail.modifyerId!==merchantId&&surveyDetail.modifyerId1!==merchantId)
                        ||(price2!==undefined&&surveyDetail.modifyerId2==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>
                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格三:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <TextInput
                                        style={{height:28,fontSize:12}}
                                        onChangeText={(price) => {
                                            this.state.price = price;
                                            this.setState({price:price,price3:price,modifyType:1})
                                        }
                                        }
                                        value={this.state.price3+''}
                                        placeholder='请输入价格'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>:
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>
                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格三:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{surveyDetail.price3}</Text>
                                </View>
                            </View>

                    }

                    {
                        (price2==undefined&&price!==undefined&&price1!==undefined&&surveyDetail.modifyerId!==merchantId&&surveyDetail.modifyerId1!==merchantId)
                        ||(price2!==undefined&&surveyDetail.modifyerId2==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格来源三:</Text>
                                </View>
                                {
                                    this.state.internetId==null?
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{internetArray[surveyDetail.internetId2]}</Text>
                                        </View>:
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{internetArray[this.state.internetId]}</Text>
                                        </View>
                                }
                                <View style={{flex:2,borderWidth:1,borderLeftWidth:0,borderColor:'#aaa',paddingRight:5,alignItems:'flex-start',justifyContent:'center'}}>

                                    <TouchableOpacity onPress={()=>{ this.show('actionSheet6'); }}>
                                        <Icon name="angle-down" color="#aaa" size={30}></Icon>
                                        <ActionSheet
                                            ref={(o) => {
                                        this.actionSheet6 = o;
                                    }}
                                            title="请选择价格来源三"
                                            options={internetArray}
                                            cancelButtonIndex={CANCEL_INDEX}
                                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                            onPress={
                                        (data)=>{ this._handlePress6(data); }
                                    }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>:
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >价格来源三:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{internetArray[surveyDetail.internetId2]}</Text>
                                </View>
                            </View>

                    }

                    {
                        (price2==undefined&&price!==undefined&&price1!==undefined&&surveyDetail.modifyerId!==merchantId&&surveyDetail.modifyerId1!==merchantId)
                        ||(price2!==undefined&&surveyDetail.modifyerId2==merchantId)?
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >大卖三:</Text>
                                </View>
                                {
                                    this.state.storeId==null?
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{storeArray[surveyDetail.storeId2]}</Text>
                                        </View>:
                                        <View style={{flex:8,borderWidth:1,borderRightWidth:0,borderColor:'#aaa',marginLeft:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                            <Text style={{marginLeft:8,}}>{storeArray[this.state.storeId]}</Text>
                                        </View>
                                }
                                <View style={{flex:2,borderWidth:1,borderLeftWidth:0,borderColor:'#aaa',paddingRight:5,alignItems:'flex-start',justifyContent:'center'}}>

                                    <TouchableOpacity onPress={()=>{ this.show('actionSheet7'); }}>
                                        <Icon name="angle-down" color="#aaa" size={30}></Icon>
                                        <ActionSheet
                                            ref={(o) => {
                                        this.actionSheet7 = o;
                                    }}
                                            title="请选择大卖三"
                                            options={storeArray}
                                            cancelButtonIndex={CANCEL_INDEX}
                                            destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                            onPress={
                                        (data)=>{ this._handlePress7(data); }
                                    }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>:
                            <View style={[styles.row,{marginBottom:5,paddingLeft:5,paddingRight:5,borderWidth:0}]}>

                                <View style={{flex:4,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                    <Text >大卖三:</Text>
                                </View>
                                <View style={{flex:10,borderWidth:1,borderColor:'#aaa',marginLeft:8,padding:5,justifyContent:'center'}}>
                                    <Text>{storeArray[surveyDetail.storeId2]}</Text>
                                </View>
                            </View>
                    }


                </View>

                <View style={{flex:1,height:40,flexDirection:'row',marginBottom:5,justifyContent:'center',alignItems:'center'}}>

                    <TouchableOpacity style={{flex:1,height:30,flexDirection:'row',marginRight:15,marginLeft:15,
                        justifyContent:'center',alignItems:'center',backgroundColor:'#387ef5',borderRadius:6}}
                        onPress={()=>{ this.submit() }}>
                        <View>
                            <Text style={{color:'#fff'}}>提交</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1,height:30,flexDirection:'row',marginRight:15,marginLeft:15,
                        justifyContent:'center',alignItems:'center',backgroundColor:'#387ef5',borderRadius:6}}
                                      onPress={()=>{ this.navigatePriceSurvey() }}>
                        <View style={{flex:1,height:30,flexDirection:'row',marginRight:15,marginLeft:15,
                        justifyContent:'center',alignItems:'center',backgroundColor:'#387ef5',borderRadius:6}}>
                            <Text style={{color:'#fff'}}>返回</Text>
                        </View>
                    </TouchableOpacity>
                </View>

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
        height:28,
    },

});



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username,
    sessionId:state.user.sessionId,
    })
)(MultiPrices);

