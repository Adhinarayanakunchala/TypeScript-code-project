import {
  BloodGroups,
  BloodgroupComponent,
  DashbordService,
  SearchFilterService,
} from "Services/SignupServices";
import posClasses from "./pos.module.scss";
import React, { useEffect, useState } from "react";
import { warningSwal } from "Util/Toast";

interface FilterProps {
  onFilterChange: (filteredData: any, g: any) => void;
}

interface BloodGroups {
  bloodGroupId: number;
  bloodGroup: string;
}

interface BloodGroupComponent {
  bloodComponentId: number;
  bloodComponent: string;
}

function Filter({ onFilterChange }: FilterProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [bloodGroups, setBloodGroups] = useState<BloodGroups[]>([]);
  const [bloodComponent, setBloodComponent] = useState<BloodGroupComponent[]>(
    []
  );
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<number | null>(
    null
  );
  const [selectedBloodComponent, setSelectedBloodComponent] = useState<
    number | null
  >(null);

  const Bloodgroups = async () => {
    setLoading(true);
    try {
      const response = await BloodGroups();
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setBloodGroups(response?.data?.BloodGroups);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };
  const Bloodgroupcomponents = async () => {
    setLoading(true);
    try {
      const response = await BloodgroupComponent();
      setLoading(false);
      console.log(response);
      if (response?.data?.Status === 1) {
        setBloodComponent(response?.data?.BloodComponents);
      } else {
        setErrorMsg("Unexpected response format");
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    Bloodgroups();
    Bloodgroupcomponents();
  }, []);

  const SearchHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const filteredData = await DashbordService(
        selectedBloodGroup ?? 0,
        selectedBloodComponent ?? 0,
        1,
        10
      );
      setLoading(false);
      onFilterChange(filteredData.data?.Inventory, {
        page: 1,
        size: 30,
        totalCount: filteredData?.data?.Pagination.totalCount,
      });
    } catch (err: any) {
      setLoading(false);
      warningSwal("warning", err?.response?.data?.Message);
      // setErrorMsg(
      //   err?.response?.data?.Message || "Something went wrong try again later"
      // );
    }
  };

  return (
    <form className={posClasses["filters"]} onSubmit={SearchHandler}>
      <div className={posClasses["form-control"]}>
        <select
          id="bloodGroup"
          value={selectedBloodGroup ?? ""}
          onChange={(e) => setSelectedBloodGroup(Number(e.target.value))}
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((group) => (
            <option key={group.bloodGroupId} value={group.bloodGroupId}>
              {group.bloodGroup}
            </option>
          ))}
        </select>
      </div>
      <div className={posClasses["form-control"]}>
        <select
          id="bloodComponent"
          value={selectedBloodComponent ?? ""}
          onChange={(e) => setSelectedBloodComponent(Number(e.target.value))}
        >
          <option value="">Select Blood Component</option>
          {bloodComponent.map((component) => (
            <option
              key={component.bloodComponentId}
              value={component.bloodComponentId}
            >
              {component.bloodComponent}
            </option>
          ))}
        </select>
      </div>
      <div className={posClasses["form-control"]}>
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {errorMsg && <p className={posClasses["error"]}>{errorMsg}</p>}
    </form>
  );
}

export default Filter;
