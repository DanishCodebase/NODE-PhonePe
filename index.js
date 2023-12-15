// const express = require('express');
// const fetch = require('node-fetch');
// const crypto = require('crypto');
import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

function generateTransactionId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return timestamp + randomStr;
}

function generateMerchantUserId() {
    return 'MUID' + Math.random().toString(36).substr(2, 9);
}

function sha256(str) {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
}

app.get("/", (req, res) => {
    res.sendFile("D:/Data Structure By love babbar/PhoneBackend/public/index.html");
});

app.post('/makePayment', async (req, res) => {
    try {
        // const { name, amount, number } = req.body;
        const name = req.body["name"];
        const amount = req.body["amount"];
        const number = req.body["number"];

        const merchantTransactionId = generateTransactionId();
        const merchantUserId = generateMerchantUserId();

        const merchant_id = 'M1KE7GMKEOEB';
        const salt_key = '56392f2a-82cd-47ec-a0e4-93a115181eb7';
        // const redirectUrl = 'http://127.0.0.1:5500/status.html'; // Replace with your redirect URL

        const data = {
            merchantId: merchant_id,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: merchantUserId,
            name: name,
            amount: amount * 100,
            redirectMode: 'POST',
            mobileNumber: number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');

        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256Hash = sha256(string);
        const checksum = sha256Hash + '###' + keyIndex;

        const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';

        const response = await fetch(prod_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            body: JSON.stringify({ request: payloadMain })
        });

        const responseData = await response.json();

        // Assuming responseData contains the URL to redirect
        const redirectURL = responseData.data.instrumentResponse.redirectInfo.url;

        // Redirect to the PhonePe payment portal
        res.redirect(redirectURL);
        // res.json(responseData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// // const express = require('express');
// import express from "express";
// // const fetch = require('node-fetch');
// import fetch from "node-fetch";
// // const crypto = require('crypto');
// import crypto from "crypto";

// const app = express();

// app.use(express.json());

// // Your functions for generating transaction ID and user ID
// function generateTransactionId() {
//     const timestamp = Date.now().toString(36);
//     const randomStr = Math.random().toString(36).substring(2, 15);
//     return timestamp + randomStr;
// }

// function generateMerchantUserId() {
//     return 'MUID' + Math.random().toString(36).substr(2, 9);
// }

// // Function for SHA-256 hashing
// function sha256(str) {
//     const hash = crypto.createHash('sha256');
//     hash.update(str);
//     return hash.digest('hex');
// }

// app.get("/", (req, res) => {
//     // console.log("working");
//     res.sendFile("D:/Data Structure By love babbar/PhoneBackend/public/index.html");
// });

// app.post('/makePayment', async (req, res) => {
//     try {
//         const { name, amount, number } = req.body;

//         const merchantTransactionId = generateTransactionId();
//         const merchantUserId = generateMerchantUserId();

//         const merchant_id = 'M1KE7GMKEOEB';
//         const salt_key = '56392f2a-82cd-47ec-a0e4-93a115181eb7';
//         const redirectUrl = 'http://127.0.0.1:5500/status.html'; // Replace with your redirect URL

//         const data = {
//             merchantId: merchant_id,
//             merchantTransactionId: merchantTransactionId,
//             merchantUserId: merchantUserId,
//             name: name,
//             amount: amount * 100,
//             redirectUrl: redirectUrl,
//             redirectMode: 'POST',
//             mobileNumber: number,
//             paymentInstrument: {
//                 type: 'PAY_PAGE'
//             }
//         };

//         const payload = JSON.stringify(data);
//         const payloadMain = Buffer.from(payload).toString('base64');

//         const keyIndex = 1;
//         const string = payloadMain + '/pg/v1/pay' + salt_key;
//         const sha256Hash = sha256(string);
//         const checksum = sha256Hash + '###' + keyIndex;

//         const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';

//         const response = await fetch(prod_URL, {
//             method: 'POST',
//             headers: {
//                 'accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-VERIFY': checksum
//             },
//             body: JSON.stringify({ request: payloadMain })
//         });

//         const responseData = await response.json();
//         res.json(responseData);
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
