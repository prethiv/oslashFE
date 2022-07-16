import React from 'react';

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    generateLayout=()=>{
        
    }


    render() {



        return (<div className='container'>
            <label>Enter a layout:</label>
            <input type="text" placeholder='13X11' />
            <button onClick={this.generateLayout}>Generate Layout</button>
        </div>);


    }


}