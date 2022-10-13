import React from "react";

import "components/Appointment/styles.scss"
import Header from "./Header";
import Show from "./Show";
import Form from "./Form";
import Empty from "./Empty";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";
import { getInterviewersForDay } from "helpers/selectors";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const SAVING = "SAVING";
  const CREATE = "CREATE";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);
  
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => {
        transition(ERROR_SAVE, true)
      })
  }
  
  function cancel() {

    transition(DELETING, true);

    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(error => {
        transition(ERROR_DELETE, true);
      })

  }


  return (
    <article data-testid="appointment" className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && 
        <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview?.student}
          interviewer={props.interview?.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />)}
      {mode === CREATE && (
        <Form
          id={props.id}
          interviewers={props.interviewers}
          onCancel={back}
          bookInterview={props.bookInterview}
          onSave={save}

        />
      )}
      {mode === SAVING && (
        <Status message="Saving" />)}
      {mode === DELETING && 
        <Status message="Deleting" />}
      {mode === CONFIRM &&
        <Confirm
          message="Are you sure you would like to delete"
          onCancel={back}
          onConfirm={cancel}
        />}
      {mode === EDIT &&
        <Form
          name={props.interview?.student}
          interviewers={props.interviewers}
          interviewer={props.interview?.interviewer.id}
          onCancel={back}
          onSave={save}
        />}
      {mode === ERROR_SAVE && 
      <Error message="Could not save appointment" onClose={back} />}
      {mode === ERROR_DELETE && 
      <Error message="Could not cancel appointment" onClose={back} />}
    </article>
  );
};