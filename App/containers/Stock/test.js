import React, { Component } from 'react';
import {
    NetInfo,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Dimensions,
    } from 'react-native';
var dataArray = ["page one", "page two","page three","page four","page five","page six",];
var Screen_Width = Dimensions.get('window').width;
var Screen_Height = Dimensions.get('window').height;
import {connect} from 'react-redux';

class test extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        var ds = new ListView.DataSource({
            rowHasChanged:(row1, row2) => row1 != row2,
        });
        this.state = {
            dataSource:ds.cloneWithRows(dataArray),
        };
    }



    render() {
        return (
            <ListView
                ref = {(listView) => {this._listView = listView}}
                style = {styles.container}
                dataSource = {this.state.dataSource}
                renderRow={this._renderRow}
                horizontal = {true}
                showsHorizontalScrollIndicator = {true}
                pagingEnabled = {true}
                onScroll = {(event) => {
                        this._scroll(event);
                   }}
                >
            </ListView>
        );
    }

    _renderRow(rowData) {
        return(
            <View style = {styles.cellStyle} >
                <Text style = {styles.textStyle} >
                    {rowData}
                </Text>
            </View>
        );
    }

    _scroll(event) {
        var scrollView = event.nativeEvent;
        var x = scrollView.contentOffset.x;
        console.log(x);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    cellStyle: {
        flex:1,
        width:Screen_Width,
        height:Screen_Height,
        justifyContent:'center',
        alignItems:'center',
    },
    textStyle: {
        fontSize:25,
        color:'red',
    }
});
module.exports = connect(state => ({
    })
)(test);