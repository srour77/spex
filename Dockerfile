FROM node
WORKDIR /spex
COPY /src /spex/
COPY package.json /spex/
COPY .env /spex/
COPY tsconfig.json /spex/
RUN npm install
RUN npx prisma db pull
RUN npx prisma migrate dev
RUN npm run build
EXPOSE 2000
CMD ["node", "/spex/dist/server.js"]