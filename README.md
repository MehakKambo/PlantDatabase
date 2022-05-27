# API

A running PostgreSQL server on port 5432 is required to run the application. A user and a database
must be created in order for the API to connect to the PostgreSQL server; to create one, run the
following commands in the database:
```sql
CREATE USER plantdb PASSWORD 'plantdb';
CREATE DATABASE plantdb;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO plantdb;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO plantdb;
GRANT ALL PRIVILEGES ON DATABASE plantdb TO plantdb;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO plantdb;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO plantdb;
```

To set up the API project, run the following commands in this folder:

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Then use `flask run` to run the application. The API will be accessible on your local computer on `http://localhost:5000`.
Ensure that the database is running locally on port 5432 before making requests to the API.