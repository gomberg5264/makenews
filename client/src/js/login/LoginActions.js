
import AjaxClient from "../utils/AjaxClient";
import DbSession from "../db/DbSession";
import UserSession from "../user/UserSession";
import AppSessionStorage from "../utils/AppSessionStorage";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export function userLogin(history, userName, password) {
    return dispatch => {
        let ajax = AjaxClient.instance("/login", true);
        const headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        const data = { "username": userName, "password": password };
        ajax.post(headers, data)
            .then(successData => {
                let userSession = UserSession.instance();
                userSession.setLastAccessedTime();
                let appSessionStorage = AppSessionStorage.instance();
                appSessionStorage.setValue(AppSessionStorage.KEYS.USERNAME, successData.userName);
                appSessionStorage.setValue(AppSessionStorage.KEYS.REMOTEDBURL, successData.dbParameters.remoteDbUrl);
                DbSession.instance().then(session => { //eslint-disable-line no-unused-vars
                    dispatch(loginSuccess(successData.userName));
                    history.push("/newsBoard");
                });
            })
            .catch(errorData => { //eslint-disable-line no-unused-vars
                dispatch(loginFailed("Invalid user name or password"));
            });
    };
}

export function loginSuccess(userName) {
    return { "type": LOGIN_SUCCESS, userName };
}

export function loginFailed(responseMessage) {
    return { "type": LOGIN_FAILED, responseMessage };
}
