<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/alex-pezzati/sonic-fog">
    <img src="https://raw.githubusercontent.com/alex-pezzati/sonic-fog/main/react-app/public/favicon.ico" alt="Logo" width="100" height="80">
  </a>

  <h2 align="center" id="readme">Sonic Fog</h2>

  <p align="center">
    A Clone of SoundCloud
    <br />
    ·
    <a href="https://sonic-fog.herokuapp.com/">Live Link</a>
    ·
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ul>
    <li>
      <a href="#about-the-project">About The Project</a>
    <li>
      <a href="#languages-and-technologies">Languages and Technologies</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>

  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Sonic Fog is a full stack application incorporating React and Redux on the frontend with Flask, SQLAlchemy and PostgreSQL on the backend. The app uses AWS S3 to store all song and photo data while serializing data to store in PostgreSQL. It also has a functioning wave form music player 🎧.

### Languages and Technologies

- [Javascript](https://nodejs.org/en/)
- [Python](https://www.python.org/)
- [React](https://reactjs.org/docs/getting-started.html)
- [Redux](https://redux.js.org/)
- [Flask](https://flask.palletsprojects.com/en/2.1.x/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Pydub](http://pydub.com/)
- [AWS S3](https://docs.aws.amazon.com/s3/index.html)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<!-- USAGE EXAMPLES -->

## Usage

This app is meant to incorporate Flask and React into a clone of the popular music streaming application.

_For more terms, please refer to the [SoundCloud](https://soundcloud.com)_

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/alex-pezzati/sonic-fog/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

> ## Contributing
>
> Although contributions are what make the open source community such an amazing community to be appart of, any contributions you make are **greatly appreciated**, but will not be commited to the master branch.

<br/>

1. Clone this repository (only this branch)

   ```bash
   git clone https://github.com/alex-pezzati/Sound_Cloud.git
   ```

2. Install dependencies

   ```bash
   pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
   ```

3. Create a **.env** file based on the example with proper settings for your
   development environment
4. Setup your PostgreSQL user, password and database and make sure it matches your **.env** file

5. Get into your pipenv, migrate your database, seed your database, and run your flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

6. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.

<!-- LICENSE -->

## License

For educational purposes only!!!

<!-- CONTACT -->

## Contact

Alex Pezzati - [@LinkedIn](https://www.linkedin.com/in/alex-pezzati/) - email

Jamie Kichuk - [@LinkedIn](https://www.linkedin.com/in/jamie-kichuk-45778068/) - [@Website](https://www.raymondmay.com/) - jckichuk@gmail.com

Raymond-Arthur May - [@LinkedIn](https://www.linkedin.com/in/coderay/) - [@Website](https://www.raymondmay.com/) - raymond@raymondmay.com

Project Live Link; [https://www.sonic-fog.herokuapp.com](https://github.com/alex-pezzati/sonic-fog)

Project Link: [https://github.com/alex-pezzati/sonic-fog](https://github.com/alex-pezzati/sonic-fog)
