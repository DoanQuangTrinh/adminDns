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
import { axiosGet, axiosPost } from "../../utils/api";
import { API_ROUTES, ROOT_API } from "utils/constant";

const createDomainApi = ROOT_API + API_ROUTES.DOMAIN_API;
const updateStatusDomain = ROOT_API + API_ROUTES.UPADTE_STATUS;
console.log(createDomainApi)
console.log(updateStatusDomain)
const AddDomainDialog = (props) => {
  const {
    onClose,
    isOpen,
    refetch,
  } = props;
  const cancelRef = React.useRef();
  const [domainName, setDomainName] = useState("");
  const toast = useToast();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const clickAddButton = async () => {
    const requestBody = {
      domainName: domainName,
    };
    try {
      const response = await axiosPost(createDomainApi, requestBody);
      if (response.data.code === 0) {
        toast({
          title: "Create Domain Successfully",
          status: "success",
          duration: 9000,
        });
        try {
          const response2 = await axiosGet(updateStatusDomain);
          console.log(response2);
        } catch (error2) {
          console.error("Error in the second API request:", error2);
        }
        refetch();
        onClose();
      } else {
        toast({
          title: "Create Domain Error ",
          status: "error",
          duration: 9000,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Delete Group Fail",
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
          <AlertDialogHeader>Thông Tin Domain</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Domain Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter Domain Name"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
            </FormControl>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                clickAddButton();
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

export default AddDomainDialog;
