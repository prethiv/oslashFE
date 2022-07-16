import React from 'react';

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theatrename: '',
            layoutX: 0,
            layoutY: 0,
            layout: '',
            board: [],
            rowPrice: [],
            onlineButton:false
        };
        this.auxilary = {
            X: '',
            Y: '',
            alpha: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            rowPrice: [],
            board: []
        };
    }

    generateLayout = () => {
        if (this.state.layout === '') {
            alert("Enter Layout")
            return;
        }

        const parseX = (layout) => {
            let X = layout.split("X");
            return X[0];
        };


        const parseY = (layout) => {
            let Y = layout.split("X");
            return Y[1];
        }

        console.log(this.state.layout);
        this.auxilary.X = parseX(this.state.layout);
        console.log(this.auxilary.X);
        this.auxilary.Y = parseY(this.state.layout);
        console.log(this.auxilary.Y)
        this.setState({ layoutX: parseInt(this.auxilary.X) });
        this.setState({ layoutY: parseInt(this.auxilary.Y) });



        let board = [];
        let chairNumber = 0;

        for (let i = 0; i < this.auxilary.Y; i++) {
            let row = [];
            for (let j = 0; j < this.auxilary.X; j++) {
                row.push({ chair: chairNumber++, availability: true });
            }
            board.push(row);
        }
        console.log(board);

        this.setState({ board: board })
        this.auxilary.board= board;
        this.setState({onlineButton:true})
    }

    setRowPrice = (rowName) => {
        let price = prompt('Enter the price of the row?');
        if(price===null){
            return;
        }
        console.log(price);
        // let alreadyExists = false;
        // let index=0;
        for (let i = 0; i < this.auxilary.rowPrice.length; i++) {
            if (this.auxilary.rowPrice[i].row === rowName) {
                // alreadyExists = true;
                this.auxilary.rowPrice[i].price = price;
                console.log(this.auxilary.rowPrice)
                this.setState({ rowPrice: this.auxilary.rowPrice })
                return;
            }
        }

        this.auxilary.rowPrice.push({ row: rowName, price: price });
        this.setState({ rowPrice: this.auxilary.rowPrice })
        console.log(this.auxilary.rowPrice)
    }

    makeDisable = (chairNumber) => {
        console.log("inside make disable", typeof chairNumber)
        let board = this.state.board;
        console.log(board)
        let updatedBoard = [];
        for (let row = 0; row < board.length; row++) {
            let rowItem = board[row];
            console.log('rowitem', rowItem)
            for (let col = 0; col < rowItem.length; col++) {
                if (rowItem[col].chair === chairNumber) {
                    console.log("YES MATCHED")
                    rowItem[col].availability = false;
                }
            }
            updatedBoard.push(rowItem);
        }

        console.log("Updated Board ", updatedBoard)
        this.setState({ board: updatedBoard })

        this.auxilary.board = updatedBoard;

    }

    makeEnable = (chairNumber) => {
        console.log("inside make disable", typeof chairNumber)
        let board = this.state.board;
        console.log(board)
        let updatedBoard = [];
        for (let row = 0; row < board.length; row++) {
            let rowItem = board[row];
            console.log('rowitem', rowItem)
            for (let col = 0; col < rowItem.length; col++) {
                if (rowItem[col].chair === chairNumber) {
                    console.log("YES MATCHED")
                    rowItem[col].availability = true;
                }
            }
            updatedBoard.push(rowItem);
        }

        console.log("Updated Board ", updatedBoard)
        this.setState({ board: updatedBoard })
        this.auxilary.board = updatedBoard;

    }

    makeOnline(board,pricing){
        console.log(board);
        console.log(pricing);
    }

    render() {



        return (<div className='container'>
            <label>Enter a layout:</label>
            <input type="text" placeholder='13X11' onChange={(event) => {

                this.setState({ layout: event.target.value })
            }} />
            <input type="text" placeholder='Theatrename' />
            <button onClick={this.generateLayout}>Generate Layout</button>

            {this.state.board.map((item, index) => {
                return (<ul>
                    <div>{item.map((rowitem, index1) => {
                        return (
                            <label>
                                {index1 === 0 ? <label onClick={() => {
                                    this.setRowPrice(this.auxilary.alpha[index])
                                }} className='badge badge-warning' style={{ height: 20, width: 20, marginTop: 20 }}>{this.auxilary.alpha[index]}</label> : null}
                                {rowitem.availability === true ? (<button className='btn btn-primary' onClick={() => {
                                    this.makeDisable(rowitem.chair)
                                }} style={{ margin: 20 }}>{rowitem.chair}</button>) : (<button className='btn btn-danger' onClick={() => {
                                    this.makeEnable(rowitem.chair)
                                }} style={{ margin: 20 }}>{rowitem.chair}</button>)}
                            </label>
                        )
                    })}</div>
                </ul>)
            })}

            <hr />
            {this.state.rowPrice.length > 0 ?
                <div>
                    <label>Theatre Summary:</label>
                    {this.state.rowPrice.map(item => {
                        return <div>
                            <label>Row Name:{item.row} | Price Per Seat : {item.price} </label>
                        </div>
                    })}
                </div> : null}


            <hr />

          { this.state.onlineButton? <button className='btn btn-info' onClick={()=>{
            this.makeOnline(this.auxilary.board,this.auxilary.rowPrice)
          }}>Make my theatre online</button>:null}

        </div>);


    }


}