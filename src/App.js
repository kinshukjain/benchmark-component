import React, { Component } from 'react';
import './App.css';

// commom imports
import { /*makeData,*/ columns, agColumns } from "./Utils";

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
          defaultPageSize={1000}
          className="-striped -highlight"
        />
      </div>
    );
  }
}


export class AgGridTable extends Component {
  componentDidUpdate() {
    console.log(performance.now());
  }

  render() {
    const { info } = this.props;
    return (
      <div 
        className="ag-theme-balham"
        style={{
          height: '100vh',
        }} 
      >
        {/* <button onClick={() => {
          var sort = [
            {
              colId: "firstName",
              sort: "asc"
            }
          ];
          this.api.setSortModel(sort);
          console.log(performance.now())
        }}>sort</button> */}
        <AgGridReact
          // deltaRowDataMode={true}
          // enableSorting={true}
          // postSort={() => console.log(performance.now())}
          // onCellValueChanged={() => { console.log(performance.now()); }}
          // onGridReady={(params) => {
          //   const api = params.api;
          //   const data = info;
          //   data[0].firstName = '123456';
          //   const row = api.getDisplayedRowAtIndex(0);

          //   setTimeout(() => {
          //     const time = performance.now();
          //     api.updateRowData({ update: [data[0]] });
          //     console.log(performance.now() - time);
          //   }, 1000);
          // }}
          columnDefs={agColumns}
          rowData={info}>
        </AgGridReact>
      </div>
    );
  }
}
