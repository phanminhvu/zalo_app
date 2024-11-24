import React, {useEffect} from "react";
import {shippingMethodsState} from "../../states/cart";
import {useRecoilState, useRecoilValue} from "recoil";
import WooWorker from "../../services/WooWorker";
import {convertPrice} from "../../utils";

const DeliveryForm = () => {
    const [shippingMethods,setShippingMethods] = useRecoilState(shippingMethodsState);
    useEffect(() => {
        //changeStatusBarColor("secondary");
        WooWorker.getShippingMethod().then((res) => {
            setShippingMethods(res);
        });
    }, []);
    return  (shippingMethods && shippingMethods.length) > 0 ? <><p className="mt-8 text-lg font-medium">Shipping Methods</p>
	    <div className="mt-5 grid gap-6">{shippingMethods.map((method,mIndex) =>{
            return (<div className="relative" key={`mth_${mIndex}`}>
                <input className="peer hidden" id={`method_${method.id}`} type="radio" name="radio" checked/>
                <span
                    className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor={`method_${method.id}`}>
                    <img className="w-14 object-contain" src="/images/naorrAeygcJzX0SyNI4Y0.png" alt=""/>
                    <div className="ml-5">
                        <span className="mt-2 font-semibold">{method.title}</span>
                        {method.settings.cost && <p className="text-slate-500 text-sm leading-6">{convertPrice(Number(method.settings.cost.value))}</p>}
                        <p className="text-slate-500 text-sm leading-6">{method.method_description}</p>
                    </div>
                </label>
            </div>)
        })}
	    </div></> : <></>
}
export default DeliveryForm;
