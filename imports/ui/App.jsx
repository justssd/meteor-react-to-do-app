import React, { useState, Fragment } from "react";
import { useTracker, useSubscribe } from "meteor/react-meteor-data";
import { Task } from "./Task.jsx";
import { TasksCollection } from "../api/TasksCollection.js";
import { TaskForm } from "./TaskForm.jsx";
import { LoginForm } from "./LoginForm.jsx";

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  const isLoading = useSubscribe("tasks");

  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? { isChecked: { $ne: true } } : {}, {
      sort: { createdAt: -1 },
    }).fetch(),
  );

  const user = useTracker(() => Meteor.user());

  const pendingTasksCount = useTracker(() =>
    TasksCollection.find({ isChecked: { $ne: true } }).count(),
  );

  const pendingTasksTitle = pendingTasksCount ? `(${pendingTasksCount})` : "";

  const handleToggleChecked = ({ _id, isChecked }) => {
    Meteor.callAsync("tasks.toggleChecked", { _id, isChecked });
  };

  const handleDelete = ({ _id, isChecked }) => {
    Meteor.callAsync("tasks.delete", { _id });
  };

  if (isLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>Meteor To Do {pendingTasksTitle}</h1>
          </div>
        </div>
      </header>
      <div className="main">
        {user ? (
          <Fragment>
            <TaskForm />
            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? "Show All" : "Hide Completed"}
              </button>
            </div>
            <ul className="tasks">
              {tasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={handleToggleChecked}
                  onDeleteClick={handleDelete}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
