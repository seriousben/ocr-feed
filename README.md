# ocr-feed

[![CircleCI](https://circleci.com/gh/seriousben/ocr-feed/tree/master.svg?style=svg)](https://circleci.com/gh/seriousben/ocr-feed/tree/master)

OCR Message Feed

## Overview

Running at: [client.ocr-feed.seriousben.com](http://client.ocr-feed.seriousben.com/)

This project is separated in 3 different parts:

 - client: Ember.js web application + Dockerfile
 - server: Node API Server + Dockerfile
 - cluster: Kubernetes Cluster definitions
 
This project also depends on a postgres database.

### Sequence diagram

![Create Message](https://github.com/seriousben/ocr-feed/blob/master/doc/seq-create-message.png)
 
## Running

### Quick run
 - docker-compose up 
 - client will be accessible at http://localhost:4000
 - server will be accessible at http://localhost:3000
 
### Client Development
 - docker-compose up postgres server
 - See [Client README](https://github.com/seriousben/ocr-feed/blob/master/client/README.md)
 
### Server Development
 - docker-compose up postgres 
 - index.js is the entrypoint

## Cluster

The running application is managed by a Kubernetes cluster on AWS.

### Create AWS Kubernetes Cluster

 - Create DNS Zone on Route53
 - Create a S3 bucket for kops cluster state
   `export KOPS_STATE_STORE=s3://ocr-feed-kops-store`
 - Install [kops](https://github.com/kubernetes/kops) and [kubectl](http://kubernetes.io/docs/user-guide/prereqs/)
 - Create cluster
   `kops create cluster --cloud=aws --zones=us-east-1a --name=ocr-feed.seriousben.com --ssh-public-key=~/.ssh/id_rsa_foko.pub`
 - Apply creation to AWS
   `kops update cluster ocr-feed.seriousben.com --yes`
   
[More information](https://github.com/kubernetes/kops/blob/master/docs/aws.md)

### Deploy to the cluster

  - `kubectl create -f clusters/*-controller.yml`
  - `kubectl create -f clusters/*-service.yml`
  - Profit!

### Setup CI + CD

See circle.yml and profit!

## Client

The client is implemented as a Single Page App using Emberjs. It also uses Ember Fastboot for faster initial loading. (Fastboot is amazing!!!)

More documentation in the [Client README](https://github.com/seriousben/ocr-feed/blob/master/client/README.md).

## Server

(Documentation style from Basecamp API documentation https://github.com/basecamp/bc3-api)

### Native dependencies

 - libleptonica-dev
 - libtesseract3
 - libtesseract-dev
 - tesseract-ocr-eng
 
### installation
 - Linux:
   - apt-get install libleptonica-dev libtesseract3 libtesseract-dev tesseract-ocr-eng
 - MacOS:
   - brew install tesseract --all-languages
   - brew install leptonica --with-libtiff

### Code

 - `index.js`: the main entrypoint
 - `messages.js`: the message API endpoints
 - `db.js`: postgres database connection and management
 - `palindrome.js`: palindrome checkers
 - `test/*`: Integration tests
 
### Other contributions / Patches

 - Palindome / https://github.com/seriousben/palindrome.git#add-tests
 - Tesseract OCR native API / https://github.com/seriousben/node-tesseract-native.git#fix-install

### [API] Messages

Endpoints:

- [Get messages](#get-messages)
- [Get a message](#get-a-message)
- [Check if a message is a palindrome](#check-a-message-is-a-palindrome)
- [Create a message](#create-a-message)
- [Update a message](#update-a-message)
- [Delete a message](#delete-a-message)

#### Get messages

* `GET /messages` will return a list of messages.

###### Example JSON Response
<!-- START GET /messages -->
```json
[
  {
    "id": 1,
    "content": "allo",
    "createdAt": "2016-06-24T23:32:09.095Z",
    "updatedAt": "2016-06-24T23:32:09.095Z",
  }
]
```
<!-- END GET /messages -->
###### Copy as cURL

``` shell
curl -s http://server.ocr-feed.seriousben.com/messages
```

#### Get a message

* `GET /messages/1` will return the message with an ID of `1`;

###### Example JSON Response
<!-- START GET /messages/1 -->
```json
{
  "id": 1,
  "content": "allo",
  "createdAt": "2016-06-24T23:32:09.095Z",
  "updatedAt": "2016-06-24T23:32:09.095Z",
}
```
<!-- END GET /messages/1 -->

###### Copy as cURL

``` shell
curl -s http://server.ocr-feed.seriousben.com/messages/1
```

#### Check a message is a palindrome

* `GET /messages/1/isPalindrome` will return result of the palindrome check.

###### Example JSON Response
<!-- START GET /messages/1/isPalindrome -->
```json
{
  "isPalindrome": true
}
```
<!-- END GET /messages/1/isPalindrome -->

###### Copy as cURL

``` shell
curl -s http://server.ocr-feed.seriousben.com/messages/1/isPalindrome
```

#### Create a message

* `POST /messages` publishes a message.

**Required parameters**: `content` as the body of the message. 

###### Example JSON Request

``` json
{
    "content": "allo",
}
```

###### Copy as cURL

``` shell
curl -s -H "Content-Type: application/json" \
  -d '{"content":"active"}' \
  http://server.ocr-feed.seriousben.com/messages
```

#### Update a message

* `PATCH /messages/2` allows changing the content of the message with an ID of `2`.

This endpoint will return `200 OK` with the current JSON representation of the message if the update was a success.

###### Example JSON Request

``` json
{
  "content": "palindrome"
}
```

###### Copy as cURL

``` shell
curl -s -H "Content-Type: application/json" \
  -d '{"content":"Hola"}' -X PATCH \
  http://server.ocr-feed.seriousben.com/messages/2
```

#### Delete a message

* `DELETE /messages/2` allows a message with an ID of `2`.

This endpoint will return `200 OK` if the delete was a success.

###### Copy as cURL

``` shell
curl -s -X DELETE \
  http://server.ocr-feed.seriousben.com/messages/2
```
