import {
  Button,
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { axiosPost } from "utils/api";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import AddSubDomain from "components/SubDomain/AddSubDomain";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";
import SubDomainRow from "components/SubDomain/SubDomainRow";
import { API_ROUTES , ROOT_API } from "utils/constant";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { axiosGet } from "utils/api";
const SubDomain = () => {
  const { isOpen, onOpen, onClose} = useDisclosure();
  const isRegisterOpen = isOpen;
  const onRegisterOpen = onOpen;
  const onRegisterClose = onClose;
  const location = useLocation();
  const spliceDomain = location.pathname.match(/\/domain\/([^/]+)\//);
  const domainId = spliceDomain[1]
  const toast = useToast();
  const [newId, setNewId] = useState([]);
  
  useEffect(() => {
  }, [newId]);

 
  const [exporting, setExporting] = useState(false);

  const handleExportSubDomain = async () => {
    setExporting(true);
  
    try {
      const exportDomainApi = ROOT_API + API_ROUTES.SUBDOMAIN_API;
      const { data } = await axiosGet(`${exportDomainApi}/${domainId}/export`, {
        params: filter,
        responseType: 'blob',
      });
  
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'exportedSubDomain.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false); 
    }
  };
  

  
  const [filter, setFilter] = useState(initialFilter);
  const subDomainApi = ROOT_API + API_ROUTES.SUBDOMAIN_API ;
  const [{ data, loading, error }, refetch] = useAxios({
    url: `${subDomainApi}/${domainId}`,
    params: filter,
  });
  
  const subDomain = data?.data
  const DeleteSubDomain = ROOT_API + API_ROUTES.DELETE_SUBDOMAIN

  const handleDeletes = async () => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa không?");

    if (!confirmDelete) {
      return;
    }
try {
      const response = await axiosPost(
        DeleteSubDomain,
        {
          ids:newId
        }
      ) 
      if (response.data.code === 0) {
        toast({
          title: response.data.msg,
          duration: 9000,
        })
        refetch();
        setNewId([])
      }
    }
    catch (error) {
      console.log(error)
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg || "Delete Group Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [userDetail, setUserDetail] = useState();
  const handelCloseModal = () => {
    setUserDetail()
    onRegisterClose()
  }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditModalOpen(true);
  };
  
  const handleIdChange = (id, isChecked) => {
    const newIdCopy = [...newId];
  
    if (isChecked) {
      newIdCopy.push(id);
    } else {
      const index = newIdCopy.indexOf(id);
      if (index !== -1) {
        newIdCopy.splice(index, 1);
      }
    }
    setNewId(newIdCopy);
  };
return (
  <>
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            SubDomain
          </Text>
          <Button
            variant="primary"
            maxH="30px"
            m="10px"
            onClick={onRegisterOpen}
          >
            Add
          </Button>
          <Button
            variant="primary"
            maxH="30px"
            m="10px"
            display={newId.length === 0 ? "none" : ""}
            onClick={() => {
              handleDeletes();
            }}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            maxH="30px"
            m="10px"
            onClick={() => {
              handleExportSubDomain();
            }}
            isLoading={exporting} 
          >
            Export
          </Button>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th borderColor={borderColor} color="gray.400">
                  link
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  LinkRedirect
                </Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {subDomain?.map((row, index, arr) => {
                return (
                  <SubDomainRow
                    onIdChange={handleIdChange} 
                    key={index}
                    domain={row.domain}
                    link={row.link}
                    id={row._id}
                    linkRedirect={row.linkRedirect}
                    zone_id={row.zone_id}
                    onClose={onClose}
                    refetch={refetch}
                    onClick={() => handleEditClick(row)}
                  />
                );
              })}
            </Tbody>
          </Table>
          <Table/>
          <Flex justifyContent={"flex-end"}>
            <TablePagination
               type="full"
               page={data?.pagination?.page}
               pageLength={data?.pagination?.pageSize}
               totalRecords={data?.pagination?.count}
               onPageChange={({ page, pageLength }) => {
                 console.log(page);
                 setFilter({
                   ...filter,
                   pageSize: pageLength,
                   pageIndex: page - 1,
                 });
               }}
               prevPageRenderer={() => <i className="fa fa-angle-left" />}
               nextPageRenderer={() => <i className="fa fa-angle-right" />}
             />
          </Flex>
        </CardBody>
      </Card>
    </Flex>
    {isRegisterOpen && <AddSubDomain
      refetch={refetch}
      isOpen={isRegisterOpen}
      userDetail={userDetail}
      onOpen={onRegisterOpen}
      onClose={handelCloseModal}
    />}
  </>
  )
}

export default SubDomain;