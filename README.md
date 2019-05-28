# Prerequisites
Read the [Get Started with Docker](https://docs.docker.com/get-started/) tutorial to get an understanding of Docker and to install the necessary packages on your operating system.

You should only need to install Git, Docker and docker-compose for your operating system.

If your operating system is a...
* **Mac**: Install “[Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/)”. This comes with Docker Compose pre-installed.
* **Windows 10**: Install “[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/)”. This comes with Docker Compose pre-installed.
* **Older Mac and Windows Systems**: Install “[Docker Toolbox](https://docs.docker.com/toolbox/overview/)”. This comes with Docker Compose pre-installed.
* **Linux**:
  * Install “Docker Community Edition (CE)”. Go to this link: [About Docker CE](https://docs.docker.com/install/). Look for the “Linux” link in the left navigation panel. Find your Linux distro and follow the installation instructions for Docker CE.
  * Install [Docker Compose](https://docs.docker.com/compose/overview/).

# `make` Commands
Navigate to the project root folder (where the `Makefile` is located) the run the following `make` commands.


# TROUBLESHOOTING
## `ERROR: Pool overlaps with other one on this address space`
After running `make dev`, if you get the following error: `ERROR: Pool overlaps with other one on this address space`, then it means that some existing networks are conflicting with the network that you are trying to create. To remove those networks, run `docker network prune`. At this point, if `make dev` still does not work, then it might be because you still have existing containers that are still using the network. So you need to remove the containers first, then you can run `docker network prune`. Once the networks are removed, the `make dev` command should work.

Source: https://github.com/maxking/docker-mailman/issues/85#issuecomment-349429246


# DEVELOPMENT

## Run the app in a development environment
The `make dev` command will start the containers in development mode. If no containers exist, then this command will create new containers. Development mode means that the app will run and show all errors and messages in the terminal.
```
make dev
```
You can access the development app in a browser at `http://localhost:8080/`.

## Stop the development app
You can stop the containers with `Ctrl + C`. You will be put back in your host terminal where you can run Git commands or any other command.

## Access MongoDB Compass (the MongoDB GUI)
You will first need to install MongoDB Compass. Go to the [Download and Install Compass](https://docs.mongodb.com/compass/master/install/) page and select the tab for your operating system.

After you run the MongoDB container (with one of the `make` commands), you can open MongoDB Compass and access your database. You can use the default "Port" number `27017`. If that does not work, then try `27020`. Click "CONNECT".


NOTES:
* The port number that is used is the one that is configured in the `docker-compose.dev.yml` file.

## Rebuild the development images without cache
If you want to rebuild the images without using the cache, then run this command first, then run `make dev` to start the newly built development containers.
```
make dev-rebuild
```

## Run the development containers in daemon mode
To run the containers in the background (i.e., no terminal messages by default), run:
```
make dev-daemon
```

## Stop and delete the development containers
`make dev-down` will stop and delete any running containers. It deletes containers and networks, but not volumes and images.
```
make dev-down
```

## Using Vue CLI
The development image installs Vue CLI, so you can access Vue CLI commands by accessing a running container's terminal. While the development containers are running, open a new terminal window or tab and execute the following command:

```
docker container exec -it <container_name> bash
```

NOTES:
  * To get the container_name, run `docker container ls` and replace `<container_name>` with the name of the running container you are trying to access.
  * If you are using VSCode, you can also click on the Docker tab in the left column, right-click the container whose terminal you want to access and then select "Attach Shell" in the context menu. That will open an interactive terminal for that container in the VSCode terminal window.
  * FYI: Since the development image installs Vue CLI, you can use this image for new projects. Simply run the app container, then run `docker container exec -it <container name> bash` to access the container's terminal, then `vue create <app-name>`. Follow the prompts to create a new Vue app.

<!-- ---

# PRODUCTION

## Run the app in a production environment
Navigate to the root folder and run
```
make prod
```
You can access the production app in a browser at one of the following URLs:
* `http://localhost/`: This is obviously the easiest method to acces the production app.
* `http://172.28.1.1:4000/`: This uses the network IP address that is configured in the `docker-compose.prod.yml` file. Port `4000` is the port that the Node server is running on and you have to specify port `4000` in the URL if you use this method to access the app.
* `http://<docker host IP address>/`: If you use this URL on your computer, then the Docker host is your computer and you would use your computer's IP address.

## Rebuild the production images without cache
If you want to rebuild the images without using the cache, then run this command first, then run `make prod` to start the newly built production containers.
```
make prod-rebuild
```

## Run the production containers in daemon mode
To run the containers in the background (i.e., no terminal messages by default), run:
```
make prod-daemon
```

## Stop and delete the production containers
`make prod-down` will stop and delete any running containers. It deletes containers and networks, but not volumes and images.
```
make prod-down
``` -->

---

# Where are the MongoDB data stored on the host machine?
As an example, the `docker-compose.dev.yml` file is configured to mount the `mongodb_data_dev` volume in `mongodb_data_dev`. What does that mean? Where is `mongodb_data_dev` located?

Volumes are stored in a part of the host filesystem which is managed by Docker (`/var/lib/docker/volumes` on Linux). Non-Docker processes should not modify this part of the filesystem. Volumes are the best way to persist data in Docker.

To learn more, see [How docker volumes work](http://code4projects.altervista.org/how-docker-volumes-works/?doing_wp_cron=1546897783.1694519519805908203125).
