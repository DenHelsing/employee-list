import React, { Component } from 'react';
import './App.css';
import EmployeesList from './components/employees-list/employees-list';

import firebase from './firebase';

import {
  doc,
  setDoc,
  getDocs,
  getFirestore,
  collection,
  deleteDoc,
  Timestamp,
  writeBatch
} from 'firebase/firestore';

export default class App extends Component {
  currentMaxId = 2;
  db = getFirestore(firebase);
  fullNameRef = React.createRef();
  salaryRef = React.createRef();
  hireDateRef = React.createRef();
  outsourceRef = React.createRef();
  formRef = React.createRef();
  state = {
    employees: [],
    editingMode: false,
    currentItemId: 0,
    deletedIDs: []
  };

  createEmployee = ({ fullName, hireDate, salary, isOutsource }) => {
    return { fullName, hireDate, salary, isOutsource, id: ++this.currentMaxId };
  };
  createEmployeeForDatabase = ({ fullName, hireDate, salary, isOutsource }) => {
    return {
      fullName,
      hireDate: Timestamp.fromMillis(new Date(hireDate).getTime()),
      salary,
      isOutsource
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const employeeData = {
      salary: this.salaryRef.current.value,
      fullName: this.fullNameRef.current.value,
      hireDate: this.hireDateRef.current.value,
      isOutsource: this.outsourceRef.current.checked
    };
    if (this.state.editingMode) {
      this.saveChanges(employeeData);
    } else {
      this.addEmployee(employeeData);
    }
    this.formRef.current.reset();
  };

  addEmployee = (employeeData) => {
    this.setState(({ employees }) => {
      return { employees: [...employees, this.createEmployee(employeeData)] };
    });
  };

  findEmployee = (id) => {
    const employeeIndex = this.state.employees.findIndex((el) => el.id === id);
    const employeeData = this.state.employees[employeeIndex];
    return [employeeIndex, employeeData];
  };

  onEdit = (id) => {
    console.log(id);
    this.setState(({}) => {
      const employeeData = this.findEmployee(id)[1];
      // console.log(employeeData);
      this.salaryRef.current.value = employeeData.salary;
      this.fullNameRef.current.value = employeeData.fullName;
      this.hireDateRef.current.value = employeeData.hireDate;
      this.outsourceRef.current.checked = employeeData.isOutsource;
      return { editingMode: true, currentItemId: id };
    });
  };

  saveChanges = (employeeData) => {
    this.setState(({ employees, currentItemId }) => {
      const index = this.findEmployee(currentItemId)[0];
      console.log(index);
      const newArray = [
        ...employees.slice(0, index),
        { ...employeeData, id: currentItemId },
        ...employees.slice(index + 1)
      ];
      // console.log(newArray);
      return { employees: newArray, editingMode: false, currentItemId: 0 };
    });
  };

  // deleteAnItem = (id) => {
  //   this.setState(({ todoData, deletedIDs }) => {
  //     console.log(deletedIDs);
  //     let anArr = todoData;
  //     anArr = todoData.filter(function (el) {
  //       return el.id !== id;
  //     });
  //     return { todoData: anArr, deletedIDs: [...deletedIDs, id] };
  //   });
  // };

  deleteAnItem = (id) => {
    this.setState(({ employees, deletedIDs }) => {
      const anArr = employees.filter(function (el) {
        return el.id !== id;
      });
      this.formRef.current.reset();
      return {
        employees: anArr,
        currentItemId: 0,
        editingMode: false,
        deletedIDs: [...deletedIDs, id]
      };
    });
  };

  saveToDatabase = () => {
    const batch = writeBatch(this.db);
    const postData = async () => {
      this.state.employees.forEach((item) => {
        const firebaseObject = this.createEmployeeForDatabase(item);
        console.log(item.id);
        console.log(firebaseObject);
        batch.set(doc(this.db, 'employees', '' + item.id), firebaseObject);
      });
      if (this.state.deletedIDs.length !== 0) {
        console.log(this.state.deletedIDs);
        this.state.deletedIDs.forEach((id) =>
          batch.delete(doc(this.db, 'employees', '' + id))
        );
      }
      await batch.commit();
    };
    postData().then(() => console.log('saved'));
  };

  componentDidMount() {
    // this.setState({ loading: true });
    const fetchData = async () => {
      const snapshot = await getDocs(collection(this.db, 'employees'));
      console.log(snapshot);
      const employees = snapshot.docs.map((doc) => {
        this.currentMaxId = Math.max(this.currentMaxId, parseInt(doc.id, 10));
        const date = doc.data().hireDate.toDate();
        return {
          ...doc.data(),
          hireDate: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`,
          id: parseInt(doc.id, 10)
        };
      });
      console.log(employees);
      this.setState({ employees: employees });
    };
    fetchData();
  }

  render() {
    let { employees, editingMode } = this.state;
    console.log(employees);
    return (
      <div className="App">
        <h2>{'Random company | Employees list'}</h2>
        <form ref={this.formRef} className="inputForm">
          <input
            type="text"
            ref={this.fullNameRef}
            placeholder="Enter employee name"
            className="formField formField-narrow"
          />
          <input
            type="number"
            min="0"
            ref={this.salaryRef}
            placeholder="Enter employee salary"
            className="formField formField-narrow"
          />
          <input type="date" ref={this.hireDateRef} className="formField" />
          <label>
            Outsource?
            <input
              type="checkbox"
              ref={this.outsourceRef}
              value={this.state.important}
              onChange={this.onStatusChange}
            />
          </label>
          <button
            onClick={(e) => this.handleSubmit(e)}
            className="myButton submitButton"
          >
            {`${editingMode ? 'Save changes' : 'Add employee'}`}
          </button>
          <button
            type="button"
            onClick={this.saveToDatabase}
            className="myButton saveToCloudButton"
          >
            {'Save to cloud'}
          </button>
        </form>
        <EmployeesList
          employeesData={employees}
          onDelete={(id) => this.deleteAnItem(id)}
          onEdit={(id) => this.onEdit(id)}
        />
        {/* {data.map((data, i) => (
            <li key={i} className="myList">
              {i + 1}. {data.fullName}, {data.hireDate}, {data.salary},{' '}
              {data.isOutsource}
              <button onClick={() => this.fRemove(i)} className="myListButton">
                remove{' '}
              </button>
              <button onClick={() => this.fEdit(i)} className="myListButton">
                edit{' '}
              </button>
            </li>
          ))} */}
      </div>
    );
  }
}
