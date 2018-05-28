import React, { Component } from "react";
import ReactTable, { ReactTableDefaults } from "react-table";
import "./draggableTable.css";

Object.assign(ReactTableDefaults, {
  defaultPageSize: 10,
  minRows: 3
});

class FixedTable extends Component {
  getFreezedColumnProps() {
    const {freezedColumnProps, rows} = this.props;
    return {
      ...freezedColumnProps,
      ...this.freezedTableProps,
      showPagination: false,
      data: rows,
      columns: [{
        columns: [{
          ...freezedColumnProps.getColumnProps(),
        }]
      }],
    };
  }

  renderFreezedColumnTable() {
    return (
      <div className="fixedTableWrapper">
        <div className="fixedColumn">
          <ReactTable
            {...this.getFreezedColumnProps()}
            {...this.props.freezedTableProps}
            {...this.props.virtualScrollOptions}
          />
        </div>
        <div className="fixedTable">
          {this.props.renderTable()}
        </div>
      </div>
    );
  }

  render() {
    return this.renderFreezedColumnTable();
  }
}

export default FixedTable;
