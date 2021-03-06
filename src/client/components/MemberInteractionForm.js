import React, { useState } from "react";
import AddSubTask from "./AddSubTask";

const MemberInteractionForm = (props) => {
  let dateRegEx = props.selectedEvent.actualDateOfEvent.replace(
    /(T)00:00:00.000Z/, ""
  )
  .replace(/(\d{4})-(\d{2})-(\d{2})/, function (match, p1,p2,p3) {
    return [p1,p2,p3].join(",")
  });
  let dateOfEventProperFormat = (eventDate) => {
    let date = new Date(eventDate);
    if(date.getDate()<10) {
      let formatDate = `${date.getFullYear()}-0${date.getMonth() + 1}-0${
        date.getDate()
      }`;
      return formatDate
    }
    let formatDate = `${date.getFullYear()}-0${date.getMonth() + 1}-${
      date.getDate()
    }`;
      return formatDate;
    }
  
  const { selectedEvent } = props;
  const [formValues, setFormValues] = useState({});
  const [resJson, setResJson] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log(id, ": ", value);
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      meetingName,
      meetingType,
      meetingDate,
      reminder,
      extension,
      description,
    } = formValues;
    if (!meetingName) {
      setResJson({ errors: "Please include a meeting name at the top." });
    }
    if (!meetingType) {
      setResJson({ errors: "Please include a Meeting Type" });
    }
    if (!description) {
      setResJson({ errors: "Please include a description" });
    }

    const response = await fetch("/add/member-interaction", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meetingName,
        meetingDate,
        reminder,
        description,
      }),
    });

    const json = await response.json();

    setResJson(json);

    console.log(json, resJson, "I submitted");
  };
  return (
    <div className='main-gradient px-3 pt-5 relative '>
      <h3 className='font-bold'>Event Type: {selectedEvent.meetingType}</h3>
      <form
        action='/add/meeting'
        onSubmit={handleSubmit}
        className='text-center'
        method='post'
      >
        <input
          type='submit'
          className='text-1xl p-2 absolute right-2 top-1  bg-blue-400 border-2 rounded-lg'
          value='Save'
        />
        {resJson.message && (
          <h3 className='text-red-900 font-bold text-2xl relative bottom-2 text-center w-3/4 '>
            {resJson.message}
          </h3>
        )}

        <div className='mt-3 flex space-x-3'>
          <div className='mb-3'>
            <label
              className='text-left block font-bold'
              htmlFor='meetingName'
            ></label>
            <input
              className='block'
              type='text'
              name='meetingName'
              id='meetingName'
              value={props.selectedEvent.meetingName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='mt-3 flex space-x-3'>
          <div className='mb-3'>
            <label className='text-left block font-bold' htmlFor='meetingDate'>
              Date of Interaction:
            </label>
            <input
              className='block'
              type='date'
              name='meetingDate'
              id='meetingDate'
              onChange={handleInputChange}
              value={dateOfEventProperFormat(
                dateRegEx
              )}
            />
          </div>
        </div>
        <div className='flex'>
          <div className='mb-5'>
            <label htmlFor='reminder' className='block text-left font-bold'>
              Reminder:
            </label>
            <input
              type='date'
              name='reminder'
              className='w-full bg-white block'
              id='reminder'
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='mt-3 '>
          <label
            className='block w-full text-left font-bold'
            htmlFor='description'
          >
            Description:
          </label>
          <textarea
            name='description'
            className='w-full'
            cols='30'
            rows='10'
            id='description'
            value={props.selectedEvent.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </form>
      <AddSubTask />
    </div>
  );
};

export default MemberInteractionForm;
