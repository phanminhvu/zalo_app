/**
 * Created by InspireUI on 01/03/2017.
 * An API for JSON API Auth Word Press plugin.
 * https://wordpress.org/plugins/json-api-auth/
 *
 * @format
 */

import request from './ApiClient'
import { WORDPRESS_API_URL } from '../utils/constants'
const secure = ''
const cookieLifeTime = 120960000000

const WPUserAPI = {
	login: async (username, password) => {
		const _url = `${WORDPRESS_API_URL}/flutter_user/generate_auth_cookie`
		return await request.post(
			_url,
			{
				second: cookieLifeTime,
				username,
				password,
			},
			'POST',
			false,
			null,
			false,
		)
	},

	loginFacebook: async (token) => {
		const _url = `${WORDPRESS_API_URL}/flutter_user/fb_connect/?second=${cookieLifeTime}&access_token=${token}${secure}`
		return await request.get(_url, null, null, false)
	},

	register: async ({ username, email, firstName, lastName, isChecked = false, password = undefined }) => {
		try {
			const niceName = firstName + ' ' + lastName

			const _url = `${WORDPRESS_API_URL}/flutter_user/register`
			return await request.post(
				_url,
				{
					username,
					user_login: username,
					user_email: email,
					email: email,
					display_name: niceName,
					first_name: firstName,
					last_name: lastName,
					password: password,
					user_pass: password,
					user_nicename: niceName,
					role: isChecked ? 'seller' : 'subscriber',
				},
				'POST',
				false,
				null,
				false,
			)
		} catch (err) {
			console.log(err)
			return { error: err }
		}
	},
}

export default WPUserAPI
