const e = require("express");

let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = (e) => {
    const db = target.result;
    db.createOjectStore("pending", { autoIncrement: true });
};

request.onerror = (e) => {
    console.log('There was an error!');
};

request.onsuccess = (e) => {
    db = target.result;
    const tx = db.transaction(["pending"], "readwrite");
    const store = tx.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    const transaction = db.transaction(["pending"], "readwrite");

                    // access your pending object store
                    const store = transaction.objectStore("pending");

                    // clear all items in your store
                    store.clear();
                });
        }
    };
}

window.addEventListener("online");