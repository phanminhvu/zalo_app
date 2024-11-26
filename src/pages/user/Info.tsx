import React, { useEffect, useState } from 'react'
import { Avatar, Box, DatePicker, Icon, Button, Radio, Input, List, Text, useNavigate } from 'zmp-ui'
import Container from '../../components/layout/Container'
import IconText from '../../components/IconText'
import { useRecoilState } from 'recoil'
import { authState } from '../../states/auth'
import useSetHeader from '../../hooks/useSetHeader'
import moment from 'moment'
import { AuthData } from '../../models'
import { loadPhoneFromCache, loadUserFromCache, saveUserToCache } from '../../services/storage'

const UserInfo = () => {
	const navigate = useNavigate()

	const [authDt, setAuthDt] = useRecoilState<AuthData>(authState)

	const [open, setOpen] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [editType, setEditType] = useState('') //phone, email, birthday
	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [sex, setSex] = useState(0)
	const [birthday, setBirthday] = useState(new Date())
	const setHeader = useSetHeader()
	useEffect(() => {
		const loadUserInfo = async () => {
			let userInfo: any = {}
			userInfo = await loadUserFromCache()
			const phoneNumber = await loadPhoneFromCache()
			userInfo.phone = phoneNumber
			if (userInfo && userInfo?.id) {
				setAuthDt({
					...authDt,
					profile: userInfo,
				})
				setName(userInfo?.name)
				setPhone(userInfo?.phone)
				setEmail(userInfo?.email)
				setSex(userInfo?.sex)
				setBirthday(userInfo?.birthday ? new Date(userInfo?.birthday) : new Date())
			}
		}

		setHeader({
			customTitle: 'Hồ sơ của tôi',
			hasLeftIcon: true,
			type: 'secondary',
			showBottomBar: true,
		})
		loadUserInfo()
	}, [])

	const resetEditForm = () => {
		let newProfile = {
			...authDt.profile,
			birthday,
			phone,
			email,
			sex,
			name,
		}
		setAuthDt((old) => {
			return {
				...old,
				profile: newProfile,
			}
		})
		saveUserToCache(newProfile)
		setIsEdit(false)
		setEditType('')
	}

	return (
		<Container>
			<Box alignItems={'center'} justifyContent={'center'} flex p={4} className={''}>
				<Avatar size={80} src={authDt.profile.avatar} />
				{/*<div className={"ml-4"}>
                <Text bold>{authDt.profile.name}</Text>
                <Text size={'xxSmall'} className={'mt-1'}>{`Id: `+ authDt.profile.zaloId}</Text>
            </div>*/}
			</Box>
			<Box m={4} p={4} className={'rounded-md bg-white'}>
				<Text bold size={'xLarge'}>{`Thông tin cá nhân`}</Text>

				{isEdit ? (
					<Box className={'mt-4'}>
						<Text>Họ và tên</Text>
						<Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
						<Text>Số điện thoại</Text>
						<Input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />

						<Text>Email</Text>

						<Input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
						<Radio
							label='Nam'
							checked={sex === 0}
							onChange={(e) => {
								if (e.target.checked) {
									setSex(0)
								}
							}}
							className={'mr-2'}
						/>
						<Radio
							label='Nữ'
							onChange={(e) => {
								if (e.target.checked) {
									setSex(1)
								}
							}}
							checked={sex === 1}
						/>
						<Text>Ngày sinh</Text>
						<DatePicker value={new Date(birthday)} onChange={(date) => setBirthday(date)} />
					</Box>
				) : (
					<List className={'mt-4'} divider={false} noSpacing>
						<List.Item prefix={<Icon icon='zi-user' />} title={authDt.profile.name} />
						<List.Item prefix={<Icon icon='zi-call' />} title={authDt?.profile?.phone} />
						<List.Item prefix={<Icon icon='zi-at' />} title={authDt?.profile?.email} />
						<List.Item prefix={<Icon icon='zi-user' />} title={sex === 1 ? 'Nữ' : 'Nam'} />
						<List.Item
							prefix={<Icon icon='zi-calendar' />}
							title={moment(authDt?.profile?.birthday).format('DD/MM/YYYY')}
						/>
					</List>
				)}

				<div className='flex justify-center'>
					<Button
						className={`w-10/12 rounded-full bg-green-500`}
						onClick={async () => {
							setIsEdit(!isEdit)
							if (isEdit) {
								resetEditForm()
							}
						}}>
						<Icon icon='zi-edit-text' className={'mr-4'} size={17} />
						{isEdit ? 'Lưu thông tin' : 'Chỉnh sửa thông tin'}
					</Button>
				</div>
				{/*<IconText icon={'zi-link'} size={18} label={authDt.profile.name} outClass={'mt-3'}/>*/}

				{/*{((!isEdit || (isEdit && editType !== 'phone') )) && <IconText icon={'zi-call'} onClick={()=>{*/}
				{/*    setEditType("phone");*/}
				{/*    setIsEdit(true);*/}
				{/*}} size={18} label={authDt?.profile?.phone} outClass={'mt-3'} rightIcon={"zi-edit"} rightIconSize={18}/>}*/}
				{/*{(isEdit && editType === "phone") && <Input*/}
				{/*    type="text"*/}
				{/*    size={"small"}*/}
				{/*    placeholder="Số điện thoại"*/}
				{/*    value={phone}*/}
				{/*    onChange={(e) =>{*/}
				{/*        setPhone(e.target.value)*/}
				{/*    }}*/}
				{/*    className="mt-3 border-slate-200"*/}
				{/*/>}*/}
				{/*{((!isEdit || (isEdit && editType !== 'email') )) && <IconText icon={'zi-at'} onClick={()=>{*/}
				{/*    setEditType("email");*/}
				{/*    setIsEdit(true);*/}
				{/*}} size={18} label={authDt?.profile?.email} outClass={'mt-3'} rightIcon={"zi-edit"} rightIconSize={18}/>}*/}

				{/*{(isEdit && editType === "email") && <Input*/}
				{/*    type="text"*/}
				{/*    size={"small"}*/}
				{/*    placeholder="Địa chỉ email"*/}
				{/*    value={email}*/}
				{/*    onChange={(e) =>{*/}
				{/*        setEmail(e.target.value)*/}
				{/*    }}*/}
				{/*    className="mt-3 border-slate-200"*/}
				{/*/>}*/}

				{/*{((!isEdit || (isEdit && editType !== 'birthday') )  ) && <IconText icon={'zi-calendar'}*/}
				{/*                                                                    onClick={()=>{*/}
				{/*                                                                        setEditType("birthday");*/}
				{/*                                                                        setIsEdit(true);*/}
				{/*                                                                    }} size={18} label={ authDt?.profile?.birthday ? moment(authDt?.profile?.birthday).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY") } outClass={'mt-3'} rightIcon={"zi-edit"} rightIconSize={18}/>}*/}

				{/*{(isEdit && editType === "birthday") && <div className={"mt-3"}><DatePicker*/}
				{/*    mask*/}
				{/*    maskClosable*/}
				{/*    dateFormat="dd/mm/yyyy"*/}
				{/*    title=""*/}
				{/*    value={birthday}*/}
				{/*    defaultValue={new Date()}*/}
				{/*    onChange={(value)=>{*/}
				{/*        setBirthday(new Date(value));*/}
				{/*    }}*/}
				{/*/></div>}*/}

				{/*{isEdit && <Button.Group className={`flex w-full  bottom-0 mt-4`}>*/}
				{/*    <Button className={`flex-1 border-l-0 border-b-0 rounded-none bg-pink-900`} onClick={resetEditForm}>*/}
				{/*        <span className="pl-3">*/}
				{/*            {`Lưu`}*/}
				{/*        </span>*/}
				{/*    </Button>*/}
				{/*   <Button className={`flex-1 border-l-0 border-r-0 border-b-0 rounded-none`} onClick={resetEditForm}>*/}
				{/*        <p>*/}
				{/*            Đóng*/}
				{/*        </p>*/}
				{/*    </Button>*/}
				{/*</Button.Group>}*/}
			</Box>
		</Container>
	)
}
export default UserInfo
