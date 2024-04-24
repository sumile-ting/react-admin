import { useState, useEffect } from "react";
export function useTable(props) {
  const { request, pageInfo } = props;
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function getData() {
      setLoading(true);

      try {
        const {
          data: { data }
        } = await request({ ...pageInfo });
        if (!ignore) {
          setTableData(data.records);
          setTotal(data.total);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    }
    getData();
    return () => {
      ignore = true;
    };
  }, [request, pageInfo]);
  return {
    tableData,
    setTableData,
    loading,
    total
  };
}
