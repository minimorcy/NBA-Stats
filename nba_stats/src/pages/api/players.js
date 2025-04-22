import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../database/players.db');

let db;

export async function GET({ request }) {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search") || "";
    console.log("Buscando:", url.searchParams);

    if (!db) {
        db = await open({
        filename: dbPath,
        driver: sqlite3.Database
        });
    }

    try {
        const rows = await db.all(
        `SELECT * FROM players WHERE PLAYER_NAME LIKE ?`,
        [`%${searchQuery}%`]
        );

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error("Error al buscar jugadores:", err);
        return new Response(
        JSON.stringify({ message: 'Error interno del servidor' }),
        { status: 500 }
        );
    }
}

export async function POST({ request }) {
    const searchQuery = await request.json();

    console.log("Buscando:", searchQuery);

    if (!db) {
        db = await open({
        filename: dbPath,
        driver: sqlite3.Database
        });
    }

    try {
        const rows = await db.all(
        `SELECT * FROM players WHERE PLAYER_NAME LIKE ?`,
        [`%${searchQuery.search}%`]
        );

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error("Error al buscar jugadores:", err);
        return new Response(
        JSON.stringify({ message: 'Error interno del servidor' }),
        { status: 500 }
        );
    }
}