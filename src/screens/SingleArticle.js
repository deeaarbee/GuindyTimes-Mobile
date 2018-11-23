import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    AsyncStorage,
    Button,
    Image,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    Modal, ToastAndroid
} from 'react-native';
import {Container, Content, Card, CardItem, Body, Input, List, ListItem, Badge, Icon, Header, Left, Right} from "native-base";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { material, human } from 'react-native-typography'
import HTMLView from 'react-native-htmlview';
import {SingleArticleURL} from "../utils/API"
import {singleArticle} from "../utils/Functions"
import Spinner from 'react-native-loading-spinner-overlay';
import OfflineNotice from "../components/OfflineNotice";

export default class SingleArticle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            slug: this.props.navigation.state.params.slug,
            headerImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2000px-Solid_white.svg.png",
            closeImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2000px-Solid_white.svg.png",
            article_data: {content:"",author_list:[], genre: '',},
            loading: false
        };
    }


    static navigationOptions = ({ navigation  }) => ({
        // title: "Article",
        headerTransparent: true,
    });

    async componentDidMount(){
        await this.setState({loading: true});
        let article_url = SingleArticleURL + this.props.navigation.state.params.slug ;
        singleArticle(article_url).then((data)=>{
            this.setState({article_data: data, headerImage: "https://guindytimes.com/" + data.image,
                closeImage: "https://guindytimes.com/" + data.image, loading: false})
        }).catch((error) => {
            this.setState({loading: false});
            ToastAndroid.show('Cannot retrieve Article.',1000);
            this.props.navigation.navigate("Home");
        });
    }

    _parseDateTime(datetime){
        if (datetime){
            var date = new Date(Date.parse(datetime));
            return date.toString().slice(0,16)
        }
        else
            return

    }

    renderNode(node, index, siblings, parent, defaultRenderer) {
        if (node.name == 'img') {
            const a = node.attribs;
            return ( <Image key={"img"} style={{width: 300, height: 300, alignContent: 'center'}} source={{uri: "https://guindytimes.com" + a.src}}/> );
        }
    }


    render() {

        return (
            <Container>

                <HeaderImageScrollView
                    key={"rootview"}
                    maxHeight={200}
                    headerImage={{uri: this.state.headerImage}}
                    // renderHeader={() => <View style={{justifyContent: 'center', alignSelf: 'center', height: 50}}><Text style={{fontSize:16, fontWeight:'bold'}}>Article</Text></View>}
                    minHeight={55}
                >
                    <OfflineNotice/>
                    <ScrollView key={"mainview"}>
                    <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

                        <TriggeringView key={"abc"}
                                        onDisplay={() => this.setState({headerImage: this.state.closeImage})}>

                            <Text key={"title"} style={[material.headline, {alignSelf: "center", marginBottom: 15}]}>{this.state.article_data.title}</Text>


                            <View key={"date"}>
                                <Text key={"datetext"} style={{alignSelf: 'center'}}>{this._parseDateTime(this.state.article_data.created_at)}</Text>
                            </View>


                            <View key={"genre"}>
                                <Text key={"gentext"} style={{alignSelf: 'center'}}>{"Genre - " +this.state.article_data.genre.charAt(0).toUpperCase() + this.state.article_data.genre.slice(1) }</Text>
                            </View>


                            <View key={"trigview"} style={{marginBottom: 30}}>
                                <Text key={"authors"} style={[material.subheading, {alignSelf: 'center'}]}> Author(s) </Text>

                                {this.state.article_data.author_list.map((item) => {
                                    return(
                                        <Text key={item} style={[material.subheading, {alignSelf: 'center'}]}>{item}</Text>
                                    )
                                })}
                            </View>


                            <HTMLView
                                key={"html"}
                                style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}}
                                renderNode={this.renderNode}
                                addLineBreaks={false}
                                stylesheet={richTextStyles}
                                value={this.state.article_data.content.replace(new RegExp('<p>', 'g'), '<span>')
                                    .replace(new RegExp('</p>', 'g'), '</span>')}
                            />
                        </TriggeringView>
                    </ScrollView>
                </HeaderImageScrollView>
            </Container>
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
    },
});

const richTextStyles = StyleSheet.create({
    p: {
        marginLeft:30,
        marginRight: 60,
        fontSize: 18,

    },
    img: {
        alignSelf: 'center'
    }

})
