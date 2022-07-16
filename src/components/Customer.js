import axios from 'axios';
import React from 'react';
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001");
export default class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theatreName: '',
            layout: [],
            pricing: [],
            selected: [],
            total: 0,
            counter: 10
        };
        this.auxilary = {
            selected: [],
            layout: [],
            pricing: [],
            alpha: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        };
    }


    loadTheatreLayout = () => {
        let name = this.state.theatreName;
        axios.post('http://localhost:3001/getTheatreInfo', { name: name }).then(data => {
            console.log("Data received from db", data)
            this.setState({ layout: data.data.seating })
            this.setState({ pricing: data.data.pricing })
            this.auxilary.layout = data.data.seating;
            this.auxilary.pricing = data.data.pricing;
        }).catch(err => {
            console.error("Error from db", err)
        })
    }

    selectChair = (chairno) => {
        console.log(this.auxilary.layout);

        const checkChairSelected = (chairno) => {
            let selectedchairs = this.auxilary.selected;
            for (let i = 0; i < selectedchairs.length; i++) {
                console.log(selectedchairs[i])
                if (selectedchairs[i].chairno === chairno) {
                    return true;
                }
            }
        };

        const calculateTotal = (items) => {
            let total = 0;

            for (let i = 0; i < items.length; i++) {
                console.log(items[i].price)
                total += parseInt(items[i].price);
                console.log(items.price)
            }
            return total;
        }

        if (checkChairSelected(chairno)) {
            console.log("Already Selected Deselecting", chairno)
            this.auxilary.selected = this.auxilary.selected.filter((value) => {
                if (value.chairno !== chairno) {
                    return value;
                }
            });



            console.log(this.auxilary.selected);
            this.setState({ selected: this.auxilary.selected });
            this.setState({ total: calculateTotal(this.auxilary.selected) });
            return;
        }

        const findPrice = (pricingTable, rowName) => {
            console.log(pricingTable)
            for (let i = 0; i < pricingTable.length; i++) {
                if (pricingTable[i].row === rowName) {
                    return pricingTable[i].price;
                }
            }
        };

        for (let i = 0; i < this.auxilary.layout.length; i++) {
            let row = this.auxilary.layout[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j].chair === chairno) {
                    let rowName = this.auxilary.alpha[i];
                    console.log("Rowname found", rowName);
                    let price = findPrice(this.auxilary.pricing, rowName);
                    this.auxilary.selected.push({
                        chairno: chairno,
                        rowName: rowName,
                        price: price === undefined ? '0' : price
                    })
                    this.setState({ selected: this.auxilary.selected });
                    this.setState({ total: calculateTotal(this.auxilary.selected) });
                    console.log(this.auxilary.selected)
                }
            }
        }

        let count = 10;
        let intervalRef = setInterval(() => {
            count--;
            if (count === 0) {
                this.setState({ layout: [] })
                this.setState({ pricing: [] })
                this.setState({ selected: [] })
                this.setState({ total: 0 })
                this.auxilary.layout = [];
                this.auxilary.pricing = [];
                this.auxilary.selected = [];
                clearInterval(intervalRef);
            }
            else {
                this.setState({ counter: count });
            }
        }, 1000);

    }


    bookTickets = () => {
        console.log(this.state.selected);
        axios.post('http://localhost:3001/bookTickets', { selected: this.state.selected, theatreName: this.state.theatreName }).then(data => {
            console.log(data)
            socket.emit("alertAllClients", { selected: this.state.selected });
            this.setState({ layout: [] })
            this.setState({ pricing: [] })
            this.setState({ selected: [] })
            this.setState({ total: 0 })
            this.auxilary.layout = [];
            this.auxilary.pricing = [];
            this.auxilary.selected = [];
        }).catch(err => {
            console.log(err)
        });

    }

    componentDidMount = () => {
        socket.on("serverUpdate", (data) => {
            console.log(data)
            let selected = data.selected;
            let chairsselected = [];
            for (let i = 0; i < selected.length; i++) {
                chairsselected.push(selected[i].chairno);
            }
            console.log(chairsselected);
            let newLayout = [];
            console.log("Auxilary Layout", this.auxilary.layout)
            for (let i = 0; i < this.auxilary.layout.length; i++) {
                let row = this.auxilary.layout[i];
                let newRow = [];
                for (let j = 0; j < row.length; j++) {
                    if (!chairsselected.includes(row[j].chair)) {
                        newRow.push({ chair: row[j].chair, availability: row[j].availability });
                    }
                    else {
                        newRow.push({ chair: row[j].chair, availability: false });
                    }
                }
                newLayout.push(newRow);
            }
            console.log("NewLayout", newLayout);
            this.setState({ layout: newLayout });
            this.auxilary.layout = newLayout;
        });
    }

    render() {
        return (
            <div className='container'>
                <input type="text" placeholder='Enter theatre' style={{ margin: 20 }} onChange={(event) => {
                    this.setState({ theatreName: event.target.value })
                }} />
                <button className='btn btn-primary' onClick={() => {
                    console.log(this.state.theatreName)
                    this.loadTheatreLayout();
                }} >Search</button>

                <hr />
                {
                    this.state.layout.map((item, index) => {
                        return (
                            <div>
                                {item.map((rowitem, index) => {
                                    return (rowitem.availability ? <button onClick={() => {
                                        this.selectChair(rowitem.chair)
                                    }} className='btn btn-primary' style={{ margin: 20 }} >{rowitem.chair}</button> :
                                        <button onClick={() => {
                                            alert("This seat cannot be booked ")
                                        }} className='btn btn-danger' style={{ margin: 20 }} >{rowitem.chair}</button>)
                                })}
                            </div>
                        )
                    })
                }
                <hr />

                {this.state.selected.length > 0 ? <div>
                    <div>Selected Summary
                    </div>
                    <div>Time Remaining: {this.state.counter} seconds</div>
                </div> : null}
                {
                    this.state.selected.map(item => {
                        return (<div>
                            <label>Chairno: {item.chairno} Price: {item.price}</label>
                        </div>)
                    })

                }

                {this.state.selected.length > 0 ? <div>
                    <label>Total :{this.state.total}</label>
                </div> : null}



                <hr />


                {this.state.selected.length > 0 ? <button className='btn btn-info'
                    onClick={() => {
                        this.bookTickets()
                    }}
                >Book Tickets</button> : null}
            </div>
        );
    }
};