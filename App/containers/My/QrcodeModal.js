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
import QRCode from 'react-native-qrcode';

class QrcodeModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState(nextProps)
    }


    constructor(props)
    {
        super(props);
        this.state={
            text:this.props.supnuevoMerchantId.toString()
        }
    }

    render(){


        return (

            <View style={{flex:1}}>
                {/* header bar */}
                <View style={[{backgroundColor:'#387ef5',height:55,padding: 12,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <TouchableOpacity ref="menu" style={{flex:1,marginRight:2,flexDirection:'row',justifyContent:'center',alignItems: 'flex-end'}}
                                      onPress={()=>{
                                              this.close();
                                          }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>

                    <Text style={{fontSize:20,flex:5,textAlign:'center',color:'#fff'}}>
                        Supnuevo(3.0)-{this.props.username}
                    </Text>

                    <View style={{flex:1}}>

                    </View>
                </View>

                <View style={{flex:height-55, alignItems: 'center',justifyContent: 'center'}}>
                    <QRCode
                        value={this.state.text}
                        size={200}
                        bgColor='black'
                        fgColor='white'/>
                </View>
            </View>
        );
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
});


module.exports = QrcodeModal;

