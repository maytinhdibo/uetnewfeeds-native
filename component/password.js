import React, { Component } from 'react';
import { Platform, StyleSheet, ScrollView, View,AsyncStorage } from 'react-native';
import { StatusBar, Image } from 'react-native';
import { Right, CardItem, Body, Icon, Button, Text, Input, ListItem } from 'native-base';
import { config } from './../env';

export default class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            old: '111111',
            newp: '111111',
            re: '111111'
        }
    }
    change =  async() => {
        const { old, newp, re } = this.state;
        if (re != newp) {
            alert("Mật khẩu bạn nhập không khớp");
        } else {
            const self = this;
            const token = await AsyncStorage.getItem('token');

            if (token !== null) {
                fetch(config.apihost + '/api/change_password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    body: JSON.stringify({ password: old,newPassword:newp })
                }).then(res => res.json())
                    .catch(error => alert("Lỗi không xác định"))
                    .then(response => {
                        if (response.success) {
                            alert("Bạn đã đổi mật khẩu thành công!");
                        } else {
                            console.log(response);
                            alert(response.message);
                        }
                    });
            }
        }
    }
    render() {
        return (

            <View
                style={{ background: "#fff", flex: 1 }}
            >
                <ListItem icon>
                    <Body>
                        <Text>Mật khẩu cũ</Text>
                    </Body>
                    <Right style={{ textAlign: 'right' }}>
                    </Right>
                    <Input
                        secureTextEntry
                        style={{ backgroundColor: "rgba(0,0,0,0)", position: "absolute", right: 22, textAlign: 'right', width: "50%", color: "#888" }}
                        onChangeText={old => this.setState({ old })}
                        value={this.state.old} />

                </ListItem>

                <ListItem icon>
                    <Body>
                        <Text>Mật khẩu mới</Text>
                    </Body>
                    <Right>
                    </Right>
                    <Input
                        secureTextEntry
                        style={{ backgroundColor: "rgba(0,0,0,0)", position: "absolute", right: 22, textAlign: 'right', width: "50%", color: "#888" }}
                        onChangeText={newp => this.setState({ newp })}
                        value={this.state.newp} />
                </ListItem>

                <ListItem icon>
                    <Body>
                        <Text>Nhập lại mật khẩu</Text>
                    </Body>
                    <Right>
                    </Right>
                    <Input
                        secureTextEntry
                        style={{ backgroundColor: "rgba(0,0,0,0)", position: "absolute", right: 22, textAlign: 'right', width: "50%", color: "#888" }}
                        onChangeText={re => this.setState({ re })}
                        value={this.state.re} />
                </ListItem>
                <Button
                    onPress={this.change}
                    block
                    style={{
                        margin: 12,
                        marginTop: 16
                    }}><Text>Đổi mật khẩu</Text></Button>

            </View>
        );
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F5FCFF',
            },
            title: {
                fontSize: 18,
                fontWeight: '500',
                color: '#345'
            },
            instructions: {
                textAlign: 'center',
                color: '#333333',
                marginBottom: 5,
            },
            content: {
                color: '#456'
            }
        });
    }

}
