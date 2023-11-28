const [filterText, setFilterText] = useDebouncedState("", 500);

const filteredData = useMemo(
  () =>
    tableData.filter((item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    ),
  [tableData, filterText]
);
