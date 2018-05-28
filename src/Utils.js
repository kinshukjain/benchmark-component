import React from "react";
import namor from "namor";
import "./index.css";

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? "relationship"
        : statusChance > 0.33 ? "complicated" : "single"
  };
};

export function makeData(len = 5553) {
  return range(len).map(d => {
    return {
      ...newPerson(),
      children: range(10).map(newPerson)
    };
  });
}

export const agColumns = [
  {
    field: "firstName",
    headerName: "First Name"
  },
  {
    headerName: "Last Name",
    field: "lastName"
  },
  {
    field: "age",
    headerName: "Age",
  },
  {
    headerName: "Status",
    field: "status",
  },
  {
    headerName: "Visits",
    field: "visits",
  },
  {
    field: "firstName",
    headerName: "First Name"
  },
  {
    headerName: "Last Name",
    field: "lastName"
  },
  {
    field: "age",
    headerName: "Age",
  },
  {
    headerName: "Status",
    field: "status",
  },
  {
    headerName: "Visits",
    field: "visits",
  }
];


export const columns = [
  {
    resizable: true,
    Header: "First Name",
    accessor: "firstName",
    field: "firstName",
    headerName: "First Name"
  },
  {
    resizable: true,
    Header: "Last Name",
    headerName: "Last Name",
    id: "lastName",
    accessor: d => d.lastName
  },
  {
    resizable: true,
    Header: "Age",
    field: "age",
    headerName: "Age",
    accessor: "age"
  },
  {
    resizable: true,
    Header: "Status",
    headerName: "Status",
    field: "status",
    accessor: "status"
  },
  {
    resizable: true,
    Header: "Visits",
    headerName: "Visits",
    field: "visits",
    accessor: "visits"
  },
  {
    resizable: true,
    Header: "First Name",
    accessor: "firstName",
    field: "firstName",
    headerName: "First Name"
  },
  {
    resizable: true,
    Header: "Last Name",
    headerName: "Last Name",
    id: "lastName",
    accessor: d => d.lastName
  },
  {
    resizable: true,
    Header: "Age",
    accessor: "age",
    field: "age",
    headerName: "Age",
  },
  {
    resizable: true,
    Header: "Status",
    accessor: "status",
    headerName: "Status",
    field: "status",
  },
  {
    resizable: true,
    Header: "Visits",
    accessor: "visits",
    headerName: "Visits",
    field: "visits",
  }
];

export const Logo = () =>
  <div style={{ margin: '1rem auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
    For more examples, visit {''}
  <br />
    <a href="https://github.com/react-tools/react-table" target="_blank" rel="noopener noreferrer">
      <img
        alt=""
        src="https://github.com/react-tools/media/raw/master/logo-react-table.png"
        style={{ width: `150px`, margin: ".5em auto .3em" }}
      />
    </a>
  </div>;

export const Tips = () =>
  <div style={{ textAlign: "center" }}>
    <em>Tip: Hold shift when sorting to multi-sort!</em>
  </div>;
