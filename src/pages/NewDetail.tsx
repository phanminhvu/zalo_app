import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import useSetHeader from "../hooks/useSetHeader";
import {NewItem} from "../models";
import {useRecoilValue} from "recoil";
import {newssState} from "../states/news";
import Container from "../components/layout/Container";

const NewDetail: React.FunctionComponent = () =>{
    const navigate = useNavigate();
    const setHeader = useSetHeader();
    let { newId } = useParams();
    const news = useRecoilValue<NewItem[]>(newssState);
    const [newDetail,setNewDetail] = useState<NewItem>(null);

    useEffect(() => {
        if (newId) {
            setNewDetail(news.find(nn =>  (Number(nn.id) === Number(newId))));

        }
    },[newId]);
    useEffect(() => {
        setHeader({
            customTitle:  newDetail?.title,
            hasLeftIcon: true,
            showAvatar: false
        });
    },[newDetail]);
    return newDetail ? (
        <Container>
            <div
                className=" relative  px-4 py-4 bg-white w-full"
            >
                <div className="mt-4">
                    <img src={newDetail?.image} />
                </div>
                <div className="mt-4 font-bold ">
                    {newDetail?.title}
                </div>
                <div className="mt-4 leading-6">
                    {newDetail?.content}
                </div>
            </div>
        </Container>) : <></>

}
export default NewDetail;
