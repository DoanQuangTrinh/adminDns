import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import { ValidateMessage, ROOT_API, API_ROUTES } from "utils/constant";
import SelectController from "components/Form/SelectController";
import { ModalType } from "utils/constant";
import DatePickerController from "components/Form/DatePickerController";
import moment from "moment";

const CreateMiniMatch = ({ isOpen, onClose, refetchData }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const params = useParams();
  const { id, groupId } = params || {};
  const [teamOptions, setTeamOptions] = useState([]);
  const [roundOptions, setRoundOptions] = useState([]);
  const [{ loading: createLoading }, createMiniMatch] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.CREATE_MINI_MATCH,
    },
    { manual: true }
  );
  const [{ data: teamsData }] = useAxios(
    {
      url: `${ROOT_API}${API_ROUTES.TEAM_OF_GROUP}/${groupId}`,
    },
    {
      useCache: false,
    }
  );
  const [{ data: roundsData }] = useAxios(
    {
      url: `${ROOT_API}${API_ROUTES.SEASON_ROUND}/${id}?pageSize=100&pageIndex=0`,
    },
    {
      useCache: false,
    }
  );

  useEffect(
    () => () => {
      reset();
    },
    []
  );

  useEffect(() => {
    setTeamOptions(
      teamsData?.data?.map((item) => ({
        value: item?.teamId?._id,
        label: item?.teamId?.name,
      }))
    );
  }, [teamsData?.data]);

  useEffect(() => {
    setRoundOptions(
      roundsData?.data?.map((item) => ({
        value: item?._id,
        label: item?.name,
      }))
    );
  }, [roundsData?.data]);

  const schema = yup.object().shape({
    homeId: yup.object().nullable().required(ValidateMessage.required),
    awayId: yup.object().nullable().required(ValidateMessage.required),
    roundId: yup.object().nullable().required(ValidateMessage.required),
    time: yup.string().nullable().required(ValidateMessage.required),
  });
  const { control, handleSubmit, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      homeId: undefined,
      awayId: undefined,
      roundId: undefined,
      time: undefined,
    },
  });
  const handleSuccess = () => {
    refetchData?.();
    toast({
      title: `Create Match Successfully`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onClose?.(ModalType.Add);
  };

  const handleError = (error) => {
    toast({
      title:
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data?.msg ||
        `Create Match Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    if (dataForm?.homeId === dataForm?.awayId) {
      toast({
        title: "Home team must difference with Away team",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    // console.log(moment(dataForm.time).toISOString());
    // return;
    createMiniMatch({
      data: {
        homeId: dataForm?.homeId?.value,
        awayId: dataForm?.awayId?.value,
        roundId: dataForm?.roundId?.value,
        time: moment(dataForm.time).toISOString(),
      },
    })
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={() => {
        onClose?.(ModalType.Add);
      }}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>{`Add Team`}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <form>
            <div>
              <SelectController
                styleContainer={{ pt: "4" }}
                styleBoxInput={{
                  flexShrink: "1",
                  flexGrow: "1",
                  flexBasis: "0",
                }}
                control={control}
                options={teamOptions}
                name="homeId"
                label="Home team"
                isRequired
              />
            </div>
            <div>
              <SelectController
                styleContainer={{ pt: "4" }}
                styleBoxInput={{
                  flexShrink: "1",
                  flexGrow: "1",
                  flexBasis: "0",
                }}
                control={control}
                options={teamOptions}
                name="awayId"
                label="Away team"
                isRequired
              />
            </div>
            <div>
              <SelectController
                styleContainer={{ pt: "4" }}
                styleBoxInput={{
                  flexShrink: "1",
                  flexGrow: "1",
                  flexBasis: "0",
                }}
                control={control}
                options={roundOptions}
                name="roundId"
                label="Round"
                isRequired
              />
            </div>
            <div>
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
            </div>
          </form>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={cancelRef}
            onClick={() => {
              onClose?.(ModalType.Add);
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            isLoading={createLoading}
            onClick={handleSubmit(onSubmit)}
          >
            OK
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateMiniMatch;
