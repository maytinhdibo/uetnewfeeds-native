import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, View, KeyboardAvoidingView } from 'react-native';
import { StatusBar, Image } from 'react-native';
import { Content, Input, Item, Text, Spinner, Icon, Button, Title } from 'native-base';
import { config } from './../env'
import { Permissions, Notifications } from 'expo';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mssv: '',
            password: '',
            token: '',
            load: false
        }


    }
    registerForPushNotificationsAsync = async () => {
        const self = this;
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            // return;
        }
        console.log("đang gửi mè")

        let token = await Notifications.getExpoPushTokenAsync();
        console.log(token)
        console.log(self.state.token);
        fetch(config.apihost + "/api/notification/work_with_token", {
            method: 'PUT',
            body: JSON.stringify({ token: token }),
            headers: {
                'Content-Type': 'application/json',
                'token': self.state.token
            },
        }).then(
            console.log("đã gửi")
        );
        // this.login();
    }
    login = () => {
        const self = this;
        var data = {
            user: this.state.mssv,
            password: this.state.password
        }
        this.state.load = true;
        this.setState(this.state);
        fetch(config.apihost + "/api/login", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(error => {
                alert(error.message);
                this.state.load = false;
                this.setState(this.state);
            })
            .then(response => {
                if (response.success) {
                    console.log(response);
                    AsyncStorage.setItem('mssv', String(response.mssv));
                    AsyncStorage.setItem('role', String(response.role_id));
                    self.setState({ token: response.accessToken })
                    self.registerForPushNotificationsAsync();
                    AsyncStorage.setItem('token', response.accessToken).then(
                        this.props.navigation.navigate('Home')
                    );

                } else {
                    this.state.load = false;
                    this.setState(this.state);
                    alert(response.message);
                }
            });
            this.registerForPushNotificationsAsync();
    }
    render() {
        return (
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    alignItems:"center"
                }}
                behavior="padding" enabled
            >
                <Image
                    style={{
                        flex: 1,
                        height: "100%",
                        resizeMode: 'cover'
                    }}
                    source={require('./../img/bg.png')}
                />
               
               <Image
               style={{height:100,width:100,position:"absolute",top:"25%"}}
                    source={require('./../img/icon.png')}
                />
                <KeyboardAvoidingView
                    style={{width:"100%",padding:40,paddingBottom:12,backgroundColor:"#fff"}}
                >
                    <Text style={{
                        fontSize: 24,
                        marginBottom: 10,
                        fontWeight:"bold",
                        color: "rgba(0,0,0,0.8)"
                    }}>Đăng nhập UET Newsfeed</Text>
                    <Item>
                        <Icon active name='contact' />
                        <Input value={this.state.mssv}
                            autoCapitalize='none'
                            onChangeText={mssv => this.setState({ mssv })}
                            style={styles.input} placeholder="MSSV" />
                    </Item>

                    <Item>
                        <Icon active name='lock' />
                        <Input secureTextEntry
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                            style={styles.input}
                            placeholder="Password" />
                    </Item>
                    <Button block info
                        onPress={this.login}
                        style={{ backgroundColor: "#1e88e5", borderRadius: 0,marginTop:12 }}
                    >
                        <Text>
                            Đăng nhập</Text></Button>
                    {this.state.load ? <Spinner size={0} color='#aaf' /> : <Text />}
                </KeyboardAvoidingView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    input: {
      backgroundColor: "rgba(254,254,254,0.95)",
      borderRadius:12,
      padding:6,
      margin:6
    }
  });
