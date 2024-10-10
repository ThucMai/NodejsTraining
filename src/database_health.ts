// Use the Agenda set up a job check db connection every minute
import Agenda from "agenda";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoConnectionString = process.env.MONGODB_URI as string;

const agenda = new Agenda({
    db: { address: mongoConnectionString, collection: "agendaJobs_healthCheck" },
});

// Define the job to check the database connection
agenda.define("check database connection", async (job, done) => {
    console.log("Running job: check database connection");

    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Database connection is ok");
        } else {
            console.error("Database connection error");
        }
    } catch (error) {
        console.error("Error checking the database connection:", error);
    }

    done();
});

export const startAgendaJobs = async () => {
    await agenda.start();
    agenda.every("1 minute", "check database connection");
    console.log("Agenda job to check database connection started!");
};
