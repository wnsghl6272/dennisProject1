// app/providers.tsx
'use client';
import { Provider } from "react-redux";
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import store from './store/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </Provider>
  );
}
