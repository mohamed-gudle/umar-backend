import App from '@/app';
import IndexRoute from '@/index/index.route';
import UsersRoute from '@/users/users.route';
import validateEnv from '@/utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute()]);

app.listen();
