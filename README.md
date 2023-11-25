# sent-birthday
To automate sending birthdays via email by doing some requests to the API Service.

Using tech stack consists of 
- ExpressJS for the nodeJS library
- MomentJS to handle the hour, date, and time
- Sequelize for the MySQL ORM
- Nodemon to hot reload on development
- Node-cron for the cron job

The API was already manually tested using Postman

Constraint and To Do
- Unit test if needed
- Fix bug on user creation (the hour time is a bit affecting the scheduler)
- e-mail column on person table

Thank You 😁
