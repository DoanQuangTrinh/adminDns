import React, { useState, useEffect, useMemo } from "react";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useColorModeValue,
  Text,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/signInImage.png";
import useAxios from "axios-hooks";
import { checkLogin, login } from "../../utils/authentication";

import { useHistory } from "react-router-dom";
import { useUserDispatch, loginUser } from "context/UserContext";

// const loginUrl = 'http://localhost:8080/api/v1/user/loginUser'
const loginUrl =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_LOGIN_PATH;
console.log(loginUrl);
// console.log(loginUrl);
function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const userDispatch = useUserDispatch();

  // const navigate = useNavigate();
  const isLoggedIn = checkLogin();
  const history = useHistory();
  const [show, setShow] = useState({
    password: false
  });

  useEffect(() => {
    if (isLoggedIn) {
      console.log('connecting to')
      return history.push("/admin");
    }
  }, [isLoggedIn]);

  const [{ data, loading, error, response }, manualExecute] = useAxios(
    {
      url: loginUrl,
      method: "post",
    },
    { manual: true }
  );

  // manual excute api
  const handleLogin = () => {
    if (!username || !password) {
      return;
    } else {
      const loginData = {
        username,
        password,
      };
      manualExecute({
        data: loginData,
      })
        .then((res) => {
          if (res?.data?.data) {
            setErrors("");
            loginUser(
              userDispatch, 
              res.data.token,
              res.data.data,
              res.data.isMember
            );
            if (res.data.isMember) {
               history.push("/admin/profile");
            } else {
              history.push("/admin/");
            }
          }
        })
        .catch((error) => {
          const status = error.response?.status;
          switch (status) {
            case 400:
              setErrors(error?.response?.data?.error || "Wrong username or password");
              break;
            default:
              setErrors("Error Unknown");
          }
        });
    }
  };

  // handler
  useEffect(() => {
    if (error) {
      const status = error.response?.status;
      switch (status) {
        case 400:
          setErrors("Sai thông tin đăng nhập");
          break;
        default:
          setErrors("Lỗi không xác định");
      }
    } else if (data) {
      setErrors("");
      login(data.token, data.data);
      // navigate("/");
      return history.push('/admin/dashboard')
    }
  }, [error, response, data]);

  return (
    <Flex position="relative">
      <Flex
        minH={{ md: "1000px" }}
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ md: "0px" }}
      >
        <Flex
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          mb="60px"
          mt={{ base: "50px", md: "20px" }}
        >
          <Flex
            zIndex="2"
            direction="column"
            w="445px"
            background="transparent"
            borderRadius="15px"
            p="40px"
            mx={{ base: "100px" }}
            m={{ base: "20px", md: "auto" }}
            bg={bgForm}
            boxShadow={useColorModeValue(
              "0px 5px 14px rgba(0, 0, 0, 0.05)",
              "unset"
            )}
          >
            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Username
              </FormLabel>
              <Input
                variant="auth"
                fontSize="sm"
                ms="4px"
                type="text"
                value={username}
                placeholder="username"
                onChange={(event) => setUsername(event.target.value)}
                mb="24px"
                size="lg"
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  variant="auth"
                  fontSize="sm"
                  ms="4px"
                  value={password}
                  type={show.password ? "text" : "password"}
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  mb="24px"
                  size="lg"
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

              <FormControl display="flex" alignItems="center" mb="24px">
                <Switch id="remember-login" colorScheme="blue" me="10px" />
                <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
                  Remember me
                </FormLabel>
              </FormControl>
              <FormControl display="flex" alignItems="center" mb="24px">
                <Text fontSize="sm" mt="3px" color="red">
                  {errors}
                </Text>
              </FormControl>
              <Button
                onClick={handleLogin}
                fontSize="10px"
                variant="dark"
                fontWeight="bold"
                w="100%"
                h="45"
                mb="24px"
              >
                SIGN IN
              </Button>
            </FormControl>
          </Flex>
        </Flex>
        <Box
          overflowX="hidden"
          h="100%"
          w="100%"
          left="0px"
          position="absolute"
          bgImage={signInImage}
        >
          <Box
            w="100%"
            h="100%"
            bgSize="cover"
            bg="blue.500"
            opacity="0.8"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
