// import dotenv = require("dotenv")
// dotenv.config()

// import { connectDatabase } from "../src/database";

// const clear = async () => {
//     try {
//       console.log("[clear] : running...");
  
//       const db = await connectDatabase();

//       await db.bookings.clear();
//       await db.listings.clear();
//       await db.users.clear();

//       console.log("[clear] : success");
//     } catch {
//       throw new Error("failed to clear database");
//     }
//   };
  
// clear();

import { connectDatabase } from "../src/database";

const clear = async () => {
  try {
    console.log("[clear] : running...");

    const db = await connectDatabase();

    await db.bookings.clear();
    await db.listings.clear();
    await db.users.clear();

    console.log("[clear] : success");
  } catch {
    throw new Error("failed to clear database");
  }
};

clear();