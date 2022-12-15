import request   from '@/router/axios';
import {baseUrl} from '@/config/env';

export const getButtons = () => request({
  url: baseUrl + '/api/blade-system/desk/index',
  method: 'get'
});


