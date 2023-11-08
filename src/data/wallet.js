import  Axios from "axios"
import { BASE_URL } from "../constant"

export const getWallet = async () => {
    const userId = localStorage.getItem('userId')
    try {
        const wallet = await Axios.get(`${BASE_URL}wallet/transactions/get/${userId}`)
        return wallet.data
    } catch (error) {
        return error.message
    }
}

export const getAllBankDetails = async () => {
    const userid = localStorage.getItem('userId');
    try {
        const data = await Axios.get(`${BASE_URL}bank/get/all?user=${userid}`);
        return data.data;
    } catch (error) {
        return error
    }
}

export const addBankDetail = async (data) => {
    try {
        const res = await Axios.post(`${BASE_URL}bank/add`, {...data});
        return res.data
    } catch (error) {
        return error;
    }
}
export const createWithDrawalReq = async (data) => {
    try {
        const res = await Axios.post(`${BASE_URL}wallet/withdrawal/request/create`, {...data});
        return res.data
    } catch (error) {
        return error;
    }
}
export const getAllWithDrawal = async () => {
    const userId = localStorage.getItem('userId')
    try {
        const res = await Axios.get(`${BASE_URL}wallet/withdrawal/get/all?userId=${userId}`) 
        return res.data;
    } catch (error) {
        return error
    }
}