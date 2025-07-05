import dotenv from "dotenv";
dotenv.config();
import { Client  } from "pg";

let client;

export async function connectToDB() {
  if (!client) {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      application_name: "$ BiteSpeed"
    });

    try {
      await client.connect();
      console.log('Connected to the database');
    } catch (err) {
      console.log(`Error connecting to the database: ${err}`);
      throw err;
    }
  }
  return client;
}

export async function executeQuery(query, params ) {
  const client = await connectToDB();
  try {
    const result = await client.query(query, params );
    return result;
  } catch (err) {
    console.log(`Error executing query: ${err}`);
    throw err;
  }
}

export async function disconnectDB() {
  if (client) {
    try {
      await client.end();
      console.log('Disconnected from the database');
    } catch (err) {
      console.log(`Error disconnecting: ${err}`);
    }
  }
}

// module.exports = { connectToDB, executeQuery, disconnectDB };
