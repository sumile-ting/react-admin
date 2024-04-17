import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { ConfigProvider } from 'antd';
import router from '@/router';
import store from '@/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </ConfigProvider>,
);
