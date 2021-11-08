import React from 'react';
import './employees-list.css';

import ListItem from '../list-item/list-item.js';

export default function EmployeesList({ employeesData, onDelete, onEdit }) {
  console.log(employeesData);
  const employees = employeesData.map((item) => {
    const { id, ...itemProps } = item;
    return (
      <ListItem
        key={id}
        {...itemProps}
        onDelete={() => onDelete(id)}
        onEdit={() => onEdit(id)}
      />
    );
  });
  return <ul className="list-group">{employees}</ul>;
}
