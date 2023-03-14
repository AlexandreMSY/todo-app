<a name="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h1 align="center">Todo App</h1>

  <p align="center">
    A todo manager built with React.JS
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#database-tables">Database Tables</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Product Name Screen Shot](https://alexandremsubs.nimbusweb.me/box/attachment/8478741/1s2cwxz8pwyf2gnfbdli/JF655P68g3Xdb0CT/screenshot-127.0.0.1_5173-2023.03.14-06_52_27.png)

<p>I've made this project in order to put what i learnt watching front-end and back-end tutorials in pratice.</p>

<p>This is a CRUD based web application, featuring a back-end API made with <strong>Node.JS</strong> and <strong>Express</strong> which connects to a <strong>PostgreSQL</strong> database. It also features a front-end page built using <strong>React.JS</strong> and it is fully responsive.</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
* ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=black)
* ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=black)
* ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=black)
* ![Node.JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=black)
* ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=black)
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Follow the instructions in order to get the project running locally.

### Prerequisites

* [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repo
```sh
  git clone https://github.com/AlexandreMSY/todo-app.git
```

2. Install the server dependencies
```sh 
  cd server
  npm install
```

3. Install the client dependencies
```sh 
  cd client
  npm install
```

4. Create an .env file inside the 'server' folder with your database credentials
```sh 
  DB_USER = 
  DB_PORT = 
  DB_HOST = 
  DB_DATABASE = 
  DB_PASSWORD = 
```

5. Start the React page
```sh 
  npm run dev
```

### Database Tables
This application requires the following database tables in order to work

#### User Details

```sh
                      Table "public.user_details"
  Column  |          Type          | Collation | Nullable | Default
----------+------------------------+-----------+----------+---------
 hostname | character varying(100) |           | not null |
 uuid     | uuid                   |           | not null |
Indexes:
    "user_details_pkey" PRIMARY KEY, btree (uuid)
Referenced by:
    TABLE "task" CONSTRAINT "task_uuid_fkey" FOREIGN KEY (uuid) REFERENCES user_details(uuid)
```

#### Task

```sh 
                                         Table "public.task"
    Column    |          Type          | Collation | Nullable |                Default
--------------+------------------------+-----------+----------+---------------------------------------
 task_name    | character varying(100) |           | not null |
 date_created | date                   |           | not null |
 uuid         | uuid                   |           | not null |
 task_id      | bigint                 |           | not null | nextval('task_task_id_seq'::regclass)
 due_date     | date                   |           | not null |
Indexes:
    "task_pkey" PRIMARY KEY, btree (task_id)
Foreign-key constraints:
    "task_uuid_fkey" FOREIGN KEY (uuid) REFERENCES user_details(uuid)

```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->


<!-- ROADMAP -->
## Roadmap

- [X] API
- [X] Responsible Interface
- [ ] Advanced query option.

See the [open issues](https://github.com/AlexandreMSY/todo-app/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->


<!-- CONTACT -->
## Contact

Alexandre Massao S. Ygei - [Linkedin](https://www.linkedin.com/in/alexandremassao/) - alexandremsubs@gmail.com

Project Link: [https://github.com/AlexandreMSY/todo-app](https://github.com/AlexandreMSY/todo-app)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
