import React, { useState, useEffect } from "react";
import useAxios from "axios-hooks";
import { useLocation } from "react-router-dom";
import { initialFilter } from "utils/constant";
import { API_ROUTES, ROOT_API } from "utils/constant";
import axios from 'axios';

const ExportSubDomain = () => {
  const location = useLocation();
  const spliceDomain = location.pathname.match(/\/subDomain\/([^/]+)\//);
  const domainId = spliceDomain[1];

  const [filter, setFilter] = useState(initialFilter);
  const exportDomainApi = ROOT_API + API_ROUTES.SUBDOMAIN_API;
  console.log(exportDomainApi);

  const [{ data, loading, error }, refetch] = useAxios({
    url: `${exportDomainApi}/${domainId}/export`,
    params: filter,
    responseType: 'blob',
  });

  useEffect(() => {
    if (data) {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'exportedSubDomain.xlsx'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [data]);

  return <div></div>;
};

export default ExportSubDomain;
