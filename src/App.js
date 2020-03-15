import React from 'react';
import faker from "faker";
import { InfiniteLoader, AutoSizer, Grid, CellMeasurerCache } from "react-virtualized";

export default class App extends React.Component {
  constructor() {
    super();

    this._cache = new CellMeasurerCache({
      defaultWidth: 100,
      fixedHeight: true,
    });

    this.state = {
      hasNextPage: true,
      isNextPageLoading: false,
      list: []
    };
  }

  loadNextPage = ({ startIndex, stopIndex }) => {
    console.log('test')
    const items = new Array(10).fill(true).map(() => ({
      name: faker.name.findName(),
      image: faker.image.avatar()
    }));

    this.setState({ isNextPageLoading: true }, () => {
      this.setState({
        isNextPageLoading: false,
        list: [...this.state.list, ...items],
      });
    });
  }


  render() {
    const { isNextPageLoading, list, hasNextPage } = this.state;
    const rowCount = hasNextPage ? list.length + 1 : list.length;
    const loadMoreRows = isNextPageLoading ? () => { } : this.loadNextPage;
    const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;
    const rowRenderer = ({ index, key, style }) => {
      let content;

      if (!isRowLoaded({ index })) {
        return (
          <div key={key} style={style}>
            Loading...
          </div>

        )
      } else {
        const { name, image } = list[index];
        return (
          <div key={key} style={style}>
            <div className="card">
              <img src={image} className="card-img-top" alt="..." />
              <div className="card-body">
                <p className="card-text">{name}</p>
              </div>
            </div>
          </div>
        );
      }
    };

    return (
      <div>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={rowCount}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <Grid
                  columnCount={5}
                  columnWidth={this._cache.columnWidth}
                  deferredMeasurementCache={this._cache}
                  height={400}
                  overscanColumnCount={0}
                  overscanRowCount={2}
                  cellRenderer={this._cellRenderer}
                  rowCount={50}
                  rowHeight={35}
                  width={width}
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={rowRenderer}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    );
  }
}
