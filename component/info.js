import React, { Component } from 'react';
import { ScrollView, TextInput, StyleSheet, AsyncStorage, View } from 'react-native';
import { Item, Input, Right, Text, Body, Icon, Button, Title, Card, CardItem,Content,ListItem,List,Left,Switch } from 'native-base';
import moment from 'moment';
import 'moment/locale/vi';
import { config } from './../env'

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        }
        moment.locale('vi');
    }
    componentDidMount() {
        this.loadData();
    }
    loadData = async () => {
        const self = this;
        console.log("ok");
        const token = await AsyncStorage.getItem('token');
        console.log(token);

        if (token !== null) {
            fetch(config.apihost + '/api/student/events', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            }).then(res => res.json())
                .catch(error => alert("Lỗi khi nhận thông tin"))
                .then(response => {
                    if (response.success) {
                        if(response.data.length==0){
                            alert("Bạn chưa tham gia sự kiện nào")
                        }
                        self.state.data = response.data;
                        self.setState(self.state);
                        console.log("state", response.filename);
                    }else{
                        console.log(response);
                        alert("Có lỗi xảy ra khi lấy thông tin");
                    }
                });
        }
    }
    render() {
        list = this.state.data.map((data) => {
            return (
                <View style={{padding:9,backgroundColor:"#fff",borderBottomWidth:1,borderBottomColor:"#ccc"}}>
                    <Text>{data.event.header} - {moment(data.event.time_start).format("DD/MM/YYYY")}</Text>
                    
                </View>
            )
        })
        return (
            <Content>
            {list}
            </Content>
        )
    }
}
export default Info;