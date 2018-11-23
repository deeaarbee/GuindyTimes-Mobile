import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TextInput,
    Alert,
    Modal,
    Dimensions,
    FlatList,
    Linking,
    Platform,
    RefreshControl,
    StatusBar,
    TouchableOpacity, ToastAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Container, Content,
        Card, CardItem, Body, Text} from "native-base";
import { material, human } from 'react-native-typography';
import {ArticlePage} from "../utils/API";
import {simpleGet} from "../utils/Functions"
import Spinner from 'react-native-loading-spinner-overlay';
import OfflineNotice from "../components/OfflineNotice";

const window = Dimensions.get('window');

export default class Articles extends React.Component {

    constructor(props) {
        super(props);
        this._handleRefresh = this._handleRefresh.bind(this);
        this.state = {
            all_articles: [],
            refreshing: false,
            loading: false
        };
    }

    static navigationOptions = ({ navigation  }) => ({
        title:"The Guindy Times",

    });


    async componentDidMount(){

        await this.setState({loading: true})
        simpleGet(ArticlePage).then((data) => { this.setState(
             {
                 all_articles: data.latest_articles,
                 loading: false
             }
             )}).catch((error) => {
                 this.setState({
                     loading: false,
                     error: true
                 });
             ToastAndroid.show('Cannot retrieve Articles.',1500);
         }).done();

    }

    async _handleRefresh(){
        await this.setState({refreshing: true})
        await simpleGet(ArticlePage).then((data) => { this.setState(
            {
                all_articles: data.latest_articles,
                refreshing: false,
                error:false
            }
        )}).catch((error) => {
            this.setState({
                loading: false,
                error: true,
                refreshing: false
            });
            ToastAndroid.show('Cannot retrieve Articles.',1500);
        }).done();
    }


    _renderArticleCards(item){

        return(
                <Card style={{flex: 0, marginLeft:7, marginRight: 7 , borderRadius:10, borderWidth: 1, overflow: 'hidden'}}>
                    <CardItem cardBody button onPress={() => this.props.navigation.navigate('SingleArticle', {slug: item.slug})}
                              style={{height:150}}>
                        <Body>
                        <Image source={{uri: "https://guindytimes.com/"+item.image}}
                               style={{height: null, width: (Platform.OS === 'ios') ? 342 : 326, flex: 1, alignSelf:"center"}}
                        />
                        </Body>
                    </CardItem>
                    <CardItem button onPress={() => this.props.navigation.navigate('SingleArticle', {slug: item.slug})} >
                        <Body>
                        <Text style={material.title}>{item.title}</Text>
                        </Body>
                    </CardItem>
                </Card>
        )
    }

    _renderErrorPage(){
         if (this.state.error)
         return (<Image source={require("../assets/ghost.png")} style={{height: 300, width: 250, marginTop: 60, alignSelf: 'center', justifyContent: 'center'}}/>
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
                        <Text style={[material.title, {marginLeft:18}]}>{"Latest Articles"}</Text>
                    </View>


                    <TouchableOpacity  style={{marginLeft: 173}} onPress={ ()=>{ Linking.openURL('https://guindytimes.com/articles/1')}}>
                        <Ionicons name="md-exit" size={28} color={"black"}/>
                    </TouchableOpacity>

                </View>

                {this._renderErrorPage()}

                <Content padder key={"cont"}>
                <FlatList
                    data={this.state.all_articles}
                    renderItem={({item}) => this._renderArticleCards(item)}
                    keyExtractor={(item, index) => item.id.toString()}
                    key={(item, index) => index.toString() }

                />
                </Content>


            </ScrollView>
        );
    }
}

const styles =  StyleSheet.create({
    container: {
        flex: 5,
        marginLeft:130,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerTextStyle: {
        color: '#000000'
      }
});
