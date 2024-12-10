import React, { useState } from "react";
import "./SalesLog.css";
import axios from "axios";

const SalesLog = () => {
  const [data, setData] = useState([
    { date: "12/03/2019", entityName: "PQR Private Limited", taskType: "Meeting", time: "1:00 PM", contactPerson: "Sansa Stark", notes: "Lorem ipsum...", status: "Open" },
    { date: "12/03/2019", entityName: "STU Private Limited", taskType: "Call", time: "1:00 PM", contactPerson: "Frodo Baggins", notes: "Lorem ipsum...", status: "Open" },
    { date: "13/03/2019", entityName: "ABC Private Limited", taskType: "Call", time: "1:00 PM", contactPerson: "John Doe", notes: "Lorem ipsum...", status: "Closed" },
    { date: "14/03/2019", entityName: "CBA Private Limited", taskType: "Video Call", time: "1:00 PM", contactPerson: "Han Solo", notes: "Lorem ipsum...", status: "Open" },
  ]);

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    entityName: "",
    date: "",
    time: "12:00 PM",
    taskType: "Call",
    phoneNumber: "",
    contactPerson: "",
    notes: "",
    status: "Open",
  });

  const [selectedTaskTypes, setSelectedTaskTypes] = useState([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [activeOptionsIndex, setActiveOptionsIndex] = useState(null);
  const [activeStatusIndex, setActiveStatusIndex] = useState(null);

  const taskTypeOptions = [
    { type: "Meeting", icon: "📍" },
    { type: "Call", icon: "📞" },
    { type: "Video Call", icon: "🎥" },
  ];

  const handleAddTask = async () => {
    const taskData = {
      entityName: newTask.entityName,
      date: newTask.date,
      time: newTask.time,
      taskType: newTask.taskType,
      contactPerson: newTask.contactPerson,
      notes: newTask.notes,
      status: newTask.status,
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/tasks", taskData);
      setData([...data, { ...taskData, id: response.data.taskId }]);
      setIsNewTaskOpen(false);
      setNewTask({
        entityName: "",
        date: "",
        time: "12:00 PM",
        taskType: "Call",
        phoneNumber: "",
        contactPerson: "",
        notes: "",
        status: "Open",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = (index) => {
    const taskToEdit = data[index];
    setNewTask(taskToEdit);
    setIsNewTaskOpen(true);
  };

  const handleDuplicateTask = (index) => {
    const duplicatedTask = { ...data[index] };
    setData([...data, duplicatedTask]);
  };

  const handleChangeStatus = (index, status) => {
    const updatedData = [...data];
    updatedData[index].status = status;
    setData(updatedData);
    setActiveStatusIndex(null); // Close the dropdown after status is updated
  };

  const handleOptionsClick = (index) => {
    setActiveOptionsIndex(index === activeOptionsIndex ? null : index);
  };

  const handleStatusClick = (index) => {
    setActiveStatusIndex(index === activeStatusIndex ? null : index);
  };

  const filteredData =
    selectedTaskTypes.length > 0
      ? data.filter((item) => selectedTaskTypes.includes(item.taskType))
      : data;

  return (
    <div className="sales-log-container">
      <div className="sales-log-header">
        <h2>Sales Log</h2>
        <input type="text" placeholder="Search" className="search-input small" />
        <button className="new-task-btn" onClick={() => setIsNewTaskOpen(true)}>
          + New Task
        </button>
      </div>
      <table className="sales-log-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Entity Name</th>
            <th>
              Task Type
              <span
                className="filter-icon"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              >
                🔽
              </span>
              {isFilterDropdownOpen && (
                <div className="filter-dropdown">
                  <p className="dropdown-title"></p>
                  {taskTypeOptions.map(({ type, icon }) => (
                    <label key={type} className="dropdown-item">
                      <input
                        type="checkbox"
                        checked={selectedTaskTypes.includes(type)}
                        onChange={() => {
                          const newSelectedTaskTypes = selectedTaskTypes.includes(type)
                            ? selectedTaskTypes.filter((item) => item !== type)
                            : [...selectedTaskTypes, type];
                          setSelectedTaskTypes(newSelectedTaskTypes);
                        }}
                      />
                      <span>{icon}</span> {type}
                    </label>
                  ))}
                </div>
              )}
            </th>
            <th>Time</th>
            <th>Contact Person</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.entityName}</td>
              <td>{item.taskType}</td>
              <td>{item.time}</td>
              <td>{item.contactPerson}</td>
              <td>{item.notes}</td>
              <td className={`status ${item.status.toLowerCase()}`}>
                <div className="status-container">
                  <button
                    className={`status-btn ${item.status.toLowerCase()}`}
                    onClick={() => handleStatusClick(index)}
                  >
                    {item.status}
                  </button>
                  {activeStatusIndex === index && (
                    <div className="status-dropdown">
                      <p>STATUS</p>
                      <button
                        className="status-option open"
                        onClick={() => handleChangeStatus(index, "Open")}
                      >
                        Open
                      </button>
                      <button
                        className="status-option closed"
                        onClick={() => handleChangeStatus(index, "Closed")}
                      >
                        Closed
                      </button>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="options-container">
                  <button
                    className="options-btn"
                    onClick={() => handleOptionsClick(index)}
                  >
                    Options
                  </button>
                  {activeOptionsIndex === index && (
                    <div className="options-dropdown">
                      <button onClick={() => handleEditTask(index)}>Edit</button>
                      <button onClick={() => handleDuplicateTask(index)}>
                        Duplicate
                      </button>
                      <button onClick={() => handleChangeStatus(index, "Closed")}>
                        Change Status to Closed
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isNewTaskOpen && (
        <div className="modal-overlay">
          <div className="new-task-modal">
            <h2>New Task</h2>
            <input
              type="text"
              placeholder="Entity Name"
              value={newTask.entityName}
              onChange={(e) =>
                setNewTask({ ...newTask, entityName: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Date"
              value={newTask.date}
              onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
            />
            <input
              type="time"
              value={newTask.time}
              onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
            />
            <select
              value={newTask.taskType}
              onChange={(e) =>
                setNewTask({ ...newTask, taskType: e.target.value })
              }
            >
              {taskTypeOptions.map(({ type }) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Phone Number"
              value={newTask.phoneNumber}
              onChange={(e) =>
                setNewTask({ ...newTask, phoneNumber: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Contact Person"
              value={newTask.contactPerson}
              onChange={(e) =>
                setNewTask({ ...newTask, contactPerson: e.target.value })
              }
            />
            <textarea
              placeholder="Notes"
              value={newTask.notes}
              onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
            ></textarea>
            <div className="modal-actions">
              <button onClick={() => setIsNewTaskOpen(false)}>Cancel</button>
              <button onClick={handleAddTask}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesLog;