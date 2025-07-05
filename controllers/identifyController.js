import { v4 as uuidv4 } from "uuid";
import { connectToDB, executeQuery, disconnectDB } from '../dbConnect.js';

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
}


export const identifyController = async (req, res) => {
    const { email, phonenumber } = req.body;
    if (!validateEmail(email)) {
        return res.status(400).send({ message: 'Please enter a valid email.' });
    }
    if (!validatePhoneNumber(phonenumber)) {
        return res.status(400).send({ message: 'Please enter a valid phone number.' });
    }

    let id, emails, phoneNumbers, secondaryContactIds;

    let response = await executeQuery(
        `SELECT * FROM contact WHERE phonenumber=$1 OR email=$2 ORDER BY contact.createdat;`, [phonenumber, email]
    );
    if (response.rows.length === 0) {
        id = uuidv4();
        await executeQuery(`INSERT INTO contact (id, phoneNumber, email, linkedid, linkprecedence, createdAt, updatedAt)
            VALUES ($1, $2, $3, NULL, 'primary', $4, $5);`, [id, phonenumber, email, new Date(), new Date()]);
        emails = [email];
        phoneNumbers = [phonenumber];
        secondaryContactIds = [];
    }
    else {
        if (response.rows[0].email === email && response.rows[0].phonenumber === phonenumber && response.rows.length === 1) {
            emails = [email];
            phoneNumbers = [phoneNumbers];
            secondaryContactIds = [];
        }
        else {
            if (response.rows[0].linkprecedence !== 'primary')
                await executeQuery(`UPDATE contact SET linkedid = NULL, linkprecedence = 'primary', updatedAt = $1 WHERE id = $2;`, [new Date(), response.rows[0].id]);
            emails = [...new Set(response.rows.map(row => row.email))];
            phoneNumbers = [...new Set(response.rows.map(row => row.phonenumber))];
            secondaryContactIds = response.rows.slice(1).map(row => row.id);
            secondaryContactIds.length > 0 && await executeQuery(`UPDATE contact SET linkedid = $1, linkprecedence = 'secondary', updatedAt = $2 WHERE id = ANY($3::uuid[]);`, [response.rows[0].id, new Date(), secondaryContactIds]);
            let sameEmailAndSamePhonenumberCheck = false;
            response.rows.some((row) => {
                if (row.email === email && row.phonenumber === phonenumber) {
                    sameEmailAndSamePhonenumberCheck = true;
                    return true;
                }
                return false;
            })
            if (!sameEmailAndSamePhonenumberCheck) {
                id = uuidv4();
                await executeQuery(`INSERT INTO contact (id, phoneNumber, email, linkedid, linkprecedence, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, 'secondary', $5, $6);`, [id, phonenumber, email, (response.rows[0].id), new Date(), new Date()]);
                secondaryContactIds = [...secondaryContactIds, id];
                emails = [...new Set([...emails, email])];
                phoneNumbers = [...new Set([...phoneNumbers, phonenumber])];
            }
        }
    }
    const responseJSON = {
        'contact': {
            "primaryContatctId": response.rows.length > 0 ? response.rows[0].id : id,
            emails,
            phoneNumbers,
            secondaryContactIds
        }
    }
    res.send(responseJSON)
}