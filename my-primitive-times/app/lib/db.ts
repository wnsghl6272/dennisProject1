// db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'dennis1',
  host: '13.53.203.150',
  database: 'junwebserver',
  password: 'fkdla90',
  port: 5432, // default PostgreSQL port
});

export default pool;