import React, { useState } from "react";
const Tab = ({ children, activeTab, currentTab, setActiveTab }) => {
    return (
            <div
                className={`py-2  cursor-pointer w-full
      ${activeTab === currentTab ? "bg-white text-primary" : "bg-slate-100 "}`}
                onClick={() => setActiveTab(currentTab)}
            >
                {children}
            </div>
    );
}
export default Tab;
