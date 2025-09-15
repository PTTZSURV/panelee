import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import HomeCard from '../../components/HomeCard'
import Typography from '@mui/joy/Typography';
import HomeSurveyItem from '../../components/HomeSurveyItem';
import { Card } from '@mui/joy';
import Tabs from '../../components/ResponsiveAppBar'

import { useAtom } from 'jotai';
import { completedSurveys } from "../../state";
import { userLoggedIn } from "../../state";
import AlertCard from '../../components/AlertCard';

export default function Home() {
  const navigate = useNavigate()
  const [doneSurveys,] = useAtom(completedSurveys)
  const [loggedIn] = useAtom(userLoggedIn)
  const [surveysData, setSurveysData] = useState([]);
  const [surveysFiltered, setSurveysFiltered] = useState([]);


  if (!loggedIn) {
    navigate("/register")
  }

  useEffect(() => {
    fetch('https://pttzsurv.github.io/eranke/surveys.json')
      .then(response => response.json())
      .then(data => {
        setSurveysData(data.surveys)
      });
  }, []);

  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;

    } else {
      if (doneSurveys.length >= 1) {
        let tempList = surveysData
        for (let x = 0; x < doneSurveys.length; x++) {
          var Id1 = doneSurveys[x].surveyId

          tempList = tempList.filter(item => {
            return item.surveyId != Id1
          })
        }
        setSurveysFiltered(tempList)
      }
    }
  });








  return (
    <div>
      <Tabs />
      <HomeCard />
      <Card sx={{ mt: 5 }} variant="soft">
        <Typography align="left" level="title-lg">
          Surveys For You Today <AlertCard sx={{ml:1}}message={"Surveys are automaticaly filtered based on your location"} /> </Typography>
        {
          surveysFiltered.length > 1 ?
            <div>
              {
                surveysFiltered.map((survey, index) => (
                  <div key={index}>
                    <HomeSurveyItem survey={survey} Id={survey.surveyId} />
                  </div>
                ))
              }
            </div>
            :
            <div>
              {
                surveysData.map((survey, index) => (
                  <div key={index}>
                    <HomeSurveyItem survey={survey} Id={survey.surveyId} />
                  </div>
                ))
              }
            </div>
        }
      </Card>
    </div>
  )
}
