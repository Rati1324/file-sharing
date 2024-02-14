FROM node:14

WORKDIR /front-end

COPY ./package*.json /front-end
# COPY ./package.json /front-end

RUN npm install
# RUN npm rebuild esbuild

COPY . /front-end

# CMD ["npm", "run", "dev"]