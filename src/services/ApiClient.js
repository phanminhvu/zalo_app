// import {REST_API_URL, WOO_API_URL} from "../utils/constants";
import { loadUserFromCache } from './storage'

const ULR_API = 'https://quequan.vn:8081/customer'
// const ULR_API = 'https://localhost:8081/customer'

export const getProducts = async (orderId, order) => {
	try {
		const response = await fetch(`${ULR_API}/zaloproducts`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		if (!response.ok) {
			throw new Error('Thất bại!')
		}
		const data = await response.json()
		console.log(data)
		return data
	} catch (e) {
		console.error(e)
	}
}

export const createOrder = async (orderId, order) => {
	try {
		const response = await fetch(`${ULR_API}/createorder`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ orderId, order }), // orderId, order
		})
		if (!response.ok) {
			throw new Error('Thất bại!')
		}
		const data = await response.json()
		return data
	} catch (e) {
		console.error(e)
	}
}

// /**
//  * Get method
//  * @param url
//  * @returns {Promise<R>}
//  */
// const get = async (url, options = {}, extraHeader, required,local = false) => {
//   //const token = globalConfig.getToken();
//   const cachedUser = await loadUserFromCache();

//   return new Promise((resolve, reject) => {
//     let baseURL = (local === true) ? WOO_API_URL + url : REST_API_URL+ url;
//     let headers = {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       ...extraHeader,
//     };
//     if (cachedUser.token && required) headers.Authorization = `Bearer ${cachedUser.token}`;
//     fetch(baseURL, {
//       ...options,
//       method: "GET",
//       mode: 'cors', // no-cors, *cors, same-origin
//       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//       credentials: 'same-origin', // include, *same-origin, omit
//       headers: headers,
//     })
//       .then((res) => {
//         if (res.ok === false && (res?.status == 401 || res?.status == 400)) {
//           reject({
//             type: "error",
//             status: res?.status,
//             message: res?.statusText,
//           });
//           //new Error(res?.status)
//         } else {
//           return res.json();
//         }
//       })
//       .then((result) => {
//           resolve(result);
//       })
//       .catch((error) => {
//         return error;
//       });
//   });
// };

// /**
//  * Post method
//  * @param url
//  * @param data
//  * @param method
//  * @returns {Promise<R>}
//  */
// const post = async (
//   url,
//   data,
//   method = "POST",
//   isDigits,
//   extraHeader,
//   required= false
// ) => {
//   //const token = globalConfig.getToken();
//   const cachedUser = await loadUserFromCache();
//   return new Promise((resolve, reject) => {
//     let baseURL = REST_API_URL+ url;
//     let headers = {
//       Accept: 'application/json',
//       "Content-Type": "application/json",
//       ...extraHeader,
//     };
//     if(isDigits !== 'upload'){
//      // headers['content-type'] = (isDigits == true) ? 'application/x-www-form-urlencoded;charset=UTF-8' : 'application/json';
//     }
//     //if (token && required) headers.Authorization = `Bearer ${token}`;
//     if (cachedUser.token && required) headers.Authorization = `Bearer ${cachedUser.token}`;
//     fetch(baseURL, {
//       method: method,
//       headers: new Headers(headers),
//       mode: 'cors', // no-cors, *cors, same-origin
//       cache: 'no-cache', //default, no-cache, reload, force-cache, only-if-cached
//       credentials: 'same-origin', // include, *same-origin, omit
//       body: (isDigits == true || isDigits == "upload")
//         ? data
//         : typeof data === "object"
//         ? JSON.stringify(data)
//         : null,
//     })
//       .then((res) => {
//         return res.clone().json();
//       })
//       .then((result) => {
//         resolve(result);
//       })
//       .catch((error) => {
//         console.log("error bad ", error);
//         reject(error);
//       });
//     //.catch(conf.onError);
//   });
// };
// const conf = {
//   onError: () => {},
// };
// const onError = (cb) => {
//   conf.onError = cb;
// };
// export default {
//   get,
//   post,
//   put: (url, data) => post(url, data, "PUT"),
// };
