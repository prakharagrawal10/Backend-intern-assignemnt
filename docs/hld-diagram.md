# High Level Design (HLD) Diagram

Below is a simple architecture diagram for the Leave Management System:

```
+-----------+        HTTP        +-----------+        SQL        +-----------+
|  Client   | <---------------> |  Express  | <---------------> |  SQLite   |
| (Postman, |   REST API Calls  |  Backend  |   DB Queries      |  DB File  |
| Swagger)  |                   |           |                   |           |
+-----------+                   +-----------+                   +-----------+
```

- **Client**: Any REST client (Postman, Swagger UI, or a frontend app)
- **Express Backend**: Handles API requests, business logic, and validation
- **SQLite DB**: Stores employees and leave requests

## API & DB Interaction
- API receives request → Validates input & business rules → Reads/writes to DB → Returns response

## Scaling
- For 500+ employees, migrate from SQLite to PostgreSQL/MySQL
- Use connection pooling, caching, and deploy backend on scalable platforms

---

*You can convert this diagram to an image for your submission if required.*
