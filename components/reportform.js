'use client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    sex: '',
    address: '',
    contactNumber: '',
    isOwner: 'No',
    driversLicense: null,
    vehicleRegistration: null,
    orCr: null,
    reason: 'Stolen? Involved in an incident/accident?',
    vehicleType: 'Motorcycle',
    platenumber: '',
    color: '',
    description: '',
  });

  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(30);
  const [alertColor, setAlertColor] = useState('bg-green-100'); // Default color for success
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [reportID, setReportID] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files?.[0] || value || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const generatedReportID = `REP-${uuidv4().slice(0, 8).toUpperCase()}`; // Generate unique report ID
    setReportID(generatedReportID); // Set the generated report ID

    // Create FormData to handle file and text fields
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'driversLicense' || key === 'vehicleRegistration' || key === 'orCr') {
        // Append file fields as files
        if (formData[key]) formDataToSend.append(key, formData[key]);
      } else {
        // Append text fields as text
        formDataToSend.append(key, formData[key]);
      }
    });
    formDataToSend.append('reportID', generatedReportID);

    try {
      const response = await fetch('/api/reporthandler', {
        method: 'POST',
        body: formDataToSend, // Send FormData
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Report submitted successfully! Your report ID is ${generatedReportID}.`);
        setAlertColor('bg-green-100'); // Green for success
        setIsModalOpen(true); // Open modal on success
        setTimer(30);
        setFormData({
          fullName: '',
          age: '',
          sex: '',
          address: '',
          contactNumber: '',
          isOwner: 'No',
          driversLicense: null,
          vehicleRegistration: null,
          orCr: null,
          reason: '',
          vehicleType: 'Motorcycle',
          platenumber: '',
          color: '',
          description: '',
        });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
        setAlertColor('bg-red-100'); // Red for error
        setIsModalOpen(true); // Open modal on error
      }
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again later.');
      setAlertColor('bg-red-100'); // Red for error
      setIsModalOpen(true); // Open modal on error
    }
  };

  // Update the alert box color opacity based on the timer
  useEffect(() => {
    if (timer === 0) return; // Stop when timer reaches 0
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1); // Decrease timer every second
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Dynamically reduce opacity of the modal alert over time
  const alertStyle = {
    opacity: `${timer / 30}`,
    transition: 'opacity 1s ease-out',
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when the user clicks close
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reportID); // Copy the report ID to clipboard
    alert('Report ID copied to clipboard!'); // Show success alert
  };

  return (
    <div className="container mx-auto p-6 mt-6">
      <div className="bg-blue-100 border border-blue-500 text-blue-700 px-4 py-3 rounded mb-4 flex items-start">
        <span className="mr-2 text-xl">ℹ️</span>
        <p>Got any complaints? Submit one through the form below:</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Complainant Details */}
        <h2 className="text-2xl font-bold mb-4">Complainant Details</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Are you the owner of the vehicle being reported?</label>
          <select
            name="isOwner"
            value={formData.isOwner}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {formData.isOwner === 'Yes' && (
          <>
            <p className='text-gray-700 text-sm italic font-bold mb-2'>For verification purposes please upload the 
              following photos:
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Driver's License</label>
              <input
                type="file"
                name="driversLicense"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Vehicle Registration</label>
              <input
                type="file"
                name="vehicleRegistration"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">OR/CR</label>
              <input
                type="file"
                name="orCr"
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              />
            </div>
          </>
        )}

        {/* Vehicle Details */}
        <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            >
              <option value="Motorcycle">Motorcycle</option>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
            </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Plate Number</label>
            <input
              type="text"
              name="platenumber"
              value={formData.platenumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Additional Description of Vehicle</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Report
          </button>
        </div>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className={`fixed top-0 left-0 w-full h-full flex justify-center items-center ${alertStyle}`}>
          <div className={`bg-white p-6 rounded-lg shadow-lg ${alertColor}`}>
            <div className="flex justify-between items-center">
              <span className="font-bold">Report Submission</span>
              <button onClick={handleCloseModal} className="text-black font-bold">X</button>
            </div>
            <p>{message}</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="font-semibold">Your Report ID:</p>
              <div>
                <span className="text-sm text-gray-700">{reportID}</span>
                <button
                  onClick={handleCopyCode}
                  className="ml-2 text-blue-500 text-sm font-bold"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
