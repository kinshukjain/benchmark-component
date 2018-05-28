import React, { Component } from 'react';
import './App.css';

// commom imports
import { /* makeData, */ columns, agColumns } from "./Utils";

// react-table imports
import DraggableTable from './DraggableTable';
import "react-table/react-table.css";
// Import React Table
// import ReactTable from "react-table";

// ag-grid imports
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

export class ReactTable extends Component {
  // state = {
  //   data: makeData(DATA_SIZE),
  // }

  render() {
    // const freezedColumnProps = {
    //   getColumnProps: () => ({
    //     Header: "Beta",
    //     accessor: "firstName",
    //   })
    // };
    // const { data } = this.state;
    const { info } = this.props;
    return (
      <div style={{ height: '100vh' }}>
        <DraggableTable
          rows={info}
          infiniteScroll={false}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}


export class AgGridTable extends Component {

  render() {
    const { info } = this.props;
    return (
      <div 
        className="ag-theme-balham"
        style={{
          height: '100vh',
        }} 
      >
        <AgGridReact
          columnDefs={agColumns}
          rowData={info}>
        </AgGridReact>
      </div>
    );
  }
}
