import React from 'react';
import './App.css';

const _ = require("lodash");

const layout = _.range(0, 16).map((n: any) => {
  const row = Math.floor(n / 4);
  const col = n % 4;
  return [80 * col, 80 * row];
});
class App extends React.Component<any, any> {
  constructor(props: any) {
      super(props);
      this.state = {
        positions: _.shuffle(_.range(0, 16)),
        clip: null,
        chunks: 16,
        rows: 4,
        coors: {}
      }
  }

  componentDidMount() {
    const { chunks, rows, coors } = this.state;

    let count = 0;
    let tempObject: any = {};
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < rows; j++) {
        tempObject[count] = [j*80, i*80];
        count++;
      }
    }

    this.setState({
      coors: tempObject
    })

    for(let i = 1; i < chunks; i++) {
      let [x, y] = tempObject[i];
      let canvas: any = document.getElementById(`${i}element`),
      ctx    = canvas.getContext('2d'),
      image: any  = document.getElementById('myImageId'),
      clip   = this.getClippedRegion(image, x, y, 80, 80);
      console.log("cann", x, y)
      ctx.drawImage(clip, 0, 0);
    }
  }

  updatePosition = (index: any) => {
    let {positions} = this.state;
    let emptyIndex = positions.indexOf(0);
    let targetIndex = positions.indexOf(index);
    const dif = Math.abs(targetIndex - emptyIndex);
    if (dif === 1 || dif === 4) {
      positions[emptyIndex] = index;
      positions[targetIndex] = 0;
      this.setState({positions});
      let win = _.every(positions, (value: any, index: any, array: [])=> {
        value = value || 16;
        return index === 0 || parseInt(array[index - 1]) <= parseInt(value)
      });
      if (win) {
        window.alert('U Win!!!');
      }
    }
  }

  getClippedRegion = (image: any, x: any, y: any, width: any, height: any) => {

    let canvas = document.createElement('canvas'),
      ctx: any = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, x, y, width, height,  0, 0, width, height);

    return canvas;
  }

  getSplittedElement = (elementId: string) => {
    let canvas: any = document.getElementById(elementId),
    ctx    = canvas.getContext('2d'),
    image  = document.getElementById('myImageId'),
    clip   = this.getClippedRegion(image, 0, 0, 170, 170);
    
    ctx.drawImage(clip, 0, 0);
  }

  render() {
    const { positions } = this.state;
    
    return (
      <div className="game">
        <img alt="testing" width="320" height="320" src="https://www.fnordware.com/superpng/pnggrad8rgb.png" id="myImageId" />
        <canvas id="myScreenCanvas"/> 
        {positions.map((i: any, key: any)=> {
          let cellClass = key ? "cell":"empty cell";
          let [x,y] = layout[positions.indexOf(key)];

          return (
            <div
              key={key}
              className={cellClass}
              onClick={() => this.updatePosition(key)}
              style={{transform: `translate3d(${x}px,${y}px,0) scale(1.1)`}}
            >
              <div style={{position: "absolute"}}>{key}</div>
              {key === 0 ? key : <canvas width="70" height="70" id={`${key}element`}/>}
            </div>
          )
        })}
      </div>
    )
  }
}

export default App;
