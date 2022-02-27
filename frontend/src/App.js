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
  Badge,
  Grid,
  GridItem,
  Image,
  Skeleton,
  IconButton,
} from "@chakra-ui/react";

import { ExternalLinkIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import { useState, useEffect } from "react";
import axios from "axios";
import { GiSniffingDog } from "react-icons/gi";
import emoji from "emoji-dictionary";

function App() {
  const today = new Date();
  const date =
    today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();

  const apiKey = process.env.REACT_APP_NYT_KEY;

  const toast = useToast();
  const [input, setInput] = useState(null);
  const [output, setOutput] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(0);

  useEffect(() => {
    setIsLoading(0);
  }, []);

  const fetchImage = (article) => {
    const media = article.multimedia;
    const objArray = [];

    // console.log(media)
    Object.keys(media).forEach((key) =>
      objArray.push({
        url: media[key],
      })
    );

    const img = objArray[4];

    var src = "https://www.color-name.com/color-image?c=F2F3F5&desktop";
    img
      ? (src = img.url.url)
      : (src = "https://www.color-name.com/color-image?c=F2F3F5&desktop");

    console.log("https://www.nytimes.com/" + src.toString());
    return "https://www.nytimes.com/" + src.toString();
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setIsLoading(1);
    setInput(e.target.value);
    setOutput(null);

    fetch(`
    https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${e.target.value}&api-key=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          console.log(data.response.docs);
          setResults(data.response.docs.slice(0, 30));
        } else {
          setResults([]);
          toast({
            title: "Error.",
            description: `There was a problem with retrieving your articles.`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      });

    setIsLoading(0);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = input;
    const params = { title };

    axios
      .post("http://localhost:8080/prediction", params)
      .then((res) => {
        setOutput(null);
        const data = res.data.data;
        const parameters = JSON.stringify(params);
        setOutput(`${data.prediction}`);
        setInput(null);

        output === "REAL"
          ? toast({
              title: "Real.",
              description: `This headline is correct.`,
              status: "success",
              duration: 9000,
              isClosable: true,
              containerStyle: {
                fontSize: "1.2em",
              },
            })
          : toast({
              title: "Fake.",
              description: `This headline is misinformed.`,
              status: "error",
              duration: 9000,
              isClosable: true,
              containerStyle: {
                fontSize: "1.2em",
              },
            });
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

  function convertEmoji(em) {
    return emoji.getUnicode(em);
  }

  return (
    <Container
      w={"100%"}
      minH={"100vh"}
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
          <span display={'inline-block'} float='left'>
          The Daily Scoob 
          </span>
          <GiSniffingDog fontSize={"1.2em"} display="inline-block" float='right' className="icons"/>
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
              {date} Fact Check Machine | Author:{" "}
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
              Check Headline
            </Button>
          </Box>
        </form>

        <Text
          display={"inline"}
          fontFamily={"Lora"}
          fontSize="1.5em"
          mt={"5px"}
        >
          {output === null ? "" : "The headline is " + output}
        </Text>
      </Box>

      {input ? (
        <Grid templateColumns="repeat(5, 1fr)" display={"block"} width={"75vw"}>
          <Skeleton isLoaded={!isLoading}>
            {results.map((result) => (
              <Tooltip
                label={
                  <span>
                    <ExternalLinkIcon />
                  </span>
                }
                fontSize="lg"
                gutter={"-50"}
                placement="top"
              >
                <GridItem
                  maxW="md"
                  display={"inline-block"}
                  float={"left"}
                  m={"5px"}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  _hover={{
                    boxShadow: "base",
                    cursor: "pointer",
                    filter: "brightness(95%)",
                  }}
                >
                  <a href={result.web_url} target={"_blank"} rel="noreferrer">
                    <Image
                      src={fetchImage(result)}
                      alt={result.headline.main.toString()}
                      w={"500px"}
                      h={"300px"}
                      fallbackSrc="https://www.color-name.com/color-image?c=F2F3F5&desktop"
                      objectFit="cover"
                    />
                    <Box p="6" whiteSpace={"nowrap"} textOverflow={"ellipsis"}>
                      <Box display="flex" alignItems="baseline">
                        <Badge borderRadius="full" px="2" colorScheme="teal">
                          NYT
                        </Badge>
                        <Box
                          color="gray.500"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          textTransform="uppercase"
                          ml="2"
                          isTruncated
                        >
                          {result.web_url}
                        </Box>
                      </Box>

                      <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                      >
                        {result.headline.main}
                      </Box>
                    </Box>
                  </a>
                </GridItem>
              </Tooltip>
            ))}
          </Skeleton>
        </Grid>
      ) : (
        ""
      )}

      <Tooltip label={<span> I stand with Ukraine {convertEmoji('heart')} </span>} placement="left" fontSize={'1em'}>
      <Button colorScheme={'whiteAlpha'} position='absolute' bottom={'5'} right={'5'}>
      <a href="https://ukraine.ua/news/stand-with-ukraine/" target="_blank">
        <Image
          src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/285/flag-ukraine_1f1fa-1f1e6.png"
          w={"50px"}
        /></a>
      </Button>
      
      </Tooltip>
    </Container>
  );
}

export default App;
