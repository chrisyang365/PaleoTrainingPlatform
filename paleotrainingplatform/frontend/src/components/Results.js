import React, { useEffect, useState } from "react";
import {
  Card,
  Loader,
  Image,
  Segment,
  Grid,
  GridColumn,
  Button,
  Form,
} from "semantic-ui-react";
import Axios from "axios";
import Chart from "react-google-charts";
import { Link } from "react-router-dom";
import References from "./References";

const Results = (props) => {
  const [scores, setScores] = useState(null);
  const [images, setImages] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allScores, setAllScores] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [healingScores, setHealingScores] = useState(null);
  const [allHealingScores, setAllHealingScores] = useState(null);
  const [healingChartData, setHealingChartData] = useState(null);
  const BASE_URL = process.env.API_KEY;

  useEffect(() => {
    if (!isLoaded) {
      if (props.location.state) {
        console.log(props.location.state.lesionImages);
        setScores(props.location.state.scores);
        setImages(props.location.state.lesionImages);
        setHealingScores(props.location.state.healingResult);
      } else {
        const scoresData = localStorage.getItem("scores");
        if (scoresData) {
          console.log("got scores from localstorage");
          setScores(JSON.parse(scoresData));
        }
        const imagesData = localStorage.getItem("images");
        if (imagesData) {
          console.log("got images from localstorage");
          setImages(JSON.parse(imagesData));
        }
        const healingData = localStorage.getItem("healingScores");
        if (healingData) {
          console.log("got healingScores from localstorage");
          setHealingScores(JSON.parse(healingData));
        }
      }
      Axios.get(`${BASE_URL}/api/training/lesionScore/`)
        .then((result) => {
          if (result.data) {
            setAllScores(result.data);
            var data = {};
            for (var i = 0; i < result.data.length; i++) {
              if (result.data[i].image_url in data) {
                if (result.data[i].score in data[result.data[i].image_url]) {
                  data[result.data[i].image_url][result.data[i].score] += 1;
                } else {
                  data[result.data[i].image_url][result.data[i].score] = 1;
                }
              } else {
                data[result.data[i].image_url] = { [result.data[i].score]: 1 };
              }
            }
            var scoresDict = {};
            for (const [imageURL, typeDict] of Object.entries(data)) {
              for (const [type, count] of Object.entries(typeDict)) {
                if (!(imageURL in scoresDict)) {
                  scoresDict[imageURL] = [
                    ["Lesion Type", "Frequency", { role: "style" }],
                    [type, count, "gold"],
                  ];
                } else {
                  scoresDict[imageURL].push([type, count, "gold"]);
                }
              }
            }
            setChartData(scoresDict);
          }
          Axios.get(`${BASE_URL}/api/training/healingScore/`)
            .then((result) => {
              if (result.data) {
                setAllHealingScores(result.data);
                var data = {}; // {image.url : {healingDegree: count}}
                for (var i = 0; i < result.data.length; i++) {
                  if (result.data[i].image_url in data) {
                    if (
                      result.data[i].score in data[result.data[i].image_url]
                    ) {
                      data[result.data[i].image_url][result.data[i].score] += 1;
                    } else {
                      data[result.data[i].image_url][result.data[i].score] = 1;
                    }
                  } else {
                    data[result.data[i].image_url] = {
                      [result.data[i].score]: 1,
                    };
                  }
                }
                console.log(data);
                var healingScoresDict = {};
                for (const [imageURL, degreeDict] of Object.entries(data)) {
                  for (const [degree, count] of Object.entries(degreeDict)) {
                    if (!(imageURL in healingScoresDict)) {
                      healingScoresDict[imageURL] = [
                        ["Degree of Healing", "Frequency", { role: "style" }],
                        [degree, count, "gold"],
                      ];
                    } else {
                      healingScoresDict[imageURL].push([degree, count, "gold"]);
                    }
                  }
                }
                setHealingChartData(healingScoresDict);
                setIsLoaded(true);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [isLoaded]);

  useEffect(() => {
    localStorage.setItem("scores", JSON.stringify(scores));
    localStorage.setItem("images", JSON.stringify(images));
    localStorage.setItem("healingScores", JSON.stringify(healingScores));
  });

  return (
    <div>
      {isLoaded ? (
    //     <Segment style={{
    //   height: "100vh",
    // }}>
    //   <Grid columns={2} relaxed="very" divided style={{ height: "100%" }}>
    //     <GridColumn width={11} style={{ height: "100%", overflowY: "scroll" }}>
    //       <ImageScoring />
    //     </GridColumn>
    //     <GridColumn width={5} style={{ height: "100%", overflowY: "scroll" }}>
    //       <Header size="large">Lesion Reference Images</Header>
    //       <References />
    //     </GridColumn>
    //   </Grid>
    // </Segment>
        <Segment
          style={{
            height: "100vh",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <Grid columns={2} relaxed="very" divided style={{ height: "100%" }}>
            <GridColumn
              width={11}
              style={{ height: "100%", overflowY: "scroll" }}
            >
              <Card.Group itemsPerRow={5}>
                {images.map((image) => {
                  return (
                    <Card>
                      <Image src={image.image_url} />
                      <Card.Content>
                        {scores[image.image_url] ==
                        image.lesion_types
                          .map(function (lesion_type) {
                            return lesion_type.name;
                          })
                          .sort()
                          .join(", ") ? (
                          <Card.Description
                            style={{
                              color: "green",
                            }}
                          >
                            Your lesion score: {scores[image.image_url]}
                          </Card.Description>
                        ) : (
                          <Card.Description
                            style={{
                              color: "red",
                            }}
                          >
                            Your lesion score: {scores[image.image_url]}
                          </Card.Description>
                        )}
                        <Card.Description>
                          Original observer's lesion score:{" "}
                          {image.lesion_types
                            .map(function (lesion_type) {
                              return lesion_type.name;
                            })
                            .sort()
                            .join(", ")}
                        </Card.Description>

                        {("Absence of pathological lesions" !=
                          image.lesion_types.map(function (lesion_type) {
                            return lesion_type.name;
                          }) &&
                          healingScores[image.image_url] ==
                            image.healing_type.degree) ||
                        ("Absence of pathological lesions" ==
                          image.lesion_types.map(function (lesion_type) {
                            return lesion_type.name;
                          }) &&
                          healingScores[image.image_url] == "N/A") ? (
                          <Card.Description
                            style={{
                              color: "green",
                            }}
                          >
                            Your healing score: {healingScores[image.image_url]}
                          </Card.Description>
                        ) : (
                          <Card.Description
                            style={{
                              color: "red",
                            }}
                          >
                            Your healing score: {healingScores[image.image_url]}
                          </Card.Description>
                        )}
                        {"Absence of pathological lesions" !=
                        image.lesion_types.map(function (lesion_type) {
                          return lesion_type.name;
                        }) ? (
                          <Card.Description>
                            Original observer's healing score:{" "}
                            {image.healing_type.degree}
                          </Card.Description>
                        ) : (
                          <Card.Description>
                            Original observer's healing score: N/A
                          </Card.Description>
                        )}
                      </Card.Content>
                      <Chart
                        chartType="ColumnChart"
                        width="100%"
                        column="100%"
                        data={chartData[image.image_url]}
                      />
                      <Chart
                        chartType="ColumnChart"
                        width="100%"
                        column="100%"
                        data={healingChartData[image.image_url]}
                      />
                    </Card>
                  );
                })}
              </Card.Group>
            </GridColumn>
            <GridColumn width={5} style={{ height: "100%", overflowY: "scroll" }}>
          <Header size="large">Lesion Reference Images</Header>
          <References />
        </GridColumn>
          </Grid>
          <Link
            to={{
              pathname: "/",
            }}
          >
            <Form.Button
              style={{
                marginLeft: "46%",
              }}
            >
              Quiz me again
            </Form.Button>
          </Link>
        </Segment>
      ) : (
        <Loader active />
      )}
    </div>
  );
};

export default Results;
