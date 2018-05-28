import {DEFAULT_ROW_HEIGHT} from './tableConstants';

export function getHeight(rowHeight, numRows, hasInfiniteScroll) {
  const height = rowHeight || DEFAULT_ROW_HEIGHT;
  return hasInfiniteScroll
    ? `${numRows * height}px`
    : 'auto';
}

export function getData(data, start = 0, end = TABLE_PAGE_SIZE) {
  return data.slice(start, end);
}

export function virtualScroll() {}

export function initVirtualScroll() {}
