/**
 * Created by dingyiming on 2016/12/14.
 */

import React,{Component} from 'react';

import  {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import GridView from 'react-native-grid-view';
import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');


class CodesModal extends Component{

    close(){
        if(this.props.onClose!==undefined&&this.props.onClose!==null)
        {
            this.props.onClose();
        }
    }

    onCodigoSelect(code){
        if(this.props.onCodigoSelect!==undefined&&this.props.onCodigoSelect!==null)
        {
            this.props.onCodigoSelect(code);
        }
    }


    renderRow(rowData){

        var row=
            <View>
                <TouchableOpacity onPress={
                    function() {
                        //TODO:close this modal
                        this.close();
                        this.onCodigoSelect(rowData);
                    }.bind(this)}>
                    <View style={{flex:1,flexDirection:'row',padding:13,borderBottomWidth:1,borderColor:'#ddd',justifyContent:'flex-start'}}>
                        <Text style={{fontSize:20,color:'#323232'}}>{rowData.codigo}</Text>
                    </View>
                </TouchableOpacity>

            </View>;

        return row;
    }


    constructor(props)
    {
        super(props);
        const {codes}=this.props;
        this.state={
            codes:codes
        }
    }

    render(){

        var listView=null;
        const {codes}=this.props;
        if(codes!==undefined&&codes!==null&&Object.prototype.toString.call(codes)=='[object Array]')
        {

            var data=codes;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView=
                <ScrollView>
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(data)}
                        renderRow={this.renderRow.bind(this)}

                    />
                </ScrollView>;
        }else{}


        return (
            <View style={{flex:1,backgroundColor:'#f0f0f0'}}>

                {/*header*/}
                <View style={[{backgroundColor:'#11c1f3',padding:4,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1,paddingLeft:10}}>
                        <TouchableOpacity onPress={
                            ()=>{
                                this.close();
                            }
                        }>
                            <Icon name="times-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:17,flex:3,textAlign:'center',color:'#fff'}}>
                        选择条型码
                    </Text>
                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                    </View>
                </View>

                {/*条型码列表*/}
                <View style={{padding:10}}>
                    {listView}
                    <View style={{height:50,width:width}}>
                    </View>
                </View>


            </View>
        );
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
        borderTopColor:'#fff'
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
        paddingTop:16,
        paddingBottom:16,
        borderBottomWidth:1,
        borderBottomColor:'#222'
    },
    list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems:'flex-start'
    },
    item: {
        backgroundColor: '#fff',
        borderRadius:4,
        margin: 3,
        width: 100,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:10,
        marginRight:10
    },
    selectedItem:{
        backgroundColor: '#63c2e3',
        borderRadius:4,
        margin: 3,
        width: 100,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:10,
        marginRight:10
    },
    listView: {
        paddingTop: 20,
        backgroundColor: 'transparent',
    },
    thumb: {
        width: 30,
        height: 30,
    }
});


module.exports = CodesModal;
