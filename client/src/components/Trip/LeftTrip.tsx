import {
    Center,
    Stack,
    Heading,
    Button,
    Flex,
    Text,
} from "@chakra-ui/react";
import Stop from "./Stop";
import StopDetail from "./StopDetail";
import { useEffect } from "react";
import { Point, Trip } from "../Shared/types";
import { useHomeContext } from "../Home/HomeContext";
import { ActiveRightPage } from "../Shared/enum";

const LeftTrip = () => {

    const { departure, destination, dataPath, activeRightPage, setActiveRightPage, startAt, endAt, dataTrip, setDataTrip } = useHomeContext();

    useEffect(() => {
        async function refreshData() {
            // fill dataTrip with the dataPath
            if (dataPath) {
                let startDate = new Date(dataPath[0]);
                let endDate = new Date(dataPath[0]);
                if (startAt === "") {
                    endDate = new Date(endAt);
                }
                else {
                    startDate = new Date(startAt);
                }
                const points = await translateTrip2Points(dataPath[1]);
                setDataTrip({ departure: startDate, arrival: endDate, points });
            }
        }
        refreshData();
    }, [dataPath, startAt, endAt, setDataTrip]);


    const translateTrip2Points = async (pointList: Trip[]): Promise<Point[]> => {
        const lst: Point[] = [];
        let lastline = pointList[0].route_short_name;
        let first = pointList[0];
        let cpt = 0;
        let travel_time = 0;
        let depart = 0;
        let marche = 0;
        const hash: { [key: string]: string } = {};

        for (let i = 0; i < pointList.length; i++) {
            travel_time += pointList[i].travel_time;
            travel_time += pointList[i].wait_time;
            if (pointList[i].route_short_name) {
                if (pointList[i].route_short_name === lastline) {
                    cpt += 1;
                } else {
                    lst.push({
                        line: lastline,
                        from: first.from_stop_id,
                        direction: first.trip_id,
                        to: pointList[i - 1].to_stop_id,
                        nbr: cpt - 1,
                        travel_time: travel_time - pointList[i - 1].travel_time,
                        depart: depart,
                        marche: marche,
                    });
                    lastline = pointList[i].route_short_name;
                    first = pointList[i];
                    cpt = 1;
                    depart = travel_time + depart;
                    travel_time = 0;
                    marche = Math.round(pointList[i - 1].travel_time / 60);
                }
            }
        }

        lst.push({
            line: lastline,
            from: first.from_stop_id,
            direction: pointList[pointList.length - 1].trip_id,
            to: pointList[pointList.length - 1].to_stop_id,
            nbr: cpt - 1,
            travel_time: travel_time,
            depart: depart,
            marche: marche,
        } as Point);

        const fetchStopName = async (stopId: string) => {
            if (hash[stopId]) {
                return hash[stopId];
            }
            try {
                const response = await fetch(`http://localhost:8000/stop/${stopId}`);
                const data = await response.json();
                hash[stopId] = data[0].stop_name;
                return hash[stopId];
            } catch (error) {
                console.error(error);
                return stopId; // Fallback to stopId in case of error
            }
        };

        const fetchDirection = async (tripIp: string) => {
            if (hash[tripIp]) {
                return hash[tripIp];
            }
            try {
                const response = await fetch(`http://localhost:8000/trip/${tripIp}`);
                const data = await response.json();
                hash[tripIp] = data[0].headsign;
                return hash[tripIp];
            } catch (error) {
                console.error(error);
                return tripIp; // Fallback to stopId in case of error
            }
        };

        for (let i = 0; i < lst.length; i++) {
            lst[i].from = await fetchStopName(lst[i].from);
            lst[i].to = await fetchStopName(lst[i].to);
            lst[i].direction = await fetchDirection(lst[i].direction);
        }

        return lst;
    };

    function addTime(date: Date, time: number): Date {
        return new Date(date.getTime() + time * 1000);
    }

    function toggleMoreDetails() {
        // toggle moreDetails
        if (activeRightPage === ActiveRightPage.Trip) {
            setActiveRightPage(ActiveRightPage.TripDetails);
        }
        else {
            setActiveRightPage(ActiveRightPage.Trip);
        }
    }

    if (dataTrip === null) {
        return (
            null
        );
    }

    return (
        <Center>
            <Stack spacing={0} w="100%">
                <Stack align="center" margin={0} padding={0}>
                    <Heading
                        fontFamily="Karla"
                        fontWeight="700"
                        marginTop={"15%"}
                        fontSize={"4xl"}
                        marginBottom={
                            "5%"
                        }
                    >
                        CITYMAPPER
                    </Heading>
                </Stack>
                <Stack spacing={5}>
                    <Stack marginX={"0%"} maxW={"100%"}>
                        <Stop name={departure?.name || 'error'} textColor={"black"} />
                        <Stop name={destination?.name || 'error'} textColor={"black"} />
                    </Stack>
                    <Heading
                        textDecoration="underline"
                        textAlign="start"
                        fontFamily="Karla"
                        fontWeight="700"
                        fontSize={"3xl"}
                        marginY="0"
                        marginLeft="5%"
                    >
                        Itinéraire :
                    </Heading>
                    <Flex
                        marginY={0}
                        maxW={"100%"}
                        border={"2px solid black"}
                        marginX={"5%"}
                        bg="white"
                        borderRadius={"10px"}
                        direction={"column"}
                        padding={4}
                        paddingY={2}
                        boxShadow="0px 0px 20px rgba(0, 0, 0, 0.3)"
                    >
                        <Heading
                            fontFamily="Karla"
                            fontWeight="550"
                            fontSize="2xl"
                            marginBottom="2%"
                        >
                            Arrivé à {dataTrip.arrival.toLocaleTimeString()}{" "}
                        </Heading>
                        <Stack spacing={0}>
                            <StopDetail
                                stop={dataTrip.points[0].from}
                                line={dataTrip.points[0].line}
                                textColor="black"
                                depart={addTime(
                                    dataTrip.departure,
                                    dataTrip.points[0].depart
                                ).toLocaleTimeString()}
                                arrive={false}
                                direction={dataTrip.points[0].direction}
                            />
                            <StopDetail
                                stop={dataTrip.points[dataTrip.points.length - 1].to}
                                line={dataTrip.points[dataTrip.points.length - 1].line}
                                textColor="black"
                                depart={addTime(
                                    dataTrip.departure,
                                    dataTrip.points[dataTrip.points.length - 1].depart +
                                    dataTrip.points[dataTrip.points.length - 1].travel_time
                                ).toLocaleTimeString()}
                                arrive={true}
                                direction={
                                    dataTrip.points[dataTrip.points.length - 1].direction
                                }
                            />
                        </Stack>
                        <Text
                            onClick={toggleMoreDetails}
                            fontSize={"md"}
                            color={"#273DFF"}
                            textDecoration={"underline"}
                            alignSelf={"end"}
                            _hover={{ cursor: "pointer" }}
                        >
                            {activeRightPage === ActiveRightPage.TripDetails ? "Moins de détails" : "Plus de détails"}
                        </Text>
                    </Flex>
                </Stack>
                <Button
                    bg="#C78484"
                    color="white"
                    onClick={() => setActiveRightPage(ActiveRightPage.Map)}
                    padding={7}
                    fontSize={"2xl"}
                    whiteSpace="wrap"
                    width={"45%"}
                    alignSelf="center"
                    borderRadius="15px"
                    margin={0}
                    marginTop={"5%"}
                    marginBottom={
                        "5%"
                    }
                >
                    Retour
                </Button>
                {/* {errorWhileFetching && (
              <Text
                fontSize={"lg"}
                color={"red"}
                alignSelf={"center"}
                _hover={{ cursor: "pointer" }}
                textAlign={"center"}
                margin={"5%"}
              >
                An error occured while computing the path, please be sure that
                the subway stations are oppended
              </Text>
            )} */}
            </Stack>
        </Center >
    )
}

export default LeftTrip;