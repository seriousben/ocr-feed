# ocr-feed

OCR Message Feed [![CircleCI](https://circleci.com/gh/seriousben/ocr-feed/tree/master.svg?style=svg)](https://circleci.com/gh/seriousben/ocr-feed/tree/master)

## Overview

This project is separated in 3 differents parts:

 - client: Ember.js web application + Dockerfile
 - server: Node API Server + Dockerfile
 - cluster: Kubernetes Cluster definitions
 
## Client

The client is implemented as a Single Page App using Emberjs.

More documentation in the [Client README](https://github.com/seriousben/ocr-feed/blob/master/client/README.md).

## Server

(Documentation style from Basecamp API documentation https://github.com/basecamp/bc3-api)

### Messages

Endpoints:

- [Get messages](#get-messages)
- [Get a message](#get-a-message)
- [Check if a message is a palindrome](#check-a-message-is-palindrome)
- [Create a message](#create-a-message)
- [Update a message](#update-a-message)
- [Delete a message][#delete-a-message]

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
  http://server.ocr-feed.seriousben.com/messages/2
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
  -d '{"content":"Hola"}' -X PUT \
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
