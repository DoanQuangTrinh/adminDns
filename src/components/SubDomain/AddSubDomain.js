import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  Button,
  Input,
  Checkbox,
  FormLabel,
  FormControl,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { vendorDomain } from "config/config";
import { teamControl } from "config/config";
import { typeDomain } from "config/config";
import { getToken } from "utils/authentication";
import useAxios from "axios-hooks";
import { API_ROUTES , ROOT_API } from "utils/constant";

const source = axios.CancelToken.source();
const CreateSubDomain = ROOT_API + API_ROUTES.SUBDOMAIN_API ;
console.log(CreateSubDomain);
const AddSubDomain = ({ isOpen, onOpen, onClose,refetch }) => {
  const cancelRef = React.useRef();
  const [id, setId] = useState("");
  const toast = useToast();
  // const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const xToken = getToken();

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);
  const [subDomains, setSubDomains] = useState([]);
  useEffect(() => {}, []);
  const [value, setValue] = useState();
  const clickCreateButton = async () => {
    const subData = {
      domain_id: id
    };
    try {
      const response = await axiosPost(
        CreateSubDomain,
        subData
      );
      if (response.data.code === 0) {
        toast({
          title: response.data.msg,
          status: "success",
          duration: 9000,
        })
        refetch();
        onClose();
      } else {
        toast({
          title: response.data.msg,
          status: "error",
          duration: 9000,
        })
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg || "Create Sub Domain Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  

  
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Thông Tin SubDomain</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Domain ID</FormLabel>
              <Input
                type="text"
                placeholder="Enter Domain ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </FormControl>
            
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                clickCreateButton();
                // onClose();
              }}
            >
              Thêm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddSubDomain;
