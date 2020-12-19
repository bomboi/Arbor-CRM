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