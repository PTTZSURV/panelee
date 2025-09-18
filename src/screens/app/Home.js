import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeCard from '../../components/HomeCard';
import Typography from '@mui/joy/Typography';
import HomeSurveyItem from '../../components/HomeSurveyItem';
import { Card } from '@mui/joy';
import Tabs from '../../components/ResponsiveAppBar';
import { useAtom } from 'jotai';
import { completedSurveys, userLoggedIn } from '../../state';
import AlertCard from '../../components/AlertCard';

export default function Home() {
  const navigate = useNavigate();
  const [doneSurveys] = useAtom(completedSurveys);
  const [loggedIn] = useAtom(userLoggedIn);
  const [surveysData, setSurveysData] = useState([]);
  const [surveysFiltered, setSurveysFiltered] = useState([]);
  const mounted = useRef(false);

  // Redirect if not logged in
  if (!loggedIn) {
    navigate('/register');
  }

  // Fetch surveys data
  useEffect(() => {
    fetch('https://pttzsurv.github.io/eranke/surveys.json')
      .then((response) => response.json())
      .then((data) => {
        setSurveysData(data.surveys);
      })
      .catch((error) => console.error('Error fetching surveys:', error));
  }, []);

  // Filter surveys based on completed surveys
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else if (doneSurveys.length >= 1) {
      const filteredSurveys = surveysData.filter(
        (item) => !doneSurveys.some((done) => done.surveyId === item.surveyId)
      );
      setSurveysFiltered(filteredSurveys);
    }
  }, [doneSurveys, surveysData]);

  // Trigger Google Analytics conversion event
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-17074435076/3cNnCMiw75sbEITo3M0_',
        value: 1.0,
        currency: 'USD',
      });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <Tabs />
      <HomeCard />
      <Card sx={{ mt: 5 }} variant="soft">
        <Typography align="left" level="title-lg">
          Surveys For You Today{' '}
          <AlertCard
            sx={{ ml: 1 }}
            message="Surveys are automatically filtered based on your location"
          />
        </Typography>
        {surveysFiltered.length > 0 ? (
          surveysFiltered.map((survey, index) => (
            <div key={index}>
              <HomeSurveyItem survey={survey} Id={survey.surveyId} />
            </div>
          ))
        ) : (
          surveysData.map((survey, index) => (
            <div key={index}>
              <HomeSurveyItem survey={survey} Id={survey.surveyId} />
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
