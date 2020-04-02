import React, { useState, useEffect } from 'react';
import { formatToDate , formatTime} from '../../../../helpers-functions/dateFormatter';
import { connect } from 'react-redux';
import { getSalesHistory } from '../../../../actions/bittrexActions'



const SalesHistory = (props) => {
    console.log(props)

    useEffect(() => {
            props.getSalesHistory();
    }, [props.user])


    const [fakeData, setFakeData] = useState({
        data: [
            {
                date: Date.now(),
                numOfFlo: 43.324,
                amountOfFlo: 21,
                margin: 10,
                revenue: '20',
                link: '#'
            },
            {
                date: Date.now(),
                numOfFlo: 43.324,
                amountOfFlo: 21,
                margin: 10,
                revenue: '20',
                link: '#'
            },
            {
                date: Date.now(),
                numOfFlo: 43.324,
                amountOfFlo: 21,
                margin: 10,
                revenue: '20',
                link: '#'

            },
        ],
    });

    const renderTableData = () => {

        if(!props.saleHistory){
            return;
        }


        for(const k in props.saleHistory){
            let x = props.saleHistory[k]
            switch(x.Exchange){
                case 'BTC-FLO': {
                    return (
                        <tr key={x.OrderUuid}>
                        <td>{formatToDate(x.Closed) + ' ' + formatTime(x.Closed)}</td>
                        <td>{x.Quantity}</td>
                        <td>${x.Price}</td>
                        {/* <td>{margin}%</td>
                        <td>${revenue}</td> */}
                        {/* <td><a href={link}>view</a></td> */}
                        </tr>
                    )
                }
            }


        }





    };

    const renderTableHeader = () => {
        // let header = Object.keys(fakeData.students[0]);
        // return header.map((key, i) => {
        //     return <th key={i}>{key.toUpperCase()}</th>;
        // });

        return (
            <>
                <th scope="col">Completed On</th>
                <th scope="col"># of FLO</th>
                <th scope="col">$ per FLO</th>
                <th scope="col">Margin</th>
                <th scope="col">Revenue</th>
                <th scope="col">Explorer</th>
            </>
        );
    };

    return (
        <div className="card open-orders">
            <div className="card-header">Sales History</div>
            <div className="card-body">
                <table className="table table-bordered" id="open-orders">
                    <tbody>
                        <tr>{renderTableHeader()}</tr>
                        {renderTableData()}
                    </tbody>
                </table>
            <a href="#">Show More</a>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        error: state.error,
        user: state.auth.user,
        account: state.account,
        saleHistory: state.bittrex.salesHistory
    };
};


export default connect(mapStateToProps, {getSalesHistory})(SalesHistory);
