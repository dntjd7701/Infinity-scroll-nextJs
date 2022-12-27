import { useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { useObserver } from '../lib/hooks/useObserver';
import style from '../styles/index.module.scss';
import PokemonCard from '../component/PokemonCard';

const OFFSET = 30;

const getPokemonList = ({ pageParam = OFFSET }) =>
  axios
    .get('https://pokeapi.co/api/v2/pokemon', {
      params: {
        limit: OFFSET,
        offset: pageParam,
      },
    })
    .then((res) => res?.data);

const Index = () => {
  // 바닥 ref를 위한 useRef 선언
  const bottom = useRef(null);

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery('pokemonList', getPokemonList, {
    getNextPageParam: (lastPage) => {
      const { next } = lastPage;

      if (!next) return false;

      return Number(new URL(next).searchParams.get('offset'));
    },
  });

  // useObserver로 넘겨줄 callback, entry로 넘어오는 HTMLElement가
  // isIntersecting이라면 무한 스크롤을 위한 fetchNextPage가 실행될 것이다.
  const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage();

  // useObserver로 bottom ref와 onIntersect를 넘겨 주자.
  useObserver({
    target: bottom,
    onIntersect,
  });

  return (
    <div className={style.pokemons_wrap}>
      {status === 'loading' && <p>불러오는 중</p>}
      {status === 'error' && <p>{error.message}</p>}
      {status === 'success' && (
        <div className={style.pokemon_list_box}>
          {data.pages.map((group, index) => (
            <div className={style.pokemon_list} key={index}>
              {group.results.map((pokemon) => {
                const { name, url } = pokemon;
                const id = url.split('/')[6];

                return <PokemonCard key={name} id={id} name={name} />;
              })}
            </div>
          ))}
        </div>
      )}
      {/* 아까 만들었던 더 불러오기 버튼을 제거하고  바닥 ref를 위한 div를 하나 만들어준다. */}
      <div ref={bottom} />
      {isFetchingNextPage && <p>계속 불러오는 중</p>}
    </div>
  );
};

export default Index;
