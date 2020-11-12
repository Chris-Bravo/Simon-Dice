export function saveData (key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
}

export function getDataFor (key) {
    const data = window.localStorage.getItem(key);
    const parsedData = JSON.parse(data);

    return parsedData;
}