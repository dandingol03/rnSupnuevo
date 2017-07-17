/**
 * Created by dingyiming on 2017/4/7.
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
    TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';

class NetInfoDemo extends Component {

    constructor(props){
        super(props);
        this.state = {
            connectionInfo: null,
            connectionInfoHistory: [],
        };
    }
    componentDidMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );
    }

    componentWillUnmount() {
        NetInfo.removeEventListener(
            'change',
            this._handleConnectionInfoChange
        );
    }

    _handleConnectionInfoChange(connectionInfo){
        const connectionInfoHistory = this.state.connectionInfoHistory.slice();
        connectionInfoHistory.push(connectionInfo);

        this.setState({
            connectionInfoHistory,
        });
    }

    render() {
        return (
            <View >
                <Text style={styles.welcome}>
                    当前的网络状态
                </Text>
                <Text>{JSON.stringify(this.state.connectionInfoHistory)}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    welcome: {
        fontSize: 16,
        textAlign: 'left',
        margin: 10,
    },
});

export default NetInfoDemo;
