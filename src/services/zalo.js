import { zmp } from 'zmp-framework/react'
import api from 'zmp-sdk';
import { authorize ,getSetting} from "zmp-sdk/apis";
export const getSettingV2 =  () => new Promise(resolve=>{
	getSetting({
		success: (data) => {
			console.log("setting data ",data)
			resolve(data)
		},
		fail: (error) => {
			// xử lý khi gọi api thất bại
			console.log(error);
			resolve(false)
		}
	});
})
export const authorizeV2 = () => new Promise(resolve => {
	authorize({
		scopes: ["scope.userInfo"],//, "scope.userPhonenumber"
		success: (data) => {
			// xử lý khi gọi api thành công
			if(data['scope.userInfo'] == true ){
				api.login({
					success: () => {
						api.getAccessToken({
							success: (token) => {
								//resolve(token)
								api.getUserInfo({
									success: (data) => {
										// xử lý khi gọi api thành công
										const { userInfo } = data;
										//console.log("zalo userInfo",userInfo)
										resolve(userInfo);
									},
									fail: (error) => {
										// xử lý khi gọi api thất bại
										console.log(error);
										resolve(false)
									}
								});
							},
							fail: (error) => {
								console.log('Access token zalo ERR1 ',error)
								resolve(false)
								//console.error(error)
							}
						})
					},
					fail: (error) => {
						console.log('Access token zalo ERR2 ',error)
						resolve(false)
					}
				})
			}else{
				console.log('Access token zalo ERR3 ')
				resolve(false)
			}
		},
		fail: (error) => {
			console.log('Access token zalo ERR4 ',error)
			// xử lý khi gọi api thất bại
			resolve(false)
			//console.log("gọi api error ",error);
		},
	});
});

export const follow = () => {
	api.followOA({
		id: config.OA_ID,
		success: () => {
			store.dispatch('setUser', {
				...store.state.user,
				isFollowing: true
			})
			zmp.toast.create({
				text: 'Cảm ơn bạn đã theo dõi OA thành công!',
				closeTimeout: 3000,
			}).open()
			// UpdateFollowStatus(true) // Không cần gửi status về backend vì mình đã có webhook
		},
		fail: (err) => {
			console.log('Failed to follow OA. Details: ', err)
		}
	})
}
