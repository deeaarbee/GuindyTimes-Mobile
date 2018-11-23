import axios from "axios";
import {AllArticles} from "../utils/API";
import {AsyncStorage} from "react-native";

export  async function getArticles(URL, page, genre) {

    return axios.get(URL+genre+"/"+page)
        .then(function (response) {
            // console.log(response.data);
            return response.data.data.results
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

export async function getAllArticles(page){
    return axios.get(AllArticles + page)
        .then(function (response) {
            // console.log(response.data);
            return response.data.data.results
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

export  async function singleArticle(URL) {

    return axios.get(URL)
        .then(function (response) {
            // console.log(response.data);
            return response.data.data
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}


export async function simpleGet(URL){
    return axios.get(URL)
        .then(function (response) {
            // console.log(response.data);
            return response.data.data
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}


export const checkFirstTime = () => {
    console.log("inside Check fiunciojd");
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('check')
            .then(res => {
                if (res === null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => reject(err));
    });
};


