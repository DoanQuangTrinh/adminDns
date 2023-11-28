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

const CreateMiniMatch = ({
  isOpen,
  onClose,
  refetchData,
  matchData,
  roundId,
}) => {
  const cancelRef = useRef();
  const toast = useToast();
  const params = useParams();
  const { id } = params || {};
  const [teamOptions, setTeamOptions] = useState([]);
  const [roundOptions, setRoundOptions] = useState([]);
  const [groupsOptions, setGroupsOptions] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [{ loading: createLoading }, createMiniMatch] = useAxios(
    {
      method: "post",
      url: matchData?._id
        ? ROOT_API + API_ROUTES.UPDATE_MINI_MATCH
        : ROOT_API + API_ROUTES.CREATE_MINI_MATCH,
    },
    { manual: true }
  );
  const [{ data: teamsData }, refetch] = useAxios(
    {
      url: `${ROOT_API}${API_ROUTES.TEAM_OF_SEASON_FOR_MATCH}/${id}?groupId=${groupId}`,
    },
    {
      useCache: false,
    }
  );
  const [{ data: groupsData }] = useAxios(
    {
      url: `${ROOT_API}${API_ROUTES.GROUP_OF_SEASON}/${id}`,
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

  useEffect(() => {
    reset({
      homeId: teamOptions
        ? teamOptions.find((item) => item.value === matchData?.homeId)
        : undefined,
      awayId: teamOptions
        ? teamOptions.find((item) => item.value === matchData?.awayId)
        : undefined,
      groupId: groupsOptions
        ? groupsOptions.find((item) => item.value === matchData?.groupId)
        : undefined,
      roundId: roundOptions
        ? roundOptions.find((item) => item.value === roundId)
        : undefined,
      time: matchData?.time
        ? new Date(moment(matchData?.time).format("YYYY-MM-DD HH:mm"))
        : undefined,
    });
  }, [matchData, teamOptions, roundOptions, groupsOptions]);

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

  useEffect(() => {
    setGroupsOptions(
      groupsData?.data?.map((item) => ({
        value: item?._id,
        label: item?.name,
      }))
    );
  }, [groupsData?.data]);

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
      title: `${matchData?._id ? "Update" : "Create"}  Match Successfully`,
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
        `${matchData?._id ? "Update" : "Create"}  Match Fail`,
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

    let data = {
      homeId: dataForm?.homeId?.value,
      awayId: dataForm?.awayId?.value,
      roundId: dataForm?.roundId?.value,
      time: moment(dataForm.time).toISOString(),
    };
    if (matchData?._id) {
      data = {
        ...data,
        id: matchData._id
      }
    }
    if (groupId) {
      data = {
        ...data,
        groupId,
      };
    }
    createMiniMatch({
      data,
    })
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const onSelectGroupChange = (item) => {
    setGroupId(item?.value);
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
        <AlertDialogHeader>{`Create Match`}</AlertDialogHeader>
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
                options={groupsOptions}
                name="groupId"
                label="Group"
                isRequired
                onChange={onSelectGroupChange}
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
                styleContainer={{ pt: "4", pb: 2 }}
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
