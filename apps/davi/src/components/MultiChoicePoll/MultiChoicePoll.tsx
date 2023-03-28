import React, { useState } from 'react';
import { Model } from "survey-core"
// import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
// import { Radiogroup, RadioGroupItem } from 'survey-react-ui';

interface Choice {
  value: string;
}

interface PollLength {
  days: number;
  hours: number;
  minutes: number;
}
export const PollComponent: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState<Choice[]>([{ value: '' }]);
  const [pollLength, setPollLength] = useState<PollLength>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const addChoice = () => {
    setChoices([...choices, { value: '' }]);
  };

  const removeChoice = (index: number) => {
    const updatedChoices = [...choices];
    updatedChoices.splice(index, 1);
    setChoices(updatedChoices);
  };

  const handleChoiceChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedChoices = [...choices];
    updatedChoices[index].value = event.target.value;
    setChoices(updatedChoices);
  };

  const handlePollLengthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setPollLength({ ...pollLength, [name]: Number(value) });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const survey = new Model({
      questions: [
        {
          type: 'radiogroup',
          name: 'poll',
          title: question,
          choices: choices.map(choice => ({ value: choice.value })),
          isRequired: true,
        },
      ],
      completedHtml: '<p>Thank you for voting!</p>',
    });
    const pollLengthInMs =
      pollLength.days * 86400000 +
      pollLength.hours * 3600000 +
      pollLength.minutes * 60000;
    survey.sendResultOnPageNext = true;
    survey.showProgressBar = 'bottom';
    survey.maxTimeToFinishPage = pollLengthInMs;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            required
          />
        </label>
        <br />
        <br />
        <label>Choices:</label>
        {choices.map((choice, index) => (
          <div key={index}>
            <input
              type="text"
              value={choice.value}
              onChange={e => handleChoiceChange(index, e)}
              required
            />
            {index !== 0 && (
              <button type="button" onClick={() => removeChoice(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <br />
        <button type="button" onClick={addChoice}>
          Add Choice
        </button>
        <br />
        <br />
        <label>
          Poll Length:
          <input
            type="number"
            name="days"
            min="0"
            value={pollLength.days}
            onChange={handlePollLengthChange}
          />
          days
          <input
            type="number"
            name="hours"
            min="0"
            max="23"
            value={pollLength.hours}
            onChange={handlePollLengthChange}
          />
          hours
          <input
            type="number"
            name="minutes"
            min="0"
            max="59"
            value={pollLength.minutes}
            onChange={handlePollLengthChange}
          />
        </label>
      </form>
    </div>
  );
};

