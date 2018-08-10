FROM golang:alpine
MAINTAINER Transceptor Technology
RUN apk add git python3 nodejs-npm libc-dev
WORKDIR /src
RUN npm install -g less@2.7.2 less-plugin-clean-css
RUN git clone https://github.com/transceptor-technology/siridb-admin.git ./
RUN ./gobuild.py -i -l -w -b -p -o siridb-admin

FROM alpine:latest
COPY --from=0 /src/siridb-admin /usr/local/bin/siridb-admin
# Client connections
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/siridb-admin"]
