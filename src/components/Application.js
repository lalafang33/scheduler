import React from "react";
import Appointment from "components/Appointment";
import useApplicationData from "hooks/useApplicationData";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


import "components/Application.scss";
import DayList from "./DayList";


export default function Application(props) {

  const { state, setDay, bookInterview, cancelInterview } =
  useApplicationData();


  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const dailyInterviewers = getInterviewersForDay(state, state.day);


  const appointmentArr = dailyAppointments.map(app => {
    const interview = getInterview(state, app.interview)
    return (
      <Appointment
        key={app.id}
        id={app.id}
        time={app.time}
        name={interview?.student}
        interviewer={interview?.interviewer?.name}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

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



