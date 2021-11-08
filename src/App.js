import React, { Component } from 'react';
import './App.css';
import EmployeesList from './components/employees-list/employees-list';

export default class App extends Component {
  currentMaxId = 2;
  fullNameRef = React.createRef();
  salaryRef = React.createRef();
  hireDateRef = React.createRef();
  outsourceRef = React.createRef();
  formRef = React.createRef();
  state = {
    employees: [
      {
        id: 1,
        fullName: 'Jeremy Oshie',
        hireDate: '2011-05-06',
        salary: 5456465,
        isOutsource: false
      },
      {
        id: 2,
        fullName: 'Lalalala',
        hireDate: '2010-08-06',
        salary: 5456461235,
        isOutsource: true
      }
    ],
    editingMode: false,
    currentItemId: 0,
    datas: []
  };

  createEmployee = ({ fullName, hireDate, salary, isOutsource }) => {
    return { fullName, hireDate, salary, isOutsource, id: ++this.currentMaxId };
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
      this.formRef.current.reset();
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
    this.setState(({ employees }) => {
      const anArr = employees.filter(function (el) {
        return el.id !== id;
      });
      this.formRef.current.reset();
      return { employees: anArr, currentItemId: 0, editingMode: false };
    });
  };

  fSubmit = (e) => {
    e.preventDefault();
    console.log('try');

    let datas = this.state.datas;
    let name = this.refs.name.value;
    let address = this.refs.address.value;

    if (this.state.act === 0) {
      //new
      let data = {
        name,
        address
      };
      datas.push(data);
    } else {
      //update
      let index = this.state.index;
      datas[index].name = name;
      datas[index].address = address;
    }

    this.setState({
      datas: datas,
      act: 0
    });

    this.refs.myForm.reset();
    this.refs.name.focus();
  };

  fRemove = (i) => {
    let datas = this.state.employees;
    datas.splice(i, 1);
    this.setState({
      datas: datas
    });

    this.refs.myForm.reset();
    this.refs.name.focus();
  };

  fEdit = (i) => {
    let data = this.state.datas[i];
    this.refs.name.value = data.name;
    this.refs.address.value = data.address;

    this.setState({
      act: 1,
      index: i
    });

    this.refs.name.focus();
  };

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
          <button onClick={(e) => this.handleSubmit(e)} className="myButton">
            {`${editingMode ? 'Save changes' : 'Add employee'}`}
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
