import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { store } from '@suc/ts-sub';

export type UserType = { id: string, name: string }

@Module({store, name: 'suc-user', namespaced: true, dynamic: true,})
export class User extends VuexModule {

    user: UserType = {name: '', id: ''};
    list:any[] = []
    @Mutation
    setUser(user: UserType) {
        this.user = user;
    }

    @Action({rawError: true})
    login(params: { username: string, password: string }) {
        setTimeout(() => {
            this.setUser({id: '1', name: params.username});
        }, 1000);
    }

}

export const $user = getModule(User);
