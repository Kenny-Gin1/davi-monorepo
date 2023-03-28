import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { PollComponent } from "./MultiChoicePoll";

describe("PollComponent", () => {
  it("renders the form with input fields and a submit button", () => {
    render(<PollComponent />);
    expect(screen.getByLabelText("Question:")).toBeInTheDocument();
    expect(screen.getByLabelText("Question:")).toBeRequired();
    expect(screen.getByLabelText("Choices:")).toBeInTheDocument();
    expect(screen.getByText("Add Choice")).toBeInTheDocument();
    expect(screen.getByLabelText("Poll Length:")).toBeInTheDocument();
    expect(screen.getByLabelText("Poll Length: Days")).toBeInTheDocument();
    expect(screen.getByLabelText("Poll Length: Hours")).toBeInTheDocument();
    expect(screen.getByLabelText("Poll Length: Minutes")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("adds and removes choices as expected", () => {
    const { getByText, queryAllByLabelText } = render(<PollComponent />);
    const addChoiceButton = getByText("Add Choice");
    fireEvent.click(addChoiceButton);
    expect(queryAllByLabelText("Choice:")).toHaveLength(2);
    const removeChoiceButton = getByText("Remove");
    fireEvent.click(removeChoiceButton);
    expect(queryAllByLabelText("Choice:")).toHaveLength(1);
  });

  it("submits the form with valid data", () => {
    const { getByLabelText, getByText } = render(<PollComponent />);
    const questionInput = getByLabelText("Question:");
    const choiceInput = getByLabelText("Choice:");
    const addChoiceButton = getByText("Add Choice");
    const daysInput = getByLabelText("Poll Length: Days");
    const hoursInput = getByLabelText("Poll Length: Hours");
    const minutesInput = getByLabelText("Poll Length: Minutes");
    const submitButton = getByText("Submit");

    fireEvent.change(questionInput, { target: { value: "What is your favorite color?" } });
    fireEvent.change(choiceInput, { target: { value: "Red" } });
    fireEvent.click(addChoiceButton);
    fireEvent.change(screen.getByLabelText("Choice: 2"), { target: { value: "Blue" } });
    fireEvent.change(daysInput, { target: { value: "1" } });
    fireEvent.change(hoursInput, { target: { value: "2" } });
    fireEvent.change(minutesInput, { target: { value: "30" } });

    fireEvent.submit(submitButton);

    expect(screen.getByText("Thank you for voting!")).toBeInTheDocument();
  });

  it("displays an error message for missing required fields", () => {
    const { getByText } = render(<PollComponent />);
    const submitButton = getByText("Submit");

    fireEvent.submit(submitButton);

    expect(screen.getByText("Question is required.")).toBeInTheDocument();
    expect(screen.getByText("Please enter at least one choice.")).toBeInTheDocument();
  });
});