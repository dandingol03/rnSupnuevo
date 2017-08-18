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
var Popover = require('react-native-popover');

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var Proxy = require('../proxy/Proxy');
import Config from '../../config';
import CodesModal from '../components/modal/CodesModal';
import Group from './Group';
import GroupQuery from './AddCommodityToGroup/GroupQuery';

import GoodUpdate from './GoodUpdate';
import GoodAdd from './GoodAdd';
import GroupManage from './GroupManage/index';

import PriceSurvey from './PriceSurvey/PriceSurvey';
import Camera from 'react-native-camera';

import sale from './Sale/Sale';

class Query extends Component{

    closeCodesModal(val){
        this.setState({codesModalVisible:val,goods:{},selectedCodeInfo:{},priceShow:null,hasCodigo:false});
    }

    showPopover(ref){
        this.refs[ref].measure((ox, oy, width, height, px, py) => {
            this.setState({
                menuVisible: true,
                buttonRect: {x: px+20, y: py+40, width: 200, height: height}
            });
        });
    }

    closePopover(){
        this.setState({menuVisible: false});
    }

    setHasCodigo(){
        this.setState({hasCodigo:false});
    }

    reset(){
        var printType={type1:'0',type2:'0',type3:'0',type4:'0'};
        this.setState({hasCodigo:false,selectedCodeInfo:{},priceShow:null,printType:printType});
    }

    onCodigoSelect(code)
    {
        const merchantId=this.props.merchantId;
        var codigo=code.codigo;

        Proxy.post({
            url:Config.server+"/func/commodity/getSupnuevoBuyerPriceFormByCodigoMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
           //body: "codigo=" + codigo + "&supnuevoMerchantId=" + merchantId
            body:{
                codigo:codigo,
                supnuevoMerchantId:merchantId
            }
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

            var printType = goodInfo.printType;
            for(var i = 0 ; i < printType.length; i++){
                var j = i + 1;
                var type = "type" + j;
               this.state.printType[type]=printType.charAt(i);

            }
            var newPrintType = this.state.printType;
            this.state.goods.codeNum = 0;
            var goods = this.state.goods;
            this.setState({selectedCodeInfo: goodInfo,codigo:codigo,priceShow:goodInfo.priceShow,
                inputPrice:goodInfo.priceShow,printType:newPrintType,goods:goods,hasCodigo:true});
        }, (err) =>{
            this.setState({codesModalVisible:false});

            setTimeout(()=>{
                Alert.alert(
                    '错误',
                    err,
                    [
                        {text: 'OK', onPress: () => {
                        }},
                    ]
                );
            },900)

        });
    }

    queryGoodsCode(codeNum){

        const { merchantId } = this.props;

        var sessionId = this.props.sessionId;

        Proxy.postes({
            url:Config.server+'/func/commodity/getQueryDataListByInputStringMobile',
            headers: {
                'Content-Type': 'application/json',
                'Cookie':sessionId,
            },
            body: {
                codigo:codeNum,
                merchantId:merchantId
            }
        }).then((json)=>{
            var errorMsg=json.message;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);

            }else{
                if(json.array!==undefined&&json.array!==null&&json.array.length>0){
                    var codes=json.array;
                    this.setState({codes: codes,codesModalVisible:true});
                }
                else{
                    var code = {codigo:json.object.codigo,commodityId:json.object.commodityId}
                    this.onCodigoSelect(code);
                }
            }
        }).catch((err) =>{
            alert(err);
        });

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

    navigateGoodAdd(){
        const { navigator } = this.props;
        const {merchantId}=this.props;

        Proxy.post({
            url:Config.server+'/func/commodity/getSupnuevoCommodityTaxInfoListMobile',
            //url:Config.server+'supnuevo/supnuevoGetSupnuevoCommodityTaxInfoListMobile.do',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
            //body:"merchantId=" + merchantId
            body:{
                merchantId:merchantId
            }
        },(json)=> {

            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                var taxArr = new Array();
                var sizeArr = new Array();
                json.taxArr.map(function(index,i){
                    taxArr.push(index);
                })
                json.sizeArr.map(function(index,i){
                    sizeArr.push(index);
                })
                for(var i = 0 ; i < taxArr.length;i++){
                    var o = {'value':'','label':''};
                    o.label = taxArr[i].label;
                    o.value = taxArr[i].value;
                    this.state.taxArr.push(o);
                }
                for(var i = 0 ; i < sizeArr.length;i++){
                    var o = {'value':'','label':''};
                    o.label = sizeArr[i].label;
                    o.value = sizeArr[i].value;
                    this.state.sizeArr.push(o);
                }

                if(navigator) {
                    navigator.push({
                        name: 'goodAdd',
                        component: GoodAdd,
                        params: {
                            merchantId:merchantId,
                            taxArr:this.state.taxArr,
                            sizeArr: this.state.sizeArr,
                            onCodigoSelect:this.onCodigoSelect.bind(this),
                        }
                    })
                }

            }
        },(err) =>{
            setTimeout(()=>{
                Alert.alert(
                    '错误',
                    err,
                    [
                        {text: 'OK', onPress: () => {
                        }},
                    ]
                );
            },900)

        });
    }

    navigateGoodUpdate(){
        const { navigator } = this.props;
        const {merchantId}=this.props;

        Proxy.post({
            url:Config.server+'/func/commodity/getSupnuevoCommodityTaxInfoListMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json'
            },
           // body:"merchantId=" + merchantId
            body:{
                merchantId:merchantId
            }
        },(json)=> {

            var errorMsg=json.errorMsg;
            if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                alert(errorMsg);
            }else{
                var taxArr = new Array();
                var sizeArr = new Array();
                json.taxArr.map(function(index,i){
                    taxArr.push(index);
                })
                json.sizeArr.map(function(index,i){
                    sizeArr.push(index);
                })
                for(var i = 0 ; i < taxArr.length;i++){
                    var o = {'value':'','label':''};
                    o.label = taxArr[i].label;
                    o.value = taxArr[i].value;
                    this.state.taxArr.push(o);
                }
                for(var i = 0 ; i < sizeArr.length;i++){
                    var o = {'value':'','label':''};
                    o.label = sizeArr[i].label;
                    o.value = sizeArr[i].value;
                    this.state.sizeArr.push(o);
                }

                if(this.state.selectedCodeInfo.codigo!=undefined&&this.state.selectedCodeInfo.codigo!=null&&this.state.selectedCodeInfo.codigo!=''){
                    if(navigator) {
                        navigator.push({
                            name: 'goodUpdate',
                            component: GoodUpdate,
                            params: {
                                merchantId:merchantId,
                                goodInfo:this.state.selectedCodeInfo,
                                taxArr:this.state.taxArr,
                                sizeArr: this.state.sizeArr,
                                onCodigoSelect:this.onCodigoSelect.bind(this),
                                setHasCodigo:this.setHasCodigo.bind(this),
                                reset:this.reset.bind(this)
                            }
                        })
                    }
                }else{
                    alert('请先选择要修改的商品！');
                }
            }
        },(err) =>{
            setTimeout(()=>{
                Alert.alert(
                    '错误',
                    err,
                    [
                        {text: 'OK', onPress: () => {
                        }},
                    ]
                );
            },900)

        });
    }

    navigateGroupMaintain(){
        const { navigator } = this.props;

        if(navigator) {
            navigator.push({
                name: 'groupMaintain',
                component: GroupManage,
                params: {
                }
            })
        }
    }

    navigatePriceSurvey(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'priceSurvey',
                component: PriceSurvey,
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
                        goodInfo:this.state.selectedCodeInfo,
                        reset:this.reset.bind(this)
                    }
                })
            }
        }else{
            alert('所选商品无法进行组改价');
        }
    }

    updatePrice(price){

        var goodInfo = this.state.selectedCodeInfo;
        goodInfo.price=price;
        goodInfo.price1=price;
        goodInfo.priceShow=price;
        this.setState({selectedCodeInfo: goodInfo,priceShow:goodInfo.priceShow,inputPrice:price, taxMark:0,
            amount:0});
    }

    addIVA(){
        var taxMark = this.state.taxMark;

        if(taxMark >= 0){
            taxMark = 1;
        }else if(taxMark < 0){
            taxMark = 0;
        }

        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + taxMark * this.state.selectedCodeInfo.iva)*(1 + this.state.amount) *100))/100;
        this.state.selectedCodeInfo.priceShow=this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({taxMark: taxMark,priceShow:priceShow});
    }

    addPercentage1(){
        var amount =  this.state.amount + 0.1;
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + this.state.taxMark * this.state.selectedCodeInfo.iva)*(1 + amount) *100))/100;
        this.state.selectedCodeInfo.priceShow= this.state.selectedCodeInfo.price;
        var priceShow =  this.state.selectedCodeInfo.priceShow;
        this.setState({amount:amount,priceShow:priceShow});
    }

    addPercentage2(){
        var amount =  this.state.amount + 0.05;
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + this.state.taxMark * this.state.selectedCodeInfo.iva)*(1 + amount) *100))/100;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({amount:amount,priceShow:priceShow});
    }

    zero(){
        this.state.selectedCodeInfo.price = parseInt(this.state.selectedCodeInfo.price);
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price.toFixed(2);
        var priceShow =  this.state.selectedCodeInfo.priceShow;
        this.setState({priceShow:priceShow});
    }

    reduceIVA(){
        var taxMark = this.state.taxMark;

        if(taxMark <= 0){
            taxMark = -1;
        }else if(taxMark > 0){
            taxMark = 0;
        }
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + taxMark * this.state.selectedCodeInfo.iva)*(1 + this.state.amount) *100))/100;
        this.state.selectedCodeInfo.priceShow=this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({taxMark: taxMark,priceShow:priceShow});
    }

    reducePercentage1(){
        var amount =  this.state.amount - 0.1;
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + this.state.taxMark * this.state.selectedCodeInfo.iva)*(1 + amount) *100))/100;
        this.state.selectedCodeInfo.priceShow= this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({amount:amount,priceShow:priceShow});
    }

    reducePercentage2(){
        var amount =  this.state.amount - 0.05;
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + this.state.taxMark * this.state.selectedCodeInfo.iva)*(1 + amount) *100))/100;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({amount:amount,priceShow:priceShow});
    }

    zero1(){
        this.state.selectedCodeInfo.price =parseInt( this.state.selectedCodeInfo.price)+0.50;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price.toFixed(2);
        var priceShow =  this.state.selectedCodeInfo.priceShow ;
        this.setState({priceShow:priceShow});
    }

    savePrice(){
        var priceShow =this.state.selectedCodeInfo.priceShow;
        var priceId = this.state.selectedCodeInfo.priceId;
        var commodityId = this.state.selectedCodeInfo.commodityId;
        var codigo = this.state.selectedCodeInfo.codigo;
        var printType = this.state.selectedCodeInfo.printType;
        var code = {codigo:codigo};


        const {merchantId}=this.props;

        if(priceShow !== null && priceShow !== undefined && priceShow !== ''){

            Proxy.post({
                url:Config.server+'/func/commodity/saveOrUpdateSupnuevoBuyerCommodityPriceMobile',
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json'
                },
                //body:"merchantId=" + merchantId + "&price=" + priceShow+ "&commodityId=" + commodityId+ "&printType=" + printType+ "&codigo=" + codigo
                body:{
                    merchantId:merchantId,
                    price:priceShow,
                    commodityId:commodityId,
                    printType:printType,
                    codigo:codigo
                }
            },(json)=> {

                var errorMsg=json.errorMsg;
                if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
                    alert(errorMsg);
                }else{
                    var message = json.message;
                    alert(message);
                   // this.onCodigoSelect(code);
                    this.reset();
                }
            });

        }else{
            alert('请输入查询商品后再进行改价!');
        }


    }

    updatePrintType1(printType1){
        this.state.printType.type1 = printType1;
        var printType =  this.state.printType;
        this.state.selectedCodeInfo.printType = printType.type1+printType.type2+printType.type3+printType.type4;
        var selectCodeInfo = this.state.selectedCodeInfo.printType;
        this.setState({printType:printType,selectCodeInfo:selectCodeInfo});
    }

    updatePrintType2(printType2){
        this.state.printType.type2 = printType2;
        var printType =  this.state.printType;
        this.state.selectedCodeInfo.printType = printType.type1+printType.type2+printType.type3+printType.type4;
        var selectCodeInfo = this.state.selectedCodeInfo.printType;
        this.setState({printType:printType,selectCodeInfo:selectCodeInfo});
    }

    updatePrintType3(printType3){
        this.state.printType.type3 = printType3;
        var printType =  this.state.printType;
        this.state.selectedCodeInfo.printType = printType.type1+printType.type2+printType.type3+printType.type4;
        var selectCodeInfo = this.state.selectedCodeInfo.printType;
        this.setState({printType:printType,selectCodeInfo:selectCodeInfo});
    }

    updatePrintType4(printType4){
        this.state.printType.type4 = printType4;
        var printType =  this.state.printType;
        this.state.selectedCodeInfo.printType = printType.type1+printType.type2+printType.type3+printType.type4;
        var selectCodeInfo = this.state.selectedCodeInfo.printType;
        this.setState({printType:printType,selectCodeInfo:selectCodeInfo});
    }

    closeCamera(){
        this.setState({cameraModalVisible:false});
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
            priceShow:null,
            inputPrice:null,
            taxMark:0,
            amount:0,
            taxArr:[],
            sizeArr:[],
            printType:{type1:'0',type2:'0',type3:'0',type4:'0'},
            hasCodigo:false,
            cameraModalVisible:false,
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto
            },
            barcodeX:null,
            barcodeY:null,
            barcodeWidth:null,
            barcodeHeight:null,
        };
    }

    render(){

        var username = this.props.username;
        var codigo = this.state.selectedCodeInfo.codigo;
        var goodName = this.state.selectedCodeInfo.goodName;
        var oldPrice = this.state.selectedCodeInfo.oldPrice;
        var suggestPrice = this.state.selectedCodeInfo.suggestPrice==undefined||this.state.selectedCodeInfo.suggestPrice==null?null:this.state.selectedCodeInfo.suggestPrice;
        var fixedPrice =null;
        var prientType = this.state.printType;

        var displayArea = {x: 5, y: 20, width:width, height: height - 25};

        return (
            <View style={{flex:1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{backgroundColor:'#387ef5',height:55,padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>

                        <Text style={{fontSize:20,flex:4,textAlign:'center',color:'#fff'}}>
                            Supnuevo(3.0)-{username}
                        </Text>
                        <TouchableOpacity ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center'}}
                                          onPress={this.showPopover.bind(this, 'menu')}>
                            <Icon name="chevron-circle-left" color="#fff" size={30}></Icon>
                        </TouchableOpacity>
                    </View>


                    <View style={{padding:10}}>

                        {/*输入条码*/}
                        <View style={[styles.row,{borderBottomWidth:0}]}>

                            <View style={{flex:1,borderWidth:1,borderColor:'#ddd',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <TextInput
                                    style={{flex:8,height: 50,paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6}}
                                    onChangeText={(codeNum) => {
                                    if(codeNum.toString().length==13||codeNum.toString().length==12||codeNum.toString().length==8)
                                    {
                                        this.state.goods.codeNum=codeNum;
                                        this.setState({goods:this.state.goods});
                                        this.queryGoodsCode(codeNum.toString());
                                    }
                                    else{
                                        if(codeNum!==undefined&&codeNum!==null){
                                            this.state.goods.codeNum=codeNum;
                                            this.setState({goods:this.state.goods});
                                        }
                                    }
                                }}
                                    value={this.state.goods.codeNum}

                                    placeholder='请输入商品条码尾数'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />

                                <TouchableOpacity style={{flex:2,height: 40,marginRight:10,paddingTop:6,paddingBottom:6,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            marginBottom:0,borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}
                                                  onPress={()=>{
                                                      if(this.state.goods.codeNum!==undefined&&this.state.goods.codeNum!==null){
                                                           var codeNum = this.state.goods.codeNum;
                                                            if(codeNum.toString().length>=4&&codeNum.toString().length<=13){
                                                                this.queryGoodsCode(this.state.goods.codeNum.toString());
                                                            }
                                                            else{
                                                         Alert.alert(
                                                            '提示信息',
                                                            '请输入4-13位的商品条码进行查询',
                                                                [
                                                                {text: 'OK', onPress: () => console.log('OK Pressed!')},
                                                                ]
                                                            )
                                                          }
                                                      }
                                                      else{
                                                         Alert.alert(
                                                            '提示信息',
                                                            '请输入4-13位的商品条码进行查询',
                                                                [
                                                                {text: 'OK', onPress: () => console.log('OK Pressed!')},
                                                                ]
                                                            )
                                                          }

                                                  }}>

                                        <Text style={{color:'#fff',fontSize:12}}>查询</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flex:2,height: 40,marginRight:10,paddingTop:6,paddingBottom:6,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            marginBottom:0,borderRadius:4,backgroundColor:'rgba(17, 17, 17, 0.6)'}}
                                                  onPress={()=>{
                                                      this.setState({cameraModalVisible:true})
                                                  }}>

                                    <View>
                                        <Text style={{color:'#fff',fontSize:12}}>扫码</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>

                        {/* 价位横幅 */}
                        <View style={[styles.row,{borderBottomWidth:0,height:50,backgroundColor:'#eee',marginTop:12,marginBottom:5}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center', marginRight:.5,alignItems:'center',
                            borderWidth:1,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
                                <Text style={{'fontSize':14,color:'#444'}}>原价位</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center', marginRight:.5,alignItems:'center', borderWidth:1,borderRightWidth:0,borderLeftWidth:0}}>
                                <Text style={{'fontSize':14,color:'#444'}}>建议价位</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center', borderWidth:1,
                            borderTopRightRadius:4,borderBottomRightRadius:4}}>
                                <Text style={{'fontSize':14,color:'#444'}}>固定价位</Text>
                            </View>
                        </View>

                        {/* 三个无意义的大方块 */}
                        <View style={[styles.row,{borderBottomWidth:0,height:50}]}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>

                                <TouchableOpacity style={{justifyContent:'center'}}
                                    onPress={
                                    ()=>{
                                        this.updatePrice(oldPrice);
                                    }}>
                                    <Text style={{'fontSize':14,color:'#fff'}}>{oldPrice}</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5}}>
                                {
                                    suggestPrice==undefined||suggestPrice==null?
                                        <Text style={{'fontSize':14,color:'#fff'}}></Text>:
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrice(suggestPrice);
                                    }}>
                                            <Text style={{'fontSize':14,color:'#fff'}}>{suggestPrice}</Text>
                                        </TouchableOpacity>


                                }
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4}}>
                                {
                                    fixedPrice==undefined||fixedPrice==null?
                                        <Text style={{'fontSize':14,color:'#fff'}}></Text>:
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrice(fixedPrice);
                                    }}>
                                            <Text style={{'fontSize':14,color:'#fff'}}>{fixedPrice}</Text>
                                        </TouchableOpacity>

                                }
                            </View>
                        </View>

                        {/*商品概要*/}
                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',
                                padding:8,marginBottom:1,marginTop:8}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
                                <Text>商品条码:</Text>
                            </View>
                            <View style={{flex:7,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                <Text>{codigo}</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:0,borderColor:'#aaa',
                                padding:8,marginBottom:1}]}>
                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4}}>
                                <Text>商品名称:</Text>
                            </View>
                            <View style={{flex:7,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                <Text>{goodName}</Text>
                            </View>
                        </View>

                        <View style={[styles.row,{borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1,borderColor:'#aaa',borderBottomColor:'#aaa'
                            ,paddingLeft:8,paddingRight:12}]}>

                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text >更新改价:</Text>
                            </View>
                            <View style={{flex:7}}>
                                <TextInput
                                    style={{height: 50,alignItems:'center'}}
                                    onChangeText={(priceShow) => {

                                        this.state.selectedCodeInfo.priceShow=priceShow;
                                        this.state.inputPrice=priceShow;
                                        this.setState({priceShow:priceShow,inputPrice:priceShow,taxMark:0,amount:0,});

                                }}

                                    value={''+(this.state.priceShow!==undefined&&this.state.priceShow!==null?this.state.priceShow.toString():'')}
                                    placeholder='在此输入您的价格'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginTop:12,marginBottom:12}]}>

                            {/*标签*/}
                            {
                                prientType.type1==0?
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#eee',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrintType1('1');
                                    }}>
                                            <Text style={{'fontSize':14,color:'#444'}}>标签</Text>
                                        </TouchableOpacity>
                                    </View>:
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{``
                                        this.updatePrintType1('0');
                                    }}>
                                            <Text style={{'fontSize':14,color:'#fff'}}>标签</Text>
                                        </TouchableOpacity>

                                    </View>

                            }

                            {/*大折扣*/}
                            {
                                prientType.type2==0?
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#eee',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrintType2('1');
                                    }}>
                                            <Text style={{'fontSize':14,color:'#444'}}>大折扣</Text>
                                        </TouchableOpacity>
                                    </View>:
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrintType2('0');
                                    }}>
                                            <Text style={{'fontSize':14,color:'#fff'}}>大折扣</Text>
                                        </TouchableOpacity>

                                    </View>

                            }

                            {/*中折扣*/}
                            {
                                prientType.type3==0?
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#eee',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrintType3('1');
                                    }}>
                                            <Text style={{'fontSize':14,color:'#444'}}>中折扣</Text>
                                        </TouchableOpacity>
                                    </View>:
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrintType3('0');
                                    }}>
                                            <Text style={{'fontSize':14,color:'#fff'}}>中折扣</Text>
                                        </TouchableOpacity>

                                    </View>

                            }

                            {/*小折扣*/}
                            {
                                prientType.type4==0?
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#eee',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrintType4('1');
                                    }}>
                                            <Text style={{'fontSize':14,color:'#444'}}>小折扣</Text>
                                        </TouchableOpacity>
                                    </View>:
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}>
                                        <TouchableOpacity style={{justifyContent:'center'}}
                                                          onPress={
                                    ()=>{
                                        this.updatePrintType4('0');
                                    }}>
                                            <Text style={{'fontSize':14,color:'#fff'}}>小折扣</Text>
                                        </TouchableOpacity>

                                    </View>

                            }

                        </View>

                        {/*包含8个按钮的按钮组*/}
                        <View style={[styles.row,{borderBottomWidth:0,height:50}]}>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderRightWidth:1,borderRightColor:'#fff',marginRight:1,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}
                                              onPress={
                                    ()=>{
                                        this.addIVA();
                                    }}>
                                    <Text style={{color:'#fff',fontSize:20}}>+IVA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderRightWidth:1,borderRightColor:'#fff',alignItems:'center'}}
                                              onPress={
                                    ()=>{
                                        this.addPercentage1();
                                    }}>

                                    <Text style={{color:'#fff',fontSize:20}}>+10%</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderRightWidth:1,borderRightColor:'#fff',alignItems:'center'}}
                                              onPress={
                                    ()=>{
                                        this.addPercentage2();
                                    }}>

                                    <Text style={{color:'#fff',fontSize:20}}>+5%</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center'}}
                                              onPress={
                                    ()=>{
                                        this.zero();
                                    }}>

                                    <Text style={{color:'#fff',fontSize:20}}>.00</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginTop:4}]}>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderRightWidth:1,borderRightColor:'#fff',marginRight:1,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}
                                              onPress={
                                    ()=>{
                                        this.reduceIVA();
                                    }}>

                                    <Text style={{color:'#fff',fontSize:20}}>-IVA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderRightWidth:1,borderRightColor:'#fff',alignItems:'center'}}
                                              onPress={
                                    ()=>{
                                        this.reducePercentage1();
                                    }}>
                                    <Text style={{color:'#fff',fontSize:20}}>-10%</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderRightWidth:1,borderRightColor:'#fff',alignItems:'center'}}
                                              onPress={
                                    ()=>{
                                        this.reducePercentage2();
                                    }}>
                                    <Text style={{color:'#fff',fontSize:20}}>-5%</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                borderTopRightRadius:4,borderBottomRightRadius:4,alignItems:'center'}}
                                              onPress={
                                    ()=>{
                                        this.zero1();
                                    }}>
                                    <Text style={{color:'#fff',fontSize:20}}>0.50</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row,{borderBottomWidth:0,height:50,marginTop:12}]}>
                            <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',backgroundColor:'#387ef5',
                                    marginRight:.5,borderTopLeftRadius:4,borderBottomLeftRadius:4,alignItems:'center'}}
                                onPress={
                                    ()=>{
                                        this.savePrice();
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

                        </View>

                    </View>

                    <Popover
                        isVisible={this.state.menuVisible}
                        fromRect={this.state.buttonRect}
                        displayArea={displayArea}
                        onClose={()=>{this.closePopover()
                        }}>

                        {
                            this.state.hasCodigo==false?
                                <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd'}]}
                                                  onPress={()=>{
                                              console.log('choose add commodity');
                                              this.closePopover();
                                              this.navigateGoodAdd();
                                          }}>
                                    <Text style={[styles.popoverText,{color:'#444'}]}>维护商品信息</Text>
                                </TouchableOpacity>:
                                <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd'}]}
                                                  onPress={()=>{
                                              console.log('choose add commodity');
                                              this.closePopover();
                                              this.navigateGoodUpdate();
                                          }}>
                                    <Text style={[styles.popoverText,{color:'#444'}]}>维护商品信息</Text>
                                </TouchableOpacity>

                        }

                        <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd'}]}
                                          onPress={()=>{
                                              this.closePopover();
                                              this.navigateGroupQuery();
                                          }}>
                            <Text style={[styles.popoverText,{color:'#444'}]}>组商品管理</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd'}]}
                                          onPress={()=>{
                                              this.closePopover();
                                              this.navigateGroupMaintain();
                                          }}>
                            <Text style={[styles.popoverText,{color:'#444'}]}>商品组维护</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd'}]}
                                          onPress={()=>{
                                              this.closePopover();
                                              this.navigatePriceSurvey();
                                          }}>
                            <Text style={[styles.popoverText,{color:'#444'}]}>商品价格调查</Text>
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

                    {/*camera part*/}
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.cameraModalVisible}
                        onRequestClose={() => {alert("Modal has been closed.")}}
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
                            onBarCodeRead={(barcode)=>{
                                var{type,data,bounds}=barcode;

                                if(data!==undefined&&data!==null){
                                  console.log('barcode data='+data+'barcode type='+type);

                                this.state.goods.codeNum = data;
                                var goods =  this.state.goods;
                                goods.codeNum = data;
                                this.queryGoodsCode(data);
                                this.closeCamera();


                                }

                            }}
                        />

                        <View style={[styles.box]}>

                        </View>
                        <View style={{ position: 'absolute',right: 1/2*width-100,top: 1/2*height,
                            height:100,width:200,borderTopWidth:1,borderColor:'#e42112',backgroundColor:'transparent'}}>

                        </View>

                        <View style={[styles.overlay,styles.bottomOverlay]}>

                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={()=>{this.closeCamera()}}
                            >
                                <Icon name="times-circle" size={50} color="#343434" />
                            </TouchableOpacity>

                        </View>


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
        height:50,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
    discountUnselected:{
        flex:1,flexDirection:'row',
        justifyContent:'center',
        backgroundColor:'#eee',
        marginRight:.5,
        borderTopLeftRadius:4,
        borderBottomLeftRadius:4,
        alignItems:'center'
    },
    discountSelected:{
        flex:1,flexDirection:'row',
        justifyContent:'center',
        backgroundColor:'#387ef5',
        marginRight:.5,
        borderTopLeftRadius:4,
        borderBottomLeftRadius:4,
        alignItems:'center'
    },
    popoverContent: {
        width: 140,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize:18
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    box:{
        position: 'absolute',
        right: 1/2*width-100,
        top: 1/2*height-100,
        height:200,
        width:200,
        borderWidth:1,
        borderColor:'#387ef5',
        backgroundColor:'transparent'

    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
});



module.exports = connect(state=>({
        merchantId:state.user.supnuevoMerchantId,
        username:state.user.username,
        sessionId:state.user.sessionId
    })
)(Query);

