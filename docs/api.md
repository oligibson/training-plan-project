FORMAT: 1A
HOST: https://trainingplanserver.heroku.com/docs

# Training Plan API's

Insert further description here...

```http
Authorization: bearer 5262d64b892e8d4341000001
```

## Subtitle

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id lacus in mi pretium rutrum sit amet ac dui. Integer ac nulla quis lacus venenatis sollicitudin. In lectus ex, pretium sed arcu eu, mattis tristique mauris. Vestibulum tincidunt aliquam libero, nec lacinia ante volutpat a. Sed fringilla cursus aliquet. Praesent in lorem iaculis, condimentum ipsum sit amet, mollis quam. Aliquam congue ipsum nunc, a sodales arcu cursus eget.

# Group Auth
Group description (also with *Markdown*)

## Login [/auth/login]

### Login [POST]
Login registered user

+ Request

    + Headers

            Content-Type: application/json

    + Body

            {
                "email": "john.doe@gmail.com",
                "password": "password"
            }

+ Response 200

    + Headers

            Content-Type: application/json

    + Body

            {
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGM3OWQ2NmVjZDJkNzAzMDA5ZDg4NzEiLCJpYXQiOjE0MjI3Mjk3NDA4MjMsImV4cCI6MTQyMjc0Nzc0MDgyM30.3tAFGQywhUhANTxZ0Tyut20aPSL6IhxiVPRwHgokY-s",
                "user": {
                    "_id": "54c79d66ecd2d703009d8871",
                    "email": "john.doe@gmail.com",
                    "__v": 0,
                    "role": "user",
                    "sessionsThisWeek": 0,
                    "sessionsTotal": 0,
                    "emailUpdates": true,
                    "lname": "Doe",
                    "fname": "John"
                }
            }

+ Response 401

    + Headers

            Content-Type: application/json

    + Body

            {
                "message": "This password is not correct."
            }


# Group Users
Group description (also with *Markdown*)

## User List [/api/users]

+ Model

    + Headers

            Content-Type: application/json,
            X-Auth-Token: "xxxx"

    + Body

            [
                {
                    "_id":"54c79d66ecd2d703009d8871",
                    "email":"john.doe1@gmail.com",
                    "__v":0,
                    "role":"user",
                    "sessionsThisWeek":0,
                    "sessionsTotal":0,
                    "emailUpdates":false,
                    "lname":"Doe",
                    "fname":"John"
                },
                {
                    "_id":"54c79d66ecd2d703009d8871",
                    "email":"john.doe1@gmail.com",
                    "__v":0,
                    "role":"user",
                    "sessionsThisWeek":0,
                    "sessionsTotal":0,
                    "emailUpdates":false,
                    "lname":"Doe",
                    "fname":"John"
                }
            ]

### Get Users [GET]
Get a list of all users.

+ Response 200

    [User List][]

### Create New User [POST]
Create a new user

+ Request

    + Headers

            Content-Type: application/json

    + Body

            {
                "fname": "John",
                "lname": "Doe",
                "email": "john.doe@gmail.com",
                "password": "password",
                "emailUpdates": "true"
            }

+ Response 200

    + Headers

            Content-Type: application/json

    + Body

            {
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGM3OWQ2NmVjZDJkNzAzMDA5ZDg4NzEiLCJpYXQiOjE0MjI3Mjk3NDA4MjMsImV4cCI6MTQyMjc0Nzc0MDgyM30.3tAFGQywhUhANTxZ0Tyut20aPSL6IhxiVPRwHgokY-s",
                "user": {
                    "_id": "54c79d66ecd2d703009d8871",
                    "email": "john.doe@gmail.com",
                    "__v": 0,
                    "role": "user",
                    "sessionsThisWeek": 0,
                    "sessionsTotal": 0,
                    "emailUpdates": true,
                    "lname": "Doe",
                    "fname": "John"
                }
            }

+ Response 400

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": "Some required parameters were not found. See documentation."
            }

## User [/api/users/{id}]

+ Parameters

    + id (required, string, `54c79d66ecd2d703009d8871`) ... The users ID

+ Model

    + Headers

            Content-Type: application/json,
            X-Auth-Token: "xxxx"

    + Body

            {
                "_id":"54c79d66ecd2d703009d8871",
                "email":"john.doe1@gmail.com",
                "__v":0,
                "role":"user",
                "sessionsThisWeek":0,
                "sessionsTotal":0,
                "emailUpdates":false,
                "lname":"Doe",
                "fname":"John"
            }

### Get User [GET]
Get a list of one user.

+ Response 200

    [User][]

### Update User [PUT]
Update a single user

+ Request

    + Headers

            Content-Type: application/json

    + Body

            {
                "title": "Grocery List (Safeway)"
            }

+ Response 200

    [User][]

+ Response 404

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": "User not found"
            }

### Delete User [DELETE]
Delete a single user

+ Response 204

+ Response 404

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": "Note not found"
            }

## Refresh User [/api/users/{id}/refresh]

+ Model

    + Headers

            Content-Type: application/json,
            X-Auth-Token: "xxxx"

    + Body

            {
                token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGM3OWQ2NmVjZDJkNzAzMDA5ZDg4NzEiLCJpYXQiOjE0MjI3Mjk3NDA4MjMsImV4cCI6MTQyMjc0Nzc0MDgyM30.3tAFGQywhUhANTxZ0Tyut20aPSL6IhxiVPRwHgokY-s",
            }

### Refresh User [GET]
Generate a new authentication token for the user.

+ Response 200

    [Refresh User][]

+ Response 404

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": "Note not found"
            }

## Change Password [/api/users/{id}/password]

+ Model

    + Headers

            Content-Type: application/json

    + Body

            {
              "oldPassword": "password",
              "newPassword": "pass"
            }

### Change Password [PUT]
Change a users password.

+ Request

    + Headers

            Content-Type: application/json,
            X-Auth-Token: "xxxx"

    + Body

            {
              "oldPassword": "password",
              "newPassword": "pass"
            }

+ Response 200

+ Response 401

    + Headers

            Content-Type: application/json

    + Body

            {
                "UnauthorizedError": "jwt expired"
            }

# Group Upload
Group description (also with *Markdown*)

## Photo Upload [/api/upload/profile/{id}]

+ Parameters

    + id (required, string, `54c79d66ecd2d703009d8871`) ... The users ID

+ Model

    + Headers

            Content-Type: application/json

    + Body

            {
                "_id":"54c79d66ecd2d703009d8871",
                "email":"john.doe1@gmail.com",
                "__v":0,
                "role":"user",
                "sessionsThisWeek":0,
                "sessionsTotal":0,
                "emailUpdates":false,
                "lname":"Doe",
                "fname":"John",
                mobileProfileImage: "http://res.cloudinary.com/trainingplan/image/upload/c_fill,g_face,h_140,w_140/v1420897958/whfkbpgsmk2m3gfxp2sy.jpg",
                profileImage: "http://res.cloudinary.com/trainingplan/image/upload/v1420897958/whfkbpgsmk2m3gfxp2sy.jpg",
                profileImageId: "whfkbpgsmk2m3gfxp2sy"
            }

### Upload User Photo [POST]
Add a user photo need to complete...

+ Request

    + Headers

            Content-Type: application/json

    + Body

            {
                "fname": "John",
                "lname": "Doe",
                "email": "john.doe@gmail.com",
                "password": "password",
                "emailUpdates": "true"
            }

+ Response 200

    [Photo Upload][]

+ Response 400

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": ""
            }

# Group Sessions
Group description (also with *Markdown*)

## Session List [/api/sessions]

+ Model

    + Headers

            Content-Type: application/json

    + Body

            [
                {
                    "_id":"54c79d66ecd2d703009d8871",
                    "email":"john.doe1@gmail.com",
                    "__v":0,
                    "role":"user",
                    "sessionsThisWeek":0,
                    "sessionsTotal":0,
                    "emailUpdates":false,
                    "lname":"Doe",
                    "fname":"John"
                },
                {
                    "_id":"54c79d66ecd2d703009d8871",
                    "email":"john.doe1@gmail.com",
                    "__v":0,
                    "role":"user",
                    "sessionsThisWeek":0,
                    "sessionsTotal":0,
                    "emailUpdates":false,
                    "lname":"Doe",
                    "fname":"John"
                }
            ]

### Get Sessions [GET]
Get a list of all sessions on service.

+ Response 200

    [Session List][]

### Create Session [POST]
Create a new session

+ Request

    + Headers

            Content-Type: application/json,
            X-Auth-Token: "xxxx"

    + Body

            {
                "fname": "John",
                "lname": "Doe",
                "email": "john.doe@gmail.com",
                "password": "password",
                "emailUpdates": "true"
            }

+ Response 200

    + Headers

            Content-Type: application/json

    + Body

            {
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGM3OWQ2NmVjZDJkNzAzMDA5ZDg4NzEiLCJpYXQiOjE0MjI3Mjk3NDA4MjMsImV4cCI6MTQyMjc0Nzc0MDgyM30.3tAFGQywhUhANTxZ0Tyut20aPSL6IhxiVPRwHgokY-s",
                "user": {
                    "_id": "54c79d66ecd2d703009d8871",
                    "email": "john.doe@gmail.com",
                    "__v": 0,
                    "role": "user",
                    "sessionsThisWeek": 0,
                    "sessionsTotal": 0,
                    "emailUpdates": true,
                    "lname": "Doe",
                    "fname": "John"
                }
            }

+ Response 400

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": "Some required parameters were not found. See documentation."
            }

## Session [/api/sessions/{id}]

+ Parameters

    + id (required, string, `54c79d66ecd2d703009d8871`) ... The session ID

+ Model

    + Headers

            Content-Type: application/json

    + Body

            {
                "_id":"54c79d66ecd2d703009d8871",
                "email":"john.doe1@gmail.com",
                "__v":0,
                "role":"user",
                "sessionsThisWeek":0,
                "sessionsTotal":0,
                "emailUpdates":false,
                "lname":"Doe",
                "fname":"John"
            }

### Get Session [GET]
Get a session.

+ Response 200

    [Session][]

### Update a Session [PUT]
Update a single session

+ Request

    + Headers

            Content-Type: application/json

    + Body

            {
                "title": "Grocery List (Safeway)"
            }

+ Response 200

    [Session][]

+ Response 404

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": "Session not found"
            }

### Delete Session [DELETE]
Delete a single session

+ Response 201

+ Response 404

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": "Session not found"
            }

## User Sessions [/api/sessions/user/{id}]

+ Parameters

    + id (required, string, `54c79d66ecd2d703009d8871`) ... The users ID

+ Model

    + Headers

            Content-Type: application/json,
            X-Auth-Token: "xxxx"

    + Body

            {
                token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NGM3OWQ2NmVjZDJkNzAzMDA5ZDg4NzEiLCJpYXQiOjE0MjI3Mjk3NDA4MjMsImV4cCI6MTQyMjc0Nzc0MDgyM30.3tAFGQywhUhANTxZ0Tyut20aPSL6IhxiVPRwHgokY-s",
            }

### Get All User Sessions [GET]
Get a list of all sessions for a user.

+ Response 200

    [User Sessions][]

+ Response 404

    + Headers

            Content-Type: application/json

    + Body

            {
                "error": "User not found"
            }
