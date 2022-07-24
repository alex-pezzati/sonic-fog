## How to Deploy to Heroku

1. Create a new project on Heroku
2. Under Resources click "Find more add-ons" and add the add on called "Heroku Postgres"
3. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line)
4. Run

   ```bash
   heroku login
   ```

5. Login to the heroku container registry

   ```bash
   heroku container:login
   ```

6. Update the `REACT_APP_BASE_URL` variable in the Dockerfile.
   This should be the full URL of your Heroku app: i.e. "https://flask-react-aa.herokuapp.com"
7. Push your docker container to heroku from the root directory of your project.
   This will build the dockerfile and push the image to your heroku container registry

   <!-- {NAME_OF_HEROKU_APP} = sonic-fog -->

   ```bash
   heroku container:push web -a sonic-fog
   ```

8. Release your docker container to heroku

   <!-- {NAME_OF_HEROKU_APP} = sonic-fog -->

   ```bash
   heroku container:release web -a sonic-fog
   ```

9. Set up your database:

   <!-- {NAME_OF_HEROKU_APP} = sonic-fog -->

   ```bash
   heroku run -a sonic-fog flask db upgrade
   heroku run -a sonic-fog flask seed all
   ```

10. Under Settings find "Config Vars" and add any additional/secret .env variables.
