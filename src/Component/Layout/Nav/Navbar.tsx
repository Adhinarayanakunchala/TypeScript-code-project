import React, { ReactNode } from "react";
import NavbarClasses from "./Navbar.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
// Icons
import { PiSlidersHorizontal } from "react-icons/pi";
import { CgInbox } from "react-icons/cg";
import { MdInventory } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { HiOutlineLogout } from "react-icons/hi";
import logo from "Assets/pos_blood.svg";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
  To: string;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const Navigate = useNavigate();
  const NavItems: NavItem[] = [
    {
      name: "Sales Dashboard",
      icon: <PiSlidersHorizontal size={19} />,
      To: "/pos/sale",
    },
    // {
    //     name: "Requests",
    //     icon: <TbMessage2 size={19} />,
    //     To: "/pos/request",
    // },
    { name: "Orders", icon: <CgInbox size={19} />, To: "/pos/orders" },
    {
      name: "Inventory",
      icon: <MdInventory size={19} />,
      To: "/pos/inventory",
    },
    {
      name: "Profile",
      icon: <BsFillPersonFill size={19} />,
      To: "/pos/profile",
    },
  ];

  const logoutHandler = () => {
    Swal.fire({
      title: "Are you sure you want to Sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "logout-popup",
        confirmButton: "cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Navigate("/");
        localStorage.clear();
      }
    });
  };
  return (
    <div className={NavbarClasses["Container"]}>
      <div className={NavbarClasses["header_section"]}>
        <div className={NavbarClasses["header_title"]}>
          <div className={NavbarClasses["logo_container"]}>
            <img src={logo} alt="Logo" />
          </div>
          <h1>{localStorage.getItem("BankName")}</h1>
        </div>
        <button type="button" onClick={logoutHandler}>
          <HiOutlineLogout size={25} />
          Logout
        </button>
      </div>
      <div className={NavbarClasses["Navbar"]}>
        {NavItems.map((NavItem: NavItem, index: number) => (
          <NavLink
            key={index}
            to={NavItem.To}
            className={({ isActive }) =>
              isActive ? NavbarClasses["ActiveLink"] : ""
            }
          >
            {NavItem.icon} <span>{NavItem.name}</span>
          </NavLink>
        ))}
      </div>
      {children}
    </div>
  );
};

export default Layout;
