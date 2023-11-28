import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  FormLabel,
  FormControl,
  useToast,
  Flex,
  Text,
  Box,
  Image,
  useColorModeValue,
  Switch,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxios from "axios-hooks";
import { isObject, pick } from "lodash";
import { useHistory, useParams } from "react-router-dom";
import InputController from "components/Form/InputController";
import {
  ValidateMessage,
  ROOT_API,
  API_ROUTES,
  PostTypeOption,
  FileImageValid,
  MAX_VIDEO_UPLOAD,
  PostType,
} from "utils/constant";
import SelectController from "components/Form/SelectController";
import EditorController from "components/Form/EditorController";
import { mappingMiniLeagueOption } from "utils/mapping";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

const CreatePostDialog = ({ seasonDetail, onClose, refetchData }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const inputThumbnailFileRef = useRef();
  const history = useHistory();
  const inputVideoUrlRef = useRef();
  const cancelRef = useRef();
  const toast = useToast();
  const params = useParams();
  const { id } = params || {};
  const [leagueOption, setLeagueOption] = useState([]);
  const [fileSelected, setFileSelected] = useState({
    thumbnailFile: null,
    videoUrl: null,
  });
  const [error, setError] = useState({
    thumbnailFile: null,
    videoUrl: null,
  });
  const [isPublic, setIsPublic] = useState(false);
  const [{ loading: createLoading }, createPostApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.CREATE_POST,
    },
    { manual: true }
  );
  const [{ loading: updateLoading }, updatePostApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.UPDATE_POST,
    },
    { manual: true }
  );
  const [{ loading: uploadLoading }, uploadVideoApi] = useAxios(
    {
      method: "post",
      url: ROOT_API + API_ROUTES.UPLOAD_VIDEO,
    },
    { manual: true }
  );
  const [, publicPostApi] = useAxios(
    {
      method: "post",
      url: `${ROOT_API}${API_ROUTES.PUBLIC_POST}/${id}`,
    },
    { manual: true }
  );
  const [{ loading: loadingPostDetail }, getPostDetailApi] = useAxios(
    {
      url: `${ROOT_API}${API_ROUTES.POSTS}/${id}`,
    },
    { manual: true }
  );
  const [{ data: leagueData }] = useAxios(
    {
      url: ROOT_API + API_ROUTES.LEAGUES_FILTER,
      params: { isActive: true },
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
    if (!!id) {
      getPostDetailApi().then((res) => {
        const data = res?.data?.data;

        reset({
          ...pick(data, [
            "title",
            "tags",
            "body",
            "videoUrl",
            "description",
            "slug",
          ]),
          type: PostTypeOption.find((item) => item.value === data?.type),
          leagueId: leagueOption?.find(
            (item) => item?.value === data?.leagueId
          ),
        });
        setFileSelected({
          thumbnailFile: {
            filePreview: data?.thumbnailUrl
              ? process.env.REACT_APP_API_HOST + data?.thumbnailUrl
              : null,
          },
        });
        setIsPublic(data?.isShow);
      });
    }
  }, [id, leagueOption]);

  useEffect(() => {
    setLeagueOption(mappingMiniLeagueOption(leagueData?.data));
  }, [leagueData]);

  const schema = yup.object().shape({
    title: yup.string().required(ValidateMessage.required),
    type: yup.object().nullable().required(ValidateMessage.required),
    videoUrl: yup
      .string()
      .nullable()
      .when("type", {
        is: (type) => (type?.value === PostType.Highlight ? true : false),
        then: () => yup.string().required(ValidateMessage.required),
      }),
    body: yup.string().required(ValidateMessage.required),
    tags: yup.string().required(ValidateMessage.required),
    slug: yup.string().required(ValidateMessage.required),
    leagueId: yup.object().nullable().required(ValidateMessage.required),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      videoUrl: "",
      body: "",
      tags: "",
      type: undefined,
      leagueId: undefined,
      description: "",
      slug: "",
    },
  });
  const watchType = watch("type");

  const handleSuccess = () => {
    refetchData?.();
    toast({
      title: `${seasonDetail?._id ? "Edit" : "Create"} Post Successfully`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    !id && history.goBack();
  };

  const handleError = (error) => {
    toast({
      title:
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data?.msg ||
        `${seasonDetail?._id ? "Edit" : "Create"} Post Fail`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const onSubmit = (dataForm) => {
    if (!fileSelected.thumbnailFile?.filePreview) {
      setError({
        thumbnailFile: "The field is not empty ",
      });
      return;
    }

    const formData = new FormData();

    Object.keys(dataForm).map((key) => {
      formData.append(
        key,
        isObject(dataForm[key]) ? dataForm[key]?.value : dataForm[key]
      );
    });
    !!fileSelected.thumbnailFile?.file &&
      formData.append("thumbnailFile", fileSelected.thumbnailFile?.file);

    if (id) {
      formData.append("id", id);

      updatePostApi({
        data: formData,
      })
        .then(() => {
          handleSuccess();
        })
        .catch((error) => {
          handleError(error);
        });

      return;
    }

    createPostApi({
      data: formData,
    })
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleFileVideo = (file, fieldName) => {
    if (file.size > MAX_VIDEO_UPLOAD) {
      handleErrorFile(fieldName, "Maximum video upload is 200Mb");
      return;
    }

    const formData = new FormData();

    formData.append("videoFile", file);
    uploadVideoApi({ data: formData })
      .then((res) => {
        setValue("videoUrl", res?.data?.data?.videoUrl);
        clearErrors("videoUrl");
      })
      .catch((error) => {
        toast({
          title: "Upload video fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const handleFileSelect = (fieldName, e) => {
    if (e?.target?.files?.[0]) {
      const fileSelected = e.target.files[0];
      const filePreview = URL.createObjectURL(fileSelected);
      const extensionFile = fileSelected?.name?.split(".")?.pop();

      if (fieldName === "videoUrl" && fileSelected.type === "video/mp4") {
        handleFileVideo(fileSelected, fieldName);
        return;
      }

      if (FileImageValid.includes(extensionFile)) {
        setFileSelected((prev) => ({
          ...prev,
          [fieldName]: { file: fileSelected, filePreview },
        }));

        return;
      }

      setFileSelected((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
      handleErrorFile(
        fieldName,
        "File reload formats are supported only .png, .jpeg, .jpg"
      );
    }
  };

  const handleErrorFile = (fieldName, value) => {
    setError((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handlePublicPost = (status) => {
    publicPostApi({ data: undefined })
      .then(() => {
        toast({
          title: "Public Post Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title:
            error?.response?.data?.errors?.[0]?.msg ||
            error?.response?.data?.msg ||
            "Public Post Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
    setIsPublic(status);
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Flex justifyContent="space-between">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              {`${id ? "Edit" : "Create"} Post`}
            </Text>
            <Switch
              size="md"
              isChecked={isPublic}
              onChange={(e) => handlePublicPost(e.target.checked)}
            />
          </Flex>
        </CardHeader>
        <CardBody pb={4}>
          <form>
            <SelectController
              control={control}
              name="type"
              label="Type"
              isRequired
              options={PostTypeOption}
            />
            <FormControl pt={4} isRequired>
              <FormLabel minW="150px">Thumbnail</FormLabel>
              <Box alignItems="center">
                <Flex alignItems="center">
                  <input
                    type="file"
                    hidden
                    ref={inputThumbnailFileRef}
                    onChange={(e) => {
                      handleFileSelect("thumbnailFile", e);
                    }}
                  />
                  {!!fileSelected.thumbnailFile?.filePreview ? (
                    <Flex direction="column" alignItems="center" w="full">
                      <Image
                        boxSize="full"
                        height="300px"
                        objectFit="cover"
                        borderRadius="6px"
                        src={fileSelected.thumbnailFile?.filePreview}
                      />
                      <Text
                        ml={3}
                        fontSize="14px"
                        color="blue.400"
                        cursor="pointer"
                        onClick={() => {
                          handleErrorFile("thumbnailFile", null);
                          inputThumbnailFileRef?.current?.click();
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
                        handleErrorFile("thumbnailFile", null);
                        inputThumbnailFileRef?.current?.click();
                      }}
                    >
                      Choose file
                    </Button>
                  )}
                </Flex>
                {!!error.thumbnailFile && (
                  <Text pt={1} color={"red.500"} fontSize="13px">
                    {error.thumbnailFile}
                  </Text>
                )}
              </Box>
            </FormControl>
            <FormControl
              pt={4}
              isRequired={watchType?.value === PostType.Highlight}
            >
              <FormLabel minW="150px">Video</FormLabel>
              <Flex justifyContent="center" alignItems="center">
                <InputController control={control} name="videoUrl" isRequired />
                <Box ml={3} alignItems="center">
                  <Flex alignItems="center">
                    <input
                      type="file"
                      hidden
                      ref={inputVideoUrlRef}
                      accept="video/mp4"
                      onChange={(e) => {
                        handleFileSelect("videoUrl", e);
                      }}
                    />
                    <Button
                      variant="primary"
                      maxH="30px"
                      isLoading={uploadLoading}
                      onClick={() => {
                        handleErrorFile("videoUrl", null);
                        inputVideoUrlRef?.current?.click();
                      }}
                    >
                      Choose file
                    </Button>
                  </Flex>
                </Box>
              </Flex>
              {!!error.videoUrl && (
                <Text pt={1} color={"red.500"} fontSize="13px">
                  {error.videoUrl}
                </Text>
              )}
            </FormControl>
            <InputController
              control={control}
              name="title"
              label="Title"
              isRequired
              styleContainer={{ pt: "4" }}
            />
            <InputController
              control={control}
              name="slug"
              label="Slug"
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
            <EditorController
              styleContainer={{ pt: "4" }}
              control={control}
              name="body"
              label="Body"
              isRequired
              uploadApiUrl={API_ROUTES.UPLOAD_IMAGE}
            />
            <InputController
              control={control}
              name="tags"
              label="Tags"
              isRequired
              styleContainer={{ pt: "4" }}
              disabled={seasonDetail}
            />
            <SelectController
              styleContainer={{ pt: "4" }}
              control={control}
              isRequired
              name="leagueId"
              label="League"
              options={leagueOption}
              menuPlacement="top"
            />
          </form>
          <Flex pt={4} alignItems="flex-end" justifyContent="flex-end">
            <Button
              ref={cancelRef}
              onClick={() => {
                history.goBack();
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
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default CreatePostDialog;
