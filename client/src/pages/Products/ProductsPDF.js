import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd';

import ReactToPrint from 'react-to-print';

export class ComponentToPrint extends React.Component {

    render() {
        return (
            <div>
                <h3>Cenovnik</h3>
                <table width="100%">
                    <thead>
                    <th>Naziv</th>
                    <th>Cena</th>
                    <th>Gotovinsko</th>
                    <th>Kolicina materijala</th>
                    <th>Kategorija</th>
                    </thead>
                    <tbody>
                        {this.props.products.map(item => 
                            <tr>
                                <td>{item.productName}</td>
                                <td>{item.price}</td>
                                <td>{item.price}</td>
                                <td>{item.materialLength?item.materialLength:'/'}</td>
                                <td>{item.category?item.category:'/'}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}


export const ProductsPDF = (props) => {

    const componentRef = useRef();

    return (
        <div className="d-inline">
            <ReactToPrint
                trigger={() => <Button>Stampaj</Button>}
                content={() => componentRef.current}
            />
            <div style={{ display: "none" }}>
                <ComponentToPrint products={props.products} ref={componentRef} />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    visible: state.modal.show.ProductsPDF,
    products: state.products
})

export default connect(mapStateToProps)(ProductsPDF)
