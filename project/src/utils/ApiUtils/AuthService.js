import Locker from 'lockr';

class AuthService {

    static initializeValidUsers(){
        Locker.set('validUsers',[
            {
                userName: 'Chirag',
                password: '123'
            },
            {
                userName: 'Abhinay',
                password: '456'
            },
            {
                userName: 'Ravi',
                password: '234sdkfj'
            },
            {
                userName: 'Ramulu',
                password: '9870sdf'
            }
        ]);
    }

    static isAuthenticated(){
        const validUsers = Locker.get('validUsers');
        const currentUser = Locker.get('currentUser');
        return validUsers.map((user) => user.userName).includes(currentUser);
    }

    static login(userName, password){
        const validUsers = Locker.get('validUsers');
        const index = validUsers.map((user) => user.userName).indexOf(userName);
        if(index===-1)
            return false;
        if(validUsers[index].password === password){
            Locker.set('currentUser', userName);
            return true;
        }
        return false;
    }

    static logout(){
        Locker.rm('currentUser');
        window.location.reload();
    }
}

export default AuthService;