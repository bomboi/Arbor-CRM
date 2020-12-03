import React from 'react'
import { Badge } from 'antd';

const Label = (props) => {
    let required = props.required === undefined ? false : props.required

    return (
    <p className='m-0 mt-1'>{props.text}</p>
    )
}

export default Label
