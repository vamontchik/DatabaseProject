FROM node:alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts

# add app
COPY . ./

# start app
CMD ["npm", "start", "--verbose"]
