import './index.css';
import {ReactTable, AgGridTable} from './App';
import {MeasurePerformance} from './performanceMeasureUtils';

const componentList = [ReactTable, AgGridTable];
const perf = new MeasurePerformance();
// first-render
perf.firstRender(componentList);

// rerenders
// perf.multipleRenders(componentList);

// table update - one table at a time
// perf.updateCompleteTable(componentList);

// update single cell
// perf.updateSingleCell(componentList)
