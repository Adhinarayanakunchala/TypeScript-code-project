import { useEffect, useState } from "react";
import inventoryClasses from "Pages/Inventory/inventory.module.scss";
import Layout from "Component/Layout/Layout";
import Table from "Component/Table/Table";
import CommonClasses from "Styles/Common.module.scss";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";
import { AddItemsInventory, RequestInventory } from "Services/SignupServices";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { SuccessSwal, warningSwal } from "Util/Toast";
import Loader from "Component/Loader/loader";

interface Inventory {
  inventoryId: number;
  bagNumber: number;
  bloodGroup: string;
  bloodComponent: string;
  collectionDate: string;
  testingDate: string;
  volume: number;
  expiryDate: string;
  IsSelected?: number;
}

interface Paginates {
  page: number;
  size: number;
  totalCount: number;
}

function Orders() {
  const Navigate = useNavigate();
  const [itemOffset, setItemOffset] = useState<number>(0);
  const [params] = useSearchParams();
  const id = params.get("requestId");
  const itemsPerPage = 10;
  const [data, setData] = useState<Inventory[]>([]);
  const [selectList, setSelectList] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paginate, setPaginate] = useState<Paginates>({
    page: 1,
    size: itemsPerPage,
    totalCount: 0,
  });

  const fetchRequest = async (PageNo: any) => {
    setLoading(true);
    try {
      const response = await RequestInventory(PageNo, itemsPerPage);
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setData(response?.data?.Inventory);
        setPaginate(response?.data?.Pagination);
      } else {
        setErrorMsg("Unexpected response format");
        Error(response?.data?.ErrorMessage);
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequest(1);
  }, []);

  const selectedBagHandler = (rowData: Inventory) => {
    const updatedData = data.map((item) => {
      if (item.bagNumber === rowData.bagNumber) {
        const isSelected = item.IsSelected === 1 ? 0 : 1;
        const updatedSelectedBagNumbers = isSelected
          ? [...selectList, rowData.bagNumber]
          : selectList.filter((bagNumber) => bagNumber !== rowData.bagNumber);

        setSelectList(updatedSelectedBagNumbers);
        return { ...item, IsSelected: isSelected };
      }
      return item;
    });

    setData(updatedData);
  };

  const Tablerow = [
    {
      name: "Selected",
      label: "Selected",
      rowElement: (rowData: any) => (
        <button
          className={
            rowData.IsSelected == 1
              ? inventoryClasses["Active-btn"]
              : inventoryClasses["inactive-btn"]
          }
          onClick={() => selectedBagHandler(rowData)}
        >
          {rowData.IsSelected == 1 ? "Remove" : "Add"}
        </button>
      ),
    },
    {
      name: "bagNumber",
      label: "Blood Bag Number",
    },
    {
      name: "bloodGroup",
      label: "Blood Group",
      rowElement: (rowData: any) => <p>Blood Type:{rowData.bloodGroup}</p>,
    },

    {
      name: "bloodComponent",
      label: "BloodComponent",
    },
    {
      name: "collectionDate",
      label: "Collection Date",
      rowElement: (rowData: any) => (
        <p>{moment(rowData.collectionDate).format("MMMM Do YYYY")}</p>
      ),
    },

    {
      name: "testingDate",
      label: "Testing Date",
      rowElement: (rowData: any) => (
        <p>{moment(rowData.testingDate).format("MMMM Do YYYY")}</p>
      ),
    },
    {
      name: "volume",
      label: "Volume",
      rowElement: (rowData: any) => <p>{rowData.volume}ml</p>,
    },
    {
      name: "expiryDate",
      label: "Testing Date",
      rowElement: (rowData: any) => (
        <p>{moment(rowData.expiryDate).format("MMMM Do YYYY")}</p>
      ),
    },
  ];

  const endOffset = itemOffset + itemsPerPage;
  const pageCount = Math.ceil(paginate.totalCount / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % paginate.totalCount;
    window.scrollTo({ top: 120, behavior: "smooth" });

    setItemOffset(newOffset);
  };
  const AddRequestHandler = async () => {
    setLoading(true);
    if (selectList.length === 0) {
      warningSwal("Please select at least one bag", "No items selected");
      setLoading(false);
      return;
    }
    let body = {
      bagNumbers: selectList,
      requestId: Number(id),
    };

    try {
      const response = await AddItemsInventory(body);
      setLoading(false);
      if (response?.data?.Status === 1) {
        localStorage.setItem("IsInventoryChecked", "1");
        SuccessSwal("Added Items Successfully", response?.data?.Message);
        Navigate(-1);
      }
    } catch (err: any) {
      setLoading(false);

      setErrorMsg(
        err?.response?.data?.Message || "Something went wrong try again later"
      );
    }
  };
  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : errorMsg ? (
        <div>Error: {errorMsg}</div>
      ) : data ? (
        <>
          <div className={inventoryClasses["Container"]}>
            <header>
              <h3>Inventory</h3>
            </header>
          </div>

          <div className={inventoryClasses["table"]}>
            <Table Tablerow={Tablerow} Data={data} />
            <div className={CommonClasses["Paginate_wrapper"]}>
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
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
            <button onClick={() => AddRequestHandler()}>Add Request</button>
          </div>
        </>
      ) : (
        <div>No data available.</div>
      )}
    </Layout>
  );
}

export default Orders;
