import mysql from "mysql2/promise";

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vehicle_database",
  port: parseInt(process.env.DB_PORT || "3306"),
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
const pool = mysql.createPool(config);

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};

// Generic query execution function with error handling
export const executeQuery = async <T = any>(
  query: string,
  params: any[] = [],
): Promise<T[]> => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    console.error("Query:", query);
    console.error("Params:", params);
    throw new Error(
      `Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Execute transaction with multiple queries
export const executeTransaction = async (
  queries: { query: string; params: any[] }[],
): Promise<any[]> => {
  const connection = await pool.getConnection();
  const results: any[] = [];

  try {
    await connection.beginTransaction();

    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }

    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error("Transaction failed:", error);
    throw new Error(
      `Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  } finally {
    connection.release();
  }
};

// Get single record
export const executeQuerySingle = async <T = any>(
  query: string,
  params: any[] = [],
): Promise<T | null> => {
  const results = await executeQuery<T>(query, params);
  return results.length > 0 ? results[0] : null;
};

// Close pool connection
export const closeConnection = async (): Promise<void> => {
  try {
    await pool.end();
    console.log("Database connection pool closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
};

export default pool;
