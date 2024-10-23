import { zmp } from 'zmp-framework/react'
import api from 'zmp-sdk';
import { authorize, getSetting } from "zmp-sdk/apis";
import { getAccessToken, getPhoneNumber } from "zmp-sdk/apis";
import { followOA } from "zmp-sdk/apis";
import { loadUserFromCache } from "../services/storage"
export const getSettingV2 = () => new Promise(resolve => {
	getSetting({
		success: (data) => {
			console.log("setting data ", data)
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
			if (data['scope.userInfo'] == true) {
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
								console.log('Access token zalo ERR1 ', error)
								resolve(false)
								//console.error(error)
							}
						})
					},
					fail: (error) => {
						console.log('Access token zalo ERR2 ', error)
						resolve(false)
					}
				})
			} else {
				console.log('Access token zalo ERR3 ')
				resolve(false)
			}
		},
		fail: (error) => {
			console.log('Access token zalo ERR4 ', error)
			// xử lý khi gọi api thất bại
			resolve(false)
			//console.log("gọi api error ",error);
		},
	});
});


export const getPhoneNumberUser = async () => {
	try {
		// Lấy accessToken từ Zalo SDK
		const accessToken = await getAccessToken({});

		if (!accessToken) {
			throw new Error("Không thể lấy Access Token. Vui lòng đăng nhập lại.");
		}

		console.log("Access Token:", accessToken);

		// Lấy số điện thoại từ Zalo SDK
		getPhoneNumber({
			success: async (data) => {
				let { token } = data;
				console.log('token', token)
				try {
					console.log({ accessToken, token });
					const response = await fetch("https://quequan.vn:8081/customer/phonenumber", {
						method: "POST",
						headers: {

							"Content-Type": "application/json",
						},
						body: JSON.stringify({ accessToken, token }),
					});
					const result = await response.json();
					console.log(result);

					let formattedPhoneNumber = result.phoneNumber.startsWith("84")
						? result.phoneNumber.replace(/^84/, "0")
						: result.phoneNumber;
					console.log("Số điện thoại đã định dạng:", formattedPhoneNumber);
					sessionStorage.setItem("phoneNumber", formattedPhoneNumber);
					// setPhoneNumber(formattedPhoneNumber);


				}
				catch (error) {
					console.error("Lỗi khi kiểm tra số điện thoại:", error);

				}
			}
		})

	}
	catch (error) {
		console.error("Lỗi khi lấy access token:", error);
		openSnackbar({
			text: "Không thể lấy access token. Vui lòng thử lại.",
			type: "error",
			duration: 5000,
		});
	}
};

export const follow = async () => {
	const userInfo = await loadUserFromCache();
	console.log('userInfo', userInfo);
	if (!userInfo.followedOA) {
		try {
			await followOA({
				id: "755177818804311101"
			});
		} catch (error) {
			// xử lý khi gọi api thất bại
			console.log(error);
		}
	}
};

//Tạo MAC
export const createMac = async (order) => {
	try {
		//https://quequan.vn:8081/customer/phonenumber
		const response = await fetch("https://quequan.vn:8081/customer/createmaccheckout", {
			method: "POST",
			headers: {

				"Content-Type": "application/json",
			},
			body: JSON.stringify(order),
		});
		if (!response.ok) {
			throw new Error('Thất bại!')
		}
		const data=await response.json();
		return data;
	}
	catch (e) {
		console.error(e)
	}
}
