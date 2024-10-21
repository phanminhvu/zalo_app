import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import {pageGlobalState, openStoresPickerState,branchValState, branchTypeState} from "../state";
import React, { useRef } from "react";
import { branchsState} from "../states/home";
import {Box, Text,Sheet, List, Icon} from "zmp-ui";
import CardProductVertical from "./custom-card/product-vertical";
import { Branch } from "../models";
const { Item } = List;
const StoresPicker = () => {
    const setErrMsg = useSetRecoilState(pageGlobalState)
    const [openSheet, setOpenSheet] = useRecoilState<boolean>(
        openStoresPickerState
    );
    const [branchVal, setBranchVal] = useRecoilState<number>(
        branchValState
    );
    const [branchType, setBranchType] = useRecoilState<number>(
        branchTypeState
    );
    const branchs = useRecoilValue<Branch[]>(branchsState);
    const sheet = useRef<any>(null);

    return (
        <>
            {branchs && (
                <Sheet
                    mask
                    visible={openSheet}
                    swipeToClose
                    maskClosable

                    onClose={() => setOpenSheet(false)}
                    afterClose={() => {

                    }}
                    ref={sheet}
                    autoHeight
                    title=""
                    
                >
                    <List>{/*zi-check-circle*/}
                        {branchs && branchs.map((branch) => (
                            <Item key={branch.id} title={branch.name} onClick={()=> {
                                setBranchVal(branch.id);
                                setOpenSheet(false)
                            }} subTitle={branch.address} prefix={(branchVal === branch.id) ? <Icon icon="zi-check-circle" /> : <Icon icon="zi-info-circle" />}/>
                        ))}
                    </List>
                </Sheet>
            )}</>);
}
export default StoresPicker;
