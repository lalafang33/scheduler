import { useEffect, useState } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {
      "1": {
        id: 1,
        time: "12pm",
        interview: null
      }
    },
    interviewers: {}
  });


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

  const setAppointments = (appointments) => setState(prev => ({ ...prev, appointments }));
  const setInterviewers = (interviewers) => setState(prev => ({ ...prev, interviewers }));
  const setDays = (days) => setState(prev => ({ ...prev, days }))
  const setDay = (day) => setState(prev => ({ ...prev, day }));
 
  const spotsRemain = function (id, interview) {
    const num = () => {
      if (!interview) {
        return 1;
      } else if (!state.appointments[id].interview) {
        return -1;
      } else {
        return 0;
      }
    };
    const days = state.days.map((day) => {
      if (day.name === state.day) {
        return {
          ...day,
          spots: day.spots + num(),
        };
      }
      return day;
    });

    return days;
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    let newDays = [...state.days];
    const days = spotsRemain(id, interview);
    console.log("THIS IS INTERVIEW", interview)
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(response => {
        console.log("appointment saved in database")
        setState({ ...state, days, appointments })
        return true;
      })
  }


  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    let dayId = 0;
    let newDays = [...state.days]

    for (const day in newDays) {
      if (newDays[day].name === state.day) {
        dayId = day;
      }
    }
    const days = spotsRemain(id);
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(response => {
        setState((prev) => ({ ...prev, appointments, days }));
        return true;
        // newDays[dayId] = { ...newDays[dayId], spots: newDays[dayId].spots + 1 }

        // setState({
        //   ...state,
        //   appointments,
        //   days: newDays
        // });

        // return response;
      })
      
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
}
}