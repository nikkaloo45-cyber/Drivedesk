# Uso Alpine in modo che il container non pesi troppo
FROM node:22-alpine
# Creo la cartella di lavoro app
WORKDIR /app
# Copio solo la lista delle librerie di package.json
COPY package.*json ./
# Installo le librerie dentro il container. Sfrutto il caching di Dockerfile:
# Se modifico il codice ma non aggiungo nuove librerie, salto l'installazione (npm install) e uso la memoria cache
RUN npm install
# Copio il resto del codice sorgente
COPY . .
# Espongo la porta 5173
EXPOSE 5173
# Avvio il server
CMD ["npm", "run", "dev"]
