import '../styles/globals.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  /**
   * useState lazy init을 사용하여 QueyrClient instance를 생성해,
   * QueyrClientProvider의 client 값으로 전달한다.
   */
  const [queryClient] = useState(() => new QueryClient());
  return (
    /** QueryClientProvider를 선언함으로써, Component에서 queryClient로의 접근이 가능해진다. */
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      {/* devTool를 설치한다. 화면 좌측하단의 로고를 누르면 개발툴을 열어볼 수 있다. */}
      {/* 개발환경에서만 활성화되기 때문에 따로 신경을 쓸 필요가 없다.*/}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
