import React, { useState, useEffect, useRef } from "react";
import {
  Button,
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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "axios-hooks";
import moment from "moment";
import InputController from "components/Form/InputController";
import {
  FileImageValid,
  ValidateMessage,
  ROOT_API,
  API_ROUTES,
} from "utils/constant";
import DatePickerController from "components/Form/DatePickerController";
import "./style.css";
import SelectController from "components/Form/SelectController";
import { mappingMiniLeagueOption } from "utils/mapping";

const CreateMatchDialog = ({ isOpen, matchDetail, onClose, fetchData }) => {
  const inputFileHomeLogoRef = useRef();
  const inputFileAwayLogoRef = useRef();
  const cancelRef = useRef();
  const toast = useToast();
  const [leagueOption, setLeagueOption] = useState([]);
  const [fileSelected, setFileSelected] = useState({
    homeLogo: null,
    awayLogo: null,
  });
  const [error, setError] = useState({
    homeLogo: null,
    awayLogo: null,
  });
  const [{ data: miniLeagueData }] = useAxios(
    {
      url: ROOT_API + API_ROUTES.MINI_LEAGUE,
      params: { isActive: true },
    },
    {
      useCache: false,
    }
  );
  const [{ loading: createLoading }, createMatchApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.CREATE_MATCH_MANUAL,
    },
    { manual: true }
  );
  const [{ loading: updateLoading }, updateMatchApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.UPDATE_MATCH_MANUAL,
    },
    { manual: true }
  );

  useEffect(
    () => () => {
      reset();
      setFileSelected({
        homeLogo: null,
        awayLogo: null,
      });
    },
    []
  );

  useEffect(() => {
    setLeagueOption(mappingMiniLeagueOption(miniLeagueData?.data));
  }, [miniLeagueData]);

  useEffect(() => {
    reset({
      homeName: matchDetail?.home_name,
      awayName: matchDetail?.away_name,
      time: matchDetail?.time
        ? new Date(moment(matchDetail?.time).format("YYYY-MM-DD HH:mm"))
        : undefined,
      league: matchDetail?.leagueId
        ? leagueOption?.find((item) => item?.id === matchDetail?.leagueId)
        : undefined,
    });
    setFileSelected({
      homeLogo: {
        filePreview: matchDetail?.home_logo
          ? process.env.REACT_APP_API_HOST + matchDetail?.home_logo
          : null,
      },
      awayLogo: {
        filePreview: matchDetail?.away_logo
          ? process.env.REACT_APP_API_HOST + matchDetail?.away_logo
          : null,
      },
    });
  }, [matchDetail, leagueOption]);

  const schema = yup.object().shape({
    homeName: yup.string().required(ValidateMessage.required),
    awayName: yup.string().required(ValidateMessage.required),
    time: yup.string().nullable().required(ValidateMessage.required),
    league: yup.object().nullable().required(ValidateMessage.required),
  });
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      homeName: "",
      awayName: "",
    },
  });

  const handleSuccess = () => {
    fetchData();
    toast({
      title: `${matchDetail?._id ? "Edit" : "Create"} Match Successfully`,
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
        `${matchDetail?._id ? "Edit" : "Create"} Match Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    const formData = new FormData();
    formData.append("home_name", dataForm.homeName);
    formData.append("away_name", dataForm.awayName);
    formData.append(
      "time",
      moment(dataForm.time).format("YYYY-MM-DD HH:mm:ss")
    );
    formData.append("leagueId", dataForm.league.value);
    !!fileSelected.homeLogo?.file &&
      formData.append("homeLogoFile", fileSelected.homeLogo?.file);
    !!fileSelected.awayLogo?.file &&
      formData.append("awayLogoFile", fileSelected.awayLogo?.file);

    if (matchDetail?._id) {
      formData.append("id", matchDetail?._id);

      updateMatchApi({ data: formData })
        .then(() => {
          handleSuccess();
        })
        .catch((error) => {
          handleError(error);
        });

      return;
    }

    createMatchApi({ data: formData })
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleFileSelect = (fieldName, e) => {
    if (e?.target?.files?.[0]) {
      const fileSelected = e.target.files[0];
      const filePreview = URL.createObjectURL(fileSelected);
      const extensionFile = fileSelected?.name?.split(".")?.pop();

      if (FileImageValid.includes(extensionFile)) {
        setFileSelected((prev) => ({
          ...prev,
          [fieldName]: { file: fileSelected, filePreview },
        }));
      } else {
        setFileSelected((prev) => ({
          ...prev,
          [fieldName]: null,
        }));
        handleErrorFile(
          fieldName,
          "File reload formats are supported only .png, .jpeg, .jpg"
        );
      }
    }
  };

  const handleErrorFile = (fieldName, value) => {
    setError((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <AlertDialog
      size="lg"
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Create Match</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <form className="match-form">
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem w="100%">
                <FormControl pb={2}>
                  <FormLabel minW="150px">Home team logo</FormLabel>
                  <Box alignItems="center">
                    <Flex alignItems="center" minH="48px">
                      <input
                        type="file"
                        hidden
                        ref={inputFileHomeLogoRef}
                        onChange={(e) => {
                          handleFileSelect("homeLogo", e);
                        }}
                      />
                      {!!fileSelected.homeLogo?.filePreview ? (
                        <Flex alignItems="center">
                          <Avatar src={fileSelected.homeLogo?.filePreview} />
                          <Text
                            ml={2}
                            fontSize="12px"
                            color="blue.400"
                            cursor="pointer"
                            onClick={() => {
                              handleErrorFile("homeLogo", null);
                              inputFileHomeLogoRef?.current?.click();
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
                            handleErrorFile("homeLogo", null);
                            inputFileHomeLogoRef?.current?.click();
                          }}
                        >
                          Choose file
                        </Button>
                      )}
                    </Flex>
                    {!!error.homeLogo && (
                      <Text pt={1} color={"red.500"} fontSize="13px">
                        {error.homeLogo}
                      </Text>
                    )}
                  </Box>
                </FormControl>
                <InputController
                  control={control}
                  name="homeName"
                  label="Home team"
                  isRequired
                  styleContainer={{ pb: 2 }}
                />
              </GridItem>
              <GridItem w="100%">
                <FormControl pb={2}>
                  <FormLabel minW="150px">Away team logo</FormLabel>
                  <Box alignItems="center">
                    <Flex alignItems="center" minH="48px">
                      <input
                        type="file"
                        hidden
                        ref={inputFileAwayLogoRef}
                        onChange={(e) => {
                          handleFileSelect("awayLogo", e);
                        }}
                      />
                      {!!fileSelected.awayLogo?.filePreview ? (
                        <Flex alignItems="center">
                          <Avatar src={fileSelected.awayLogo?.filePreview} />
                          <Text
                            ml={2}
                            fontSize="12px"
                            color="blue.400"
                            cursor="pointer"
                            onClick={() => {
                              handleErrorFile("awayLogo", null);
                              inputFileAwayLogoRef?.current?.click();
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
                            handleErrorFile("awayLogo", null);
                            inputFileAwayLogoRef?.current?.click();
                          }}
                        >
                          Choose file
                        </Button>
                      )}
                    </Flex>
                    {!!error.awayLogo && (
                      <Text pt={1} color={"red.500"} fontSize="13px">
                        {error.awayLogo}
                      </Text>
                    )}
                  </Box>
                </FormControl>
                <InputController
                  control={control}
                  name="awayName"
                  label="Away team"
                  isRequired
                  styleContainer={{ pb: 2 }}
                />
              </GridItem>
            </Grid>

            <DatePickerController
              isRequired
              styleContainer={{ pb: 2 }}
              control={control}
              name="time"
              label="Time"
              showTimeSelect={true}
              dateFormat="yyyy-MM-dd HH:mm"
              timeFormat="HH:mm"
              timeIntervals={30}
            />
            <SelectController
              styleContainer={{ pb: 2 }}
              control={control}
              isRequired
              name="league"
              label="League"
              options={leagueOption}
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

export default CreateMatchDialog;
