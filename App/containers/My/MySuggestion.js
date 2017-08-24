import React, {Component} from 'react';
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
import {connect} from 'react-redux';
import Config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
var Proxy = require('../../proxy/Proxy');
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');

class MySuggestion extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            suggestion: null,
        };
    }

    subsuggestion() {
        var suggestion = this.state.suggestion;
        Proxy.post({
            url: Config.server + "/func/merchant/submitSupnuevoMerchantQuestionInfoMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                content: suggestion
            }
        }, (json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            }
            else{
                alert('提交成功');
                this.navigatorMy();
            }
        });
    }

    navigatorMy(){
        var My=require('./My');
        this.props.navigator.push({
            component:My,
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={{
                    backgroundColor: '#387ef5',
                    height: 55,
                    padding: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        height: 45,
                        marginRight: 10,
                        marginTop:10
                    }}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>
                {/* body */}
                <View style={{
                flex:1
                }}>
                    <TextInput
                        style={{
                                        height: 150,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        paddingTop: 6,
                                        paddingBottom: 6,
                                        borderColor:'#ddd',
                                        borderBottomWidth:1,
                                        fontSize:20
                                    }}
                        onChangeText={(suggestion)=>{
                            this.state.suggestion=suggestion;
                            this.setState({suggestion: this.state.suggestion});
                    }}
                        multiline={true}
                        value={this.state.suggestion}
                        placeholder='想要回复，留下QQ'
                        placeholderTextColor="#aaa"
                        underlineColorAndroid="transparent"
                        />
                    <TouchableOpacity style={{ backgroundColor: '#CAE1FF',
                    marginTop:20,marginLeft:120, marginRight: 120, borderRadius: 4,flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'}}
                                      onPress={() => {
                                      var suggestion=this.state.suggestion;
                                       if (suggestion !== undefined && suggestion !== null)
                                      this.subsuggestion();
                                      else
                                      alert('没写东西');
                                      }}>
                        <Text style={{'fontSize': 30, color: 'black'}}>提交</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({});

module.exports = connect(state => ({
        username: state.user.username,
    })
)(MySuggestion);

