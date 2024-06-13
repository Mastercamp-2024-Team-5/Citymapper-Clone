import {
  Center,
  Stack,
  Heading,
  VStack,
  FormControl,
  Input,
  InputGroup,
  Button,
  Flex,
  Text
} from "@chakra-ui/react";
import Icon from "./Icon";
import useScreenWidth from "./useScreenWidth";
import { useState } from "react";

const LeftSearch = (
  {
    departure,
    setDeparture,
    destination,
    setDestination,
    startAt,
    setStartAt,
    endAt,
    setEndAt
  }: {
    departure: string,
    setDeparture: React.Dispatch<React.SetStateAction<string>>,
    destination: string,
    setDestination: React.Dispatch<React.SetStateAction<string>>,
    startAt: string,
    setStartAt: React.Dispatch<React.SetStateAction<string>>,
    endAt: string,
    setEndAt: React.Dispatch<React.SetStateAction<string>>
  }
) => {
  const screenWidth = useScreenWidth();


  return (
    <Center>
      <Stack spacing={8} w="100%">
        <Stack align="center">
          <Heading fontFamily="Karla" fontWeight="600" marginTop={screenWidth<600?"30%":"15%"} fontSize={screenWidth<600?"5xl":"4xl"} marginBottom='5%'>
            CITYMAPPER
          </Heading>
          <Text fontSize={screenWidth<600?"xl":"lg"} marginBottom={screenWidth<600?'15%':'10%'}>
            Trouvez votre itinéraire
          </Text>
        </Stack>
        <VStack spacing={15} w="90%" alignSelf="center">
          <Input
            focusBorderColor="#5eaf91"
            fontFamily="Karla"
            variant="outline"
            border="2px"
            borderColor="gray.200"
            rounded="md"
            type="text"
            placeholder="Départ"
            fontSize={screenWidth<600?"xl":"lg"}
            p={screenWidth<600?10:8}
            bg="white"
            borderRadius="15"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            marginBottom={screenWidth<600?'5%':'0%'}
          />
          <Input
            focusBorderColor="#5eaf91"
            fontFamily="Karla"
            variant="outline"
            border="2px"
            borderColor="gray.200"
            rounded="md"
            type="text"
            placeholder="Destination"
            fontSize={screenWidth<600?"xl":"lg"}
            p={screenWidth<600?10:8}
            bg="white"
            borderRadius="15"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            marginBottom={screenWidth<600?'5%':'0%'}
          />
          <Flex maxW={"100%"} margin={0} padding={0} display={"flex"} flex={1} direction={"row"} align="center" justify="center">
            <Input
              focusBorderColor="#5eaf91"
              fontFamily="Karla"
              variant="outline"
              border="2px"
              borderColor="gray.200"
              rounded="md"
              type="text"
              placeholder="Partir à"
              fontSize={screenWidth<600?"xl":"lg"}
              p={screenWidth<600?10:8}
              bg="white"
              width="48%"
              borderRadius="15"
              marginRight={'5%'}
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
            <Input
              focusBorderColor="#5eaf91"
              fontFamily="Karla"
              variant="outline"
              border="2px"
              borderColor="gray.200"
              rounded="md"
              type="text"
              placeholder="Arriver à"
              fontSize={screenWidth<600?"xl":"lg"}
              p={screenWidth<600?10:8}
              bg="white"
              width="48%"
              borderRadius="15"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </Flex>
          <Button
            fontFamily="Karla"
            bg="#84C7AE"
            color="white"
            _hover={{
              bg: "#5eaf91",
            }}
            rounded="md"
            marginBottom={screenWidth<600?'5%':'0%'} 
            fontSize={screenWidth<600?'3xl':'xl'}
            whiteSpace="wrap"
            width={screenWidth<600?"80%":"80%"}
            alignSelf="center"
            borderRadius="15"
            marginTop={screenWidth<600?'15%':'10%'}
            p={screenWidth<600?12:8} // Added padding
          >
            Trouver l’itinéraire
          </Button>
        </VStack>
      </Stack>
    </Center>
  );
};

export default LeftSearch;
