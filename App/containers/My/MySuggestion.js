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
var proxy = require('../../proxy/Proxy');
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
        proxy.postes({
            url: Config.server + "/func/merchant/submitSupnuevoMerchantQuestionInfoMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                content: suggestion
            }
        }).then((json)=> {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            }
            else {
                alert('提交成功');
                this.navigatorMy();
            }
        }).catch((err)=>{alert(err);});
    }

    navigatorMy() {
        var My = require('./My');
        this.props.navigator.push({
            component: My,
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
                        marginLeft:10,
                        marginRight:10,
                        marginTop:30,
                                        height: 150,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        paddingTop: 6,
                                        paddingBottom: 6,
                                        borderColor:'#ddd',
                                        borderWidth:1,
                                        fontSize:20
                                    }}
                        onChangeText={(suggestion)=>{
                            this.state.suggestion=suggestion;
                            this.setState({suggestion: this.state.suggestion});
                    }}
                        multiline={true}
                        value={this.state.suggestion}
                        placeholder='如果您想要得到回复，请留下QQ'
                        placeholderTextColor="#aaa"
                        underlineColorAndroid="transparent"
                        />
                    <TouchableOpacity style={{ backgroundColor: '#CAE1FF',
                    marginTop:20,marginLeft:150, marginRight: 150,
                     paddingTop:5,paddingBottom:5,
                     borderRadius: 4,flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'}}
                                      onPress={() => {
                                      var suggestion=this.state.suggestion;
                                       if (suggestion !== undefined && suggestion !== null)
                                      this.subsuggestion();
                                      else
                                      alert('您没有填写任何信息');
                                      }}>
                        <Text style={{'fontSize': 15, color: 'black'}}>提交</Text>
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