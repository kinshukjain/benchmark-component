import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {makeData} from './Utils';

export const DATA_SIZE = 100;

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: props.info,
    };
  }

  componentDidMount() {
    if(this.props.updateTest) {
      setTimeout(() => {
        const data = this.getData(); // this.state.info
        // data[0].age = 123456;
        this.prevTime = performance.now();
        console.log(`%cTesting componenent - ${this.props.component.name}`,'color: green; font-weight: bold;');
        this.setState({ info: data });
      }, 2000);
    }
  }

  getData = () => {
    return makeData(DATA_SIZE);
  }

  componentDidUpdate() {
    if(this.props.updateTest) {
      console.log(`Time: %c${Math.round(performance.now() - this.prevTime)}ms`, 'color:blue');
    }
  }

  render() {
    const { component: Component, iteration } = this.props
    const { info } = this.state;
    return <Component iteration={iteration} info={info} />;
  }
}

export class MeasurePerformance {
  constructor() {
    this.init();
    this.getNextComponent = this.getNextComponent.bind(this);
    this.getData = this.getData.bind(this);
    this.updateCompleteTable = this.updateCompleteTable.bind(this);
    this.root = document.getElementById('root');
  }

  init() {
    this.max_rerenders = 1;
    this.cmpList = [];
    this.prevTime = 0;
    this.cmpSwitcher = undefined;
    this.updateTest = false;
  }

  setMaxReRender(val) {
    this.max_rerenders = val;
  }

  setCmpList(cmpList) {
    if(!!cmpList.length) {
      this.cmpList = cmpList;
      this.cmpSwitcher = this.cycleThroughComponents();
    }
  }

  getData() {
    return makeData(DATA_SIZE);
  }

  getCmpList() {
    return this.cmpList;
  }

  * cycleThroughComponents() {
    yield* this.cmpList;
  }
  
  getNextComponent() {
    console.log('%c ', 'border-top: 1px solid #999;');
    const data = this.getData();
    this.start(this.cmpSwitcher.next().value, data);
  }

  start(cmp, data) {
    if (!cmp) return;
    console.log(`%cTesting componenent - ${cmp.name}`,'color: green; font-weight: bold;');
    this.prevTime = performance.now();
    this.iterate(cmp, data);
  }

  iterate(cmp, data) {
    let num_iterations = this.max_rerenders;
    while (num_iterations--) {
      this.rerender(cmp, num_iterations, data); // measures re-render performance
    }
    console.log(`Time: %c${Math.round(performance.now() - this.prevTime)}ms`, 'color:blue');
    setTimeout(this.getNextComponent, 500);
  }

  startPerformanceBenchmark() {
    console.log(`Starting tests with %cReact 16...`, 'font-weight: bold');
    setTimeout(this.getNextComponent, 1000);
  }

  // method to measure re-render peformance
  rerender(cmp, i, data) {
    ReactDOM.render(
      <Wrapper component={cmp}
        iteration={i} info={data} updateTest={this.updateTest} />, this.root);
  }

  // add list of methods here to measure different types of performance
  firstRender(list) {
    console.log('Measuring First Render time ... ');
    this.init();
    this.setCmpList(list);
    this.setMaxReRender(1);
    this.startPerformanceBenchmark();
  }

  multipleRenders(list) {
    console.log('Measuring re-rendering time(destroy + render) across 100 rerenders ... ');
    this.init();
    this.setCmpList(list);
    this.setMaxReRender(100);
    this.startPerformanceBenchmark();
  }

  updateCompleteTable(list) {
    if(!list.length) return;
    console.log('Measuring time to update complete table ... ');
    this.init();
    this.setCmpList(list);
    this.setMaxReRender(1);
    this.updateTest = true;
    this.rerender(this.cmpSwitcher.next().value, 0, this.getData());
  }
}
