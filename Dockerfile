FROM alpine:3.11.2

ENV GLIBC_VERSION 2.30-r0

RUN apk add --update curl && \
    curl -Lo /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    curl -Lo glibc.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk" && \
    curl -Lo glibc-bin.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk" && \
    apk add glibc-bin.apk glibc.apk && \
    /usr/glibc-compat/sbin/ldconfig /lib /usr/glibc-compat/lib && \
    echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf && \
    apk del curl && \
    rm -rf glibc.apk glibc-bin.apk

RUN apk add nodejs-current npm python g++ make && rm -rf /var/cache/apk/*

RUN mkdir -p /app/server
WORKDIR /app/server
COPY tsconfig.json /app/server/tsconfig.json
COPY nodemon.json /app/server/nodemon.json
COPY package.json /app/server/package.json
RUN npm install
COPY src /app/server/src 
RUN npm run-script build
EXPOSE 5010
CMD [ "npm", "run", "dev" ]