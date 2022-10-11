

export const getAppointmentsForDay = (state, day) => {
  let result = []; 
  let appointmentArray;

  for(let appObj of state.days){
    if(appObj.name === day){
      appointmentArray = appObj.appointments
    }
  }
  if(Array.isArray(appointmentArray)){
    for(let app of appointmentArray){
      result.push(state.appointments[app])
    }
  }
  return result; 
}

export const getInterview = (state, interview) => {
  if (!interview) return null;
  const id = interview.interviewer;
  const interviewer = state.interviewers[id]
  return {
    student: interview.student,
    interviewer
  }
};

export const getInterviewersForDay = (state, dayA) => {
  const day = state.days.find(d => d.name === dayA)
  if (!day) return [];
  
  const result = [];

  console.log(day.interviewers);
  for (const id of day.interviewers) {
    result.push(state.interviewers[id]);
  }

  return result;

};
 

