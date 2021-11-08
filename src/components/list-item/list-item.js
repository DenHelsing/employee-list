import React, { Component } from 'react';
import './list-item.css';

export default class ListItem extends Component {
  render() {
    const { fullName, hireDate, salary, isOutsource, onEdit, onDelete } =
      this.props;
    return (
      <li className="list-item">
        <div className="list-item-labels">
          <span className="list-item-label">{`${fullName}`}</span>
          <span className="list-item-label">{`Hired on ${hireDate}`}</span>
          <span className="list-item-label">{`Salary : ${salary}$`}</span>
          <span className="list-item-label">{`Is ${
            isOutsource ? '' : 'not'
          } an outsource worker`}</span>
        </div>
        <div className="list-item-buttons">
          <button
            type="button"
            className="myListButton myListButton-edit"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="myListButton myListButton-delete"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </li>
    );
  }
}
