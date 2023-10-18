import React, { useState } from 'react';
import "./InitalForm.css";


export default function InitialForm() {
  const [name, setName] = useState('');
  const [subjectLine, setSubjectLine] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubjectLineChange = (e) => {
    setSubjectLine(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform actions with the input values here
    console.log('Name:', name);
    console.log('Subject Line:', subjectLine);
  };

  return (
    <div>
      <h2>Form</h2>
      <form className="initalFormContainer" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className='ifFormIdentifier'>Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            id="ifInput" // Add your custom CSS class
          />
        </div>
        <div>
          <label htmlFor="subjectLine" className='ifFormIdentifier'>Subject Line:</label>
          <input
            type="text"
            value={subjectLine}
            onChange={handleSubjectLineChange}
            onInvalidCapture="ifInput"// Add your custom CSS class
          />
        </div>
        <button id='ifButton'>Submit</button>
      </form>
    </div>
  );
}
