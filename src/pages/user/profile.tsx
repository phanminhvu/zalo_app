import React, { useEffect, useState } from 'react'
import { Box, Button, Icon, List, Modal, Text, useNavigate } from 'zmp-ui'
import Container from '../../components/layout/Container'
import { HiOutlineFlag, HiOutlineShoppingCart, HiOutlineUser } from 'react-icons/hi'
import { useRecoilState, useRecoilValue } from 'recoil'
import { authState } from '../../states/auth'
import useSetHeader from '../../hooks/useSetHeader'
import { showOAWidget } from 'zmp-sdk/apis'
import { authorizeV2, getPhoneNumberUser } from '../../services/zalo'
import { isFromSettingState, isMappingState } from '../../state'
import { createShortcut } from 'zmp-sdk/apis'
import { openWebview } from 'zmp-sdk/apis'
import { convertPrice } from '../../utils'
import { getSetting } from 'zmp-sdk'
import { getAccessToken } from 'zmp-sdk/apis'

const openUrlInWebview = async () => {
    try {
        await openWebview({
            url: 'https://zalo.me/0963559840',
            config: {
                style: 'bottomSheet',
                leftButton: 'back',
            },
        })
    } catch (error) {
        // xử lý khi gọi api thất bại
        console.log(error)
    }
}

const createMiniAppShortcut = async () => {
    try {
        await createShortcut({
            params: {
                utm_source: 'shortcut',
            },
        })
    } catch (error) {
        // xử lý khi gọi api thất bại
        console.log(error)
    }
}

const { Item } = List
const UserProfile = () => {
    const navigate = useNavigate()
    const authDt = useRecoilValue(authState)
    const setHeader = useSetHeader()
    const [point, setPoint] = useState(0)
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
    const [isMapping, setIsMapping] = useRecoilState<boolean>(isFromSettingState)
    const [popupVisible, setPopupVisible] = useState(false)

    useEffect(() => {
        setHeader({
            customTitle: 'Trang cá nhân',
            hasLeftIcon: true,
            type: 'secondary',
            showBottomBar: true,
        })
        showOAWidget({
            id: 'oaWidget',
            guidingText: 'Nhận thông báo khuyến mãi mới nhất từ cửa hàng',
            color: '#0068FF',
            onStatusChange: (status) => {
                console.log(status)
            },
        })
        // const savedPhoneNumber = sessionStorage.getItem("phoneNumber");
        //         if (savedPhoneNumber) {
        //             setPhoneNumber(savedPhoneNumber);
        //         }else{
        //             getPhoneNumberUser();
        //         }

        getSetting().then((value) => {
            if (!value.authSetting?.['scope.userPhonenumber']) {
                // authorizeV2()
                setPopupVisible(true)
            }else{
                getPhoneNumberUser();
            }
        })
    }, [])

    useEffect(() => {
        const userId = authDt?.profile?.id
        if (userId) {
            fetch(`https://quequan.vn:8081/customer/zalo-customer-point?userid=${userId}`)
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    console.log(result,)
                    if (result?.point) setPoint(result?.point)
                })
                .catch((error) => console.log(JSON.stringify(error)))
        }
    }, [authDt?.profile?.id])

    const getPhoneNumber = async () => {
        await authorizeV2()
        const setting = await getSetting()
        if (setting.authSetting['scope.userPhonenumber']) {
            await createUser()
            getPhoneNumberUser()
        }
    }

    const createUser = async () => {
		console.log('Get access token')
		Promise.all([getAccessToken()])
			.then((values) => {
				const accessToken = values?.[0]
				if (accessToken) {
					fetch('https://quequan.vn:8081/customer/zalocustomer', {
						method: 'POST',
						body: window.location.pathname.includes('active-referral')? 
						JSON.stringify({ accessToken, isReferral : true }) :
						 JSON.stringify({ accessToken }),
						headers: {
							'Content-Type': 'application/json',
						},
					})
						.then((value) => {
							console.log('post user info success', value)
						})
						.catch((err) => {
							console.log(err)
						})
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

    return (
        <Container className={'zui-container-background-color'}>
            <Modal
                visible={popupVisible}
                title='Yêu cầu cấp quyền'
                onClose={() => {
                    setPopupVisible(false)
                }}
                verticalActions
                description='Cho phép chúng tôi truy cập số điện thoại để tăng cường trải nghiệm và thuận tiện cho công việc đặt hàng và giao hàng!'>
                <Box p={6}>
                    <Button
                        onClick={() => {
                            setPopupVisible(false)
                            getPhoneNumber()
                        }}
                        fullWidth>
                        Xác nhận
                    </Button>
                </Box>
            </Modal>
            <div className='p-0 pb-[80px] zui-container-background-color'>
                <Box m={4} p={0}

                    onClick={() => {
                        setIsMapping(true)
                        navigate('/history-points')
                    }}
                    className={'rounded-lg'} style={{ backgroundColor: '#088c4c' }}>
                    <div className="text-center p-4">
                        <Text size={"large"} className={' text-white font-semibold'}>
                            Điểm tích lũy
                        </Text>
                        <Text style={{ fontSize: '30px' }} className={'text-white mt-2 font-semibold'}>{point} đ</Text>
                    </div>
                </Box>
                <Box m={4} p={0} className={'rounded-lg bg-white'}>
                    <List>
                        {/*<Item*/}
                        {/*    title='Điểm tích luỹ'*/}
                        {/*    prefix={<HiOutlineUser size={20}/>}*/}
                        {/*    className={'text-sm m-0'}*/}
                        {/*    suffix={*/}
                        {/*        <div className='flex flex-row gap-2 items-center'>*/}
                        {/*            <Text*/}
                        {/*                className='text-base text-green-500 font-semibold'>{convertPrice(point ?? 0)}</Text>*/}
                        {/*            <Icon icon='zi-chevron-right'/>*/}
                        {/*        </div>*/}
                        {/*    }*/}
                        {/*    onClick={() => {*/}
                        {/*        setIsMapping(true)*/}
                        {/*        navigate('/history-points')*/}
                        {/*    }}*/}
                        {/*/>*/}
                        <Item
                            title='Thông tin tài khoản'
                            prefix={<HiOutlineUser size={20} />}
                            className={'text-sm m-0'}
                            suffix={<Icon icon='zi-chevron-right' />}
                            onClick={() => {
                                setIsMapping(true)
                                navigate('/user-info')
                            }}
                        />
                        <Item
                            title='Địa chỉ đã lưu'
                            prefix={<HiOutlineFlag size={20} />}
                            suffix={<Icon icon='zi-chevron-right' />}
                            className={'text-sm m-0'}
                            onClick={() => {
                                setIsMapping(true)
                                navigate('/my-addresses/profile')
                            }}
                        />
                        <Item
                            title='Lịch sử đơn hàng'
                            prefix={<HiOutlineShoppingCart size={20} />}
                            suffix={<Icon icon='zi-chevron-right' />}
                            className={'text-sm m-0'}
                            onClick={() => {
                                setIsMapping(true)
                                navigate('/my-orders')
                            }}
                        />
                        <Item
                            title='Mã giới thiệu'
                            prefix={<HiOutlineUser size={20} />}
                            className={'text-sm m-0'}
                            suffix={<Icon icon='zi-chevron-right' />}
                            onClick={() => {
                                setIsMapping(true)
                                navigate('/user-referral')
                            }}
                        />
                    </List>
                </Box>

                <Box m={4} p={0} className={'rounded-lg bg-white'}>
                    <List>
                        <Item
                            title='Chính sách riêng tư'
                            className={'text-sm m-0'}
                            suffix={<Icon icon='zi-chevron-right' />}
                            onClick={() => {
                                setIsMapping(true)
                                navigate('/detail-new/3')
                            }}
                        />
                        <Item
                            title='Điều khoản dịch vụ'
                            suffix={<Icon icon='zi-chevron-right' />}
                            className={'text-sm m-0'}
                            onClick={() => {
                                setIsMapping(true)
                                navigate('/detail-new/4')
                            }}
                        />
                        <Item
                            title='Hướng dẫn sử dụng'
                            suffix={<Icon icon='zi-chevron-right' />}
                            className={'text-sm m-0'}
                            onClick={() => {
                                setIsMapping(true)
                                navigate('/detail-new/1')
                            }}
                        />
                        <Item
                            title='Thêm Quế Quân vào màn hình chính'
                            suffix={<Icon icon='zi-share-external-1' />}
                            className={'text-sm m-0'}
                            onClick={() => {
                                createMiniAppShortcut()
                            }}
                        />
                    </List>
                </Box>
                <Box m={4} p={0} className='rounded-lg bg-white'>
                    <div id='oaWidget' />
                </Box>
                <Box m={4} p={0} className='rounded-lg bg-white'>
                    <List>
                        <Item
                            title='Liên hệ với nhà phát triển ứng dụng'
                            suffix={<Icon icon='zi-chat' />}
                            className={'text-sm m-0'}
                            onClick={() => {
                                openUrlInWebview()
                            }}
                        />
                    </List>
                </Box>
            </div>

        </Container>
    )
}
export default UserProfile
