import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    Linking,
    Alert,
    ToastAndroid
} from 'react-native';
import {Text, Container} from "native-base";
import { simpleGet } from "../utils/Functions";
import { AllNews } from "../utils/API";
import Swiper from 'react-native-deck-swiper';
import {material} from "react-native-typography";
import Ionicons from 'react-native-vector-icons/Ionicons';
import OfflineNotice from "../components/OfflineNotice";


export default class News extends Component {

    constructor(props) {
        super(props);
        this._goto = this._goto.bind(this);
        state = {
            spinner: false,
            news_data: [{image: "https://www.freeiconspng.com/uploads/loading-icon-png-loader-5.png"}],
            flag: 0
        };
    }
    state = {
        spinner: false,
        news_data: [{image: "https://www.freeiconspng.com/uploads/loading-icon-png-loader-5.png"}],
        flag: 0
    };


    componentDidMount() {
        simpleGet(AllNews).then((data) =>{ if (data.length > 1) this.setState({news_data: data})}).catch((error) => {
            ToastAndroid.show('Cannot retrieve News.',1000);
        }).done();
    }

    _handleRefresh(){

        simpleGet(AllNews).then((data) =>{ if (data.length > 1) {
            ToastAndroid.show('Refreshing News feed.',400);
            this.setState({news_data: data})};
        }).catch((error) => {
            ToastAndroid.show('Cannot retrieve News.',1000);
        }).done();
    }

    _goto(cardIndex){

        if(this.state.news_data.length === 1)
            Alert.alert("Loading the latest news.");
        else if (cardIndex === 0){
            if (this.state.flag === 0)
                this.setState({flag: 1})
            else
                if (this.state.news_data[cardIndex].reference)
                    Linking.openURL(this.state.news_data[cardIndex].reference)
                else
                    Linking.openURL("https://guindytimes.com/")
        }
        else if (this.state.news_data[cardIndex].reference)
            Linking.openURL(this.state.news_data[cardIndex].reference)
        else
            Linking.openURL("https://guindytimes.com/")
    }

    _getDate(date){
        if(date){
            return new Date(date).toString().slice(0, 21)
            }
            else
        {
            return
        }
        }




    render() {
        return (
            <View style={styles.container}>
            <StatusBar
                    backgroundColor="#000000"
                    barStyle="light-content"
                />

            <Swiper
                cards={this.state.news_data}
                infinite={true}
                renderCard={(card) => {
                    if(card.image && this.state.news_data.length === 1){
                        var img = "https://upstreamgroup.com/wp-content/uploads/LoadingIcon.png";
                    }
                    else if(card.image) {
                        var img = "https://guindytimes.com/" + card.image;
                    }
                    else {
                        var img = "https://guindytimes.com/static/mainsite/images/gttrans.png";
                    }
                    return (
                        <View style={styles.card}>
                             <Image source={{uri: img}}
                               style={{height: 180, width: (Platform.OS === 'ios') ? 250 : 250, alignSelf:"center"}} />

                            <Text style={styles.title}>{card.title}</Text>
                            <Text style={styles.description}>{card.description}</Text>
                            <Text style={styles.date}>{this._getDate(card.created_at)}</Text>


                        </View>
                    )
                }}
                onSwipedAll={() => { ToastAndroid.show('You\'re All Caught Up',1000);}}
                cardIndex={0}
                backgroundColor={'#000000'}
                goBackToPreviousCardOnSwipeBottom={true}
                onTapCard={this._goto}
                onTapCardDeadZone={0}
                stackSize= {this.state.news_data.length}>
                <OfflineNotice />
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={[material.titleWhite, {fontSize: 20, alignSelf: 'center', marginTop: 10, marginLeft: 110}]}>News</Text>
                        <TouchableOpacity  style={{marginLeft: 15, marginTop: 10}} onPress={ ()=>{ Linking.openURL('https://guindytimes.com/news')}}>
                            <Ionicons name="md-exit" size={28} color={"white"}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity  style={{marginLeft: 90, marginTop: 10}} onPress={ ()=> this._handleRefresh()}>
                        <Ionicons name="md-refresh" size={28} color={"white"}/>
                    </TouchableOpacity>
                </View>
            </Swiper>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

      },
      card: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginBottom: 40
      },
      title: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        backgroundColor: 'transparent'
      },
      description: {
        textAlign: 'center',
        fontSize: 13,
        marginTop: 5
      },
      date: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 5,
        fontWeight: '100'

      }
});
