import React, {useEffect} from "react";
import {Icon, Page, Modal,Box, Button} from "zmp-ui";
import {pageGlobalState} from "../../state";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {Toast} from "flowbite-react";

const Container = ({children,...other})=> {
    const {errMsg,confirmModal} = useRecoilValue(pageGlobalState)
    const setErrMsg = useSetRecoilState(pageGlobalState)

    return (<Page {...other}>{children}
        {errMsg &&  <Toast color={'red'} className={'mx-auto fixed z-[99999999] top-[64px] right-7 bg-pink-400'}>
		    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
			    <Icon icon={"zi-warning"} size={20} className="h-5 w-5" />
		    </div>
		    <div className="ml-3 text-sm font-normal text-white">
                {errMsg}
		    </div>
		    <Toast.Toggle onDismiss={() => setErrMsg(oldErr => {
                return {
                    ...oldErr,
                    errMsg:""
                }
            })}/>
	    </Toast>}
        {confirmModal && <Modal
        visible={confirmModal.showModal}
        title= {confirmModal.title}
        onClose={() => setErrMsg(oldErr => {
            return {
                ...oldErr,
                confirmModal: {}
            }
        })}
        verticalActions
        description={confirmModal.description}
      >
        {confirmModal?.buttons && <Box p={6} flex>
          {confirmModal.buttons.map(btn =>{
            return (<Button
                type={btn?.type ?? "highlight"}
                className="mr-1"
                onClick={ (btn?.isCLosed === true ) ? () => setErrMsg(oldErr => {
                    return {
                        ...oldErr,
                        confirmModal: null
                    }
                }) : () => {
                    btn.action();
                    setErrMsg(oldErr => {
                        return {
                            ...oldErr,
                            confirmModal: null
                        }
                    })
                }}
              >
                {btn.label}
              </Button>)
          })}
        </Box>}
      </Modal>}
    </Page>)
}
export default Container;
