import { Injectable } from '@angular/core';
import { Parse } from 'parse';
import { User } from '../../models/user.model';

@Injectable()
export class CreateUserService {

  constructor() { }

  CreateUserService(userObj: User): Promise<boolean> {
    const query = new Parse.Query(Parse.Role);
    query.equalTo('name', userObj.role);
    return new Promise<boolean>((resolve, reject) => {
      query.find().then(
        (roles) => {
          const user = new Parse.User;
          user.set('username', userObj.username);
          user.set('email', userObj.email);
          user.set('password', userObj.password);
          user.set('name', userObj.name);
          user.set('first_name', userObj.firstname);
          user.set('last_name', userObj.lastname);
          user.signUp(null, {
            success: (result) => resolve(result),
            error: (error) => reject(error)
          });
        },
        (err) => console.log(err)
      );
    });
  }
}