import React from "react";
import { useState, useEffect } from "react";
import Appointment from "components/Appointment";
import axios from "axios";

import { getAppointmentsForDay } from "helpers/selectors";


import "components/Application.scss";
import DayList from "./DayList";

const appointments = {
  "1": {
    id: 1,
    time: "12pm",
  },
  "2": {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer:{
        id: 3,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  "3": {
    id: 3,
    time: "2pm",
  },
  "4": {
    id: 4,
    time: "3pm",
    interview: {
      student: "Archie Andrews",
      interviewer:{
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  },
  "5": {
    id: 5,
    time: "4pm",
  }
};

export default function Application(props) {

  // const [day, setDay] = useState([])

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {}
  });
  

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const appointmentArr = dailyAppointments.map(app =>{
    return <Appointment key={app.id} {...app} />
  })

  // useEffect(()=>{
  //   axios.get("/api/days")
  //   .then(response => {
  //     console.log(response.data)
  //     setState(state=>({...state, days:response.data}))
  //   })
  // }, [])
  
  
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setAppointments(all[1].data);
      setInterviewers(all[2].data);
      setDays(all[0].data);
    })
  }, [])
  
  const setInterviewers = (interviewers) => setState(prev => ({...prev, interviewers}));
  const setAppointments = (appointments) => setState(prev => ({...prev, appointments}));
  const setDays = (days) => setState(prev=> ({...prev, days}))
  const setDay = (day) => setState(prev => ({...prev, day}));


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu" >
        <DayList 
        days={state.days} 
        value={state.day} 
        onChange={setDay} 
        />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentArr}
      </section>
    </main>
  );
}



