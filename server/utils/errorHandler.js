import fs from "fs";
import moment from "moment";

export default async (req, res, next) => {
    res.error = (status, message, internMessage = "") => {
        message = JSON.stringify({ error: message });
        if (internMessage) {
            let time = moment().format("DD-MM-YYYY HH:mm:ss");
            let log = `${time}: errorMessage - ${
                internMessage.message
            }, name - ${internMessage.name} `;
            fs.appendFile("server.log", log + "\n", err => {});
        }
        res.status(status).send(message);
    };
    next();
};
