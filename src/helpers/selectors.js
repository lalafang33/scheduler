

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