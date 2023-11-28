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
import { mappingOptionSelect } from "utils/mapping";

const AddTeamDialog = ({ isOpen, seasonDetail, onClose, refetchData }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const params = useParams();
  const { id } = params || {};
  const [teamOptions, setTeamOptions] = useState([]);
  const [{ loading: createLoading }, addTeamIntoSeasonApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.ADD_TEAM_INTO_SEASON,
    },
    { manual: true }
  );
  const [{ data: teamsData }] = useAxios(
    {
      url: ROOT_API + API_ROUTES.TEAMS,
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
    reset({
      teamId: seasonDetail?.teams?.map((item) => ({
        value: item?.teamId?._id,
        label: item?.teamId?.name,
      })),
    });
  }, [seasonDetail]);

  useEffect(() => {
    setTeamOptions(mappingOptionSelect(teamsData?.data));
  }, [teamsData?.data]);

  const schema = yup.object().shape({
    teamId: yup.array().nullable().required(ValidateMessage.required),
  });
  const { control, handleSubmit, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      teamIds: undefined,
    },
  });
  const watchTeams = watch("teamId");

  const handleSuccess = () => {
    refetchData?.();
    toast({
      title: `Add Group Successfully`,
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
        `Add Group Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    addTeamIntoSeasonApi({
      data: {
        seasonId: id,
        teamIds: dataForm?.teamId?.map((item) => item.value).join(","),
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
                name="teamId"
                label="Team"
                isRequired
                isMulti
                isOptionDisabled={() =>
                  watchTeams?.length === seasonDetail?.numberTeam
                }
              />
              <Box pt={2} fontSize="14px" color="gray.500">
                Selected team number: {watchTeams?.length || 0}
              </Box>
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

export default AddTeamDialog;
