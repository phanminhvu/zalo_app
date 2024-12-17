import React, {useEffect, useState} from 'react'
import useSetHeader from '../../hooks/useSetHeader'
import {useRecoilValue} from 'recoil'
import {authState} from '../../states/auth'
import {Button, Page, useNavigate} from 'zmp-ui'
import {openShareSheet} from 'zmp-sdk'

const UserReferral = () => {
    const setHeader = useSetHeader()
    const navigate = useNavigate()
    const authDt = useRecoilValue(authState)
    const [code, setCode] = useState('')

    useEffect(() => {
        getRefferalCode()
    }, [])

    const getRefferalCode = async () => {
        console.log(authDt.profile.id)
        fetch(`https://quequan.vn:8081/customer/zalo-referral-code?userid=${authDt.profile.id}`)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                console.log(result)
                if (result.code) setCode(result.code)
            })
            .catch((error) => console.log(JSON.stringify(error)))
    }

    useEffect(() => {
        setHeader({
            customTitle: 'Mã giới thiệu',
            hasLeftIcon: true,
            type: 'secondary',
            showBottomBar: true,
        })
    }, [])

    const onShareLink = () => {
        // https://zalo.me/s/3330579448132307150/active-referral/ABCXYZ
        const link = `https://zalo.me/s/3330579448132307150/?action=active-referral&code=${code}`
        console.log(link)
        openShareSheet({
            type: 'link',
            data: {
                link,
                chatOnly: false,
            },
            success: (data) => {
                console.log(data)
            },
            fail: (err) => {
                console.log(err)
            },
        })
    }

    return (
        <Page className='bg-gray-200'>
            <div className='bg-white flex flex-col m-4 p-3 gap-4 rounded-lg'>
                <img
                    src="https://quequan.vn:8081/images/products/Anh%20bia.jpg"
                    alt="Product Image"
                    className="w-full h-full object-cover rounded-lg"
                />
                <div className='flex flex-col bg-gray-100 p-3 rounded-lg gap-2'>
                    <div className='flex justify-between items-center h-6'>
                        <span className='text-sm font-medium'>{'Mã giới thiệu'}</span>
                        <span className='text-base font-extrabold text-green-500'>{code}</span>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <Button size='medium' onClick={onShareLink}>
                        {'Chia sẻ mã giới thiệu'}
                    </Button>
                    <Button size='medium' variant='secondary' onClick={() => navigate('/')}>
                        {'Trở về trang chủ'}
                    </Button>
                </div>
            </div>
        </Page>
    )
}
export default UserReferral
