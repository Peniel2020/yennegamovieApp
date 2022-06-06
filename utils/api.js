import axios from 'axios';

let baseUrl = "https://www.yennegamovie.com"

// let baseUrl = "http://10.0.0.99:3000"
let key = "2713C357-A67F-4072-819D-BEDA0B992F90"

let api = {
    loginUrl: () =>{
        // return testBaseUrl + "/login?tvToken=";
        return baseUrl + "/login?tvToken=";
    },

    getMovieList: () => {
        var uri = baseUrl + "/tv-api/get-media/" + key;
        // var testUri = testBaseUrl + "/tv-api/get-media/" + key;
        // return axios.get(testUri)
        return axios.get(uri)
        .then((response) => {
            // console.log('response: ', response)
            return response;
        }).catch(err => {
            //console.log('err: ', err)
            return {media: [], error: err};
        })
    },

    generateDeviceID: () => {
        var uri = baseUrl + "/tv-api/generate-uuid";
        // var testUri = testBaseUrl + "/tv-api/generate-uuid";
        // return axios.get(testUri)
        return axios.get(uri)
        .then((response) => {
            // console.log('response: ', response)
            return response.data;
        }).catch(err => {
            //console.log('err: ', err)
            return {media: [], error: err};
        })
    },
    
    hasNewMovie: (data) => {
        var uri = baseUrl + "/tv-api/hasNewMovie";
        // var testUri = testBaseUrl + "/tv-api/hasNewMovie";
        // return axios.post(testUri, data)
        return axios.get(uri)
        .then((response) => {
            // console.log('response: ', response)
            return response.data;
        }).catch(err => {
            //console.log('err: ', err)
            return {media: [], error: err};
        })
    },

    retreiveUserData: (data) => {
        var uri = baseUrl + '/tv-api/retreive-user-data';
        // var testUri = testBaseUrl + '/tv-api/retreive-user-data';
        return axios.post(uri, data).then((res) => {
        // return axios.post(testUri, data).then((res) => {
            return res;
        });
    },

    rent: (data) => {
        var uri = baseUrl + '/tv-api/rent';
        // var testUri = testBaseUrl + '/tv-api/rent';
        return axios.post(uri, data).then((res) => {
        // return axios.post(testUri, data).then((res) => {
            return res;
        });
    }
    
}

export default api;

/*
        return axios.post(uri, data).then((res) => {
            console.log("searchPromo: ", res.data);
            return res;
        }).catch(err => {
            //console.log('err: ', err)
            return {data: [], error: err};
        })
*/