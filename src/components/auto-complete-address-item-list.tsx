import {Button, Input, Text, useNavigate,Spinner} from "zmp-ui";
import React, {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {Address, AuthData} from "../models";
import {authState} from "../states/auth";
import {addressAutoState, addressSearchItemState} from "../states/cart";
import {VietmapApi} from "@vietmap/vietmap-api/src/vietmap-api";
import {VIET_MAP_KEY} from "../utils/constants";
import {userEditingAddressState} from "../state";
import { SearchResponse } from "@vietmap/vietmap-api/src/models";

const AddressSearchItemList = () => {
    const navigate = useNavigate();
    const [searchString, setSearchString] = useState<string>("");

    const [userEditingAddress, setUserEditingAddress] = useRecoilState<Address>(
        userEditingAddressState
    );
    const [addressAuto, setAddressAuto] =  useRecoilState<boolean>(
        addressAutoState
    );
    const [searchList, setSearchList] = useState([]);
    const [loading, setLoading] = useState(false);
    const vietmapApi = new VietmapApi({ apiKey: VIET_MAP_KEY })
    useEffect(() => {
        setLoading(true)
        setSearchList([])
        const getData = setTimeout(async() => {
            const autoCompleteSearchResponseList :SearchResponse [] = await vietmapApi.autoCompleteSearch(
                { text: searchString,apikey: VIET_MAP_KEY ,cityId:12}
            );
            setSearchList(autoCompleteSearchResponseList);
            setLoading(false)
        }, 1500)
        return () => clearTimeout(getData)
    }, [searchString])
    return (<div className={' relative'}><div className={'rounded-lg border border-slate-200 mx-4 '}>
        <Input.Search
            label=""
            helperText=""
            placeholder="Tìm địa chỉ..."
            className="w-full border-0 m-0"
            size={'medium'}
            onChange={(event) => setSearchString(event.target.value)}
        />
    </div>
        {/*loading && <div className={'w-full text-center my-2'}><Spinner visible logo={"https://theme.hstatic.net/200000370513/1000940538/14/logo.png"} /></div>*/}
        {(searchList && searchList?.length > 0) && <div className={"list"}>
            {searchList.map( (v) => {
                console.log("me nos",v);
                return <Button
                onClick={() => {
                    setUserEditingAddress(old=>({
                        ...old,
                            address: v.display
                    }))
                    setAddressAuto(false);
                }}
                key={v.ref_id}
                size={'medium'}
                type={'neutral'}
                className={`border-b m-0 rounded-none min-w-0`}
                >
                <Text className={`text-black text-sm`}>{v.display}</Text>
                </Button>
            })}
        </div>}
    </div>)
};
export default AddressSearchItemList;
