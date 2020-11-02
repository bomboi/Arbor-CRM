// import React, { Component, useState } from 'react'
// import { connect } from 'react-redux'
// import { Modal, Row, Input, Col, InputNumber } from 'antd';
// import Axios from 'axios';


// const EditMultipleProducts = (props) => {
        
//     const [product, setProduct] = useState({});

//     const addProduct = () => {
//         if(product.name !== undefined && product.price !== undefined) {
//             Axios.post('/api/product/add', product)
//                 .then(res => {
//                     console.log(res)
//                     props.dispatch(addProducts(res.data))
//                     props.dispatch(toggleShowModal('AddProduct'))
//                 })
//         }
//     }

//     const onCancel = () => {
//         props.dispatch(toggleShowModal('AddProduct'))
//     }

//     return (
//         <Modal
//         title = "Dodaj proizvod"
//         destroyOnClose
//         visible = {props.visible}
//         closable = {false}
//         maskClosable = {false}
//         okText = "Dodaj"
//         onOk = {addProduct}
//         cancelText = "Zatvori"
//         onCancel = {onCancel}>
//           <Row gutter={[20,10]}><Col flex={'auto'}>
//               <Input onChange={e=>{product.name=e.target.value; setProduct(product)}} placeholder="Naziv proizvoda"/>
//           </Col></Row>
//           <Row gutter={[20,10]}><Col flex={'auto'}>
//               <InputNumber onChange={e=>{product.price=e; setProduct(product)}} className='w-100' placeholder="Cena"/>
//               </Col></Row>
//           <Row gutter={[20,10]}><Col flex={'auto'}>
//               <InputNumber onChange={e=>{product.material=e; setProduct(product)}} className='w-100' placeholder="Kolicina stofa[m]"/>
//               </Col></Row>
//           <Row gutter={[20,10]}><Col flex={'auto'}>
//               <Input onChange={e=>{product.category=e.target.value; setProduct(product)}} placeholder="Kategorija"/>
//           </Col></Row>
//       </Modal>
//     )
// }

// const mapStateToProps = (state) => ({
    
// })

// const mapDispatchToProps = {
    
// }

// export default connect(mapStateToProps, mapDispatchToProps)(EditMultipleProducts)
