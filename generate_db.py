import sqlite3
import csv

def csv_to_sqlite(csv_path, db_path, table_name="players"):
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        headers = reader.fieldnames

        # Conexión a SQLite
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Crear la tabla con columnas como TEXT
        column_defs = ", ".join([f'"{col}" TEXT' for col in headers])
        cursor.execute(f'CREATE TABLE IF NOT EXISTS {table_name} ({column_defs})')

        # Limpiar la tabla si ya existe
        cursor.execute(f'DELETE FROM {table_name}')

        # Insertar filas
        for row in reader:
            placeholders = ", ".join(["?"] * len(headers))
            values = [row[col] for col in headers]
            cursor.execute(
                f'INSERT INTO {table_name} ({", ".join(headers)}) VALUES ({placeholders})',
                values
            )

        conn.commit()
        conn.close()
        print(f"✅ Base de datos '{db_path}' creada con la tabla '{table_name}'.")

# 🟢 Ruta a tu CSV y salida .db
csv_to_sqlite("players.csv", "players.db")
