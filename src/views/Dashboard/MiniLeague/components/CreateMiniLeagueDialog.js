import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
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
  Flex,
  Text,
  Box,
  Avatar,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "axios-hooks";
import InputController from "components/Form/InputController";
import {
  FileImageValid,
  ValidateMessage,
  ROOT_API,
  API_ROUTES,
} from "utils/constant";

const CreateMiniLeagueDialog = ({
  isOpen,
  leagueDetail,
  onClose,
  fetchData,
}) => {
  const inputFileRef = useRef();
  const cancelRef = useRef();
  const toast = useToast();
  const [fileSelected, setFileSelected] = useState(null);
  const [error, setError] = useState();
  const [{ loading: createLoading }, createLeagueApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.CREATE_MINI_LEAGUE,
    },
    { manual: true }
  );
  const [{ loading: updateLoading }, updateLeagueApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.UPDATE_MINI_LEAGUE,
    },
    { manual: true }
  );

  useEffect(
    () => () => {
      reset();
      setFileSelected(null);
    },
    []
  );

  useEffect(() => {
    reset({ name: leagueDetail?.name });
    leagueDetail?.leagueLogo &&
      setFileSelected({
        filePreview: process.env.REACT_APP_API_HOST + leagueDetail?.leagueLogo,
      });
  }, [leagueDetail]);

  const schema = yup.object().shape({
    name: yup.string().required(ValidateMessage.required),
  });
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const handleSuccess = () => {
    fetchData();
    toast({
      title: `${leagueDetail?._id ? "Edit" : "Create"} League Successfully`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onClose?.();
  };

  const handleError = (error) => {
    toast({
      title:
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data?.msg ||
        `${leagueDetail?._id ? "Edit" : "Create"} League Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    const formData = new FormData();
    formData.append("name", dataForm.name);
    !!fileSelected?.file &&
      formData.append("leagueLogoFile", fileSelected?.file);

    if (leagueDetail?._id) {
      formData.append("id", leagueDetail?._id);

      updateLeagueApi({ data: formData })
        .then(() => {
          handleSuccess();
        })
        .catch((error) => {
          handleError(error);
        });

      return;
    }

    createLeagueApi({ data: formData })
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleFileSelect = (e) => {
    setError("");
    if (e?.target?.files?.[0]) {
      const fileSelected = e.target.files[0];
      const filePreview = URL.createObjectURL(fileSelected);
      const extensionFile = fileSelected?.name?.split(".")?.pop();

      if (FileImageValid.includes(extensionFile)) {
        setFileSelected({ file: fileSelected, filePreview });
      } else {
        setFileSelected(null);
        setError("File reload formats are supported only .png, .jpeg, .jpg");
      }
    }
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>{`${
          leagueDetail?._id ? "Edit" : "Create"
        } Mini League`}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <form>
            <FormControl pb={2}>
              <FormLabel minW="150px">Logo</FormLabel>
              <Box alignItems="center">
                <Flex alignItems="center" minH="48px">
                  <input
                    type="file"
                    hidden
                    ref={inputFileRef}
                    onChange={handleFileSelect}
                  />
                  {!!fileSelected?.filePreview ? (
                    <Flex alignItems="center">
                      <Avatar src={fileSelected?.filePreview} />
                      <Text
                        ml={2}
                        fontSize="12px"
                        color="blue.400"
                        cursor="pointer"
                        onClick={() => {
                          setError("");
                          inputFileRef?.current?.click();
                        }}
                      >
                        Change
                      </Text>
                    </Flex>
                  ) : (
                    <Button
                      variant="primary"
                      maxH="30px"
                      onClick={() => {
                        setError("");
                        inputFileRef?.current?.click();
                      }}
                    >
                      Choose file
                    </Button>
                  )}
                </Flex>
                {!!error && (
                  <Text pt={1} color={"red.500"} fontSize="13px">
                    {error}
                  </Text>
                )}
              </Box>
            </FormControl>
            <InputController
              control={control}
              name="name"
              label="Name"
              isRequired
            />
          </form>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            isLoading={createLoading || updateLoading}
            onClick={handleSubmit(onSubmit)}
          >
            OK
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateMiniLeagueDialog;
