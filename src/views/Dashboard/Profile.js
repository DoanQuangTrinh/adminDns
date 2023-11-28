// Chakra imports
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
// Assets
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar5 from "assets/img/avatars/avatar5.png";
import avatar6 from "assets/img/avatars/avatar6.png";
import ImageArchitect1 from "assets/img/ImageArchitect1.png";
import ImageArchitect2 from "assets/img/ImageArchitect2.png";
import ImageArchitect3 from "assets/img/ImageArchitect3.png";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { useUserState } from "context/UserContext";
import React, { useState } from "react";
import {
  FaLock,
  FaFacebook,
  FaInstagram,
  FaPenFancy,
  FaPlus,
  FaTwitter,
} from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import { axiosPost } from "utils/api";
const changePassApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CHANGE_PASS_USER;
const defaultValue = {
  password: "",
  newPassword: "",
  confirmPass: "",
};
const defaultValueShow = {
  password: false,
  newPassword: false,
  confirmPass: false,
};
function Profile() {
  const { colorMode } = useColorMode();
  const [changePass, setChangePass] = useState(defaultValue);
  const [show, setShow] = useState(defaultValueShow);

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("blue.500", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");
  const { isAuthenticated, userInfo } = useUserState();
  const toast = useToast();
  const changePassword = async () => {
    // return;
    try {
      const response = await axiosPost(changePassApi, changePass);
      if (response?.data?.code == 0) {
        toast({
          title: "Đổi mật khẩu thành công",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setChangePass(defaultValue);
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Đổi mật khẩu thất bại",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px", lg: "100px" }}>
      {!!isAuthenticated ? (
        <>
          <Flex
            direction={{ sm: "column", md: "row" }}
            mb="24px"
            maxH="330px"
            justifyContent={{ sm: "center", md: "space-between" }}
            align="center"
            backdropFilter="blur(21px)"
            boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
            border="1.5px solid"
            borderColor={borderProfileColor}
            bg={bgProfile}
            p="24px"
            borderRadius="20px"
          >
            <Flex
              align="center"
              mb={{ sm: "10px", md: "0px" }}
              direction={{ sm: "column", md: "row" }}
              w={{ sm: "100%" }}
              textAlign={{ sm: "center", md: "start" }}
            >
              <Avatar
                me={{ md: "22px" }}
                w="80px"
                h="80px"
                borderRadius="15px"
              />
              <Flex direction="column" maxWidth="100%" my={{ sm: "14px" }}>
                <Text
                  fontSize={{ sm: "lg", lg: "xl" }}
                  color={textColor}
                  fontWeight="bold"
                  ms={{ sm: "8px", md: "0px" }}
                >
                  {userInfo?.username}
                </Text>
                <Text
                  fontSize={{ sm: "sm", md: "md" }}
                  color={emailColor}
                  fontWeight="semibold"
                >
                  {userInfo?.email}
                </Text>
              </Flex>
            </Flex>
            <Flex
              direction={{ sm: "column", lg: "row" }}
              w={{ sm: "100%", md: "50%", lg: "auto" }}
            ></Flex>
          </Flex>
          <Card p="16px" my="24px">
            <CardHeader p="12px 5px" mb="12px">
              <Flex direction="column">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Đổi mật khẩu
                </Text>
              </Flex>
            </CardHeader>
            <CardBody px="50px">
              <Flex direction="column">
                <FormControl mb={3}>
                  <FormLabel color={textColor} fontWeight="bold">
                    Mật khẩu
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      type={show.password ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={changePass.password}
                      onChange={(event) =>
                        setChangePass({
                          ...changePass,
                          password: event.target.value,
                        })
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() =>
                          setShow({
                            ...show,
                            password: !show.password,
                          })
                        }
                      >
                        {show.password ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel color={textColor} fontWeight="bold">
                    Mật khẩu mới
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      type={show.newPassword ? "text" : "password"}
                      placeholder="Mật khẩu mới"
                      value={changePass.newPassword}
                      onChange={(event) =>
                        setChangePass({
                          ...changePass,
                          newPassword: event.target.value,
                        })
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() =>
                          setShow({
                            ...show,
                            newPassword: !show.newPassword,
                          })
                        }
                      >
                        {show.newPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel color={textColor} fontWeight="bold">
                    Xác nhận mật khẩu
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      type={show.confirmPass ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu"
                      value={changePass.confirmPass}
                      onChange={(event) =>
                        setChangePass({
                          ...changePass,
                          confirmPass: event.target.value,
                        })
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() =>
                          setShow({
                            ...show,
                            confirmPass: !show.confirmPass,
                          })
                        }
                      >
                        {show.confirmPass ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Flex>
              <Button p="0px" bg="transparent" variant="no-effects">
                <Flex
                  align="center"
                  w={{ sm: "100%", lg: "135px" }}
                  bg={colorMode === "dark" ? "navy.900" : "#fff"}
                  borderRadius="8px"
                  justifyContent="center"
                  py="10px"
                  boxShadow="2px 2px 5.5px rgba(0, 0, 0, 0.06)"
                  cursor="pointer"
                  onClick={changePassword}
                >
                  <Icon color={textColor} as={FaLock} me="6px" />
                  <Text fontSize="xs" color={textColor} fontWeight="bold">
                    Đổi mật khẩu
                  </Text>
                </Flex>
              </Button>
            </CardBody>
          </Card>
        </>
      ) : (
        ""
      )}
    </Flex>
  );
}

export default Profile;
