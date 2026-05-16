require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");

const User = require("./models/User");

const CSV_FILE = "expiring_users.csv";

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

async function exportExpiringUsers() {

    try {

        // TODAY START TIME
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        // NEXT 6 DAYS
        const next6Days = new Date();

        next6Days.setDate(today.getDate() + 6);

        next6Days.setHours(23, 59, 59, 999);

        console.log("Finding users expiring between:");
        console.log(today);
        console.log(next6Days);

        // FIND USERS
        const users = await User.find({

            subscriptionExpiry: {
                $gte: today,
                $lte: next6Days
            }

        });

        console.log(`Found ${users.length} users`);

        // CSV HEADER
        let csvContent =
            "Name,Email,Phone Number,Subscription Expiry Date";

        // ADD USERS
        users.forEach(user => {

            csvContent += `\n"${user.name || ""}","${user.email || ""}","${user.phone || ""}","${user.subscriptionExpiry || ""}"`;

        });

        // OVERWRITE FILE
        fs.writeFileSync(CSV_FILE, csvContent);

        console.log("expiring_users.csv updated successfully");

        process.exit();

    } catch (error) {

        console.log(error);

    }

}

mongoose.connection.once("open", () => {

    exportExpiringUsers();

});