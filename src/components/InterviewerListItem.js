import React from "react";
import "components/InterviewerListItem.scss"
import classNames from "classnames";

export default function InterviewerListItem(props) {
  let interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });
  const interviewerImgClass = classNames("interviewers__item-image", {
    "interviewers__item--selected-image": props.selected
  })
  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className={interviewerImgClass}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}    
    </li>
  );
};

