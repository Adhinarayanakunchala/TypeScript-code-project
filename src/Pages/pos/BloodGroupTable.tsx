import { useState, forwardRef, useEffect } from "react";
import Table from "Component/Table/Table";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";
//Assests
import TableClasses from "./pos.module.scss";
import CommonClasses from "Styles/Common.module.scss";
import {
  AddCart,
  CartService,
  Dashbord,
  DashbordService,
} from "Services/SignupServices";
// import Blood from "Assets/pos_blood.svg";
import Filter from "./filter";
import Loader from "Component/Loader/loader";
import moment from "moment";
import { Success, SuccessSwal, warningSwal } from "Util/Toast";

interface BloodGroupTableProps {
  forwardedRef: React.RefObject<HTMLDivElement>;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reloadAgain: boolean;
}
interface Items {
  inventoryId: number;
  bloodBankId: number;
  bagNumber: number;
  bloodGroup: string;
  bloodComponent: string;
  bloodGroupComponentId: number;
  volume: number;
  expiryDate: string;
  bagSerialNumber: string;
}
interface Paginates {
  page: number;
  size: number;
  totalCount: number;
}

const BloodGroupTable = forwardRef<HTMLDivElement, BloodGroupTableProps>(
  ({ forwardedRef, setReload, reloadAgain }, ref) => {
    const [itemOffset, setItemOffset] = useState<number>(0);
    const itemsPerPage = 30;
    const Navigate = useNavigate();
    const [paginate, setPaginate] = useState<Paginates>({
      page: 1,
      size: itemsPerPage,
      totalCount: 0,
    });
    const [data, setData] = useState<any[]>([]);
    const [cartItems, setCartItems] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const fetchRequest = async (PageNo: any) => {
      setLoading(true);
      try {
        const response = await Dashbord(PageNo, itemsPerPage);
        setLoading(false);
        console.log(response);
        if (response?.data?.Status === 1) {
          setData(response?.data?.Inventory);
          setPaginate({
            page: PageNo,
            size: itemsPerPage,
            totalCount: response?.data?.Pagination.totalCount,
          });
        } else {
          setErrorMsg("Unexpected response format");
        }
      } catch (err: any) {
        setLoading(false);
        console.log(err);
      }
    };

    const updateCart = async (
      inventoryId: number,
      bloodGroupComponentId: number,
      volume: number,
      isAdding: boolean
    ) => {
      const body = {
        inventoryId,
        bloodGroupComponentId,
        units: isAdding ? 1 : 0,
      };
      setLoading(true);
      try {
        const response = isAdding ? await AddCart(body) : await AddCart(body);
        setLoading(false);

        if (response?.data?.Status === 1) {
          SuccessSwal("success", response?.data?.Message);
          setReload((prev) => !prev);
          fetchRequest(1);
        } else {
          setErrorMsg("Failed to update cart");
        }
      } catch (err: any) {
        setLoading(false);
        console.log(err);
        warningSwal("warning", err?.response?.data?.Message);
      }
    };

    useEffect(() => {
      fetchRequest(1);
    }, [reloadAgain]);

    const handleFilterChange = (
      filteredData: any[],
      filteredcount: Paginates
    ) => {
      setData(filteredData);
      setPaginate(filteredcount);
    };

    // Scroll to the top of the table
    const scrollToTop = (ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    const endOffset = itemOffset + itemsPerPage;
    const pageCount = Math.ceil(paginate.totalCount / itemsPerPage);

    const handlePageClick = (event: { selected: number }) => {
      const newPage = event.selected + 1;
      setItemOffset((newPage - 1) * itemsPerPage);
      setPaginate((prevState) => ({ ...prevState, page: newPage }));
      fetchRequest(newPage);
      window.scrollTo({ top: 120, behavior: "smooth" });
    };

    const Actionformatter = (rowData: any) => {
      return (
        <>
          {rowData.inCart === 1 ? (
            <button
              className={TableClasses["Remove"]}
              onClick={() =>
                updateCart(
                  rowData.inventoryId,
                  rowData.bloodGroupComponentId,
                  rowData.volume,
                  false
                )
              }
            >
              Remove
            </button>
          ) : (
            <button
              className={TableClasses["Add"]}
              onClick={() =>
                updateCart(
                  rowData.inventoryId,
                  rowData.bloodGroupComponentId,
                  rowData.volume,
                  true
                )
              }
            >
              Add
            </button>
          )}
        </>
      );
    };

    const Tablerow = [
      {
        name: "bagNumber",
        label: "Bag Number",
      },
      {
        name: "bagSerialNumber",
        label: "Bag SerialNumber",
      },
      {
        name: "bloodGroup",
        label: "Blood Group",
        rowElement: (rowData: any) => <p>Blood Type:{rowData.bloodGroup}</p>,
      },
      {
        name: "bloodComponent",
        label: "Blood Component",
      },

      {
        name: "expiryDate",
        label: "Expiry Date",
        rowElement: (rowData: any) => (
          <p>{moment(rowData.expiryDate).format("D MMM  YYYY")}</p>
        ),
      },
      {
        name: "Actions",
        label: "Actions",
        rowElement: Actionformatter,
      },
    ];

    return (
      <div
        ref={forwardedRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          borderRight: "2px solid #cccc",
        }}
      >
        <Filter onFilterChange={handleFilterChange} />
        {loading ? (
          <Loader />
        ) : errorMsg ? (
          <div>Error: {errorMsg}</div>
        ) : data ? (
          <>
            <h1 className={CommonClasses["results"]}>
              Search Results :{paginate.totalCount}
            </h1>
            <div className={CommonClasses["table_container"]}>
              <Table Tablerow={Tablerow} Data={data} />
            </div>
            <div className={CommonClasses["Paginate_wrapper"]}>
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                forcePage={paginate.page - 1}
                renderOnZeroPageCount={null}
                pageClassName={CommonClasses["pageClassName"]}
                disabledLinkClassName={CommonClasses["disabledLinkClassName"]}
                disabledClassName={CommonClasses["disabledClassName"]}
                containerClassName={CommonClasses["Paginate_Container"]}
                nextClassName={CommonClasses["nextClassName"]}
                previousClassName={CommonClasses["previousClassName"]}
                activeClassName={CommonClasses["activeClassName"]}
                activeLinkClassName={CommonClasses["activeLinkClassName"]}
                pageLinkClassName={CommonClasses["pageLinkClassName"]}
              />
            </div>
          </>
        ) : (
          <div>No data available.</div>
        )}
      </div>
    );
  }
);

export default BloodGroupTable;
