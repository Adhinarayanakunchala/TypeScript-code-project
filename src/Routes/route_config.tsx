import Pos from "Pages/pos/pos";
// import CheckOut from "Pages/pos/Cart/Cart";
import Orders from "Pages/Orders/Orders";
import OrderDetails from "Pages/Orders/Details";
import Profile from "Pages/Profile/profile";
import UpdatePassword from "Pages/Profile/updatePassword";
import Inventory from "Pages/Inventory/Inventory";
import AddInventory from "Pages/Inventory/Add";
import InventoryLogs from "Pages/Inventory/Logs";
import Requests from "Pages/Request/request";
import RequestDetails from "Pages/Request/Details";
import AddRequest from "Pages/Request/New/new";
import InventoryCheck from "Pages/Request/Inventory";
import CrossMatch from "Pages/Request/CrossReport/CrossMatch";

export const Config = [
  {
    path: "sale",
    Element: Pos,
  },
  // {
  //   path: "sale/checkout",
  //   Element: CheckOut,
  // },
  {
    path: "request",
    Element: Requests,
  },
  {
    path: "orders",
    Element: Orders,
  },
  {
    path: "orders/details",
    Element: OrderDetails,
  },
  {
    path: "profile",
    Element: Profile,
  },
  {
    path: "profile/update-password",
    Element: UpdatePassword,
  },
  {
    path: "inventory",
    Element: Inventory,
  },
  {
    path: "inventory/add",
    Element: AddInventory,
  },
  {
    path: "inventory/logs",
    Element: InventoryLogs,
  },
  {
    path: "request/details",
    Element: RequestDetails,
  },
  {
    path: "request/add",
    Element: AddRequest,
  },
  {
    path: "request/details/Inventory",
    Element: InventoryCheck,
  },
  {
    path: "request/details/cross-match",
    Element: CrossMatch,
  },
];
