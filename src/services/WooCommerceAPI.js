/**
 * /*
 * WooCommerce API
 * DO NOT TOUCH!
 *
 * @format
 */

import OAuth from 'oauth-1.0a'
import { getUserToken } from '../utils/functions'
function WooCommerceAPI(opt) {
	if (!(this instanceof WooCommerceAPI)) {
		return new WooCommerceAPI(opt)
	}

	opt = opt || {}

	if (!opt.url) {
		throw new Error('url is required')
	}
	if (!opt.consumerKey) {
		throw new Error('consumerKey is required')
	}
	if (!opt.consumerSecret) {
		throw new Error('consumerSecret is required')
	}

	// this.classVersion = '1.0.0';
	this._setDefaultsOptions(opt)
}

WooCommerceAPI.prototype._setDefaultsOptions = function (opt) {
	this.url = opt.url
	this.wpAPI = opt.wpAPI || false
	this.wpAPIPrefix = opt.wpAPIPrefix || 'wp-json'
	this.version = opt.version || 'v3'
	this.isSsl = /^https/i.test(this.url)
	this.consumerKey = opt.consumerKey
	this.consumerSecret = opt.consumerSecret
	this.verifySsl = opt.verifySsl
	this.encoding = opt.encoding || 'utf8'
	this.queryStringAuth = opt.queryStringAuth || true
	this.port = opt.port || ''
	this.timeout = opt.timeout || 5000
}

WooCommerceAPI.prototype._normalizeQueryString = function (url) {
	// Exit if don't find query string
	if (url.indexOf('?') === -1) return url

	// let query       = _url.parse(url, true).query;
	const query = url
	const params = []
	let queryString = ''

	for (const p in query) params.push(p)
	params.sort()

	for (const i in params) {
		if (queryString.length) queryString += '&'

		queryString += encodeURIComponent(params[i]).replace('%5B', '[').replace('%5D', ']')
		queryString += '='
		queryString += encodeURIComponent(query[params[i]])
	}

	return `${url.split('?')[0]}?${queryString}`
}

WooCommerceAPI.prototype._getUrl = function (endpoint) {
	let url = this.url.slice(-1) === '/' ? this.url : `${this.url}/`
	const api = this.wpAPI ? `${this.wpAPIPrefix}/` : 'wp-json/'

	url = `${url + api + this.version}/${endpoint}`

	// Include port.
	if (this.port !== '') {
		const hostname = url // _url.parse(url, true).hostname;
		url = url.replace(hostname, `${hostname}:${this.port}`)
	}

	if (!this.isSsl) return this._normalizeQueryString(url)

	return url
}

WooCommerceAPI.prototype._getOAuth = function () {
	const data = {
		consumer: {
			public: this.consumerKey,
			secret: this.consumerSecret,
		},
		signature_method: 'HMAC-SHA256',
	}

	if (['v1', 'v2'].indexOf(this.version) > -1) data.last_ampersand = false

	return new OAuth(data)
}

WooCommerceAPI.prototype.join = function (obj, separator) {
	const arr = []
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			arr.push(`${key}=${obj[key]}`)
		}
	}
	return arr.join(separator)
}

WooCommerceAPI.prototype._request = async function (method, endpoint, data, required = false) {
	const token = await getUserToken()
	const url = this._getUrl(endpoint)
	const params = {
		url,
		method,
		encoding: this.encoding,
		timeout: this.timeout,
	}
	if (this.isSsl) {
		if (this.queryStringAuth) {
			params.qs = {
				consumer_key: this.consumerKey,
				consumer_secret: this.consumerSecret,
				...data,
			}
		} else {
			params.auth = {
				user: this.consumerKey,
				pass: this.consumerSecret,
			}
		}

		if (this.verifySsl) {
			params.strictSSL = this.verifySsl
		}
	} else if (method == 'GET') {
		params.qs = this._getOAuth().authorize({
			url,
			method,
			data,
		})
	} else if (method == 'POST') {
		params.qs = this._getOAuth().authorize({
			url,
			method,
		})
	}

	// console.log(params.url);

	// encode the oauth_signature to make sure it not remove + charactor
	params.qs.oauth_signature = encodeURIComponent(params.qs.oauth_signature)
	params.url = `${params.url}?${this.join(params.qs, '&')}`

	if (method == 'GET') {
		//params.headers = { "cache-control": "no-cache" };
		params.mode = 'cors'
	} else if (method == 'POST') {
		params.headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		}
		params.body = JSON.stringify(data)
	}
	if (token && required) {
		params.headers = {
			...params.headers,
			Authorization: `Bearer ${token}`,
		}
	}

	return await fetch(params.url, params)
}

WooCommerceAPI.prototype.get = async function (endpoint, data, callback, required = false) {
	return await this._request('GET', endpoint, data, callback, required)
}

WooCommerceAPI.prototype.post = async function (endpoint, data, callback, required = false) {
	return await this._request('POST', endpoint, data, callback, required)
}

WooCommerceAPI.prototype.put = async function (endpoint, data, callback) {
	return await this._request('PUT', endpoint, data, callback)
}

WooCommerceAPI.prototype.delete = async function (endpoint, callback) {
	return await this._request('DELETE', endpoint, null, callback)
}

WooCommerceAPI.prototype.options = async function (endpoint, callback) {
	return await this._request('OPTIONS', endpoint, null, callback)
}

export default WooCommerceAPI
