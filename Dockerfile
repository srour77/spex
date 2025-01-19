FROM node
WORKDIR /spex
COPY /src /spex/src
COPY package.json /spex/
COPY .env /spex/
COPY tsconfig.json /spex/
RUN npm install
RUN npx prisma generate --schema=/spex/src/prisma/schema.prisma
RUN npm run build
EXPOSE 2000
CMD ["sh", "-c", "npx prisma migrate dev && node /spex/dist/server.js"]