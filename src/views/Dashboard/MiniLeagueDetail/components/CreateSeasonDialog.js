import React, { useEffect, useRef } from "react";
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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import { pick } from "lodash";
import InputController from "components/Form/InputController";
import {
  ValidateMessage,
  ROOT_API,
  API_ROUTES,
  SeasonTypeKey,
  SeasonTypeOption,
  KnockoutOption,
  ModalType,
} from "utils/constant";
import SelectController from "components/Form/SelectController";

const CreateSeasonDialog = ({ isOpen, seasonDetail, onClose, refetchData }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const params = useParams();
  const { id } = params || {};
  const [{ loading: createLoading }, createSeasonApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.CREATE_SEASON,
    },
    { manual: true }
  );
  const [{ loading: updateLoading }, updateSeasonApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.UPDATE_SEASON,
    },
    { manual: true }
  );

  useEffect(
    () => () => {
      reset();
    },
    []
  );

  useEffect(() => {
    reset({
      ...pick(seasonDetail, [
        "name",
        "leagueId",
        "numberGroup",
        "numberTeam",
        "description",
        "year",
        "pointsForDraw",
        "pointsForWin",
      ]),
      type: SeasonTypeOption.find((item) => item.value === seasonDetail?.type),
      numberTeamForKnockout: KnockoutOption.find(
        (item) => Number(item.value) === seasonDetail?.numberTeamForKnockout
      ),
    });
  }, [seasonDetail]);

  const schema = yup.object().shape({
    name: yup.string().required(ValidateMessage.required),
    numberTeam: yup
      .number()
      .nullable()
      .typeError(ValidateMessage.mustNumber)
      .min(1, ValidateMessage.minNumber)
      .required(ValidateMessage.required),
    numberGroup: yup
      .number()
      .nullable()
      .when("type", {
        is: (type) => (type?.value === SeasonTypeKey.Cup ? true : false),
        then: () =>
          yup
            .number()
            .nullable()
            .typeError(ValidateMessage.mustNumber)
            .min(1, ValidateMessage.minNumber)
            .required(ValidateMessage.required),
      }),
    pointsForWin: yup
      .number()
      .nullable()
      .typeError(ValidateMessage.mustNumber)
      .min(1, ValidateMessage.minNumber)
      .required(ValidateMessage.required),
    pointsForDraw: yup
      .number()
      .nullable()
      .typeError(ValidateMessage.mustNumber)
      .min(1, ValidateMessage.minNumber)
      .required(ValidateMessage.required),
    type: yup.object().nullable().required(ValidateMessage.required),
    numberTeamForKnockout: yup
      .object()
      .nullable()
      .when("type", {
        is: (type) => (type?.value === SeasonTypeKey.Cup ? true : false),
        then: () => yup.object().nullable().required(ValidateMessage.required),
      }),
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      numberTeam: 1,
      numberGroup: 1,
      type: undefined,
      description: "",
      year: new Date().getFullYear(),
      pointsForWin: 3,
      pointsForDraw: 1,
    },
  });
  const watchType = watch("type");

  const handleSuccess = () => {
    refetchData?.();
    toast({
      title: `${seasonDetail?._id ? "Edit" : "Create"} Season Successfully`,
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
        `${seasonDetail?._id ? "Edit" : "Create"} Season Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    if (seasonDetail?._id) {
      updateSeasonApi({
        data: {
          ...dataForm,
          type: dataForm?.type?.value,
          id: seasonDetail?._id,
          ...(dataForm?.type?.value === SeasonTypeKey.Cup && {
            numberTeamForKnockout: dataForm?.numberTeamForKnockout?.value,
            numberGroup: dataForm?.numberGroup,
          }),
          year: new Date().getFullYear(),
        },
      })
        .then(() => {
          handleSuccess();
        })
        .catch((error) => {
          handleError(error);
        });

      return;
    }

    createSeasonApi({
      data: {
        ...dataForm,
        leagueId: id,
        type: dataForm?.type?.value,
        year: new Date().getFullYear(),
        ...(dataForm?.type?.value === SeasonTypeKey.Cup && {
          numberTeamForKnockout: dataForm?.numberTeamForKnockout?.value,
          numberGroup: dataForm?.numberGroup,
        }),
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
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>{`${
          seasonDetail?._id ? "Edit" : "Create"
        } Season`}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          <form>
            <InputController
              control={control}
              name="name"
              label="Name"
              isRequired
            />
            <SelectController
              control={control}
              name="type"
              label="Type"
              isRequired
              options={SeasonTypeOption}
              styleContainer={{ pt: "4" }}
              isDisabled={seasonDetail}
            />
            <InputController
              type="number"
              control={control}
              name="numberTeam"
              label="Team number"
              isRequired
              styleContainer={{ pt: "4" }}
              disabled={seasonDetail}
            />
            {watchType?.value === SeasonTypeKey.Cup && (
              <>
                <InputController
                  type="number"
                  control={control}
                  name="numberGroup"
                  label="Group number"
                  isRequired
                  styleContainer={{ pt: "4" }}
                  disabled={seasonDetail}
                />
                <SelectController
                  control={control}
                  name="numberTeamForKnockout"
                  label="Number of teams in the knockout round"
                  isRequired
                  options={KnockoutOption}
                  styleContainer={{ pt: "4" }}
                />
              </>
            )}
            <InputController
              type="number"
              control={control}
              name="pointsForWin"
              label="Wins point"
              isRequired
              styleContainer={{ pt: "4" }}
            />
            <InputController
              type="number"
              control={control}
              name="pointsForDraw"
              label="Draws point"
              isRequired
              styleContainer={{ pt: "4" }}
            />
            <InputController
              type="area"
              control={control}
              name="description"
              label="Description"
              styleContainer={{ pt: "4" }}
            />
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

export default CreateSeasonDialog;
