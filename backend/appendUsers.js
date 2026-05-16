require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");

const User = require("./models/User"); // adjust path if needed

const CSV_FILE = "users_master.csv";

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

async function appendNewUsers() {

    const existingEmails = new Set();

    // STEP 1: Read existing CSV emails
    if (fs.existsSync(CSV_FILE)) {

        await new Promise((resolve) => {

            fs.createReadStream(CSV_FILE)
                .pipe(csv())
                .on("data", (row) => {

                    if (row.Email) {
                        existingEmails.add(row.Email.trim().toLowerCase());
                    }

                })
                .on("end", resolve);

        });

    }

    // STEP 2: Fetch MongoDB users
    const users = await User.find({}, "name email phone subscriptionExpiry");

    // STEP 3: Filter only NEW users
    const newUsers = users.filter(user => {

        if (!user.email) return false;

        return !existingEmails.has(
            user.email.trim().toLowerCase()
        );

    });

    // STEP 4: Append new users
    if (newUsers.length > 0) {

        const rows = newUsers.map(user => {

            return `\n"${user.name || ""}","${user.email || ""}","${user.phone || ""}","${user.subscriptionExpiry || ""}"`;

        }).join("");

        fs.appendFileSync(CSV_FILE, rows);

        console.log(`${newUsers.length} new users appended`);

    } else {

        console.log("No new users found");

    }

    process.exit();
}

appendNewUsers();