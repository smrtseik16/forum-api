const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

const sortedAsc = (arr) => {
    return arr.sort(
        (objA, objB) => Number(Date.parse(objA.date_created)) - Number(Date.parse(objB.date_created)),
    );
}

const sortedDesc = (arr) => {
    return arr.sort(
        (objA, objB) => Number(Date.parse(objB.date_created)) - Number(Date.parse(objA.date_created)),
    );
}

export { giveCurrentDateTime, sortedAsc, sortedDesc};