import "./App.css";
import {
  Box,
  Container,
  Heading,
  Input,
  Text,
  Tooltip,
  Button,
  Link,
  useToast,
} from "@chakra-ui/react";

import { ExternalLinkIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import { useState } from "react";
import axios from "axios";

function App() {
  const today = new Date();
  const date =
    today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();

  const toast = useToast();

  const [input, setInput] = useState(null);
  const [output, setOutput] = useState(null);

  const handleInputChange = (e) => (setInput(e.target.value).setOutput(null));
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = input;
    const params = { title };

    axios
      .post("/api/prediction", params)
      .then((res) => {
        setOutput(null);
        const data = res.data.data;
        const parameters = JSON.stringify(params);
        setOutput(`${data.prediction}`);
        setInput(null);

        {output === 'REAL' ? toast({
          title: "Real.",
          description: `This headline is correct.`,
          status: "success",
          duration: 9000,
          isClosable: true,
          containerStyle: {
            fontSize: '1.2em',
          },
        }) : toast({
          title: "Fake.",
          description: `This headline is misinformed.`,
          status: "error",
          duration: 9000,
          isClosable: true,
          containerStyle: {
            fontSize: '1.2em',
          },
        })}
      })
      .catch(
        (error) =>
          toast({
            title: "Error.",
            description: `${error.message}`,
            status: "error",
            duration: 9000,
            isClosable: true,
          }),
        setInput(null)
      );
  };

  return (
    <Container
      w={"100%"}
      h={"100vh"}
      m={"0"}
      bg="#f9f5ed"
      maxW={"none"}
      p={"0"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
    >
      <Box
        width={"75%"}
        minH={"50vh"}
        m={"0"}
        pl={"100px"}
        pr={"100px"}
        pt={"50px"}
      >
        <Heading
          fontFamily={"Merriweather"}
          borderColor={"gray.400"}
          fontSize="7em"
          textAlign={"left"}
          borderBottomWidth={"1px"}
          pb={"10px"}
          pt={"10px"}
        >
          The Daily Scoob
        </Heading>

        <form onSubmit={(e) => handleSubmit(e)}>
          <Tooltip
            label="Type a news heading here..."
            placement="bottom-start"
            fontSize={"1.2em"}
            fontFamily={"Lora"}
            aria-label="A tooltip"
          >
            <Input
              placeholder="Breaking News..."
              size={"lg"}
              h={"1.5em"}
              borderColor={"gray.400"}
              width={"100%"}
              variant="flushed"
              fontSize={"4.5em"}
              fontFamily={"Lora"}
              color="black"
              focusBorderColor="orange.800"
              onChange={handleInputChange}
            />
          </Tooltip>

          <Box w={"100%"} pt={"10px"}>
            <Text
              display={"inline"}
              fontFamily={"Lora"}
              fontSize="1.5em"
              mt={"5px"}
            >
              {date} Author:{" "}
              <Link href="https://cjlaserna.github.io" isExternal>
                cjlaserna <ExternalLinkIcon w={"12px"} />
              </Link>{" "}
            </Text>
            <Button
              colorScheme="blackAlpha"
              fontFamily={"Lora"}
              fontSize={"1.5em"}
              variant="ghost"
              float={"right"}
              type="submit"
              rightIcon={<ArrowForwardIcon />}
            >
              Submit
            </Button>
          </Box>
        </form>

        <Text
          display={"inline"}
          fontFamily={"Lora"}
          fontSize="1.5em"
          mt={"5px"}
        >
          {output===null? '' : 'The headline is ' + output}
        </Text>
      </Box>
    </Container>
  );
}

export default App;
