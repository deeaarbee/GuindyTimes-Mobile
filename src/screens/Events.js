import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TextInput,
    Alert,
    Dimensions,
    FlatList,
    Linking,
    Platform,
    RefreshControl,
    StatusBar,
    TouchableOpacity,
    BackHandler,
    ToastAndroid,
    AsyncStorage
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Content, Card, CardItem, Body, Right, Left, Text, Badge} from "native-base";
import { material } from 'react-native-typography';
import {UpcommingEventsURL} from "../utils/API";
import {simpleGet} from "../utils/Functions"
import Modal from "react-native-modal";
import call from 'react-native-phone-call'
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import OfflineNotice from "../components/OfflineNotice";
import Toast, {DURATION} from 'react-native-easy-toast'
import SplashScreen from 'react-native-splash-screen'
import DoubleClick from "react-native-double-tap";
const window = Dimensions.get('window');

export default class Events extends React.Component {
    constructor(props) {
        super(props);
        this._handleRefresh = this._handleRefresh.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this.changeExitStatus = this.changeExitStatus.bind(this);
        this.state = {
            all_events: [],
            curr_item: {},
            refreshing: false,
            spinner: true,
            modalVisible: false,
            loading: false,
            exit: false,
            error: false,
            infoModal: false
        };
    }

    static navigationOptions = ({ navigation  }) => ({
        title:"The Guindy Times",
        headerTintColor: 'black',
        headerStyle: {
            backgroundColor: '#C92627'
        },
        headerLeft: (
            <View style={{padding: 10}}>
                <Image source={{uri: "https://guindytimes.com/static/mainsite/images/favicon.png"}} style={{height:35, width:35, marginLeft:5}}/>
            </View>
        ),
    });

    changeExitStatus(){
         this.setState({exit: false})
    }


     async componentDidMount(){

         await this.setState({loading: true});
         await simpleGet(UpcommingEventsURL).then((data) => { if(data.length) this.setState(
             {
                 all_events: data,
                 loading: false,
                 error: false
             }
             )}).catch((error) => {
             this.setState({
                 loading: false,
                 error: true
             });
             ToastAndroid.show('Cannot retrieve Events.',1000);
         }).done(()=> this.setState({loading: false}));
         AsyncStorage.setItem("check", "olduser");
         SplashScreen.hide();
    }


    utcDateToString = (momentInUTC) => {
        let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        // console.warn(s);
        return s;
      };

    static addToCalendar = (title, startDateUTC, endDateUTC, location, allday) => {
        const eventConfig = {
          title,
          startDate: moment.utc(startDateUTC).add({hours: 6, minutes: 30}).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          endDate: moment.utc(endDateUTC).add({hours: 6, minutes: 30}).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          notes: 'Ready to attend the event?',
          allDay: allday,
          location: location,
          navigationBarIOS: {
            tintColor: 'orange',
            backgroundColor: 'green',
            titleColor: 'blue',
          },
        };

        AddCalendarEvent.presentEventCreatingDialog(eventConfig)
          .then((eventInfo) => {
              // console.log(eventInfo);
              if (eventInfo.action==='CANCELED'){
                  ToastAndroid.show('User cancelled event.',1000);
              }
          })
          .catch((error) => {
              ToastAndroid.show('Cannot add event to the calender.',1000);
            // console.warn(error);
          });
      };

    async _handleRefresh(){
        await this.setState({refreshing: true});
        await simpleGet(UpcommingEventsURL).then((data) => { if(data.length > 0) this.setState(
            {
                all_events: data,
                refreshing: false,
                error: false
            });
            else
                this.setState({
                    loading: false,
                    error: true,
                    refreshing: false
                })
        }).catch((error) => {
            this.setState({
                loading: false,
                error: true,
                refreshing: false
            });
            ToastAndroid.show('Cannot retrieve Events.',1000);
        });
    }

    _viewDescription(item){
        this.setState({curr_item: item, modalVisible: true})
    }

    _closeModal(){
        this.setState({modalVisible: false, infoModal: false})
    }

    _checkOneDayEvent(startDate, endDate){
        var start = new Date(startDate)
        var end = new Date(endDate)
        if( start.getDate() === end.getDate()){
            return true
        }
        else
            return false
    }

    _renderErrorPage(){
        if (this.state.error)
            return (<Image source={require("../assets/ghost.png")} style={{height: 300, width: 250, marginTop: 65, alignSelf: 'center', justifyContent: 'center'}}/>
            )
    }


    _renderEndDate(startDate, endDate){
        var start = new Date(startDate);
        var end = new Date(endDate);
        if( start.getDate() === end.getDate()){
            return null
        }
        else{
            return (
                <View style={{alignSelf: 'center'}}>
                    <Text style={{fontSize: 16, alignSelf: 'center'}}>to</Text>
                    <Text style={{fontSize: 16, alignSelf: 'center'}}>{this._parseDateTime(this.state.curr_item.end_date)}</Text>
                </View>)
        }
    }

    _parseDateTime(datetime){
        var date = new Date(Date.parse(datetime));
        return date.toString().slice(0,16)
    }


    _renderArticleCards(item){
        var date = new Date(Date.parse(item.start_date))

        return(
                <Card style={{flex: 0, marginLeft:7, marginRight: 7, borderRadius:10,
                    borderWidth: 1, overflow: 'hidden'}}>
                <CardItem>
                <Left>
                    <Body>
                    <Text style={{fontSize:18, fontWeight: '500'}}>{item.title}</Text>
                    <Text note style={{fontSize:15}}>{item.club}</Text>
                    </Body>
                </Left>
                <Right><Badge style={{ backgroundColor: 'black', height:30, justifyContent: 'center', alignContent: 'center' }}><Text style={{fontWeight: 'bold', fontSize: 18, color: 'white' }}>{date.toString().slice(3, 10)}</Text></Badge></Right>
                </CardItem>
                <CardItem cardBody>
                <Image source={{uri: "https://guindytimes.com/"+item.image}} style={{height: 150, width: null, flex: 1}}/>
                </CardItem>
                <CardItem >
                <Left>
                    <Ionicons name="md-compass" size={30} color={"black"}/>
                    <Text>{item.venue}</Text>
                </Left>
                <Body style={{justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity  onPress={ ()=>{ this._viewDescription(item);} }>
                <Ionicons name="md-eye" size={30} color={"black"}/>
                    </TouchableOpacity>
                </Body>
                <Right>
                <TouchableOpacity  onPress={ ()=>{ Linking.openURL(item.reference)}}>
                        <Ionicons name="md-exit" size={30} color={"black"}/>
                    </TouchableOpacity>
                </Right>
                </CardItem>
                </Card>
        )
    }

    _renderNoEvents(){
        if (this.state.all_events && this.state.all_events.length === 0)
            return(
                <Card style={{flex: 0, marginLeft:7, marginRight: 7, borderRadius:10, borderWidth: 1, overflow: 'hidden'}}>
                    <CardItem >
                        <Image source={{uri: "https://guindytimes.com/static/mainsite/images/gttrans.png"}} style={{height: 150, width: null, flex: 1}}/>
                    </CardItem>
                    <CardItem >
                        <Body style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{justifyContent: 'center', alignSelf: 'center', fontSize: 18, fontWeight: "700"}}>No Upcoming Events :(</Text>
                        <Text style={{justifyContent: 'center', alignSelf: 'center', fontSize: 14, fontWeight: "100"}}>Check the website.</Text>
                        </Body>
                    </CardItem>
                </Card>
            )
    }




    render() {
        return (
            <ScrollView

                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._handleRefresh}
                    />
                }

            >
                <OfflineNotice/>

                <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

                <StatusBar
                    backgroundColor="#000000"
                    barStyle="light-content"
                />

                <View key={"latest"} style={{flexDirection: 'row', marginTop: 7}}>
                    <View key={"latesttest"}>
                        <DoubleClick
                            doubleTap={() => {
                                this.setState({infoModal: true});
                            }}
                            delay={200}
                        >
                        <Text style={[material.title, {marginLeft:18}]}>{"Upcoming Events"}</Text>
                        </DoubleClick>
                    </View>


                    <TouchableOpacity  style={{marginLeft: 147}} onPress={ ()=>{ Linking.openURL('https://guindytimes.com/events')}}>
                        <Ionicons name="md-exit" size={28} color={"black"}/>
                    </TouchableOpacity>

                </View>



                <Content padder key={"cont"}>
                    {this._renderNoEvents()}
                <FlatList
                    data={this.state.all_events}
                    renderItem={({item}) => this._renderArticleCards(item)}
                    keyExtractor={(item, index) => item.id.toString()}
                    key={(item, index) => index.toString() }

                />

                    {this._renderErrorPage()}

                <Modal isVisible={this.state.modalVisible}
                        onBackButtonPress={this._closeModal}
                >
                    <ScrollView  contentContainerStyle={{ flex: 1}}>
                        <Content padder>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <Body>
                                            <Text style={{fontSize:20}}>{this.state.curr_item.title}</Text>
                                            <Text note style={{fontSize: 17}}>{this.state.curr_item.club}</Text>
                                        </Body>
                                    </Left>
                                </CardItem>
                                <CardItem bordered>
                                <Body>
                                    <Text>{this.state.curr_item.description}</Text>
                                </Body>
                                </CardItem>
                                <CardItem bordered>
                                <Body>
                                <Text style={{fontWeight: 'bold', fontSize: 18}}>Event Date(s)</Text>
                                    <Text style={{fontSize: 16, alignSelf: 'center'}}>
                                        {this._parseDateTime(this.state.curr_item.start_date)}
                                    </Text>
                                        {this._renderEndDate(this.state.curr_item.start_date, this.state.curr_item.end_date)}
                                </Body>
                                </CardItem>

                                <CardItem bordered>
                                    <Body>
                                    <Text style={{fontWeight: 'bold', fontSize: 18}}>Venue</Text>
                                        <Text>{this.state.curr_item.venue}</Text>
                                    </Body>
                                </CardItem>

                                <CardItem bordered>
                                <Body>
                                    <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center', flex: 1}}
                                                        onPress={ ()=>{ call({number:this.state.curr_item.contact, prompt: false}).catch((error) => {
                                                            ToastAndroid.show('Cannot make a call.',1000);
                                                        })}}>
                                        <Ionicons name="md-call" size={28} color={'black'}/>
                                        <Text style={{marginTop: 5, marginLeft:5}}>Contact</Text>
                                    </TouchableOpacity>
                                </Body>
                                </CardItem>



                                <CardItem bordered>
                                <Body>
                                    <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center', flex: 1}}
                                                       onPress={() => {
                                                           Events.addToCalendar(this.state.curr_item.title,
                                                                            this.state.curr_item.start_date,
                                                                            this.state.curr_item.end_date,
                                                                            this.state.curr_item.venue,
                                                                            this._checkOneDayEvent(this.state.curr_item.start_date,
                                                                                                    this.state.curr_item.end_date));
                                                      }} >
                                        <Ionicons name="md-calendar" size={28} color={"black"}/>
                                        <Text style={{marginTop: 5, marginLeft:5}}>Add to Calender</Text>
                                    </TouchableOpacity>
                                </Body>
                                </CardItem>
                                <CardItem footer bordered>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={ ()=>{ Linking.openURL(this.state.curr_item.reference)}}>
                                        <Ionicons name="md-exit" size={28} color={"black"}/>
                                        <Text style={{marginTop: 5, marginLeft: 5}}>Website</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection: 'row', marginLeft:110, flex: 1}}  onPress={ ()=>{ this._closeModal()}}>
                                        <Ionicons name="md-close" size={28} color={"black"}/>
                                        <Text style={{marginTop: 5, marginLeft:5}}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                                </CardItem>
                            </Card>
                        </Content>
                    </ScrollView>
                </Modal>

                    <Modal isVisible={this.state.infoModal}
                           onBackButtonPress={this._closeModal}
                           style={{alignSelf: 'center', justifyContent: 'center', marginTop: 150}}
                    >
                        <ScrollView  contentContainerStyle={{ flex: 1}}>
                            <Content padder>
                                <Card>
                                    <CardItem>
                                        <Left>
                                            <Body>
                                            <Text style={{fontSize:20, alignSelf: 'center', marginRight: 24}}>The Guindy Times</Text>
                                            <Text note style={{fontSize: 15, alignSelf: 'center'}}>2018</Text>
                                            <Text note style={{fontSize: 15, alignSelf: 'center'}}>Version 0.2.1</Text>
                                            <Text note style={{fontSize: 15, alignSelf: 'center'}}>Developed by deeaarbee.</Text>
                                            <Text note style={{fontSize: 10, alignSelf: 'center'}}>© Copyright 2018 Guindy Times.</Text>
                                            </Body>
                                        </Left>
                                    </CardItem>
                                    <CardItem bordered>
                                        <Body>
                                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center', flex: 1}}
                                                          onPress={ ()=> Linking.openURL("https://guindytimes.com")}>
                                            <Ionicons name="md-globe" size={28} color={'black'}/>
                                            <Text style={{marginTop: 5, marginLeft:5}}>Official Website</Text>
                                        </TouchableOpacity>
                                        </Body>
                                    </CardItem>

                                    <CardItem footer bordered>
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={ ()=>{ Linking.openURL("https://guindytimes.com/ourteam")}}>
                                                <Ionicons name="md-contacts" size={28} color={"black"}/>
                                                <Text style={{marginTop: 5, marginLeft: 5}}>GT Team</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{flexDirection: 'row', marginLeft:100, flex: 1}}  onPress={ ()=>{ this._closeModal()}}>
                                                <Ionicons name="md-close" size={28} color={"black"}/>
                                                <Text style={{marginTop: 5, marginLeft:5}}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </CardItem>
                                </Card>
                            </Content>
                        </ScrollView>
                    </Modal>
                </Content>
                <Toast ref="toast" position='top' />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#000000'
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    }
});
