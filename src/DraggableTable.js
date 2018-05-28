import React, { Component } from "react";
import ReactTable, { ReactTableDefaults } from "react-table";
import FixedTable from './FixedTable';
import _ from 'lodash';

import "react-table/react-table.css";
import "./draggableTable.css";

/** constants for virtual scroll */
const TABLE_PAGE_SIZE = 100;
const DEFAULT_ROW_HEIGHT = 30;
const MIN_ROWS = 3;
const DEFAULT_PAGE_SIZE = 10;
const BEFORE_OFFSET = Math.floor(0.2 * TABLE_PAGE_SIZE);
const AFTER_OFFSET = Math.floor(0.8 * TABLE_PAGE_SIZE);

Object.assign(ReactTableDefaults, {
  minRows: MIN_ROWS,
  defaultPageSize: DEFAULT_PAGE_SIZE
});

/**
 * Table Component: HOC over React-Table
 * TODO - Infinite Scroll without Column Freeze. Set Height on Table Parent equal to getHeight
 * TODO - Set Margin-top for virtual scroll
 * TODO - Pagination Component
 * TODO - Drag-Drop of columns
 * TODO - Refactor Code
 */
class DraggableTable extends Component {
  constructor(props) {
    super(props);
    this.dragged = null;
    this.reorder = [];

    this.state = {
      trigger: 0,

      /** Needed for Virtual Scroll */
      rows: props.rows,

      /** Freezed Column Options */
      freezedTableProps: {},
    };

    /** Virtual Scroll Options */
    this.changeAfterDistance = 0;
    this.lastScroll = 0;
    this.scrollHandler = () => {};
    this.virtualScrollOptions = !!props.infiniteScroll ? {
      pageSize: TABLE_PAGE_SIZE,
      showPagination: false,
    } : {};
    this.tableWrapper = null;
    this.tableBodyArray = [];
    this.rowHeight = 0;
  }

  mountEvents() {
    const headers = Array.prototype.slice.call(
      document.querySelectorAll(".draggable-header")
    );

    headers.forEach((header, i) => {
      header.setAttribute("draggable", true);
      //the dragged header
      header.ondragstart = e => {
        e.stopPropagation();
        this.dragged = i;
      };

      header.ondrag = e => e.stopPropagation;

      header.ondragend = e => {
        e.stopPropagation();
        setTimeout(() => (this.dragged = null), 1000);
      };

      //the dropped header
      header.ondragover = e => {
        e.preventDefault();
      };

      header.ondrop = e => {
        e.preventDefault();
        const { target, dataTransfer } = e;
        this.reorder.push({ a: i, b: this.dragged });
        this.setState({ trigger: Math.random() });
      };
    });
  }
  componentDidMount() {
    const {infiniteScroll} = this.props;
    this.scrollHandler = _.debounce(this.virtualScroll, 100);
    this.tableBodyArray = document.getElementsByClassName('rt-tbody');
    if(infiniteScroll) {
      const tableRow = document.getElementsByClassName('rt-tr-group')[0];
      this.rowHeight = tableRow.clientHeight;
      this.changeAfterDistance = TABLE_PAGE_SIZE * this.rowHeight;
      this.tableWrapper.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
    this.mountEvents();
  }

  componentWillUnmount() {
    const parent = this.tableWrapper;
    !!parent && parent.removeEventListener('scroll', this.scrollHandler);
    // TODO - remove drag event handlers on unmount
  }

  componentDidUpdate() {
    this.mountEvents();
  }

  getData = (data, start = 0, end = TABLE_PAGE_SIZE) => {
    return data.slice(start, end);
  }

  virtualScroll = () => {
    // get how far we are in scroll
    const distSinceLastScroll = Math.floor(this.tableWrapper.scrollTop - this.lastScroll);
    if(Math.abs(distSinceLastScroll) >  this.changeAfterDistance) {
      this.lastScroll = this.tableWrapper.scrollTop;
      // calculate which element number should be present at current scroll location
      const elemNumber = Math.ceil(this.lastScroll/this.rowHeight);
      const scrollDirection = distSinceLastScroll / Math.abs(distSinceLastScroll);
      let start = 0;
      if (scrollDirection === 1) {
        start = Math.max(elemNumber - BEFORE_OFFSET, 0);
        console.log('scrolling down', start);
      } else if(scrollDirection === -1) {
        start = Math.max(elemNumber - AFTER_OFFSET, 0);
        console.log('scrolling up', start);
      }

      if(elemNumber > TABLE_PAGE_SIZE) {
        // update table data
        this.setState((state) => ({
          ...state,
          rows: this.getData(this.props.rows, start, start + TABLE_PAGE_SIZE)
        }));
        // set margin-top = this.rowHeight * start
      } else {
        // elemNumber <= TABLE_PAGE_SIZE
        // update table data
        this.setState((state) => ({
          ...state,
          rows: this.getData(this.props.rows, 0, TABLE_PAGE_SIZE) 
        }));
        // set margin-top = 0
      }
    }
  }

  onPageSizeChangeHandler = (pageSize, pageIndex) => {
    this.setState((state) => ({
        ...state,
        freezedTableProps: {
          ...this.freezedTableProps,
          pageSize: pageSize,
          page: pageIndex,
        }
      })
    );
  }

  onPageChangeHandler = (pageIndex) => {
    this.setState((state) => ({
        ...state,
        freezedTableProps: {
          ...this.freezedTableProps,
          page: pageIndex,
        }
      })
    );
  }

  getFreezedColumnProps() {
    const {freezedColumnProps} = this.props;
    const {rows} = this.state;
    return {
      ...freezedColumnProps,
      ...this.freezedTableProps,
      showPagination: false,
      data: this.getData(rows),
      columns: [{
        columns: [{
          ...freezedColumnProps.getColumnProps(),
        }]
      }],
    };
  }

  getHeight() {
    const height = this.rowHeight || DEFAULT_ROW_HEIGHT;
    return this.props.infiniteScroll
      ? `${this.props.rows.length * height}px`
      : 'auto';
  }

  renderFreezedColumnTable() {
    return (
      <div className="fixedTableWrapper">
        <div className="fixedColumn" style={
          { height: this.getHeight() }
        }>
          <ReactTable
            {...this.getFreezedColumnProps()}
            {...this.state.freezedTableProps}
            {...this.virtualScrollOptions}
          />
        </div>
        <div className="fixedTable" style={
          { height: this.getHeight() }
        }>
          {this.renderTable()}
        </div>
      </div>
    );
  }

  renderTable() {
    const { columns } = this.props;
    const { rows } = this.state;
    // const cols = columns.map(col => ({
    //   ...col,
    //   Header: <span className="draggable-header">{col.Header}</span>
    // }));

    // //run all reorder events
    // this.reorder.forEach(o => cols.splice(o.a, 0, cols.splice(o.b, 1)[0]));

    return (
      <ReactTable
        {...this.props}
        {...this.virtualScrollOptions}
        data={this.getData(rows)}
        columns={columns}
        onPageChange={this.onPageChangeHandler}
        onPageSizeChange={this.onPageSizeChangeHandler}
      />
    );
  }

  render() {
    const { freezedColumnProps } = this.props;

    //render
    return (
      <div className="tableWrapper" ref={el => this.tableWrapper = el}>
        {!freezedColumnProps && this.renderTable()}
        {freezedColumnProps && this.renderFreezedColumnTable()}
      </div>
    );
  }
}

export default DraggableTable;
