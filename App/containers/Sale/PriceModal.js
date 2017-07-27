/**
 * Created by dingyiming on 2017/7/26.
 */

import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    ListView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var {height, width} = Dimensions.get('window');


class PriceModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    confirm(price)
    {
        if(this.props.onConfirm)
            this.props.onConfirm(price);
        this.close();
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState(nextProps)
    }


    constructor(props)
    {
        super(props);
        this.state={

            price:null,
        }
    }

    render(){


        return (

            <View style={{height:height*0.4,width:width*0.8,padding:5,margin:width*0.1,marginTop:100,borderColor:'#387ef5',borderWidth:1,
                backgroundColor:'#fff',borderRadius:6}}>

                <View style={{padding:10}}>
                    <View style={{flexDirection:'row',alignItems:'center',padding:4}}>
                        <Text style={{color:'#222',fontSize:17,fontWeight:'bold'}}>{this.props.commodity.nombre}价格</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',padding:4,paddingTop:15,borderBottomWidth:1,borderColor:'#387ef5'}}>
                        <TextInput
                            style={{flex:8,height: 50,paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6}}
                            onChangeText={(price) => {
                                this.setState({price:price});
                                }}
                            value={this.state.price}

                            placeholder='请输入该类商品价格'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                </View>


                <View style={{flex:1,padding:2,margin:4,flexDirection:'row',justifyContent:'center',alignItems:'flex-end'}}>
                    <TouchableOpacity style={{flex:1,padding:2,margin:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                            backgroundColor:'#fff',borderRadius:6,borderWidth:1,borderColor:'#387ef5'}}
                                      onPress={()=>{ this.close(); }}>
                        <Text style={{color:'#387ef5',padding:5}}>取消</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1,padding:2,margin:5,flexDirection:'row',justifyContent:'center',alignItems:'center',
                                backgroundColor:'#387ef5',borderRadius:6}}
                                      onPress={()=>{
                                          if(this.state.price!==null&&this.state.price!==undefined){
                                               this.confirm(this.state.price);
                                          }
                                          else{
                                              alert('请输入价格后再按确定键');
                                          }


                                      }}>
                        <Text style={{color:'#fff',padding:5}}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        borderTopWidth:0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderTopColor:'#fff'
    },
    body:{
        padding:10
    },
    row:{
        flexDirection:'row',
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
});


module.exports = PriceModal;

