FROM node:10

# Create app directory
WORKDIR /app 


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY functions/package.json functions/package-lock.json firebase.json /app/

RUN npm install 
# If you are building your code for production
# RUN npm ci --only=production
#RUN npm install firebase-admin
#RUN npm install -g firebase-tools
#RUN npm install express
#RUN npm install cors

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "functions/server/index.js" ]