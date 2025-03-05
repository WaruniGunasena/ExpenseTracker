import React, {useContext} from "react";
import { UserContext } from "../../context/UserContext";
import SideMenu from "./SideMenu";
import Navbar from "./Navbar";

const DashboardLayout = ({children, activeMenu}) => {
    const {user} = useContext(UserContext);
    return (
        <div className="">
            <Navbar activeMenu = {activeMenu}></Navbar>
            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                    <SideMenu activeMenu ={activeMenu}></SideMenu>
                </div>
                   <div className="grow mx-5">{children}</div>
                </div>  
            )}
        </div>
    );
};

export default DashboardLayout;