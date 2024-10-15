import { DB_HOST, DB_PORT, DB_DATABASE } from '@/common/config';

export const dbConnection = {
  url: `mongodb+srv://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
