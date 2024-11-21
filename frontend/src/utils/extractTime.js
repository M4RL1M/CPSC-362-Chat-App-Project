export function extractTime(dateString) {
    const date = new Date(dateString);

    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = padZero(hours);
    
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes} ${ampm}`;
}

function padZero(number) {
    return number.toString().padStart(2, "0");
}