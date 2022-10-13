import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";


import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);


describe("application", () => {

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check that the enter student name is shown.
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click the "Save" button to confirm the edit.
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 6. Expect Lydia to be in the appointment
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 7. Expect the edit button to appear again
    const Monday = getAllByTestId(container, "day").find((edit) =>
      queryByText(edit, "Monday")
    );

    // 8. Expect to see 1 spot remaining 
    expect(getByText(Monday, /1 spot remaining/i)).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    // 1. Render the Application. 
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    // Adding an appointment
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(container, "Saving")).toBeInTheDocument();

    await waitForElement(() => {
      return getByText(appointment, "Error")
    });
    expect(getByText(appointment, "Could not save appointment")).toBeInTheDocument();
  })
    
    it("shows the delete error when failing to delete an existing appointment", async () => {
      axios.delete.mockRejectedValueOnce();
      const { container } = render(<Application />);
      await waitForElement(() => getByText(container, "Archie Cohen"));
      const appointment = getAllByTestId(container, "appointment")[1];
  
      fireEvent.click(queryByAltText(appointment, "Delete"));
      expect(
        getByText(container, /Are you sure you would like to delete/i)
      ).toBeInTheDocument();
  
      fireEvent.click(queryByText(appointment, "Confirm"));
      expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  
      await waitForElement(() =>
        getByText(appointment, /could not cancel appointment/i)
      );
      expect(getByText(appointment, /could not cancel appointment/i));
  
      fireEvent.click(getByAltText(appointment, "Close"));
      expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
    });

});


