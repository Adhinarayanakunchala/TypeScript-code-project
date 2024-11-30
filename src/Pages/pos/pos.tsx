import { useRef, useState } from "react";
import Layout from "Component/Layout/Layout";
import posClasses from "./pos.module.scss";

// Component
import Cart from "./Cart/Cart";
import Filter from "./filter";
import BloodGroupTable from "./BloodGroupTable";

const Pos = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [reload, setReload] = useState<boolean>(false);
  const [reloadAgain, setReloadAgain] = useState<boolean>(false);

  return (
    <Layout>
      <div className={posClasses["Container"]}>
        <BloodGroupTable
          forwardedRef={tableRef}
          setReload={setReload}
          reloadAgain={reloadAgain}
        />
        <Cart reload={reload} setReloadAgain={setReloadAgain} />
      </div>
    </Layout>
  );
};

export default Pos;
