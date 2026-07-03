import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "data", "users.json");
const BOOKINGS_FILE = path.join(__dirname, "data", "bookings.json");

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export const usersDb = {
  findByEmail(email) {
    return readJSON(USERS_FILE).find((u) => u.email === email);
  },
  findById(id) {
    return readJSON(USERS_FILE).find((u) => u.id === id);
  },
  insert(user) {
    const users = readJSON(USERS_FILE);
    users.push(user);
    writeJSON(USERS_FILE, users);
    return user;
  }
};

export const bookingsDb = {
  byUser(userId) {
    return readJSON(BOOKINGS_FILE)
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  byId(id) {
    return readJSON(BOOKINGS_FILE).find((b) => b.id === id);
  },
  insert(booking) {
    const bookings = readJSON(BOOKINGS_FILE);
    bookings.push(booking);
    writeJSON(BOOKINGS_FILE, bookings);
    return booking;
  }
};
