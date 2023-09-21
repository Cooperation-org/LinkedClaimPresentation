
# Example of using a composedb model to represent a verifiable credential

https://ceramic.linkedtrust.us/api/v0/streams/kjzl6kcym7w8y8llfg1tkz73j292eehkv9greyq4lzzbdi7jczlnzeppsdz6i0y

Loosely based on
http://cooperation.org/credentials/v1/

```
composedb composite:create trustclaims-with-vc.graphql --output=trustclaims-with-vc.json --did-private-key=31ae172e016a2f2c1c9ad6407106d1eb1b11ee2d59d5c62e0613cd4092d5a318


composedb composite:deploy trustclaims-with-vc.json --ceramic-url=http://localhost:7007 --did-private-key=31ae172e016a2f2c1c9ad6407106d1eb1b11ee2d59d5c62e0613cd4092d5a318

## produce compiled json
composedb composite:compile trustclaims-with-vc.json trustclaims-with-vc-runtime-composite.json

## produce compiled javascript
composedb composite:compile trustclaims-with-vc.json trustclaims-with-vc-runtime-composite.js
```

then

```
npm install --save @composedb/client
npm install --save -D @composedb/types
```
