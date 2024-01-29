# Social Auth JS

Intends to provide reusable components that will allow you to access the login flow for several social platforms, some will work as standalone frontend components, others will need some type of backend support.

##### Platforms
- Facebook
- Google
- Github
- Instagram
- Twitter
- Bitbucket
- Linkedin
- Vkontakte
- Live

#### Install
Using NPM
```sh
npm i social-auth-js
```
or using Yarn
```sh
yarn add social-auth-js
```

#### Using
```js
import SocialAuthJS from 'social-auth-js'
import axios from 'axios'

const socialAuth = new SocialAuthJS(axios, {
    providers: {
      facebook: {
        clientId: 'YOUR_CLIENT_ID',
        redirectUri: 'YOUR_REDIRECT_URL',
      },
      google: {
        clientId: 'YOUR_CLIENT_ID',
        redirectUri: 'YOUR_REDIRECT_URL',
      },
    },
 });
 socialAuth.authenticate('facebook').then((res) => {
     // res will return callback token
     // call api to verify token and get user information
     // If you are using Laravel, you can easily use https://laravel.com/docs/10.x/socialite for authenticate
 });
```