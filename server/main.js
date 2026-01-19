import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { TasksCollection } from "/imports/api/TasksCollection";
import "../imports/api/TasksPublication";
import "../imports/api/tasksMethods";

const SEED_USERNAME = "admin";
const SEED_PASSWORD = "123456";

Meteor.startup(() => {
  Accounts.config({
    ambiguousErrorMessages: false,
  });
});

Meteor.startup(async () => {
  if (!(await Accounts.findUserByUsername(SEED_USERNAME))) {
    await Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
});

const insertTask = (taskText) => {
  TasksCollection.insertAsync({ text: taskText });
};

Meteor.startup(async () => {
  if ((await TasksCollection.find().countAsync()) === 0) {
    [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ].forEach(insertTask);
  }
});
