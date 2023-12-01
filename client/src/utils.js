export const getTagColor = (value) => {
    switch(value){
        case 'poruceno': return 'magenta';
        case 'u izradi': return 'orange';
        case 'za isporuku': return 'green';
        case 'isporuceno': return 'blue';
        case 'reklamacija': return 'red';
        case 'arhivirano': return 'gray';
    }
} 

export const getPrimaryTagHEXColor = (value) => {
    switch(value){
        case 'poruceno': return '#eb2f95';
        case 'u izradi': return '#fa8c16';
        case 'za isporuku': return '#52c41a';
        case 'isporuceno': return '#1890ff';
        case 'reklamacija': return '#a01717';
        case 'arhivirano': return '#808080';
    }
} 

export const getSecondaryTagHEXColor = (value) => {
    switch(value){
        case 'poruceno': return '#fef1f6';
        case 'u izradi': return '#fff7e6';
        case 'za isporuku': return '#f6ffec';
        case 'isporuceno': return '#e6f7ff';
        case 'reklamacija': return '#ff9696';
        case 'arhivirano': return '#cdcdcd';
    }
} 