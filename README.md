Routes: </br>
http://localhost:3000/products; </br>
GET
</br>

http://localhost:3000/user/signup </br>
POST  {
      "email":"a@ukr.net",
      "password":"123456"
      }
<br>

http://localhost:3000/user/login </br>
POST  {
      "email":"a@ukr.net",
      "password":"123456"
      }
</br>      

http://localhost:3000/checkjwt
POST
headers {Authorization: ZXZXZsometokenZXZX}

</br>
default use mongodb atlas
command: $ npm start
</br>
test use "mongodb://127.0.0.1/new"
command: $ npm test
