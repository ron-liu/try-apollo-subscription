FROM keymetrics/pm2

# copy files
WORKDIR /server
COPY package.json pm2.json index.js pubsub.js schema.js  /server/

# fetch packages
RUN npm config set registry "https://registry.npm.taobao.org"
RUN npm install --production=false
RUN npm run build

# start serving
CMD [ "pm2-docker", "start", "pm2.json" ]

# to build docker run the following command on your local machine
# docker build -t apollo-sub .
# docker run -d -p 3001:3001 --name apollo-sub apollo-sub
